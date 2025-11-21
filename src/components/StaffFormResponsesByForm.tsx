import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Users,
  CheckCircle,
  Eye,
  Clock,
  Edit,
  Trash2,
  Plus,
  X,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { Button } from "./ui/button";
import { PageHeader } from "./ui/page-header";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DeleteConfirmationDialog } from "./ui/delete-confirmation-dialog";
import { Input } from "./ui/input";
import { SearchBar } from "./ui/search-bar";
import {
  getAllForms,
  getFormById,
  deleteForm,
  updateForm,
  type Form,
} from "../services/formService";
import {
  getAllUsers,
  getAssignableUsers,
  type User,
} from "../services/userService";
import {
  getFormRespondents,
  type Respondent,
} from "../services/responseService";
import { getRoleLabel, getRoleColor } from "../utils/roleLabels";
import { getUserCookie } from "../utils/userCookie";

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

export function StaffFormResponsesByForm() {
  const navigate = useNavigate();
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

      if (response.error) {
        console.error("Error loading respondents:", response.error);
        return null;
      }

      // Se users está vazio (analyst), buscar os dados dos usuários atribuídos do backend
      let assignedUsers: User[] = [];

      if (users.length === 0 && assignedUserIds.length > 0) {
        // Buscar detalhes do formulário para obter dados completos dos usuários
        try {
          const formDetails = await getFormById(formId, userRole);
          assignedUsers = formDetails.assignedUsers
            .filter((u): u is User => typeof u !== "string")
            .map((u) => ({
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
      response.respondents.forEach((r) => {
        if (r._id) {
          respondentsMap.set(r._id, r);
        }
      });

      // Combinar dados: usuários atribuídos com status de resposta
      const usersWithResponse: UserWithResponse[] = assignedUsers.map(
        (user) => {
          const respondent = respondentsMap.get(user._id);
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            anonymous: user.anonymous,
            responded: !!respondent,
            submittedAt: respondent?.submittedAt,
            responseId: respondent?.responseId,
          };
        }
      );

      return {
        respondents: usersWithResponse,
        respondedCount: response.totalRespondents,
        respondedUserIds: response.respondents
          .filter((r) => r._id)
          .map((r) => r._id as string),
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
          isAnalyst ? Promise.resolve([]) : getAssignableUsers(), // Apenas usuários que podem ser atribuídos a formulários
        ]);

        if (!isMounted) return;

        console.log("API Response:", apiForms);
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
        assignedUserIds = formDetails.assignedUsers.map((u) =>
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
          f.id === formId
            ? {
                ...f,
                ...data,
                assignedUserIds,
              }
            : f
        )
      );
    }
  }; // Gerenciamento de seleção de usuários
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
      alert("Selecione pelo menos um usuário para remover");
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

      alert("Usuários removidos com sucesso!");
    } catch (err: any) {
      alert(err?.message || "Erro ao remover usuários");
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

      alert(`${userIds.length} usuário(s) adicionado(s) com sucesso!`);
    } catch (err: any) {
      alert(err?.message || "Erro ao adicionar usuários");
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
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    navigate(`/staff/form-builder?formId=${formId}`);
  };

  const handleDeleteForm = async (
    formId: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
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
      setForms(forms.filter((f) => f.id !== formToDelete.id));
      setDeleteDialogOpen(false);
      setFormToDelete(null);
    } catch (err: any) {
      setError(err?.message || "Erro ao excluir formul\u00e1rio");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewForm = async (
    formId: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    try {
      const user = getUserCookie();
      const userRole = user?.role || "teacher_analyst";
      const form = await getFormById(formId, userRole);
      setViewFormModal(form);
    } catch (err: any) {
      alert(err?.message || "Erro ao carregar formulário");
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

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Carregando formulários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Erro: {error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Exibindo dados mock enquanto o erro persiste.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Formulários"
        description="Visualize as respostas organizadas por formulário e aluno"
      >
        <Button
          onClick={() => navigate("/staff/form-builder")}
          className="h-12 bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg rounded-2xl"
        >
          <Plus className="w-5 h-5" />
          Criar Formulário
        </Button>
      </PageHeader>
      {/* Stats */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total de Formulários
            </p>
            <p className="text-gray-800 dark:text-gray-200">{forms.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total de Usuários
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {forms.find((f) => f.isActive)?.totalStudents || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total de Respostas
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {forms.reduce((acc, form) => acc + form.respondedCount, 0)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Formulário Ativo
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {forms.find((f) => f.isActive)?.title || "Nenhum"}
            </p>
          </div>
        </div>
      </div>

      {/* Forms List */}
      <div className="flex-1 overflow-auto p-6">
        {forms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Nenhum formulário encontrado
            </h3>
            <p className="text-gray-500">
              Crie um formulário para começar a receber respostas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map((form) => {
              const isExpanded = expandedForms.has(form.id);
              const totalUsers = form.totalStudents;
              const respondedUsers = form.respondedCount;
              const percentage =
                totalUsers > 0
                  ? Math.round((respondedUsers / totalUsers) * 100)
                  : 0;

              return (
                <div
                  key={form.id}
                  className={`bg-white border-2 rounded-lg overflow-hidden transition-all ${
                    form.isActive
                      ? "border-green-500 shadow-lg shadow-green-100"
                      : "border-gray-200"
                  }`}
                >
                  {/* Form Header - Clickable */}
                  <button
                    onClick={() => toggleForm(form.id, form.isActive)}
                    className={`w-full p-6 flex items-center gap-4 transition-colors ${
                      form.isActive
                        ? "hover:bg-gray-50 cursor-pointer"
                        : "cursor-default"
                    }`}
                    disabled={!form.isActive}
                  >
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 ${
                        form.isActive ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <FileText
                        className={`w-6 h-6 ${
                          form.isActive ? "text-green-600" : "text-gray-600"
                        }`}
                      />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="mb-1">{form.title}</h3>
                        {form.isActive && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Ativo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {form.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {respondedUsers} de {totalUsers} respostas
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-900 dark:bg-blue-600 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                          handleViewForm(form.id, e)
                        }
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </Button>

                      {!isAnalyst && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                              handleEditForm(form.id, e)
                            }
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                              handleDeleteForm(form.id, e)
                            }
                            className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </Button>
                        </>
                      )}

                      <div className="text-gray-400">
                        {form.isActive ? (
                          isExpanded ? (
                            <ChevronDown className="w-6 h-6" />
                          ) : (
                            <ChevronRight className="w-6 h-6" />
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Users List - Collapsible (apenas para formulário ativo) */}
                  {isExpanded && form.isActive && (
                    <div className="border-t border-gray-200">
                      {loadingRespondents[form.id] ? (
                        <div className="flex items-center justify-center p-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="ml-3 text-gray-600">
                            Carregando usuários...
                          </p>
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                              <tr>
                                {!isAnalyst && (
                                  <th className="text-left px-6 py-3 w-12">
                                    <input
                                      type="checkbox"
                                      checked={
                                        form.respondents.length > 0 &&
                                        (selectedUsers[form.id]?.size || 0) ===
                                          form.respondents.length
                                      }
                                      onChange={() => toggleSelectAll(form.id)}
                                      className="w-4 h-4 rounded border-gray-300"
                                    />
                                  </th>
                                )}
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Nome
                                </th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Email
                                </th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Cargo
                                </th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Status
                                </th>
                                {!isAnalyst && (
                                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {(selectedUsers[form.id]?.size || 0) >
                                      0 && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleRemoveSelectedUsers(form.id)
                                        }
                                        className="gap-1 text-red-600 hover:bg-red-50 border-red-200"
                                      >
                                        <UserMinus className="w-4 h-4" />
                                        Remover ({selectedUsers[form.id]?.size})
                                      </Button>
                                    )}
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900">
                              {form.respondents.length > 0 ? (
                                <>
                                  {form.respondents.map((user) => (
                                    <tr
                                      key={user._id || user.email}
                                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                      {!isAnalyst && (
                                        <td className="px-6 py-4">
                                          <input
                                            type="checkbox"
                                            checked={selectedUsers[
                                              form.id
                                            ]?.has(user._id || "")}
                                            onChange={() =>
                                              toggleUserSelection(
                                                form.id,
                                                user._id || ""
                                              )
                                            }
                                            className="w-4 h-4 rounded border-gray-300"
                                          />
                                        </td>
                                      )}
                                      <td className="px-6 py-4">
                                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                                          {user.anonymous
                                            ? "Usuário Anônimo"
                                            : user.name}
                                        </p>
                                      </td>
                                      <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          {user.anonymous ? "N/A" : user.email}
                                        </p>
                                      </td>
                                      <td className="px-6 py-4">
                                        <Badge
                                          className={getRoleColor(user.role)}
                                        >
                                          {getRoleLabel(user.role)}
                                        </Badge>
                                      </td>
                                      <td className="px-6 py-4">
                                        {user.responded ? (
                                          <div className="flex flex-col gap-1">
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                              <CheckCircle className="w-3 h-3 mr-1" />
                                              Respondido
                                            </Badge>
                                            {user.submittedAt && (
                                              <span className="text-xs text-gray-500">
                                                {formatDate(user.submittedAt)}
                                              </span>
                                            )}
                                          </div>
                                        ) : (
                                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Pendente
                                          </Badge>
                                        )}
                                      </td>
                                      {!isAnalyst && (
                                        <td className="px-6 py-4"></td>
                                      )}
                                    </tr>
                                  ))}
                                  {/* Linha para adicionar usuários - apenas para admin */}
                                  {!isAnalyst && (
                                    <tr className="border-t-2 border-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                                      <td colSpan={6} className="px-6 py-4">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleOpenAddUserModal(form.id)
                                          }
                                          className="w-full gap-2 border-dashed border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                                        >
                                          <UserPlus className="w-4 h-4" />
                                          Adicionar Usuários
                                        </Button>
                                      </td>
                                    </tr>
                                  )}
                                </>
                              ) : (
                                <tr>
                                  <td
                                    colSpan={isAnalyst ? 5 : 6}
                                    className="px-6 py-8 text-center text-gray-500"
                                  >
                                    <div className="flex flex-col items-center gap-3">
                                      <p>Nenhum usuário atribuído</p>
                                      {!isAnalyst && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleOpenAddUserModal(form.id)
                                          }
                                          className="gap-2"
                                        >
                                          <UserPlus className="w-4 h-4" />
                                          Adicionar Usuários
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Form Modal */}
      {viewFormModal && (
        <Dialog
          open={!!viewFormModal}
          onOpenChange={() => setViewFormModal(null)}
        >
          <DialogContent className="max-w-3xl overflow-auto flex flex-col h-full  overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {viewFormModal.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {viewFormModal.description && (
                <p className="text-gray-600">{viewFormModal.description}</p>
              )}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Questões:</h4>
                {viewFormModal.questions &&
                viewFormModal.questions.length > 0 ? (
                  <div className="space-y-4">
                    {viewFormModal.questions.map((q, index) => (
                      <div
                        key={q._id}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-700">
                            {index + 1}.
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {q.questionId.title}
                              {q.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Tipo: {q.questionId.type}
                            </p>
                            {q.questionId.options &&
                              q.questionId.options.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600">
                                    Opções:
                                  </p>
                                  <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                    {q.questionId.options.map(
                                      (opt: any, i: number) => (
                                        <li key={i}>{opt.label}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhuma questão adicionada.</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
        description={
          <>
            Tem certeza que deseja excluir o formulário{" "}
            <strong>{formToDelete?.title}</strong>?
            <br />
            <br />
            Todas as respostas associadas também serão perdidas.
          </>
        }
        countdownSeconds={3}
      />

      {/* Modal de Adicionar Usuários */}
      <AddUsersModal
        open={addUserModalOpen}
        onOpenChange={setAddUserModalOpen}
        allUsers={allUsers}
        assignedUserIds={
          currentFormId
            ? forms.find((f) => f.id === currentFormId)?.assignedUserIds || []
            : []
        }
        onAddUsers={handleAddUsers}
        searchTerm={userSearchTerm}
        onSearchChange={setUserSearchTerm}
      />
    </div>
  );
}

// Componente Modal para adicionar usuários
interface AddUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allUsers: User[];
  assignedUserIds: string[];
  onAddUsers: (userIds: string[]) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

function AddUsersModal({
  open,
  onOpenChange,
  allUsers,
  assignedUserIds,
  onAddUsers,
  searchTerm,
  onSearchChange,
}: AddUsersModalProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("");

  // Filtrar usuários disponíveis (que ainda não estão atribuídos)
  const availableUsers = allUsers.filter(
    (u) => !assignedUserIds.includes(u._id)
  );

  // Obter valores únicos para filtros
  const uniqueCities = [
    ...new Set(availableUsers.map((u) => u.city).filter(Boolean)),
  ].sort();
  const uniqueStates = [
    ...new Set(availableUsers.map((u) => u.state).filter(Boolean)),
  ].sort();
  const uniqueInstitutions = [
    ...new Set(availableUsers.map((u) => u.institution).filter(Boolean)),
  ].sort();

  // Filtrar por termo de busca e filtros de localização/instituição
  const filteredUsers = availableUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = !cityFilter || u.city === cityFilter;
    const matchesState = !stateFilter || u.state === stateFilter;
    const matchesInstitution =
      !institutionFilter || u.institution === institutionFilter;

    return matchesSearch && matchesCity && matchesState && matchesInstitution;
  });

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUserIds);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUserIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map((u) => u._id)));
    }
  };

  const handleConfirm = () => {
    onAddUsers(Array.from(selectedUserIds));
    setSelectedUserIds(new Set());
  };

  const handleClose = () => {
    setSelectedUserIds(new Set());
    setCityFilter("");
    setStateFilter("");
    setInstitutionFilter("");
    onOpenChange(false);
  };

  const clearFilters = () => {
    setCityFilter("");
    setStateFilter("");
    setInstitutionFilter("");
    onSearchChange("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl sm:max-w-3xl w-full h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Adicionar Usuários ao Formulário
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2">
          {/* Barra de busca e filtros */}
          <div className="space-y-3 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* Filtros de localização e instituição */}
            <div className="grid grid-cols-4 gap-2">
              <div>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="">Todas as Cidades</option>
                  {uniqueCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="">Todos os Estados</option>
                  {uniqueStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={institutionFilter}
                  onChange={(e) => setInstitutionFilter(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="">Todas as Instituições</option>
                  {uniqueInstitutions.map((institution) => (
                    <option key={institution} value={institution}>
                      {institution}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-10"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Informações */}
          <div className="flex items-center justify-between text-sm text-gray-600 flex-shrink-0">
            <div>
              <span>
                {filteredUsers.length} de {availableUsers.length} usuário(s)
                disponível(is)
              </span>
              {(cityFilter ||
                stateFilter ||
                institutionFilter ||
                searchTerm) && (
                <span className="ml-2 text-blue-600">(filtrado)</span>
              )}
            </div>
            {selectedUserIds.size > 0 && (
              <span className="font-medium text-blue-600">
                {selectedUserIds.size} selecionado(s)
              </span>
            )}
          </div>

          {/* Lista de usuários */}
          <div className="flex-1 min-h-0 border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-y-auto h-full">
              {filteredUsers.length === 0 ? (
                <div className="flex items-center justify-center h-full p-8 text-gray-500">
                  {availableUsers.length === 0
                    ? "Todos os usuários já estão atribuídos a este formulário"
                    : "Nenhum usuário encontrado"}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                    <tr>
                      <th className="text-left px-4 py-3 w-12">
                        <input
                          type="checkbox"
                          checked={
                            filteredUsers.length > 0 &&
                            selectedUserIds.size === filteredUsers.length
                          }
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                        Nome
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                        Email
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                        Instituição / Localização
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                        Função
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleUserSelection(user._id)}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.has(user._id)}
                            onChange={() => toggleUserSelection(user._id)}
                            className="w-4 h-4 rounded border-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">
                            {user.anonymous ? "Usuário Anônimo" : user.name}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-600">
                            {user.anonymous ? "N/A" : user.email}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600">
                            {user.institution && (
                              <p className="font-medium text-gray-800">
                                {user.institution}
                              </p>
                            )}
                            {(user.city || user.state) && (
                              <p className="text-xs text-gray-500">
                                {[user.city, user.state]
                                  .filter(Boolean)
                                  .join(" - ")}
                              </p>
                            )}
                            {!user.institution && !user.city && !user.state && (
                              <span className="text-gray-400 italic">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Footer com botões */}
        <div className="flex gap-3 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedUserIds.size === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Adicionar {selectedUserIds.size > 0 && `(${selectedUserIds.size})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
