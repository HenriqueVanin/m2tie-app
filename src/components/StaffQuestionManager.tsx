import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ShieldAlert } from "lucide-react";
import { getUserCookie } from "../utils/userCookie";
import { hasPermission, type UserRole } from "../utils/permissions";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ErrorState } from "./ui/error-state";
import { SearchBar } from "./ui/search-bar";
import { PageHeaderWithSearch } from "./ui/page-header";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { DeleteConfirmationDialog } from "./ui/delete-confirmation-dialog";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  updateQuestion,
  Question as BackendQuestion,
  QuestionOption,
} from "../services/questionService";
import {
  backendToUIType,
  uiToBackendType,
  UIQuestionType,
  QUESTION_TYPE_ICONS,
  getQuestionTypeLabel,
} from "../utils/questionTypes";

interface UIQuestion {
  _id: string;
  title: string;
  description?: string;
  type: UIQuestionType;
  options?: string[];
  required: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt?: string;
  validation?: BackendQuestion["validation"];
}

interface FormState {
  title: string;
  description: string;
  type: UIQuestionType;
  options: string; // linha por opção (para múltipla escolha / checkbox)
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  scaleMin: number;
  scaleMax: number;
}

function deriveScaleRange(options: QuestionOption[] | undefined): {
  min: number;
  max: number;
} {
  const nums = (options || [])
    .map((o) => parseInt(o.value, 10))
    .filter((n) => !isNaN(n));
  if (!nums.length) return { min: 0, max: 10 };
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

function mapBackendToUI(q: BackendQuestion): UIQuestion {
  const uiType = backendToUIType(q.type);
  const { min, max } =
    uiType === "scale" ? deriveScaleRange(q.options) : { min: 0, max: 0 };
  return {
    _id: q._id,
    title: q.title,
    description: q.description,
    type: uiType,
    options: q.options?.map((o) => o.label) || undefined,
    required: !!q.validation?.required,
    createdBy: q.createdBy || {
      _id: "",
      name: "Desconhecido",
      email: "",
      role: "",
    },
    createdAt: q.createdAt,
    validation: q.validation,
  };
}

function buildOptions(optionsText: string): QuestionOption[] | undefined {
  const lines = optionsText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return undefined;
  return lines.map((l) => ({
    label: l,
    value: l.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }));
}

export function StaffQuestionManager() {
  const [questions, setQuestions] = useState<UIQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRequired, setFilterRequired] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<UIQuestion | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const user = getUserCookie();
    if (user?.role) setUserRole(user.role as UserRole);
  }, []);

  const canManage = hasPermission(userRole, "canManageQuestions");
  const canCreate = hasPermission(userRole, "canCreateQuestions");
  const canEdit = hasPermission(userRole, "canEditQuestions");
  const canDelete = hasPermission(userRole, "canDeleteQuestions");

  // Verificar se o usuário é analyst (sem permissões de edição/exclusão)
  const currentUser = getUserCookie();
  const isAnalyst = currentUser?.role === "teacher_analyst";

  const [currentQuestion, setCurrentQuestion] = useState<UIQuestion | null>(
    null
  );
  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    type: "text",
    options: "",
    required: true,
    minLength: undefined,
    maxLength: undefined,
    pattern: "",
    scaleMin: 0,
    scaleMax: 10,
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllQuestions();
      console.log("Questions from backend:", data);
      setQuestions(Array.isArray(data) ? data.map(mapBackendToUI) : []);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar questões");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || q.type === filterType;
    const matchesRequired =
      filterRequired === "all" ||
      (filterRequired === "required" && q.required) ||
      (filterRequired === "optional" && !q.required);

    return matchesSearch && matchesType && matchesRequired;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "text",
      options: "",
      required: true,
      minLength: undefined,
      maxLength: undefined,
      pattern: "",
      scaleMin: 0,
      scaleMax: 10,
    });
    setCurrentQuestion(null);
  };

  async function handleCreate() {
    try {
      const validation: any = { required: formData.required };
      if (formData.type === "text") {
        if (formData.minLength) validation.minLength = formData.minLength;
        if (formData.maxLength) validation.maxLength = formData.maxLength;
        if (formData.pattern) validation.pattern = formData.pattern;
      }
      let options: QuestionOption[] | undefined;
      if (
        formData.type === "multiple_choice" ||
        formData.type === "checkbox" ||
        formData.type === "dropdown"
      ) {
        options = buildOptions(formData.options);
      } else if (formData.type === "scale") {
        const { scaleMin, scaleMax } = formData;
        options = [];
        for (let i = scaleMin; i <= scaleMax; i++) {
          options.push({ label: String(i), value: String(i) });
        }
      }
      const created = await createQuestion({
        title: formData.title,
        description: formData.description || undefined,
        type: uiToBackendType(formData.type),
        options,
        validation,
      });
      setQuestions((prev) => [mapBackendToUI(created), ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao criar questão");
    }
  }

  async function handleUpdate() {
    if (!currentQuestion) return;
    try {
      const validation: any = { required: formData.required };
      if (formData.type === "text") {
        if (formData.minLength) validation.minLength = formData.minLength;
        if (formData.maxLength) validation.maxLength = formData.maxLength;
        if (formData.pattern) validation.pattern = formData.pattern;
      }
      let options: QuestionOption[] | undefined;
      if (
        formData.type === "multiple_choice" ||
        formData.type === "checkbox" ||
        formData.type === "dropdown"
      ) {
        options = buildOptions(formData.options);
      } else if (formData.type === "scale") {
        const { scaleMin, scaleMax } = formData;
        options = [];
        for (let i = scaleMin; i <= scaleMax; i++) {
          options.push({ label: String(i), value: String(i) });
        }
      }
      const updated = await updateQuestion(currentQuestion._id, {
        title: formData.title,
        description: formData.description || undefined,
        type: uiToBackendType(formData.type),
        options,
        validation,
      });

      console.log("Updated question from backend:", updated);

      // Mapeia a questão atualizada preservando createdBy e description originais se necessário
      const updatedUI = mapBackendToUI(updated);
      if (
        !updatedUI.createdBy.name ||
        updatedUI.createdBy.name === "Desconhecido"
      ) {
        updatedUI.createdBy = currentQuestion.createdBy;
      }
      // Preserva a descrição do formulário se o backend não retornou
      if (!updatedUI.description && formData.description) {
        updatedUI.description = formData.description;
      }

      setQuestions((prev) =>
        prev.map((q) => (q._id === updated._id ? updatedUI : q))
      );
      setIsEditDialogOpen(false);
      resetForm();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao atualizar questão");
    }
  }

  async function handleDelete(id: string) {
    const question = questions.find((q) => q._id === id);
    if (!question) return;
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!questionToDelete) return;
    setDeleting(true);
    try {
      await deleteQuestion(questionToDelete._id);
      setQuestions((prev) =>
        prev.filter((q) => q._id !== questionToDelete._id)
      );
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
    } catch (e: any) {
      setError(e?.message || "Erro ao excluir quest\u00e3o");
    } finally {
      setDeleting(false);
    }
  }

  function handleEdit(q: UIQuestion) {
    let scaleMin = 0;
    let scaleMax = 10;
    if (q.type === "scale" && q.options && q.options.length) {
      const nums = q.options
        .map((o) => parseInt(o, 10))
        .filter((n) => !isNaN(n));
      if (nums.length) {
        scaleMin = Math.min(...nums);
        scaleMax = Math.max(...nums);
      }
    }
    setCurrentQuestion(q);
    setFormData({
      title: q.title,
      description: q.description || "",
      type: q.type,
      options:
        q.type === "multiple_choice" ||
        q.type === "checkbox" ||
        q.type === "dropdown"
          ? q.options?.join("\n") || ""
          : "",
      required: q.required,
      minLength: q.validation?.minLength,
      maxLength: q.validation?.maxLength,
      pattern: q.validation?.pattern || "",
      scaleMin,
      scaleMax,
    });
    setIsEditDialogOpen(true);
  }

  if (!canManage) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Você não tem permissão para gerenciar questões.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeaderWithSearch
        title="Banco de Questões"
        description="Gerencie todas as questões disponíveis"
        searchComponent={
          <div className="flex gap-3">
            <SearchBar
              placeholder="Buscar questões por título ou categoria..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 h-12 rounded-2xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="multiple_choice">
                  Múltipla Escolha
                </SelectItem>
                <SelectItem value="checkbox">Caixas de Seleção</SelectItem>
                <SelectItem value="dropdown">Lista Suspensa</SelectItem>
                <SelectItem value="scale">Escala Linear</SelectItem>
                <SelectItem value="date">Data</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRequired} onValueChange={setFilterRequired}>
              <SelectTrigger className="w-48 h-12 rounded-2xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Obrigatória" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="required">Obrigatórias</SelectItem>
                <SelectItem value="optional">Opcionais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {!isAnalyst && (
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-2xl"
          >
            <Plus className="w-5 h-5" />
            Nova Questão
          </Button>
        )}
      </PageHeaderWithSearch>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Carregando...</div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchQuestions} />
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-900 mb-2">Nenhuma questão encontrada</p>
            <p className="text-gray-500">
              {searchTerm
                ? "Tente buscar por outros termos"
                : "Crie sua primeira questão para começar"}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Questão
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Tipo
                </th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">
                  Obrigatória
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Criado Por
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Data de Criação
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredQuestions.map((q) => {
                const Icon = QUESTION_TYPE_ICONS[q.type];
                return (
                  <tr
                    key={q._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br bg-[#003087] rounded-xl flex items-center justify-center flex-shrink-0">
                          {Icon && <Icon className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">{q.title}</p>
                          {q.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {q.description}
                            </p>
                          )}
                          {q.options && q.options.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {q.options.length}{" "}
                              {q.options.length === 1 ? "opção" : "opções"}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-700 hover:bg-gray-100"
                      >
                        {getQuestionTypeLabel(q.type)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {q.required ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          Sim
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Não
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-800 font-medium">
                          {q.createdBy.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {q.createdBy.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {q.createdAt
                        ? new Date(q.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}
                    </td>
                    <td className="px-6 py-4">
                      {!isAnalyst ? (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(q)}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleDelete(q._id)}
                            variant="outline"
                            size="sm"
                            className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Somente visualização
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>Nova Questão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Questão</Label>
              <Input
                id="title"
                placeholder="Digite o título da questão"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="h-12 rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Adicione instruções ou detalhes sobre a questão"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-2xl"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Questão</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val: string) =>
                    setFormData({ ...formData, type: val as UIQuestionType })
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="multiple_choice">
                      Múltipla Escolha
                    </SelectItem>
                    <SelectItem value="checkbox">Caixas de Seleção</SelectItem>
                    <SelectItem value="dropdown">Lista Suspensa</SelectItem>
                    <SelectItem value="scale">Escala Linear</SelectItem>
                    <SelectItem value="date">Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(formData.type === "multiple_choice" ||
              formData.type === "checkbox" ||
              formData.type === "dropdown") && (
              <div>
                <Label htmlFor="options">Opções (uma por linha)</Label>
                <Textarea
                  id="options"
                  placeholder="Digite cada opção em uma nova linha"
                  value={formData.options}
                  onChange={(e) =>
                    setFormData({ ...formData, options: e.target.value })
                  }
                  className="min-h-32 rounded-2xl"
                />
              </div>
            )}
            {formData.type === "text" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minLength">Mín. Caracteres</Label>
                  <Input
                    id="minLength"
                    type="number"
                    min={0}
                    value={formData.minLength ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minLength: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="maxLength">Máx. Caracteres</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    min={0}
                    value={formData.maxLength ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxLength: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>
            )}
            {formData.type === "scale" && (
              <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="scaleMin">Valor Inicial</Label>
                  <Input
                    id="scaleMin"
                    type="number"
                    value={formData.scaleMin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scaleMin: parseInt(e.target.value, 10),
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="scaleMax">Valor Final</Label>
                  <Input
                    id="scaleMax"
                    type="number"
                    value={formData.scaleMax}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scaleMax: parseInt(e.target.value, 10),
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {formData.scaleMin < formData.scaleMax
                    ? `${formData.scaleMax - formData.scaleMin + 1} pontos`
                    : "Intervalo inválido"}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) =>
                  setFormData({ ...formData, required: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <Label htmlFor="required" className="cursor-pointer">
                Questão obrigatória
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="rounded-2xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !formData.title ||
                (formData.type === "scale" &&
                  formData.scaleMin >= formData.scaleMax)
              }
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl"
            >
              Criar Questão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>Editar Questão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título da Questão</Label>
              <Input
                id="edit-title"
                placeholder="Digite o título da questão"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="h-12 rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição (opcional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Adicione instruções ou detalhes sobre a questão"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-2xl"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Tipo de Questão</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val: string) =>
                    setFormData({ ...formData, type: val as UIQuestionType })
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="multiple_choice">
                      Múltipla Escolha
                    </SelectItem>
                    <SelectItem value="checkbox">Caixas de Seleção</SelectItem>
                    <SelectItem value="dropdown">Lista Suspensa</SelectItem>
                    <SelectItem value="scale">Escala Linear</SelectItem>
                    <SelectItem value="date">Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(formData.type === "multiple_choice" ||
              formData.type === "checkbox" ||
              formData.type === "dropdown") && (
              <div>
                <Label htmlFor="edit-options">Opções (uma por linha)</Label>
                <Textarea
                  id="edit-options"
                  placeholder="Digite cada opção em uma nova linha"
                  value={formData.options}
                  onChange={(e) =>
                    setFormData({ ...formData, options: e.target.value })
                  }
                  className="min-h-32 rounded-2xl"
                />
              </div>
            )}
            {formData.type === "text" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-minLength">Mín. Caracteres</Label>
                  <Input
                    id="edit-minLength"
                    type="number"
                    min={0}
                    value={formData.minLength ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minLength: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-maxLength">Máx. Caracteres</Label>
                  <Input
                    id="edit-maxLength"
                    type="number"
                    min={0}
                    value={formData.maxLength ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxLength: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>
            )}
            {formData.type === "scale" && (
              <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="edit-scaleMin">Valor Inicial</Label>
                  <Input
                    id="edit-scaleMin"
                    type="number"
                    value={formData.scaleMin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scaleMin: parseInt(e.target.value, 10),
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-scaleMax">Valor Final</Label>
                  <Input
                    id="edit-scaleMax"
                    type="number"
                    value={formData.scaleMax}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scaleMax: parseInt(e.target.value, 10),
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {formData.scaleMin < formData.scaleMax
                    ? `${formData.scaleMax - formData.scaleMin + 1} pontos`
                    : "Intervalo inválido"}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-required"
                checked={formData.required}
                onChange={(e) =>
                  setFormData({ ...formData, required: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <Label htmlFor="edit-required" className="cursor-pointer">
                Questão obrigatória
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="rounded-2xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                !formData.title ||
                (formData.type === "scale" &&
                  formData.scaleMin >= formData.scaleMax)
              }
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
        description={
          <>
            Tem certeza que deseja excluir a questão{" "}
            <strong>{questionToDelete?.title}</strong>?
          </>
        }
        countdownSeconds={3}
      />
    </div>
  );
}

// Backwards compatibility export if other parts still import the old name
export const StaffQuestionBank = StaffQuestionManager;
