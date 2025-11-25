import React from "react";
import { Plus, ListChecks } from "lucide-react";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Button } from "../../../../components/ui/button";

interface Props {
  selectedQuestion: string | null;
  formTitle: string;
  formDescription?: string;
  isLoadingQuestions: boolean;
  loadExistingQuestions: () => void;
  setFormTitle: (v: string) => void;
  setFormDescription: (v: string) => void;
  addQuestion: (type: string) => void;
  QUESTION_TYPES: { type: string; icon: any; label: string }[];
  children?: React.ReactNode;
}

export function SidebarPanel({
  selectedQuestion,
  formTitle,
  formDescription,
  isLoadingQuestions,
  loadExistingQuestions,
  setFormTitle,
  setFormDescription,
  addQuestion,
  QUESTION_TYPES,
  children,
}: Props) {
  if (selectedQuestion) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="flex-1 overflow-auto p-4">
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
            <span className="bg-white px-2 text-gray-500">Ou criar nova</span>
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
    </div>
  );
}

export default SidebarPanel;
