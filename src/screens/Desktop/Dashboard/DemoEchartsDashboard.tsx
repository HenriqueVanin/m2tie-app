import React from "react";
import ChartsGrid from "./ChartsGrid";
import { useEchartsExport } from "./useEchartsExport";

const questionsAnalysis = [
  {
    questionId: "q1",
    title: "Escala de Satisfação",
    type: "scale",
    distribution: { "1": 2, "2": 5, "3": 8, "4": 4, "5": 10 },
    totalAnswers: 29,
    average: 3.7,
  },
  {
    questionId: "q2",
    title: "Preferências de Produto",
    type: "multiple_choice",
    distribution: { "Produto A": 10, "Produto B": 15, "Produto C": 4 },
    totalAnswers: 29,
  },
  {
    questionId: "q3",
    title: "Opções Selecionadas",
    type: "checkbox",
    distribution: { "Opção 1": 12, "Opção 2": 7, "Opção 3": 10 },
    totalAnswers: 29,
  },
];

export default function DemoEchartsDashboard() {
  const { registerChart, exportAll, exportCombined } = useEchartsExport();

  return (
    <div className="space-y-4">
      <ChartsGrid
        questionsAnalysis={questionsAnalysis}
        registerChart={registerChart}
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={exportAll}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Exportar cada gráfico
        </button>
        <button
          onClick={exportCombined}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Exportar tudo combinado
        </button>
      </div>
    </div>
  );
}
