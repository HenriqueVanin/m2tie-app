import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ErrorState } from "./ui/error-state";
import { getUserCookie } from "../utils/userCookie";
import { hasPermission, type UserRole } from "../utils/permissions";
import {
  Plus,
  GripVertical,
  Trash2,
  Settings,
  Type,
  ListChecks,
  Circle,
  ToggleLeft,
  Calendar,
  FileText,
  X,
  ChevronDown,
  CheckSquare,
  BarChart3,
  ShieldAlert,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SearchBar } from "./ui/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  createQuestion,
  updateQuestion as updateQuestionAPI,
  QuestionOption,
  getQuestion,
  getAllQuestions,
  Question as QuestionFromService,
} from "../services/questionService";
import {
  UIQuestionType,
  QUESTION_TYPE_ICONS,
  getQuestionTypeLabel,
} from "../utils/questionTypes";
import {
  createForm,
  updateForm,
  getFormById,
  CreateFormPayload,
  Form,
  FormQuestion,
} from "../services/formService";

interface Question {
  id: string;
  type: UIQuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: any[];
}

const QUESTION_TYPES: { type: UIQuestionType; icon: any; label: string }[] = [
  { type: "text", icon: Type, label: "Texto" },
  { type: "multiple_choice", icon: ListChecks, label: "Múltipla Escolha" },
  { type: "checkbox", icon: CheckSquare, label: "Caixas de Seleção" },
  { type: "dropdown", icon: ChevronDown, label: "Lista Suspensa" },
  { type: "scale", icon: BarChart3, label: "Escala Linear" },
  { type: "date", icon: Calendar, label: "Data" },
];

export function StaffFormBuilder() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FormBuilderContent />
    </DndProvider>
  );
}

