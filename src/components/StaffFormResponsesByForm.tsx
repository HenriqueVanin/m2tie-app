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
} from "lucide-react";
import { Button } from "./ui/button";
import { PageHeader } from "./ui/page-header";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  getAllForms,
  getFormById,
  deleteForm,
  type Form,
} from "../services/formService";
import { getAllUsers, type User } from "../services/userService";
import {
  getFormRespondents,
  type Respondent,
} from "../services/responseService";

interface UserWithResponse {
  _id: string | null;
  name: string;
  email: string;
  role: string;
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

  // Fetch forms from API
  useEffect(() => {
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
        const apiForms = await getAllForms();
        console.log("API Response:", apiForms);

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

        console.log("Forms list:", formsList);

        const mapped: FormWithStudents[] = formsList.map((f: any) => ({
          id: f._id || f.id || "unknown",
          title: f.title || "Sem título",
          description: f.description || "",
          isActive: f.isActive || false,
          totalStudents: f.totalStudents || 0,
          respondedCount: f.respondedCount || 0,
          respondedUserIds: [],
          respondents: [],
        }));

        console.log("Mapped forms:", mapped);
        setForms(mapped);

        // Carregar respondentes para todos os formulários
        await Promise.all(
          mapped.map((form) => fetchRespondentsForForm(form.id))
        );

        // Auto-expand the active form
        const activeForm = mapped.find((f) => f.isActive);
        if (activeForm) {
          setExpandedForms(new Set([activeForm.id]));
        }
      } catch (e: any) {
        console.error("Error loading forms:", e);
        setError(e?.message || "Falha ao carregar formulários");
      } finally {
        setLoading(false);
      }
    }
    fetchForms();
  }, []);

  // Fetch respondents quando um formulário for expandido
  const fetchRespondentsForForm = async (formId: string) => {
    setLoadingRespondents((prev) => ({ ...prev, [formId]: true }));
    try {
      const response = await getFormRespondents(formId);

      if (response.error) {
        console.error("Error loading respondents:", response.error);
        return;
      }

      // Obter todos os usuários
      const allUsers = await getAllUsers();
      const regularUsers = allUsers.filter((u) => u.role === "user");

      // Criar mapa de respondentes
      const respondentsMap = new Map<string, Respondent>();
      response.respondents.forEach((r) => {
        if (r._id) {
          respondentsMap.set(r._id, r);
        }
      });

      // Combinar dados: todos os usuários com status de resposta
      const usersWithResponse: UserWithResponse[] = regularUsers.map((user) => {
        const respondent = respondentsMap.get(user._id);
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          responded: !!respondent,
          submittedAt: respondent?.submittedAt,
          responseId: respondent?.responseId,
        };
      });

      // Atualizar o formulário com os dados dos respondentes
      setForms((prevForms) =>
        prevForms.map((f) =>
          f.id === formId
            ? {
                ...f,
                respondents: usersWithResponse,
                respondedCount: response.totalRespondents,
                respondedUserIds: response.respondents
                  .filter((r) => r._id)
                  .map((r) => r._id as string),
                totalStudents: regularUsers.length,
              }
            : f
        )
      );
    } catch (err: any) {
      console.error("Error loading respondents:", err);
    } finally {
      setLoadingRespondents((prev) => ({ ...prev, [formId]: false }));
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
    if (!confirm("Tem certeza que deseja excluir este formulário?")) return;

    try {
      await deleteForm(formId);
      setForms(forms.filter((f) => f.id !== formId));
    } catch (err: any) {
      alert(err?.message || "Erro ao excluir formulário");
    }
  };

  const handleViewForm = async (
    formId: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    try {
      const form = await getFormById(formId);
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
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Nome
                                </th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Email
                                </th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Função
                                </th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900">
                              {form.respondents.length > 0 ? (
                                form.respondents.map((user) => (
                                  <tr
                                    key={user._id || user.email}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                  >
                                    <td className="px-6 py-4">
                                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                                        {user.name}
                                      </p>
                                    </td>
                                    <td className="px-6 py-4">
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {user.email}
                                      </p>
                                    </td>
                                    <td className="px-6 py-4">
                                      <Badge
                                        className={
                                          user.role === "admin"
                                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                            : user.role === "staff"
                                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                        }
                                      >
                                        {user.role === "admin"
                                          ? "Administrador"
                                          : user.role === "staff"
                                          ? "Staff"
                                          : "Usuário"}
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
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="px-6 py-8 text-center text-gray-500"
                                  >
                                    Nenhum usuário encontrado
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
          <DialogContent className="max-w-3xl  overflow-auto flex flex-col h-full  overflow-auto">
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
    </div>
  );
}
