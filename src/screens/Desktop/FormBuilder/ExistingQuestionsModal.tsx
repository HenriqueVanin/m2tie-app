import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { SearchBar } from "../../../components/ui/search-bar";
import { FileText, X, Type } from "lucide-react";
import { QUESTION_TYPE_ICONS } from "../../../utils/questionTypes";
import type { UIQuestionType } from "../../../utils/questionTypes";

interface Props {
  visible: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterType: string | null;
  setFilterType: (v: any) => void;
  filteredQuestions: any[];
  questions: any[];
  addExistingQuestion: (q: any) => void;
}

export default function ExistingQuestionsModal({
  visible,
  onClose,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filteredQuestions,
  questions,
  addExistingQuestion,
}: Props) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl overflow-auto flex flex-col h-full max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Banco de Questões</h2>
            <p className="text-sm text-gray-500 mt-1">
              Selecione uma questão existente para adicionar ao formulário
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 space-y-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar questões..."
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhuma questão encontrada no banco de questões</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q: any) => {
                const Icon =
                  QUESTION_TYPE_ICONS[q.type as UIQuestionType] || Type;
                const isAlreadyAdded = questions.some(
                  (existingQ) => existingQ.id === q._id
                );

                return (
                  <Card
                    key={q._id}
                    className={`border cursor-pointer transition-all hover:shadow-md ${
                      isAlreadyAdded
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-blue-500"
                    }`}
                    onClick={() => !isAlreadyAdded && addExistingQuestion(q)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {q.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {q.type}
                              </p>
                              {q.options && q.options.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {q.options
                                    .slice(0, 3)
                                    .map((opt: any, idx: number) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-gray-100 text-xs rounded"
                                      >
                                        {opt.label}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                            {isAlreadyAdded && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                Adicionada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
