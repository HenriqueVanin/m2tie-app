import { Input } from "../../../components/ui/input";

interface Question {
  id: string;
  type: string;
  title: string;
  description?: string;
  required: boolean;
  options?: any[];
}

function QuestionPreview({ question }: { question: Question }) {
  switch (question.type) {
    case "text":
      return <Input disabled placeholder="Resposta" className="mt-2" />;
    case "multiple_choice":
    case "checkbox":
    case "dropdown":
      return (
        <div className="mt-2 space-y-2">
          {question.options?.map((option, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <div className="w-4 h-4 border-2 border-gray-300 rounded" />
              {option}
            </div>
          ))}
        </div>
      );
    case "scale":
      return (
        <div className="mt-2 flex gap-2">
          {Array.from({ length: 11 }, (_, i) => (
            <div
              key={i}
              className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-xs"
            >
              {i}
            </div>
          ))}
        </div>
      );
    case "date":
      return <Input disabled type="date" className="mt-2" />;
    default:
      return null;
  }
}

export default QuestionPreview;
