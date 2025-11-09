import { useState } from "react";
import {
  Search,
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
} from "lucide-react";
import { Button } from "./ui/button";
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
  userName: string;
  userEmail: string;
  userPhone: string;
  submittedAt: string;
  status: "completed" | "pending" | "rejected";
  answers: Record<string, any>;
}

const MOCK_RESPONSES: FormResponse[] = [
  {
    id: "resp-001",
    formTitle: "Formulário de Cadastro",
    userName: "Maria Silva",
    userEmail: "joao@email.com",
    userPhone: "(11) 98765-4321",
    submittedAt: "2025-11-09T14:30:00",
    status: "completed",
    answers: {
      "Nome completo": "Maria Silva",
      CPF: "123.456.789-00",
      "Data de nascimento": "15/01/1990",
      Gênero: "Masculino",
      CEP: "01234-567",
      Rua: "Rua das Flores, 123",
      Cidade: "São Paulo",
      Estado: "SP",
    },
  },
  {
    id: "resp-002",
    formTitle: "Solicitação de Serviço",
    userName: "Maria Oliveira",
    userEmail: "maria@email.com",
    userPhone: "(11) 91234-5678",
    submittedAt: "2025-11-09T13:15:00",
    status: "pending",
    answers: {
      "Tipo de serviço": "Consultoria",
      Descrição: "Preciso de ajuda com implementação de sistema",
      Urgência: "Alta",
      "Data preferencial": "15/11/2025",
    },
  },
  {
    id: "resp-003",
    formTitle: "Atualização de Dados",
    userName: "Carlos Santos",
    userEmail: "carlos@email.com",
    userPhone: "(21) 99876-5432",
    submittedAt: "2025-11-08T16:45:00",
    status: "completed",
    answers: {
      "Novo telefone": "(21) 99876-5432",
      "Novo endereço": "Av. Paulista, 1000",
      Cidade: "São Paulo",
    },
  },
  {
    id: "resp-004",
    formTitle: "Formulário de Cadastro",
    userName: "Ana Costa",
    userEmail: "ana@email.com",
    userPhone: "(11) 95555-1234",
    submittedAt: "2025-11-08T10:20:00",
    status: "rejected",
    answers: {
      "Nome completo": "Ana Costa",
      CPF: "987.654.321-00",
      "Data de nascimento": "20/05/1995",
    },
  },
  {
    id: "resp-005",
    formTitle: "Solicitação de Serviço",
    userName: "Pedro Almeida",
    userEmail: "pedro@email.com",
    userPhone: "(11) 94444-3333",
    submittedAt: "2025-11-07T09:00:00",
    status: "completed",
    answers: {
      "Tipo de serviço": "Suporte Técnico",
      Descrição: "Problema com acesso ao sistema",
      Urgência: "Média",
    },
  },
];

export function StaffFormResponses() {
  const [responses, setResponses] = useState<FormResponse[]>(MOCK_RESPONSES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterForm, setFilterForm] = useState<string>("all");
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(
    null
  );

  // Filtrar respostas
  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.formTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || response.status === filterStatus;
    const matchesForm =
      filterForm === "all" || response.formTitle === filterForm;

    return matchesSearch && matchesStatus && matchesForm;
  });

  // Obter lista única de formulários
  const uniqueForms = Array.from(new Set(responses.map((r) => r.formTitle)));

  const getStatusBadge = (status: FormResponse["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completo
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        );
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

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1>Respostas de Formulários</h1>
            <p className="text-gray-500">
              Visualize e gerencie as respostas dos usuários
            </p>
          </div>

          <Button className="bg-gray-800  hover:bg-blue-700 gap-2">
            <Download className="w-5 h-5" />
            Exportar
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email ou formulário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-2"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 h-12 border-2">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="completed">Completo</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterForm} onValueChange={setFilterForm}>
            <SelectTrigger className="w-64 h-12 border">
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
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-gray-50 border-b-2 border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-500">Total de Respostas</p>
            <p className="text-gray-800">{responses.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-500">Completas</p>
            <p className="text-gray-800">
              {responses.filter((r) => r.status === "completed").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="text-gray-800">
              {responses.filter((r) => r.status === "pending").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-500">Rejeitadas</p>
            <p className="text-gray-800">
              {responses.filter((r) => r.status === "rejected").length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
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
                Status
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
                    {getStatusBadge(response.status)}
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

  const getStatusBadge = (status: FormResponse["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completo
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-2 border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2>{response.formTitle}</h2>
              {getStatusBadge(response.status)}
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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {response.userPhone}
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
              {Object.entries(response.answers).map(([question, answer]) => (
                <div
                  key={question}
                  className="pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  <p className="text-sm text-gray-500 mb-2">{question}</p>
                  <p className="text-gray-800">{answer}</p>
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
          <Button className="flex-1 bg-gray-800  hover:bg-blue-700 gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
