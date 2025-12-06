import React, { forwardRef } from "react";
import { Card } from "../../../components/ui/card";
import type { FullAnalysisResponse } from "../../../services/dashboardService";

interface QuestionChartProps {
  question: FullAnalysisResponse["questionsAnalysis"][0];
}

const QuestionChart = forwardRef<HTMLDivElement, QuestionChartProps>(
  ({ question }, ref) => {
    if (question.type === "text") {
      return (
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {question.title}
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total de respostas:{" "}
              <span className="font-semibold">{question.totalAnswers}</span>
            </p>
            {question.sampleAnswers && question.sampleAnswers.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Exemplos de respostas:
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {question.sampleAnswers.map((answer: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                    >
                      {answer}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      );
    }

    if (question.type === "date") {
      return (
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {question.title}
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total de respostas:{" "}
              <span className="font-semibold">{question.totalAnswers}</span>
            </p>
            {question.range && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                    Data mais antiga
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {new Date(question.range.earliest).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                    Data mais recente
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {new Date(question.range.latest).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="mb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total de respostas: {question.totalAnswers}
          </p>
          {question.type === "scale" && question.average && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Média:{" "}
              <span className="font-semibold text-emerald-600">
                {question.average}
              </span>
            </p>
          )}
        </div>
        <div ref={ref as any} style={{ height: "350px", width: "100%" }} />
      </Card>
    );
  }
);

export default QuestionChart;
