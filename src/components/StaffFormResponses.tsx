import { useState, useEffect } from "react";
import {
  Filter,
  Eye,
  Download,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import { getAllResponses, ResponseData } from "../services/responseService";
import { Button } from "./ui/button";
import { ErrorState } from "./ui/error-state";
import { SearchBar } from "./ui/search-bar";
import { PageHeaderWithSearch } from "./ui/page-header";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FormResponse {
  id: string;
  formTitle: string;
  formDescription?: string;
  userName: string;
  userEmail: string;
  submittedAt: string;
  answers: {
    questionId: string;
    questionTitle: string;
    questionType: string;
    questionOptions?: string[];
    answer: string | string[] | number;
  }[];
}

export function StaffFormResponses() {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterForm, setFilterForm] = useState<string>("all");
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(
    null
  );

  // Fetch responses on mount
  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllResponses();
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        // Map backend data to UI format
        const mappedResponses: FormResponse[] = result.data.map(
          (r: ResponseData) => ({
            id: r._id,
            formTitle: r.formId.title,
            formDescription: r.formId.description,
            userName: r.userId.name,
            userEmail: r.userId.email,
            submittedAt: r.submittedAt,
            answers: r.answers.map((a) => ({
              questionId: a.questionId._id,
              questionTitle: a.questionId.title,
              questionType: a.questionId.type,
              questionOptions: a.questionId.options,
              answer: a.answer,
            })),
          })
        );
        setResponses(mappedResponses);
      }
    } catch (err) {
      setError("Erro ao carregar respostas");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar respostas
  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.formTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesForm =
      filterForm === "all" || response.formTitle === filterForm;

    return matchesSearch && matchesForm;
  });

  // Obter lista única de formulários
  const uniqueForms = Array.from(new Set(responses.map((r) => r.formTitle)));

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

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeaderWithSearch
        title="Respostas de Formulários"
        description="Visualize e gerencie as respostas dos usuários"
        searchComponent={
          <div className="flex gap-4">
            <SearchBar
              placeholder="Buscar por nome, email ou formulário..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1"
            />
            <Select value={filterForm} onValueChange={setFilterForm}>
              <SelectTrigger className="w-64 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-2xl">
                <SelectValue placeholder="Formulário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os formulários</SelectItem>
                {uniqueForms.map((form) => (
                  <SelectItem key={form} value={form}>
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        <Button className="h-12 bg-emerald-600 hover:bg-emerald-700 text-emerald gap-2 shadow-lg rounded-2xl">
          <Download className="w-5 h-5" />
          Exportar
        </Button>
      </PageHeaderWithSearch>

      {/* Stats */}
      <div className="px-6 py-4 bg-gray-50 border-b-2 border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-500">Total de Respostas</p>
            <p className="text-gray-800">{responses.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-500">Formulários Únicos</p>
            <p className="text-gray-800">{uniqueForms.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-500">Usuários Únicos</p>
            <p className="text-gray-800">
              {new Set(responses.map((r) => r.userEmail)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchResponses} />
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-gray-500">
                  Usuário
                </th>
                <th className="text-left px-6 py-4 text-sm text-gray-500">
                  Formulário
                </th>
                <th className="text-left px-6 py-4 text-sm text-gray-500">
                  Data de Envio
                </th>
                <th className="text-left px-6 py-4 text-sm text-gray-500">
                  Respostas
                </th>
                <th className="text-left px-6 py-4 text-sm text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredResponses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Nenhuma resposta encontrada
                  </td>
                </tr>
              ) : (
                filteredResponses.map((response) => (
                  <tr
                    key={response.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-800">{response.userName}</p>
                          <p className="text-sm text-gray-500">
                            {response.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{response.formTitle}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(response.submittedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        {response.answers.length}{" "}
                        {response.answers.length === 1
                          ? "resposta"
                          : "respostas"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => setSelectedResponse(response)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedResponse && (
        <ResponseDetailModal
          response={selectedResponse}
          onClose={() => setSelectedResponse(null)}
        />
      )}
    </div>
  );
}

interface ResponseDetailModalProps {
  response: FormResponse;
  onClose: () => void;
}

function ResponseDetailModal({ response, onClose }: ResponseDetailModalProps) {
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

  const formatAnswer = (answer: string | string[] | number): string => {
    if (Array.isArray(answer)) {
      return answer.join(", ");
    }
    return String(answer);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-2 border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2>{response.formTitle}</h2>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                {response.answers.length}{" "}
                {response.answers.length === 1 ? "resposta" : "respostas"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Enviado em {formatDate(response.submittedAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* User Info */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{response.userName}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {response.userEmail}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answers */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Respostas do Formulário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {response.answers.map((answer) => (
                <div
                  key={answer.questionId}
                  className="pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-500 flex-1">
                      {answer.questionTitle}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {answer.questionType}
                    </Badge>
                  </div>
                  <p className="text-gray-800">{formatAnswer(answer.answer)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1 border">
            Fechar
          </Button>
          <Button className="flex-1 bg-blue-900 hover:bg-blue-800 text-white gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
