import React from "react";
import { X, FileText } from "lucide-react";
import { SearchBar } from "../../../../components/ui/search-bar";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  BackendQuestionType,
  QUESTION_TYPE_ICONS,
} from "../../../../utils/questionTypes";

interface QuestionItem {
  _id: string;
  type: string;
  title: string;
  description?: string;
}

interface Props {
  filteredQuestions: QuestionItem[];
  onClose: () => void;
  addExistingQuestion: (q: QuestionItem) => void;
  isAlreadyAdded: (id: string) => boolean;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  filterType: string;
  setFilterType: (t: string) => void;
  QUESTION_TYPES: { type: string; icon: any; label: string }[];
}

export function ExistingQuestionsModal({
  filteredQuestions,
  onClose,
  addExistingQuestion,
  isAlreadyAdded,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  QUESTION_TYPES,
}: Props) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl overflow-auto flex flex-col h-full max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-semibold">Banco de Questões</h2>
            <p className="text-sm text-gray-500 mt-1">
              Selecione uma questão existente para adicionar ao formulário
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 space-y-3 shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar questões..."
          />

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                filterType === "all"
                  ? "bg-[#003087] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            {QUESTION_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.type}
                  onClick={() => setFilterType(type.type)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${
                    filterType === type.type
                      ? "bg-[#003087] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>
                {searchQuery || filterType !== "all"
                  ? "Nenhuma questão encontrada com os filtros aplicados"
                  : "Nenhuma questão encontrada no banco de questões"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q) => {
                const Icon =
                  QUESTION_TYPE_ICONS[q.type as BackendQuestionType] ||
                  ((p: any) => null);
                const already = isAlreadyAdded(q._id);
                return (
                  <Card
                    key={q._id}
                    className={`border cursor-pointer transition-all ${
                      already
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-blue-500"
                    }`}
                    onClick={() => !already && addExistingQuestion(q)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="text-gray-800">{q.title}</p>
                              {q.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {q.description}
                                </p>
                              )}
                            </div>
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

export default ExistingQuestionsModal;
