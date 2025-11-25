import React from "react";
import { ChevronRight, Check } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface Props {
  form: any;
  answers: Record<string, any>;
  onEditQuestion: (index: number) => void;
}

export default function ReviewStep({ form, answers, onEditQuestion }: Props) {
  const formatAnswer = (question: any, answer: any): string => {
    if (!answer) return "Não respondida";
    const questionDetails =
      typeof question.questionId === "string" ? null : question.questionId;
    if (Array.isArray(answer)) {
      if (answer.length === 0) return "Não respondida";
      return answer.join(", ");
    }
    if (
      questionDetails &&
      questionDetails.options &&
      questionDetails.options.length > 0
    ) {
      const option = questionDetails.options.find(
        (opt: any) => opt.value === answer || opt.label === answer
      );
      return option ? option.label : String(answer);
    }
    return String(answer);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Revisão das Respostas
        </h2>
        <p className="text-gray-600">
          Confira suas respostas antes de enviar o formulário
        </p>
      </div>

      <div className="space-y-4">
        {form.questions.map((question: any, index: number) => {
          const questionId =
            typeof question.questionId === "string"
              ? question.questionId
              : question.questionId._id;
          const answer = answers[questionId];
          const questionDetails =
            typeof question.questionId === "string"
              ? null
              : question.questionId;

          return (
            <div
              key={questionId}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group"
              onClick={() => onEditQuestion(index)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {questionDetails ? questionDetails.title : "Pergunta"}
                    {question.required && (
                      <span className="text-red-600 ml-1">*</span>
                    )}
                  </h3>
                  <div className="text-sm">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                      {formatAnswer(question, answer)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-gray-400 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <p className="text-sm text-indigo-900 text-center">
          ✓ Ao clicar em "Enviar Formulário", suas respostas serão submetidas
        </p>
      </div>
    </div>
  );
}
