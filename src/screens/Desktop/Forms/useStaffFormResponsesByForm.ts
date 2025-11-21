import { useEffect, useState } from "react";
import {
  getAllForms,
  getFormById,
  deleteForm,
  updateForm,
  type Form,
} from "../../../services/formService";
import { getAssignableUsers, type User } from "../../../services/userService";
import {
  getFormRespondents,
  type Respondent,
} from "../../../services/responseService";
import { getUserCookie } from "../../../utils/userCookie";
import { toast } from "sonner";

interface UserWithResponse {
  _id: string | null;
  name: string;
  email: string;
  role: string;
  anonymous?: boolean;
  responded: boolean;
  submittedAt?: string;
  responseId?: string;
}

interface FormWithStudents {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  totalStudents: number;
  respondedCount: number;
  respondedUserIds: string[];
  respondents: UserWithResponse[];
  assignedUserIds: string[]; // IDs dos usuários atribuídos ao formulário
}

export function useStaffFormResponsesByForm(
  navigateFn?: (path: string) => void
) {
  const [forms, setForms] = useState<FormWithStudents[]>([]);
  const [expandedForms, setExpandedForms] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewFormModal, setViewFormModal] = useState<Form | null>(null);
  const [loadingRespondents, setLoadingRespondents] = useState<
    Record<string, boolean>
  >({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormWithStudents | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  // Estados para gerenciamento de usuários
  const [selectedUsers, setSelectedUsers] = useState<
    Record<string, Set<string>>
  >({});
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Função para carregar respondentes de um formulário específico
  const loadRespondentsForForm = async (
    formId: string,
    users: User[],
    assignedUserIds: string[]
  ) => {
    setLoadingRespondents((prev) => ({ ...prev, [formId]: true }));
    try {
      const user = getUserCookie();
      const userRole = user?.role || "teacher_analyst";
      const response = await getFormRespondents(formId, userRole);

      if ((response as any).error) {
        console.error("Error loading respondents:", (response as any).error);
        return null;
      }

      // Se users está vazio (analyst), buscar os dados dos usuários atribuídos do backend
      let assignedUsers: User[] = [];

      if (users.length === 0 && assignedUserIds.length > 0) {
        try {
          const formDetails = await getFormById(formId, userRole);
          assignedUsers = formDetails.assignedUsers
            .filter((u: any): u is User => typeof u !== "string")
            .map((u: any) => ({
              _id: u._id,
              name: u.name || "Usuário Anônimo",
              email: u.email || "-",
              role: u.role || "Anonimo",
              anonymous: u.anonymous,
              city: u.city || "-",
              state: u.state || "-",
              institution: u.institution || "-",
            }));
        } catch (err) {
          console.error("Error fetching form details for assigned users:", err);
          return null;
        }
      } else {
        // Usar o array de users passado (caso admin)
        assignedUsers = users.filter((u) => assignedUserIds.includes(u._id));
      }

      // Criar mapa de respondentes
      const respondentsMap = new Map<string, Respondent>();
      (response as any).respondents.forEach((r: Respondent) => {
        if (r._id) respondersMapSet(respondentsMap, r);
      });

      // Combinar dados: usuários atribuídos com status de resposta
      const usersWithResponse: UserWithResponse[] = assignedUsers.map(
        (user) => {
          const respondent = (response as any).respondents.find(
            (r: Respondent) => r._id === user._id
          );
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            anonymous: (user as any).anonymous,
            responded: !!respondent,
            submittedAt: respondent?.submittedAt,
            responseId: respondent?.responseId,
          };
        }
      );

      return {
        respondents: usersWithResponse,
        respondedCount: (response as any).totalRespondents,
        respondedUserIds: (response as any).respondents
          .filter((r: any) => r._id)
          .map((r: any) => r._id as string),
        totalStudents: assignedUsers.length,
      };
    } catch (err: any) {
      console.error("Error loading respondents:", err);
      return null;
    } finally {
      setLoadingRespondents((prev) => ({ ...prev, [formId]: false }));
    }
  };

  // Verificar se o usuário é analyst (sem permissões de edição)
  const currentUser = getUserCookie();
  const isAnalyst = currentUser?.role === "teacher_analyst";

  // Fetch forms from API
  useEffect(() => {
    let isMounted = true;

    async function fetchForms() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(
          "Usuário não autenticado. Faça login para ver os formulários."
        );
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const user = getUserCookie();
        const userRole = user?.role;

        // Analyst não precisa carregar lista de usuários (não pode editar)
        const [apiForms, users] = await Promise.all([
          getAllForms(userRole),
          isAnalyst ? Promise.resolve([]) : getAssignableUsers(),
        ]);

        if (!isMounted) return;

        setAllUsers(users);

        // O backend pode retornar um wrapper { data, error, msg } ou diretamente o array
        let formsList: any[] = [];

        if (Array.isArray(apiForms)) {
          formsList = apiForms;
        } else if (
          apiForms &&
          typeof apiForms === "object" &&
          "data" in apiForms
        ) {
          // @ts-ignore
          formsList = Array.isArray(apiForms.data) ? apiForms.data : [];
        }

        const mapped: FormWithStudents[] = formsList.map((f: any) => ({
          id: f._id || f.id || "unknown",
          title: f.title || "Sem título",
          description: f.description || "",
          isActive: f.isActive || false,
          totalStudents: 0,
          respondedCount: 0,
          respondedUserIds: [],
          respondents: [],
          assignedUserIds: f.assignedUsers?.map((u: any) => u._id || u) || [],
        }));

        setForms(mapped);

        // Carregar respondentes para todos os formulários em paralelo
        const respondentsData = await Promise.all(
          mapped.map((form) =>
            loadRespondentsForForm(form.id, users, form.assignedUserIds)
          )
        );
        if (!isMounted) return;

        // Atualizar formulários com dados de respondentes
        const updatedForms = mapped.map((form, index) => {
          const data = respondentsData[index];
          if (data) {
            return { ...form, ...data };
          }
          return form;
        });

        setForms(updatedForms);
        // Auto-expand the active form
        const activeForm = updatedForms.find((f) => f.isActive);
        if (activeForm) {
          setExpandedForms(new Set([activeForm.id]));
        }
      } catch (e: any) {
        console.error("Error loading forms:", e);
        if (isMounted) {
          setError(e?.message || "Falha ao carregar formulários");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchForms();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch respondents quando um formulário for expandido ou atualizado
  const fetchRespondentsForForm = async (formId: string) => {
    const currentForm = forms.find((f) => f.id === formId);
    let assignedUserIds = currentForm?.assignedUserIds || [];

    // Se não tiver IDs no estado, buscar do backend
    if (assignedUserIds.length === 0) {
      try {
        const user = getUserCookie();
        const userRole = user?.role || "teacher_analyst";
        const formDetails = await getFormById(formId, userRole);
        assignedUserIds = formDetails.assignedUsers.map((u: any) =>
          typeof u === "string" ? u : u._id
        );
      } catch (err) {
        console.error("Error fetching form details:", err);
        return;
      }
    }

    const data = await loadRespondentsForForm(
      formId,
      allUsers,
      assignedUserIds
    );

    if (data) {
      setForms((prevForms) =>
        prevForms.map((f) =>
          f.id === formId ? { ...f, ...data, assignedUserIds } : f
        )
      );
    }
  };

  // Gerenciamento de seleção de usuários
  const toggleUserSelection = (formId: string, userId: string) => {
    setSelectedUsers((prev) => {
      const formSelections = new Set(prev[formId] || []);
      if (formSelections.has(userId)) {
        formSelections.delete(userId);
      } else {
        formSelections.add(userId);
      }
      return { ...prev, [formId]: formSelections };
    });
  };

  const toggleSelectAll = (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;

    const allUserIds = form.respondents
      .map((u) => u._id)
      .filter(Boolean) as string[];
    const currentSelections = selectedUsers[formId] || new Set();

    if (currentSelections.size === allUserIds.length) {
      // Desselecionar todos
      setSelectedUsers((prev) => ({ ...prev, [formId]: new Set() }));
    } else {
      // Selecionar todos
      setSelectedUsers((prev) => ({ ...prev, [formId]: new Set(allUserIds) }));
    }
  };

  // Remover usuários selecionados
  const handleRemoveSelectedUsers = async (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;

    const usersToRemove = selectedUsers[formId] || new Set();
    if (usersToRemove.size === 0) {
      toast.error("Selecione pelo menos um usuário para remover");

      return;
    }

    if (
      !confirm(`Remover ${usersToRemove.size} usuário(s) deste formulário?`)
    ) {
      return;
    }

    try {
      const newAssignedUsers = form.assignedUserIds.filter(
        (id) => !usersToRemove.has(id)
      );

      await updateForm(formId, {
        assignedUsers: newAssignedUsers,
      });

      // Atualizar estado local imediatamente com os novos IDs
      setForms((prevForms) =>
        prevForms.map((f) =>
          f.id === formId ? { ...f, assignedUserIds: newAssignedUsers } : f
        )
      );

      // Recarregar respondentes com os IDs atualizados
      const data = await loadRespondentsForForm(
        formId,
        allUsers,
        newAssignedUsers
      );

      if (data) {
        setForms((prevForms) =>
          prevForms.map((f) => (f.id === formId ? { ...f, ...data } : f))
        );
      }

      // Limpar seleção
      setSelectedUsers((prev) => ({ ...prev, [formId]: new Set() }));

      toast.success("Usuários removidos com sucesso!");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao remover usuários");
    }
  };

  // Abrir modal para adicionar usuários
  const handleOpenAddUserModal = (formId: string) => {
    setCurrentFormId(formId);
    setAddUserModalOpen(true);
    setUserSearchTerm("");
  };

  // Adicionar usuários selecionados ao formulário
  const handleAddUsers = async (userIds: string[]) => {
    if (!currentFormId || userIds.length === 0) return;

    const form = forms.find((f) => f.id === currentFormId);
    if (!form) return;

    try {
      const newAssignedUsers = [
        ...new Set([...form.assignedUserIds, ...userIds]),
      ];

      await updateForm(currentFormId, {
        assignedUsers: newAssignedUsers,
      });

      // Atualizar estado local imediatamente com os novos IDs
      setForms((prevForms) =>
        prevForms.map((f) =>
          f.id === currentFormId
            ? { ...f, assignedUserIds: newAssignedUsers }
            : f
        )
      );

      // Recarregar respondentes com os IDs atualizados
      const data = await loadRespondentsForForm(
        currentFormId,
        allUsers,
        newAssignedUsers
      );

      if (data) {
        setForms((prevForms) =>
          prevForms.map((f) => (f.id === currentFormId ? { ...f, ...data } : f))
        );
      }

      setAddUserModalOpen(false);
      setCurrentFormId(null);

      toast.success(`${userIds.length} usuário(s) adicionado(s) com sucesso!`);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao adicionar usuários");
    }
  };

  const toggleForm = (formId: string, isActive: boolean) => {
    // Só permite expandir se o formulário for ativo
    if (!isActive) return;

    const newExpanded = new Set(expandedForms);

    if (newExpanded.has(formId)) {
      newExpanded.delete(formId);
    } else {
      newExpanded.add(formId);
    }
    setExpandedForms(newExpanded);
  };

  const handleEditForm = (
    formId: string,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.stopPropagation();
    if (navigateFn) navigateFn(`/staff/form-builder?formId=${formId}`);
  };

  const handleDeleteForm = (
    formId: string,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.stopPropagation();
    const form = forms.find((f) => f.id === formId);
    if (!form) return;
    setFormToDelete(form);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!formToDelete) return;
    setDeleting(true);
    try {
      await deleteForm(formToDelete.id);
      setForms((prev) => prev.filter((f) => f.id !== formToDelete.id));
      setDeleteDialogOpen(false);
      setFormToDelete(null);
    } catch (err: any) {
      setError(err?.message || "Erro ao excluir formulário");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewForm = async (
    formId: string,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.stopPropagation();
    try {
      const user = getUserCookie();
      const userRole = user?.role || "teacher_analyst";
      const form = await getFormById(formId, userRole);
      setViewFormModal(form);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao carregar formulário");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return {
    forms,
    setForms,
    expandedForms,
    setExpandedForms,
    loading,
    error,
    viewFormModal,
    setViewFormModal,
    loadingRespondents,
    deleteDialogOpen,
    setDeleteDialogOpen,
    formToDelete,
    deleting,
    selectedUsers,
    setSelectedUsers,
    addUserModalOpen,
    setAddUserModalOpen,
    currentFormId,
    setCurrentFormId,
    allUsers,
    userSearchTerm,
    setUserSearchTerm,
    loadRespondentsForForm,
    fetchRespondentsForForm,
    toggleUserSelection,
    toggleSelectAll,
    handleRemoveSelectedUsers,
    handleOpenAddUserModal,
    handleAddUsers,
    toggleForm,
    handleEditForm,
    handleDeleteForm,
    handleDeleteConfirm,
    handleViewForm,
    formatDate,
    isAnalyst,
  } as const;
}

function respondersMapSet(map: Map<string, any>, r: any) {
  // helper used in earlier logic compatibility (no-op wrapper)
  if (r._id) map.set(r._id, r);
}

export default useStaffFormResponsesByForm;
