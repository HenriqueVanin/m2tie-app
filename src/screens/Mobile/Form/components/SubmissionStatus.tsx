import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface Props {
  submissionSuccess: boolean;
  remainingForms: any[];
  form?: any;
  onMoreForms?: () => void;
  onBackHome?: () => void;
}

export default function SubmissionStatus({
  submissionSuccess,
  remainingForms,
  form,
  onMoreForms,
  onBackHome,
}: Props) {
  const hasMoreForms = remainingForms.length > 0;

  if (!submissionSuccess) return null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 space-y-6">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl animate-in zoom-in duration-500">
        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
      </div>

      <div
        role="status"
        aria-live="polite"
        className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        <h1 className="text-white text-2xl font-bold">Formulário Enviado!</h1>
        <p className="text-white text-sm">
          Suas respostas foram registradas com sucesso.
        </p>
      </div>

      {form && (
        <div className="w-full max-w-sm p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="pt-2 border-t border-white/20 text-center">
            <p className="text-white text-sm mb-1 mt-2">Data de envio</p>
            <p className="text-white font-semibold text-base">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      )}

      {hasMoreForms ? (
        <>
          <p className="text-white text-center">
            Você ainda tem {remainingForms.length} formulário
            {remainingForms.length > 1 ? "s" : ""} para responder
          </p>
          <Button
            type="button"
            onClick={onMoreForms}
            className="w-full max-w-sm h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold rounded-2xl shadow-lg"
          >
            {remainingForms.length === 1
              ? "Responder Próximo"
              : "Ver Formulários Restantes"}
          </Button>
        </>
      ) : (
        <Button
          type="button"
          onClick={onBackHome}
          className="w-full max-w-sm h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold rounded-2xl shadow-lg"
        >
          Voltar para Home
        </Button>
      )}
    </div>
  );
}
