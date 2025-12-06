import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import type { BackendQuestionType } from "../../../utils/questionTypes";

interface Props {
  q: { type: BackendQuestionType; [key: string]: any };
  canEdit: boolean;
  canDelete: boolean;
  isAnalyst: boolean;
  handleEdit: (q: any) => void;
  handleDelete: (id: string) => void;
  QUESTION_TYPE_ICONS: Record<BackendQuestionType, any>;
  getQuestionTypeLabel: (type: BackendQuestionType) => string;
}

export default function QuestionRow({
  q,
  canEdit,
  canDelete,
  isAnalyst,
  handleEdit,
  handleDelete,
  QUESTION_TYPE_ICONS,
  getQuestionTypeLabel,
}: Props) {
  const Icon = QUESTION_TYPE_ICONS[q.type];

  return (
    <tr key={q._id} className="border-b border-gray-200 hover:bg-gray-50">
      <th scope="row" className="px-6 py-4 text-left align-top">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 bg-linear-to-br bg-[#003087] rounded-xl flex items-center justify-center shrink-0"
            aria-hidden
          >
            {Icon && <Icon className="w-5 h-5 text-white" aria-hidden />}
          </div>
          {Icon && (
            <span className="sr-only">{getQuestionTypeLabel(q.type)}</span>
          )}
          <div className="flex-1">
            <p className="text-gray-800 font-medium">{q.title}</p>
            {q.description && (
              <p className="text-sm text-gray-600 mt-1">{q.description}</p>
            )}
            {q.options && q.options.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {q.options.length} {q.options.length === 1 ? "opção" : "opções"}
              </p>
            )}
          </div>
        </div>
      </th>
      <td className="px-6 py-4">
        <Badge
          variant="secondary"
          className="bg-gray-100 text-gray-700 hover:bg-gray-100"
        >
          {getQuestionTypeLabel(q.type)}
        </Badge>
      </td>
      <td className="px-6 py-4 text-center">
        {q.required ? (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Sim
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-500">
            Não
          </Badge>
        )}
      </td>
      <td className="px-6 py-4">
        <div>
          <p className="text-sm text-gray-800 font-medium">
            {q.createdBy.name}
          </p>
          <p className="text-xs text-gray-500">{q.createdBy.email}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {q.createdAt
          ? new Date(q.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--"}
      </td>
      <td className="px-6 py-4">
        {!isAnalyst ? (
          <div className="flex gap-2">
            <Button
              onClick={() => handleEdit(q)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Edit className="w-4 h-4" aria-hidden />
              Editar
            </Button>
            <Button
              onClick={() => handleDelete(q._id)}
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
            >
              <Trash2 className="w-4 h-4" aria-hidden />
              Excluir
            </Button>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Somente visualização</span>
        )}
      </td>
    </tr>
  );
}
