import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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

type QuestionType =
  | "text"
  | "textarea"
  | "multiple-choice"
  | "checkboxes"
  | "radio"
  | "toggle"
  | "date";

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
}

const QUESTION_TYPES = [
  { type: "text" as QuestionType, icon: Type, label: "Texto Curto" },
  { type: "textarea" as QuestionType, icon: FileText, label: "Texto Longo" },
  {
    type: "multiple-choice" as QuestionType,
    icon: ListChecks,
    label: "Múltipla Escolha",
  },
  {
    type: "checkboxes" as QuestionType,
    icon: ListChecks,
    label: "Caixas de Seleção",
  },
  { type: "radio" as QuestionType, icon: Circle, label: "Escolha Única" },
  { type: "toggle" as QuestionType, icon: ToggleLeft, label: "Sim/Não" },
  { type: "date" as QuestionType, icon: Calendar, label: "Data" },
];

export function StaffFormBuilder() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FormBuilderContent />
    </DndProvider>
  );
}

function FormBuilderContent() {
  const [formTitle, setFormTitle] = useState("Novo Formulário");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type,
      title: "Nova Pergunta",
      required: false,
      options:
        type === "multiple-choice" || type === "checkboxes" || type === "radio"
          ? ["Opção 1", "Opção 2"]
          : undefined,
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

  const selectedQuestionData = questions.find((q) => q.id === selectedQuestion);

  return (
    <div className="flex h-screen">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 bg-white border-b border-gray-200">
          <div>
            <h1>Editor de Formulários</h1>
            <p className="text-gray-500">Crie e gerencie seus formulários</p>
          </div>
        </div>
        <div className="flex-1 flex flex-row">
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex w-full gap-4">
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="text-2xl border-0 p-0 mb-2 focus-visible:ring-0"
                />
                <Input
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Adicione uma descrição..."
                  className="border-0 p-0 text-gray-500 focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Form Header Card */}
              <Card className="border-2 ">
                <CardHeader>
                  <CardTitle>{formTitle || "Título do Formulário"}</CardTitle>
                  {formDescription && (
                    <p className="text-gray-500">{formDescription}</p>
                  )}
                </CardHeader>
              </Card>

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
          {/* Right Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* Question Types */}
            {!selectedQuestion ? (
              <div className="flex-1 overflow-auto p-4">
                <div className="flex gap-3 w-full mb-4 justify-end">
                  <Button variant="outline" className="border">
                    Visualizar
                  </Button>
                  <Button className="bg-gray-800  hover:bg-blue-700">
                    Salvar Formulário
                  </Button>
                </div>
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
                onUpdate={(updates) =>
                  updateQuestion(selectedQuestion, updates)
                }
                onClose={() => setSelectedQuestion(null)}
              />
            )}
          </div>{" "}
        </div>
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

  return (
    <div
      ref={(node) => {
        preview(drop(node));
      }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
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
              ref={(node) => {
                if (node) drag(node);
              }}
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
      return <Input disabled placeholder="Resposta curta" className="mt-2" />;
    case "textarea":
      return (
        <Textarea disabled placeholder="Resposta longa" className="mt-2" />
      );
    case "multiple-choice":
    case "checkboxes":
    case "radio":
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
    case "toggle":
      return (
        <div className="mt-2 flex items-center gap-2">
          <div className="w-10 h-6 bg-gray-200 rounded-full" />
          <span className="text-sm text-gray-600">Sim / Não</span>
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
}

function QuestionSettings({
  question,
  onUpdate,
  onClose,
}: QuestionSettingsProps) {
  const hasOptions =
    question.type === "multiple-choice" ||
    question.type === "checkboxes" ||
    question.type === "radio";

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
          <p className="text-sm">Configurações da Opção</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-3 h-3" />
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
            onValueChange={(value: QuestionType) =>
              onUpdate({ type: value as QuestionType })
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

        <Button className="w-full" onClick={onClose}>
          Salvar Pergunta
        </Button>
      </div>
    </div>
  );
}
