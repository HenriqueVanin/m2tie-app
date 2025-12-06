import React from "react";
import { Plus } from "lucide-react";
import type { Screen } from "../../../App";

type FormCardProps = {
  form: {
    title: string;
    institution: string;
    date: string;
    status?: string;
    color?: string;
  };
  onNavigate: (screen: Screen) => void;
};

export function FormCard({ form, onNavigate }: FormCardProps) {
  return (
    <div className="bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-10 h-10 bg-linear-to-br ${
            form.color ?? "from-emerald-500 to-emerald-600"
          } mb-4 rounded-xl flex items-center justify-center shrink-0`}
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
