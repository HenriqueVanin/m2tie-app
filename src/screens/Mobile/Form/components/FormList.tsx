import React from "react";
import { FileText, Calendar, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface FormSummary {
  _id: string;
  title: string;
  description?: string;
  questions?: any[];
  createdAt?: string;
}

interface Props {
  forms: FormSummary[];
  onSelect: (index: number) => void;
}

export default function FormList({ forms, onSelect }: Props) {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4">
      {forms
        .sort(
          (a, b) =>
            new Date(a?.createdAt ?? "").getTime() -
            new Date(b?.createdAt ?? "").getTime()
        )
        .map((formItem, index) => (
          <button
            key={formItem._id}
            type="button"
            onClick={() => onSelect(index)}
            className="w-full text-left bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-indigo-300"
            aria-label={`Selecionar formulário ${formItem.title}`}
          >
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center"
                aria-hidden
              >
                <FileText className="w-6 h-6 text-white" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {formItem.title}
                </h3>
                {formItem.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {formItem.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" aria-hidden />
                    {formItem.questions?.length || 0} questões
                  </span>
                  {formItem.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" aria-hidden />
                      {new Date(formItem.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" aria-hidden />
            </div>
          </button>
        ))}
    </div>
  );
}
