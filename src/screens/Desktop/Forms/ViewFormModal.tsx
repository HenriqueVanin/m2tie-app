import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { FileText } from "lucide-react";

interface Props {
  open: boolean;
  form: any | null;
  onClose: () => void;
  formatDate: (s?: string) => string;
}

export default function ViewFormModal({
  open,
  form,
  onClose,
  formatDate,
}: Props) {
  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-auto flex flex-col h-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {form.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Questões:</h4>
            {form.questions && form.questions.length > 0 ? (
              <div className="space-y-4">
                {form.questions.map((q: any, index: number) => (
                  <div
                    key={q._id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-700">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {q.questionId.title}
                          {q.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Tipo: {q.questionId.type}
                        </p>
                        {q.questionId.options &&
                          q.questionId.options.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">Opções:</p>
                              <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                {q.questionId.options.map(
                                  (opt: any, i: number) => (
                                    <li key={i}>{opt.label}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma questão adicionada.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
