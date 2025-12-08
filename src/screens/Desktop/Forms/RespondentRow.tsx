import React from "react";
import { Badge } from "../../../components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { getRoleLabel, getRoleColor } from "../../../utils/roleLabels";

interface Props {
  formId: string;
  user: any;
  isAnalyst: boolean;
  selected: boolean;
  onToggleSelect: (formId: string, userId: string) => void;
  formatDate: (s?: string) => string;
}

export default function RespondentRow({
  formId,
  user,
  isAnalyst,
  selected,
  onToggleSelect,
  formatDate,
}: Props) {
  return (
    <tr className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      {!isAnalyst && (
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(formId, user._id || "")}
            disabled={!user._id}
            title={!user._id ? "Usuário sem ID válido" : undefined}
            className="w-4 h-4 rounded border-gray-300"
          />
        </td>
      )}
      <td className="px-6 py-4">
        <p className="text-gray-800 dark:text-gray-200 font-medium">
          {user.name}
        </p>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
      </td>
      <td className="px-6 py-4">
        <Badge className={getRoleColor(user.role)}>
          {getRoleLabel(user.role)}
        </Badge>
      </td>
      <td className="px-6 py-4">
        {user.responded ? (
          <div className="flex flex-col gap-1">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle className="w-3 h-3 mr-1" />
              Respondido
            </Badge>
            {user.submittedAt && (
              <span className="text-xs text-gray-500">
                {formatDate(user.submittedAt)}
              </span>
            )}
          </div>
        ) : (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        )}
      </td>
      {!isAnalyst && <td className="px-6 py-4"></td>}
    </tr>
  );
}
