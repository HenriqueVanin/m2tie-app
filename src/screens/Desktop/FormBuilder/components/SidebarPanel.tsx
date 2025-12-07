import React from "react";
import { Plus, ListChecks } from "lucide-react";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Button } from "../../../../components/ui/button";

interface Props {
  selectedQuestion: string | null;
  question?: any;
  onQuestionChange?: (patch: Partial<any>) => void;
  onSaveQuestion?: () => void;
  onCloseEditor?: () => void;
  onDeleteQuestion?: () => void;
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
  question,
  onQuestionChange,
  onSaveQuestion,
  onCloseEditor,
  onDeleteQuestion,
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
  if (selectedQuestion && question) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="mb-2">Editar Questão</h3>
          <p className="text-xs text-gray-500">ID: {selectedQuestion}</p>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <Label htmlFor="title">Título da Questão</Label>
            <Input
              id="title"
              placeholder="Digite o título da questão"
              autoComplete="off"
              value={question.title || ""}
              onChange={(e) =>
                onQuestionChange && onQuestionChange({ title: e.target.value })
              }
              className="h-12 rounded-2xl"
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Adicione instruções ou detalhes sobre a questão"
              value={question.description || ""}
              onChange={(e) =>
                onQuestionChange &&
                onQuestionChange({ description: e.target.value })
              }
              className="rounded-2xl"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="type">Tipo de Questão</Label>
            <select
              id="type"
              className="h-12 rounded-2xl border border-gray-200 w-full px-3"
              value={question.type}
              onChange={(e) =>
                onQuestionChange && onQuestionChange({ type: e.target.value })
              }
            >
              <option value="text">Texto</option>
              <option value="multiple_choice">Múltipla Escolha</option>
              <option value="checkbox">Caixas de Seleção</option>
              <option value="dropdown">Lista Suspensa</option>
              <option value="scale">Escala Linear</option>
              <option value="date">Data</option>
            </select>
          </div>
          {(question.type === "multiple_choice" ||
            question.type === "checkbox" ||
            question.type === "dropdown") && (
            <div>
              <Label htmlFor="options">Opções (uma por linha)</Label>
              <Textarea
                id="options"
                placeholder="Digite cada opção em uma nova linha"
                value={(question.options || []).join("\n")}
                onChange={(e) =>
                  onQuestionChange &&
                  onQuestionChange({
                    options: e.target.value.split(/\r?\n/).filter(Boolean),
                  })
                }
                className="min-h-32 rounded-2xl"
              />
            </div>
          )}
          {question.type === "text" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minLength">Mín. Caracteres</Label>
                <Input
                  id="minLength"
                  type="number"
                  min={0}
                  value={question.minLength ?? ""}
                  autoComplete="off"
                  onChange={(e) =>
                    onQuestionChange &&
                    onQuestionChange({
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
                  value={question.maxLength ?? ""}
                  autoComplete="off"
                  onChange={(e) =>
                    onQuestionChange &&
                    onQuestionChange({
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
          {question.type === "scale" && (
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="scaleMin">Valor Inicial</Label>
                <Input
                  id="scaleMin"
                  type="number"
                  value={question.scaleMin ?? 0}
                  autoComplete="off"
                  onChange={(e) =>
                    onQuestionChange &&
                    onQuestionChange({ scaleMin: parseInt(e.target.value, 10) })
                  }
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="scaleMax">Valor Final</Label>
                <Input
                  id="scaleMax"
                  type="number"
                  value={question.scaleMax ?? 10}
                  autoComplete="off"
                  onChange={(e) =>
                    onQuestionChange &&
                    onQuestionChange({ scaleMax: parseInt(e.target.value, 10) })
                  }
                  className="h-12 rounded-2xl"
                />
              </div>
              <div className="text-sm text-gray-600">
                {question.scaleMin < question.scaleMax
                  ? `${
                      (question.scaleMax ?? 0) - (question.scaleMin ?? 0) + 1
                    } pontos`
                  : "Intervalo inválido"}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={!!question.required}
              onChange={(e) =>
                onQuestionChange &&
                onQuestionChange({ required: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded"
            />
            <Label htmlFor="required" className="cursor-pointer">
              Questão obrigatória
            </Label>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex gap-2">
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={onCloseEditor}
          >
            Fechar
          </Button>
          <Button
            variant="destructive"
            className="rounded-2xl"
            onClick={onDeleteQuestion}
          >
            Excluir
          </Button>
          <Button
            onClick={onSaveQuestion}
            disabled={
              question.type === "scale" &&
              (question.scaleMin ?? 0) >= (question.scaleMax ?? 0)
            }
            className="ml-auto bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl"
          >
            Salvar alterações
          </Button>
        </div>
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
