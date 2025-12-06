import React from "react";
import { Button } from "../../../../components/ui/button";

interface Props {
  formId?: string | null;
  isSaving: boolean;
  isLoading: boolean;
  onSave: () => void;
}

export function FormBuilderHeader({
  formId,
  isSaving,
  isLoading,
  onSave,
}: Props) {
  return (
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
            onClick={onSave}
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
  );
}

export default FormBuilderHeader;
