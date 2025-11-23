import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ErrorState } from "../../../components/ui/error-state";
import { toast } from "sonner";
import { getUserCookie } from "../../../utils/userCookie";
import { hasPermission, type UserRole } from "../../../utils/permissions";
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
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { SearchBar } from "../../../components/ui/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  UIQuestionType,
  QUESTION_TYPE_ICONS,
  getQuestionTypeLabel,
} from "../../../utils/questionTypes";
import useStaffFormBuilder from "./useStaffFormBuilder";

interface Question {
  id: string;
  type: UIQuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: any[];
  minLength?: number;
  maxLength?: number;
  scaleMin?: number;
  scaleMax?: number;
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
  const navigate = useNavigate();
  const hook = useStaffFormBuilder((path: string) => navigate(path));
  const {
    formId,
    formTitle,
    formDescription,
    questions,
    selectedQuestion,
    isLoading,
    isSaving,
    showExistingQuestionsModal,
    setShowExistingQuestionsModal,
    isLoadingQuestions,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    setFormTitle,
    setFormDescription,
    setSelectedQuestion,
    loadExistingQuestions,
    addExistingQuestion,
    filteredQuestions,
    addQuestion,
    moveQuestion,
    deleteQuestion,
    updateQuestion,
    saveQuestion,
    saveForm,
    selectedQuestionData,
    canManage,
  } = hook;

  // logic moved to hook

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
            <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
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
            <div className="p-4 border-b border-gray-200 space-y-3 shrink-0">
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
      toast.error("O título da pergunta é obrigatório");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(question);
      onClose();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao salvar questão");
    } finally {
      setIsSaving(false);
    }
  };

  const hasOptions =
    question.type === "multiple_choice" ||
    question.type === "checkbox" ||
    question.type === "dropdown";

  const isText = question.type === "text";
  const isScale = question.type === "scale";

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

        {isText && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="question-minLength">Mín. Caracteres</Label>
              <Input
                id="question-minLength"
                type="number"
                min={0}
                value={question.minLength ?? ""}
                onChange={(e) =>
                  onUpdate({
                    minLength: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="question-maxLength">Máx. Caracteres</Label>
              <Input
                id="question-maxLength"
                type="number"
                min={0}
                value={question.maxLength ?? ""}
                onChange={(e) =>
                  onUpdate({
                    maxLength: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
                className="h-12"
              />
            </div>
          </div>
        )}

        {isScale && (
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="question-scaleMin">Valor Inicial</Label>
              <Input
                id="question-scaleMin"
                type="number"
                min={0}
                value={question.scaleMin ?? 0}
                onChange={(e) =>
                  onUpdate({ scaleMin: parseInt(e.target.value, 10) })
                }
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="question-scaleMax">Valor Final</Label>
              <Input
                id="question-scaleMax"
                type="number"
                value={question.scaleMax ?? 10}
                min={0}
                onChange={(e) =>
                  onUpdate({ scaleMax: parseInt(e.target.value, 10) })
                }
                className="h-12"
              />
            </div>
            <div className="text-sm text-gray-600">
              {typeof question.scaleMin === "number" &&
              typeof question.scaleMax === "number"
                ? question.scaleMin < question.scaleMax
                  ? `${question.scaleMax - question.scaleMin + 1} pontos`
                  : "Intervalo inválido"
                : "Defina início e fim"}
            </div>
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
