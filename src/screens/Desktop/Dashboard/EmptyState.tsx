import React from "react";
import { BarChart3 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Selecione um formulário para visualizar os dados</p>
      </div>
    </div>
  );
}

export default EmptyState;
