import React from "react";
import { User, Mail, Download, X } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import type { FormResponse } from "./useStaffFormResponses";

interface Props {
  response: FormResponse;
  onClose: () => void;
}

export function ResponseDetailModal({ response, onClose }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatAnswer = (answer: string | string[] | number): string => {
    if (Array.isArray(answer)) return answer.join(", ");
    return String(answer);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b-2 border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2>{response.formTitle}</h2>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                {response.answers.length}{" "}
                {response.answers.length === 1 ? "resposta" : "respostas"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Enviado em {formatDate(response.submittedAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Informações do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{response.userName}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {response.userEmail}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Respostas do Formulário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {response.answers.map((answer) => (
                <div
                  key={answer.questionId}
                  className="pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-500 flex-1">
                      {answer.questionTitle}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {answer.questionType}
                    </Badge>
                  </div>
                  <p className="text-gray-800">{formatAnswer(answer.answer)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1 border">
            Fechar
          </Button>
          <Button className="flex-1 bg-blue-900 hover:bg-blue-800 text-white gap-2">
            <Download className="w-4 h-4" /> Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ResponseDetailModal;
