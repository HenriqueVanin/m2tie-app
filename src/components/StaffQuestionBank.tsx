import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ListChecks,
  Type,
  AlignLeft,
  BarChart3,
  Calendar,
  Upload,
  CheckSquare,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
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
import { DeleteConfirmationDialog } from "./ui/delete-confirmation-dialog";
import {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  Question,
  CreateQuestionDto,
  UpdateQuestionDto,
} from "../services/questionService";
import {
  UIQuestionType,
  uiToBackendType,
  backendToUIType,
  getQuestionTypeLabel,
  QUESTION_TYPE_ICONS,
} from "../utils/questionTypes";

interface UIQuestionLocal {
  _id: string;
  title: string;
  type: UIQuestionType;
  category: string; // placeholder - backend não possui ainda
  options?: string[];
  required: boolean;
  createdAt: string;
}

export function StaffQuestionBank() {
  const [questions, setQuestions] = useState<UIQuestionLocal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterRequired, setFilterRequired] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] =
    useState<UIQuestionLocal | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "multiple_choice" as UIQuestionType,
    category: "",
    options: "",
    required: true,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] =
    useState<UIQuestionLocal | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Question[] = await getAllQuestions();
      const mapped: UIQuestionLocal[] = data.map((q: Question) => ({
        _id: q._id,
        title: q.title,
        type: backendToUIType(q.type),
        category: "Geral",
        options: q.options?.map((o: { label: string }) => o.label),
        required: q.validation?.required || false,
        createdAt: q.createdAt
          ? new Date(q.createdAt).toLocaleDateString("pt-BR")
          : "-",
      }));
      setQuestions(mapped);
    } catch (e: any) {
      setError(e?.message || "Falha ao carregar perguntas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const getQuestionTypeIcon = (type: UIQuestionType) => {
    return QUESTION_TYPE_ICONS[type] || Type;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Socioeconômico":
        return "from-blue-400 to-blue-500";
      case "Acadêmico":
        return "from-orange-400 to-orange-500";
      case "Infraestrutura":
        return "from-pink-400 to-pink-500";
      case "Identificação":
        return "from-yellow-400 to-yellow-500";
      case "Documentação":
        return "from-purple-400 to-purple-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || q.type === filterType;
    const matchesCategory =
      filterCategory === "all" || q.category === filterCategory;
    const matchesRequired =
      filterRequired === "all" ||
      (filterRequired === "required" && q.required) ||
      (filterRequired === "optional" && !q.required);

    return matchesSearch && matchesType && matchesCategory && matchesRequired;
  });

  const questionsByCategory = filteredQuestions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, UIQuestionLocal[]>);

  const handleDelete = async (_id: string) => {
    const question = questions.find((q) => q._id === _id);
    if (!question) return;
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;
    setDeleting(true);
    try {
      await deleteQuestion(questionToDelete._id);
      setQuestions((qs) => qs.filter((q) => q._id !== questionToDelete._id));
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
    } catch (e: any) {
      setError(e?.message || "Erro ao excluir");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (question: UIQuestionLocal) => {
    setCurrentQuestion(question);
    setFormData({
      title: question.title,
      type: question.type,
      category: question.category,
      options: question.options?.join("\n") || "",
      required: question.required,
    });
    setIsEditDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) return;
    const uiType = formData.type;
    const backendType = uiToBackendType(uiType);
    let optionsArray = (
      formData.options
        ? formData.options.split("\n").filter((o) => o.trim())
        : []
    ).map((o) => ({ label: o.trim(), value: o.trim() }));
    if (uiType === "scale" && optionsArray.length === 0) {
      optionsArray = Array.from({ length: 11 }).map((_, i) => ({
        label: String(i),
        value: String(i),
      }));
    }
    const payload: CreateQuestionDto = {
      title: formData.title.trim(),
      type: backendType,
      options: optionsArray,
      validation: { required: formData.required },
    };
    try {
      const created = await createQuestion(payload);
      const newLocal: UIQuestionLocal = {
        _id: created._id,
        title: created.title,
        type: backendToUIType(created.type),
        category: formData.category || "Geral",
        options: created.options?.map((o) => o.label),
        required: created.validation?.required || false,
        createdAt: created.createdAt
          ? new Date(created.createdAt).toLocaleDateString("pt-BR")
          : "-",
      };
      setQuestions((qs) => [newLocal, ...qs]);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (e: any) {
      setError(e?.message || "Erro ao criar");
    }
  };

  const handleUpdate = async () => {
    if (!currentQuestion) return;
    const uiType = formData.type;
    const backendType = uiToBackendType(uiType);
    let optionsArray = (
      formData.options
        ? formData.options.split("\n").filter((o) => o.trim())
        : []
    ).map((o) => ({ label: o.trim(), value: o.trim() }));
    if (uiType === "scale" && optionsArray.length === 0) {
      optionsArray = Array.from({ length: 11 }).map((_, i) => ({
        label: String(i),
        value: String(i),
      }));
    }
    const payload: UpdateQuestionDto = {
      title: formData.title.trim(),
      type: backendType,
      options: optionsArray,
      validation: { required: formData.required },
    };
    try {
      const updated = await updateQuestion(currentQuestion._id, payload);
      setQuestions((qs) =>
        qs.map((q) =>
          q._id === currentQuestion._id
            ? {
                _id: updated._id,
                title: updated.title,
                type: backendToUIType(updated.type),
                category: formData.category || "Geral",
                options: updated.options?.map((o) => o.label),
                required: updated.validation?.required || false,
                createdAt: updated.createdAt
                  ? new Date(updated.createdAt).toLocaleDateString("pt-BR")
                  : "-",
              }
            : q
        )
      );
      setIsEditDialogOpen(false);
      resetForm();
    } catch (e: any) {
      setError(e?.message || "Erro ao atualizar");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "multiple_choice",
      category: "",
      options: "",
      required: true,
    });
    setCurrentQuestion(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-gray-900 text-2xl">Banco de Questões</h1>
            <p className="text-gray-500">
              Gerencie todas as questões disponíveis
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadQuestions}
              variant="outline"
              className="gap-2 rounded-3xl"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar
            </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-emerald-500 shadow-lg rounded-3xl px-6"
            >
              <Plus className="w-5 h-5" />
              Nova Questão
            </Button>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar questões por título ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-gray-200 rounded-3xl"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 h-12 rounded-3xl">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
              <SelectItem value="checkbox">Caixas de Seleção</SelectItem>
              <SelectItem value="dropdown">Lista Suspensa</SelectItem>
              <SelectItem value="scale">Escala Linear</SelectItem>
              <SelectItem value="date">Data</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48 h-12 rounded-3xl">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {Array.from(new Set(questions.map((q) => q.category))).map(
                (cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Select value={filterRequired} onValueChange={setFilterRequired}>
            <SelectTrigger className="w-48 h-12 rounded-3xl">
              <SelectValue placeholder="Obrigatória" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="required">Obrigatórias</SelectItem>
              <SelectItem value="optional">Opcionais</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl border border-blue-200">
            <p className="text-blue-900 text-2xl">{questions.length}</p>
            <p className="text-sm text-blue-700 mt-1">Total de Questões</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl border border-orange-200">
            <p className="text-orange-900 text-2xl">
              {Object.keys(questionsByCategory).length}
            </p>
            <p className="text-sm text-orange-700 mt-1">Categorias</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl border border-pink-200">
            <p className="text-pink-900 text-2xl">
              {questions.filter((q) => q.required).length}
            </p>
            <p className="text-sm text-pink-700 mt-1">Obrigatórias</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl border border-yellow-200">
            <p className="text-yellow-900 text-2xl">
              {questions.filter((q) => !q.required).length}
            </p>
            <p className="text-sm text-yellow-700 mt-1">Opcionais</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-gray-600 mb-4">Carregando...</p>}
        <div className="space-y-6">
          {Object.entries(questionsByCategory).map(
            ([category, categoryQuestions]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(
                      category
                    )} text-white rounded-2xl shadow-md`}
                  >
                    <h2 className="text-sm">{category}</h2>
                  </div>
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <span className="text-sm text-gray-500">
                    {categoryQuestions.length}{" "}
                    {categoryQuestions.length === 1 ? "questão" : "questões"}
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categoryQuestions.map((question) => {
                    const Icon = getQuestionTypeIcon(question.type);
                    return (
                      <Card
                        key={question._id}
                        className="border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-3xl"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div
                                className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(
                                  question.category
                                )} rounded-2xl flex items-center justify-center flex-shrink-0`}
                              >
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-gray-900 mb-1 line-clamp-2">
                                  {question.title}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                    {getQuestionTypeLabel(question.type)}
                                  </span>
                                  {question.required && (
                                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                                      Obrigatória
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEdit(question)}
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(question._id)}
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 rounded-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {question.options && question.options.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500">Opções:</p>
                              <div className="space-y-1">
                                {question.options
                                  .slice(0, 3)
                                  .map((option, idx) => (
                                    <div
                                      key={idx}
                                      className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg"
                                    >
                                      {option}
                                    </div>
                                  ))}
                                {question.options.length > 3 && (
                                  <p className="text-xs text-gray-400 px-3">
                                    +{question.options.length - 3} mais opções
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              Criada em {question.createdAt}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )
          )}
          {filteredQuestions.length === 0 && !loading && (
            <div className="text-center py-12">
              <ListChecks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">Nenhuma questão encontrada</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Tente buscar por outros termos"
                  : "Crie sua primeira questão para começar"}
              </p>
            </div>
          )}
        </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Questão</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, type: value as UIQuestionType })
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">
                      Múltipla Escolha
                    </SelectItem>
                    <SelectItem value="short-text">Texto Curto</SelectItem>
                    <SelectItem value="long-text">Texto Longo</SelectItem>
                    <SelectItem value="scale">Escala Linear</SelectItem>
                    <SelectItem value="date">Data</SelectItem>
                    <SelectItem value="file-upload">
                      Upload de Arquivo
                    </SelectItem>
                    <SelectItem value="checkbox">Caixas de Seleção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Categoria (local)</Label>
                <Input
                  id="category"
                  placeholder="Ex: Socioeconômico"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="h-12 rounded-2xl"
                />
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
              disabled={!formData.title || !formData.category}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Tipo de Questão</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, type: value as UIQuestionType })
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">
                      Múltipla Escolha
                    </SelectItem>
                    <SelectItem value="short-text">Texto Curto</SelectItem>
                    <SelectItem value="long-text">Texto Longo</SelectItem>
                    <SelectItem value="scale">Escala Linear</SelectItem>
                    <SelectItem value="date">Data</SelectItem>
                    <SelectItem value="file-upload">
                      Upload de Arquivo
                    </SelectItem>
                    <SelectItem value="checkbox">Caixas de Seleção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-category">Categoria (local)</Label>
                <Input
                  id="edit-category"
                  placeholder="Ex: Socioeconômico"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="h-12 rounded-2xl"
                />
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
              disabled={!formData.title || !formData.category}
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
