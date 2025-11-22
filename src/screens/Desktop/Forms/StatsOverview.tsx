import React from "react";
import { FileText } from "lucide-react";

interface FormSummary {
  formsCount: number;
  totalStudents: number;
  totalResponses: number;
  activeFormTitle?: string;
}

export default function StatsOverview({
  formsCount,
  totalStudents,
  totalResponses,
  activeFormTitle,
}: FormSummary & {
  formsCount: number;
  totalStudents: number;
  totalResponses: number;
  activeFormTitle?: string;
}) {
  return (
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total de Formulários
          </p>
          <p className="text-gray-800 dark:text-gray-200">{formsCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total de Usuários
          </p>
          <p className="text-gray-800 dark:text-gray-200">{totalStudents}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total de Respostas
          </p>
          <p className="text-gray-800 dark:text-gray-200">{totalResponses}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Formulário Ativo
          </p>
          <p className="text-gray-800 dark:text-gray-200">
            {activeFormTitle || "Nenhum"}
          </p>
        </div>
      </div>
    </div>
  );
}
