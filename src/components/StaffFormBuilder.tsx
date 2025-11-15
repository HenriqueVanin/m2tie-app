import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ErrorState } from "./ui/error-state";
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
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
          <div className="flex items-center justify-between mb-6">
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

          <div className="space-y-4">
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Título do formulário"
              className="text-2xl border-0 p-0 focus-visible:ring-0"
            />
            <Input
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Adicione uma descrição..."
              className="border-0 p-0 text-gray-500 focus-visible:ring-0"
            />
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
            <h3 className="mb-4">Adicionar Pergunta</h3>
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
