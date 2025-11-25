import React from "react";
import { Loader2, Check, ChevronRight } from "lucide-react";
import DraftStatus from "./DraftStatus";
import { Button } from "../../../../components/ui/button";

interface Props {
  onNext: () => void;
  onBack: () => void;
  submitting: boolean;
  isReviewStep: boolean;
  currentStep: number;
  totalSteps: number;
  draftStatus?: "idle" | "saving" | "saved" | "error";
  draftSavedAt?: string | null;
  onBackToList?: () => void;
}

export default function FormActions({
  onNext,
  onBack,
  submitting,
  isReviewStep,
  currentStep,
  totalSteps,
  draftStatus,
  draftSavedAt,
  onBackToList,
}: Props) {
  return (
    <div className="p-6 space-y-3 pb-30">
      <DraftStatus draftStatus={draftStatus} draftSavedAt={draftSavedAt} />
      <Button
        onClick={onNext}
        disabled={submitting}
        className="w-full h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white gap-2 shadow-lg rounded-2xl disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : isReviewStep ? (
          <>
            <Check className="w-5 h-5" />
            Enviar Formulário
          </>
        ) : currentStep === totalSteps - 2 ? (
          <>
            <Check className="w-5 h-5" />
            Revisar Respostas
          </>
        ) : (
          <>
            Próximo
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </Button>

      {currentStep > 0 && (
        <Button
          onClick={onBack}
          disabled={submitting}
          variant="outline"
          className="w-full h-12 border-2 border-gray-200 rounded-2xl"
        >
          Voltar
        </Button>
      )}
    </div>
  );
}
