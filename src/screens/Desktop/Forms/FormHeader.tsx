import React from "react";
import {
  FileText,
  Users,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

interface Props {
  form: any;
  isExpanded: boolean;
  percentage: number;
  respondedUsers: number;
  totalUsers: number;
  isAnalyst: boolean;
  onView: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onEdit: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onToggle: () => void;
}

export default function FormHeader({
  form,
  isExpanded,
  percentage,
  respondedUsers,
  totalUsers,
  isAnalyst,
  onView,
  onEdit,
  onDelete,
  onToggle,
}: Props) {
  return (
    <>
      <div
        className={`w-full p-6 flex items-center gap-4 transition-colors ${
          form.isActive ? "hover:bg-gray-50 cursor-pointer" : "cursor-default"
        }`}
      >
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-lg shrink-0 ${
            form.isActive ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <FileText
            className={`w-6 h-6 ${
              form.isActive ? "text-green-600" : "text-gray-600"
            }`}
          />
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="mb-1">{form.title}</h3>
            {form.isActive && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Ativo
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">{form.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {respondedUsers} de {totalUsers} respostas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-900 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{percentage}%</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => onView(form.id, e)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver
          </Button>
          {!isAnalyst && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => onEdit(form.id, e)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => onDelete(form.id, e)}
                className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </Button>
            </>
          )}

          <div className="text-gray-400">
            {form.isActive ? (
              isExpanded ? (
                <ChevronDown className="w-6 h-6" />
              ) : (
                <ChevronRight className="w-6 h-6" />
              )
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
