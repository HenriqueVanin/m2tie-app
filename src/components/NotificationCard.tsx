import { BookOpen, Plus } from "lucide-react";
import type { Screen } from "../App";

type DiaryNotification = {
  type: "diary";
  entry: { date: string; text: string } | null;
  onNavigate: (screen: Screen) => void;
};

type FormNotification = {
  type: "form";
  form: {
    title: string;
    institution: string;
    date: string;
    status?: string;
    color?: string;
  };
  onNavigate: (screen: Screen) => void;
};

type NotificationCardProps = DiaryNotification | FormNotification;

export function NotificationCard(props: NotificationCardProps) {
  if (props.type === "diary") {
    const { entry, onNavigate } = props;
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 mb-4 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
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
        ) : (
          <button
            onClick={() => onNavigate("diary")}
            className="mt-4 w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Começar a escrever
          </button>
        )}
      </div>
    );
  }
  if (props.type === "form") {
    const { form, onNavigate } = props;
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${
              form.color ?? "from-emerald-500 to-emerald-600"
            } mb-4 rounded-xl flex items-center justify-center flex-shrink-0`}
          >
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-semibold mb-1">
              Novo Formulário Disponível
            </h3>
            <p className="text-xs text-gray-500">
              {form.date} • {form.institution}
            </p>
          </div>
        </div>
        <div className="bg-white/50 rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-wrap">
            {form.title}
          </p>
        </div>
        <button
          onClick={() => onNavigate("form")}
          className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
        >
          Responder formulário →
        </button>
      </div>
    );
  }
  return null;
}
