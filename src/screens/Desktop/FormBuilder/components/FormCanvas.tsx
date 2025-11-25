import React from "react";
import { FileText } from "lucide-react";
import DraggableQuestion from "../DraggableQuestion";

interface Question {
  id: string;
  type: string;
  title: string;
  description?: string;
  required: boolean;
  options?: any[];
}

interface Props {
  questions: Question[];
  selectedQuestion: string | null;
  setSelectedQuestion: (id: string | null) => void;
  moveQuestion: (from: number, to: number) => void;
  deleteQuestion: (id: string) => void;
}

export function FormCanvas({
  questions,
  selectedQuestion,
  setSelectedQuestion,
  moveQuestion,
  deleteQuestion,
}: Props) {
  return (
    <div className="flex-1 overflow-auto p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Adicione perguntas usando o painel lateral →</p>
          </div>
        ) : (
          questions.map((question, index) => (
            <DraggableQuestion
              key={question.id}
              question={question}
              index={index}
              isSelected={selectedQuestion === question.id}
              onSelect={() => setSelectedQuestion(question.id)}
              onMove={moveQuestion}
              onDelete={deleteQuestion}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default FormCanvas;