function FormBuilderContent() {
  const [searchParams] = useSearchParams();
  const formIdFromUrl = searchParams.get("formId");

  console.log("FormIdFromUrl:", formIdFromUrl);

  const [formId, setFormId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("Novo Formulário");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showExistingQuestionsModal, setShowExistingQuestionsModal] =
    useState(false);
  const [existingQuestions, setExistingQuestions] = useState<
    QuestionFromService[]
  >([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<UIQuestionType | "all">("all");
  const [userRole, setUserRole] = useState<UserRole>("student");

  useEffect(() => {
    const user = getUserCookie();
    if (user?.role) setUserRole(user.role as UserRole);
  }, []);

  const canManage = hasPermission(userRole, "canManageForms");
  const canCreate = hasPermission(userRole, "canCreateForms");
  const canEdit = hasPermission(userRole, "canEditForms");

  // Carregar formulário ao montar componente ou quando formIdFromUrl mudar
  useEffect(() => {
    console.log(
      "useEffect triggered - formIdFromUrl:",
      formIdFromUrl,
      "formId:",
      formId
    );
    if (formIdFromUrl && formIdFromUrl !== formId) {
      loadForm(formIdFromUrl);
    }
  }, [formIdFromUrl]);

  const loadExistingQuestions = async () => {
    try {
      setIsLoadingQuestions(true);
      const allQuestions = await getAllQuestions();
      setExistingQuestions(allQuestions);
      setShowExistingQuestionsModal(true);
    } catch (e: any) {
      alert(e?.message || "Erro ao carregar questões");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const addExistingQuestion = (existingQ: QuestionFromService) => {
    const newQuestion: Question = {
      id: existingQ._id,
      type: existingQ.type as UIQuestionType,
      title: existingQ.title,
      required: existingQ.validation?.required || false,
      options: existingQ.options?.map((o) => o.label),
    };
    setQuestions([...questions, newQuestion]);
    setShowExistingQuestionsModal(false);
  };

  // Filtrar questões baseado na pesquisa e tipo
  const filteredQuestions = existingQuestions.filter((q) => {
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || q.type === filterType;
    return matchesSearch && matchesType;
  });

  const addQuestion = (type: UIQuestionType) => {
    const options: string[] | undefined =
      type === "multiple_choice" || type === "checkbox" || type === "dropdown"
        ? ["Opção 1", "Opção 2"]
        : type === "scale"
        ? Array.from({ length: 11 }, (_, i) => String(i))
        : undefined;

    const newQuestion: Question = {
      id: `temp-${Date.now()}`, // ID temporário até salvar
      type,
      title: "Nova Pergunta",
      required: false,
      options,
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestion(newQuestion.id);
  };

  const moveQuestion = (dragIndex: number, hoverIndex: number) => {
    const newQuestions = [...questions];
    const [draggedItem] = newQuestions.splice(dragIndex, 1);
    newQuestions.splice(hoverIndex, 0, draggedItem);
    setQuestions(newQuestions);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    if (selectedQuestion === id) {
      setSelectedQuestion(null);
    }
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const saveQuestion = async (question: Question) => {
    // Se o ID for temporário, criar nova questão no backend
    if (question.id.startsWith("temp-")) {
      const options: QuestionOption[] | undefined =
        question.type === "multiple_choice" ||
        question.type === "checkbox" ||
        question.type === "dropdown"
          ? question.options?.map((label, i) => ({
              label,
              value: label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
            }))
          : question.type === "scale"
          ? question.options?.map((label) => ({
              label,
              value: label,
            }))
          : undefined;

      const created = await createQuestion({
        title: question.title,
        type: question.type,
        options,
        validation: { required: question.required },
      });

      // Atualizar a questão com o ID real do backend
      setQuestions(
        questions.map((q) =>
          q.id === question.id
            ? {
                ...q,
                id: created._id,
              }
            : q
        )
      );
      setSelectedQuestion(null);
    } else {
      // Se já tem ID real, atualizar questão existente
      const options: QuestionOption[] | undefined =
        question.type === "multiple_choice" ||
        question.type === "checkbox" ||
        question.type === "dropdown"
          ? question.options?.map((label, i) => ({
              label,
              value: label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
            }))
          : question.type === "scale"
          ? question.options?.map((label) => ({
              label,
              value: label,
            }))
          : undefined;

      await updateQuestionAPI(question.id, {
        title: question.title,
        type: question.type,
        options,
        validation: { required: question.required },
      });
      setSelectedQuestion(null);
    }
  };

  const saveForm = async () => {
    try {
      setIsSaving(true);

      if (!formTitle.trim()) {
        alert("O título do formulário é obrigatório");
        return;
      }

      if (questions.length === 0) {
        alert("Adicione pelo menos uma pergunta ao formulário");
        return;
      }

      const payload = {
        title: formTitle,
        description: formDescription || undefined,
        questions: questions.map((q, index) => ({
          questionId: q.id,
          order: index + 1,
          required: q.required,
        })),
        assignedUsers: [], // necessário para CreateFormPayload; preencher conforme lógica futura
        isActive: true,
      };

      let savedForm: Form;
      if (formId) {
        // Atualizar formulário existente
        savedForm = await updateForm(formId, payload);
        alert("Formulário atualizado com sucesso!");
      } else {
        // Criar novo formulário
        savedForm = await createForm(payload);
        setFormId(savedForm._id);
        alert("Formulário criado com sucesso!");
      }
    } catch (e: any) {
      alert(e?.message || "Erro ao salvar formulário");
    } finally {
      setIsSaving(false);
    }
  };

  const loadForm = async (id: string) => {
    try {
      console.log("Loading form with ID:", id);
      setIsLoading(true);
      const form = await getFormById(id);

      setFormId(form._id);
      setFormTitle(form.title);
      setFormDescription(form.description || "");

      // Carregar detalhes das questões usando os dados já populados na resposta
      if (form.questions && form.questions.length > 0) {
        const loadedQuestions: Question[] = form.questions
          .sort((a, b) => a.order - b.order)
          .map((fq: any) => {
            // O backend retorna questionId como objeto aninhado
            const questionData = fq.questionId;
            return {
              id: questionData._id,
              type: questionData.type,
              title: questionData.title,
              description: "", // ajuste se o backend passar descrição
              required: fq.required, // required vem do FormQuestion, não do questionId
              options: questionData.options?.map((o: any) => o.label),
            };
          });
        setQuestions(loadedQuestions);
        console.log("Questions loaded:", loadedQuestions);
      }
    } catch (e: any) {
      console.error("Error loading form:", e);
      alert(e?.message || "Erro ao carregar formulário");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedQuestionData = questions.find((q) => q.id === selectedQuestion);

  if (!canManage) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Você não tem permissão para criar ou editar formulários.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-6">
              <h1>{formId ? "Editar Formulário" : "Criar Formulário"}</h1>
              <p className="text-gray-500">
                {formId
                  ? "Edite as perguntas e configurações do formulário"
                  : "Crie e edite formulários personalizados"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={saveForm}
                disabled={isSaving || isLoading}
                className="bg-[#003087] hover:bg-[#002070] text-white rounded-2xl"
              >
                {isSaving
                  ? "Salvando..."
                  : formId
                  ? "Atualizar Formulário"
                  : "Salvar Formulário"}
              </Button>
            </div>
          </div>
        </div>

        {/* Form Canvas */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Form Header Card */}
            {/* <Card className="border-2">
              <CardHeader>
                <CardTitle>{formTitle || "Título do Formulário"}</CardTitle>
                {formDescription && (
                  <p className="text-gray-500">{formDescription}</p>
                )}
              </CardHeader>
            </Card> */}

            {/* Questions */}
            {questions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Adicione perguntas usando o painel lateral →</p>
              </div>
            ) : (
              questions.map((question, index) => (
                <DraggableQuestion
                  key={question.id}
                  question={question}
                  index={index}
                  isSelected={selectedQuestion === question.id}
                  onSelect={() => setSelectedQuestion(question.id)}
                  onMove={moveQuestion}
                  onDelete={deleteQuestion}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Question Types */}
        {!selectedQuestion ? (
          <div className="flex-1 overflow-auto p-4">
            {/* Informações do Formulário */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="mb-4">Informações do Formulário</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="form-title">Título</Label>
                  <Input
                    id="form-title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Título do formulário"
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-description">Descrição (opcional)</Label>
                  <Textarea
                    id="form-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Adicione uma descrição..."
                    className="border-2"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <h3 className="mb-4">Adicionar Pergunta</h3>

            {/* Botão para adicionar questão existente */}
            <Button
              onClick={loadExistingQuestions}
              disabled={isLoadingQuestions}
              variant="outline"
              className="w-full mb-4 border-2 border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white"
            >
              <ListChecks className="w-4 h-4 mr-2" />
              {isLoadingQuestions ? "Carregando..." : "Banco de Questões"}
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Ou criar nova
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {QUESTION_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.type}
                    onClick={() => addQuestion(type.type)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span>{type.label}</span>
                    <Plus className="w-4 h-4 ml-auto text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <QuestionSettings
            question={selectedQuestionData!}
            onUpdate={(updates) => updateQuestion(selectedQuestion, updates)}
            onClose={() => setSelectedQuestion(null)}
            onSave={saveQuestion}
          />
        )}
      </div>

      {/* Modal de Questões Existentes */}
      {showExistingQuestionsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowExistingQuestionsModal(false);
            setSearchQuery("");
            setFilterType("all");
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl overflow-auto flex flex-col h-full max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold">Banco de Questões</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Selecione uma questão existente para adicionar ao formulário
                </p>
              </div>
              <button
                onClick={() => {
                  setShowExistingQuestionsModal(false);
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters and Search */}
            <div className="p-4 border-b border-gray-200 space-y-3 flex-shrink-0">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar questões..."
              />

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    filterType === "all"
                      ? "bg-[#003087] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todas
                </button>
                {QUESTION_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.type}
                      onClick={() => setFilterType(type.type)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${
                        filterType === type.type
                          ? "bg-[#003087] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>
                    {searchQuery || filterType !== "all"
                      ? "Nenhuma questão encontrada com os filtros aplicados"
                      : "Nenhuma questão encontrada no banco de questões"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuestions.map((q) => {
                    const Icon =
                      QUESTION_TYPE_ICONS[q.type as UIQuestionType] || Type;
                    const isAlreadyAdded = questions.some(
                      (existingQ) => existingQ.id === q._id
                    );

                    return (
                      <Card
                        key={q._id}
                        className={`border cursor-pointer transition-all hover:shadow-md ${
                          isAlreadyAdded
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-blue-500"
                        }`}
                        onClick={() =>
                          !isAlreadyAdded && addExistingQuestion(q)
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">
                                    {q.title}
                                    {q.validation?.required && (
                                      <span className="text-red-500 ml-1">
                                        *
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {getQuestionTypeLabel(
                                      q.type as UIQuestionType
                                    )}
                                  </p>
                                  {q.options && q.options.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {q.options.slice(0, 3).map((opt, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-1 bg-gray-100 text-xs rounded"
                                        >
                                          {opt.label}
                                        </span>
                                      ))}
                                      {q.options.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                                          +{q.options.length - 3} mais
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {isAlreadyAdded && (
                                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                    Adicionada
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface DraggableQuestionProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: string) => void;
}

function DraggableQuestion({
  question,
  index,
  isSelected,
  onSelect,
  onMove,
  onDelete,
}: DraggableQuestionProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "QUESTION",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "QUESTION",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  const attachRef = (node: HTMLDivElement | null) => {
    preview(drop(node));
  };

  return (
    <div ref={attachRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card
        className={`border cursor-pointer transition-all ${
          isSelected
            ? "border-blue-600 shadow-lg"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              ref={drag as any}
              className="cursor-grab active:cursor-grabbing pt-1"
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-gray-800">
                    {question.title}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </p>
                  {question.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {question.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(question.id);
                  }}
                  className="p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <QuestionPreview question={question} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionPreview({ question }: { question: Question }) {
  switch (question.type) {
    case "text":
      return <Input disabled placeholder="Resposta" className="mt-2" />;
    case "multiple_choice":
    case "checkbox":
    case "dropdown":
      return (
        <div className="mt-2 space-y-2">
          {question.options?.map((option, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <div className="w-4 h-4 border-2 border-gray-300 rounded" />
              {option}
            </div>
          ))}
        </div>
      );
    case "scale":
      return (
        <div className="mt-2 flex gap-2">
          {Array.from({ length: 11 }, (_, i) => (
            <div
              key={i}
              className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-xs"
            >
              {i}
            </div>
          ))}
        </div>
      );
    case "date":
      return <Input disabled type="date" className="mt-2" />;
    default:
      return null;
  }
}

interface QuestionSettingsProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onClose: () => void;
  onSave: (question: Question) => Promise<void>;
}

function QuestionSettings({
  question,
  onUpdate,
  onClose,
  onSave,
}: QuestionSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!question.title.trim()) {
      alert("O título da pergunta é obrigatório");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(question);
      onClose();
    } catch (e: any) {
      alert(e?.message || "Erro ao salvar questão");
    } finally {
      setIsSaving(false);
    }
  };

  const hasOptions =
    question.type === "multiple_choice" ||
    question.type === "checkbox" ||
    question.type === "dropdown";

  const addOption = () => {
    const newOptions = [
      ...(question.options || []),
      `Opção ${(question.options?.length || 0) + 1}`,
    ];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const deleteOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <h3>Configurações</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="question-title">Título da Pergunta</Label>
          <Input
            id="question-title"
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="question-description">Descrição (opcional)</Label>
          <Textarea
            id="question-description"
            value={question.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Adicione uma descrição ou instrução..."
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="question-type">Tipo de Pergunta</Label>
          <Select
            value={question.type}
            onValueChange={(value: string) =>
              onUpdate({ type: value as UIQuestionType })
            }
          >
            <SelectTrigger className="border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((type) => (
                <SelectItem key={type.type} value={type.type}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasOptions && (
          <div className="space-y-2">
            <Label>Opções</Label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="border"
                  />
                  <button
                    onClick={() => deleteOption(index)}
                    className="p-2 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              onClick={addOption}
              variant="outline"
              className="w-full border border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Opção
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="required"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
          />
          <Label htmlFor="required" className="cursor-pointer">
            Pergunta obrigatória
          </Label>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-[#003087] hover:bg-[#002070] text-white"
        >
          {isSaving ? "Salvando..." : "Salvar Questão"}
        </Button>
      </div>
    </div>
  );
}
