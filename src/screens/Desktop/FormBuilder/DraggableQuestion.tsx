import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { GripVertical, Trash2 } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import QuestionPreview from "./QuestionPreview";

interface Question {
  id: string;
  type: string;
  title: string;
  description?: string;
  required: boolean;
  options?: any[];
}

interface DraggableQuestionProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: string) => void;
}

export function DraggableQuestion({
  question,
  index,
  isSelected,
  onSelect,
  onMove,
  onDelete,
}: DraggableQuestionProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "QUESTION",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "QUESTION",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  const attachRef = (node: HTMLDivElement | null) => {
    preview(drop(node));
  };

  return (
    <div ref={attachRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card
        className={`border cursor-pointer transition-all ${
          isSelected
            ? "border-blue-600 shadow-lg"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              ref={drag as any}
              className="cursor-grab active:cursor-grabbing pt-1"
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-gray-800">
                    {question.title}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </p>
                  {question.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {question.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(question.id);
                  }}
                  className="p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <QuestionPreview question={question} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DraggableQuestion;
