import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Edit,
} from "lucide-react";
import { Button } from "./ui/button";
import { PageHeader } from "./ui/page-header";
import { Badge } from "./ui/badge";
import { getAllForms, getFormById } from "../services/formService";

interface Student {
  id: string;
  name: string;
  email: string;
  responded: boolean;
  submittedAt?: string;
  responseId?: string;
}

interface FormWithStudents {
  id: string;
  title: string;
  description: string;
  totalStudents: number;
  respondedCount: number;
  students: Student[];
}

export function StaffFormResponsesByForm() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormWithStudents[]>([]);
  const [expandedForms, setExpandedForms] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
          totalStudents: f.totalStudents || 0,
          respondedCount: f.respondedCount || 0,
          students: Array.isArray(f.students)
            ? f.students.map((s: any) => ({
                id: s.id || s._id || "unknown",
                name: s.name || "Sem nome",
                email: s.email || "",
                responded: !!s.responded || !!s.submittedAt || false,
                submittedAt: s.submittedAt,
                responseId: s.responseId,
              }))
            : [],
        }));

        console.log("Mapped forms:", mapped);
        setForms(mapped);
      } catch (e: any) {
        console.error("Error loading forms:", e);
        setError(e?.message || "Falha ao carregar formulários");
      } finally {
        setLoading(false);
      }
    }
    fetchForms();
  }, []);

  const toggleForm = (formId: string) => {
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
        title="Respostas por Formulário"
        description="Visualize as respostas organizadas por formulário e aluno"
      />
      {/* Stats */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Total de Formulários</p>
            <p className="text-gray-800">{forms.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Total de Alunos</p>
            <p className="text-gray-800">{forms[0]?.totalStudents || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Total de Respostas</p>
            <p className="text-gray-800">
              {forms.reduce((acc, form) => acc + form.respondedCount, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Taxa de Resposta Média</p>
            <p className="text-gray-800">
              {forms.length > 0
                ? Math.round(
                    (forms.reduce((acc, form) => acc + form.respondedCount, 0) /
                      (forms.length * forms[0].totalStudents)) *
                      100
                  )
                : 0}
              %
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
              const percentage = Math.round(
                (form.respondedCount / form.totalStudents) * 100
              );

              return (
                <div
                  key={form.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Form Header - Clickable */}
                  <button
                    onClick={() => toggleForm(form.id)}
                    className="w-full p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>

                    <div className="flex-1 text-left">
                      <h3 className="mb-1">{form.title}</h3>
                      <p className="text-sm text-gray-500">
                        {form.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {form.respondedCount} de {form.totalStudents}{" "}
                            respostas
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-900 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                          handleEditForm(form.id, e)
                        }
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar Formulário
                      </Button>

                      <div className="text-gray-400">
                        {isExpanded ? (
                          <ChevronDown className="w-6 h-6" />
                        ) : (
                          <ChevronRight className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Students List - Collapsible */}
                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-6 py-3 text-sm text-gray-500">
                              Aluno
                            </th>
                            <th className="text-left px-6 py-3 text-sm text-gray-500">
                              Email
                            </th>
                            <th className="text-left px-6 py-3 text-sm text-gray-500">
                              Status
                            </th>
                            <th className="text-left px-6 py-3 text-sm text-gray-500">
                              Data de Resposta
                            </th>
                            <th className="text-left px-6 py-3 text-sm text-gray-500">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.students.map((student) => (
                            <tr
                              key={student.id}
                              className="border-t border-gray-200 hover:bg-gray-50"
                            >
                              <td className="px-6 py-4">
                                <p className="text-gray-800">{student.name}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-600">
                                  {student.email}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                {student.responded ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Respondido
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pendente
                                  </Badge>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {student.submittedAt ? (
                                  <p className="text-sm text-gray-600">
                                    {formatDate(student.submittedAt)}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-400">-</p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {student.responded ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Ver Resposta
                                  </Button>
                                ) : (
                                  <span className="text-sm text-gray-400">
                                    Sem resposta
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
