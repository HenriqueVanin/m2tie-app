import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import type { Screen } from "../../../App";
import { IconBlock } from "./IconBlock";

type DiaryCardProps = {
  entry: { date: string; text: string } | null;
  onNavigate: (screen: Screen) => void;
  diaryFormId?: string;
};

import { canRespondToDiary } from "../../../services/responseService";

export function DiaryCard({ entry, onNavigate, diaryFormId }: DiaryCardProps) {
  const [canRespond, setCanRespond] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    async function check() {
      if (!diaryFormId) return setCanRespond(null);
      try {
        const res = await canRespondToDiary(diaryFormId);
        if (!mounted) return;
        // backend returns { error: null, msg, canRespond: boolean } inside data
        const val = res?.data?.canRespond;
        setCanRespond(typeof val === "boolean" ? val : null);
      } catch (e) {
        if (!mounted) return;
        setCanRespond(null);
      }
    }
    check();
    return () => {
      mounted = false;
    };
  }, [diaryFormId]);

  return (
    <div className="bg-linear-to-br from-emerald-50 to-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <IconBlock>
          <BookOpen className="w-5 h-5 text-white" />
        </IconBlock>
        <div className="flex-1">
          <h3 className="text-gray-900 font-semibold mb-1">
            Última Anotação do Diário
          </h3>
          {entry ? (
            <p className="text-xs text-gray-500">
              {new Date(entry.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : (
            <p className="text-xs text-gray-500">Nenhuma anotação ainda</p>
          )}
        </div>
      </div>
      <div className="bg-white/50 rounded-xl p-4 border border-emerald-100">
        {entry ? (
          <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-wrap">
            {entry.text}
          </p>
        ) : canRespond === true ? (
          <p className="text-sm text-gray-400 italic">
            Não há nada escrito ainda — você pode começar uma nova anotação.
          </p>
        ) : canRespond === false ? (
          <p className="text-sm text-gray-400 italic">
            Você já começou a escrever — continue editando sua anotação.
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Comece a escrever suas anotações diárias para acompanhar seu
            progresso e reflexões.
          </p>
        )}
      </div>
      {entry ? (
        <button
          onClick={() => onNavigate("diary")}
          className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
        >
          Ver diário completo →
        </button>
      ) : canRespond === false ? (
        <button
          onClick={() => onNavigate("diary")}
          className="mt-4 w-full h-12 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          Continuar editando
        </button>
      ) : (
        <button
          onClick={() => onNavigate("diary")}
          className="mt-4 w-full h-12 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          <span className="sr-only">Começar a escrever</span>
          <span aria-hidden>
            <span className="w-5 h-5 inline-block" />
          </span>
          Começar a escrever
        </button>
      )}
    </div>
  );
}
