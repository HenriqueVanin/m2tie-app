import { useState } from "react";
import { Settings, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { QUESTION_TYPES } from "../../../utils/questionTypes";
import type { UIQuestionType } from "../../../utils/questionTypes";

interface Question {
  id: string;
  type: UIQuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
}

interface QuestionSettingsProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onClose: () => void;
  onSave: (question: Question) => Promise<void>;
}

export function QuestionSettings({
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

export default QuestionSettings;
