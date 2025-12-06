import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface Props {
  title: string;
  subtitle?: string;
  onBack: () => void;
  isReview?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export default function FormHeader({
  title,
  subtitle,
  onBack,
  isReview,
  currentStep,
  totalSteps,
}: Props) {
  return (
    <div className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg rounded-md mt-2 mx-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-white" aria-hidden />
        </button>
        <div className="flex-1">
          <h1 className="text-white">{title}</h1>
          {subtitle || (
            <p className="text-sm text-indigo-100">
              {isReview
                ? "Revisão Final"
                : `Questão ${currentStep} de ${totalSteps}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
