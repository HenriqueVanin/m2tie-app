import React from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ShieldAlert } from "lucide-react";
import useStaffFormBuilder from "./useStaffFormBuilder";
import FormBuilderHeader from "./components/FormBuilderHeader";
import FormCanvas from "./components/FormCanvas";
import SidebarPanel from "./components/SidebarPanel";
import ExistingQuestionsModal from "./components/ExistingQuestionsModal";
import { QUESTION_TYPES } from "../../../utils/questionTypes";

const StaffFormBuilder = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <FormBuilderScreen />
    </DndProvider>
  );
};

function FormBuilderScreen() {
  const navigate = useNavigate();
  const hook = useStaffFormBuilder((path: string) => navigate(path));

  const {
    formId,
    formTitle,
    formDescription,
    questions,
    selectedQuestion,
    isLoading,
    isSaving,
    showExistingQuestionsModal,
    setShowExistingQuestionsModal,
    isLoadingQuestions,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    setFormTitle,
    setFormDescription,
    setSelectedQuestion,
    loadExistingQuestions,
    addExistingQuestion,
    filteredQuestions,
    addQuestion,
    moveQuestion,
    saveForm,
    selectedQuestionData,
    updateQuestion,
    saveQuestion,
    deleteQuestion,
    canManage,
  } = hook;

  if (!canManage) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Você não tem permissão para criar ou editar formulários.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087] mx-auto mb-4" />
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <FormBuilderHeader
          formId={formId}
          isSaving={isSaving}
          isLoading={isLoading}
          onSave={saveForm}
        />

        <FormCanvas
          questions={questions as any}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          moveQuestion={moveQuestion}
          deleteQuestion={deleteQuestion}
        />
      </div>

      <SidebarPanel
        selectedQuestion={selectedQuestion}
        question={selectedQuestionData || undefined}
        onQuestionChange={(patch) =>
          selectedQuestion ? updateQuestion(selectedQuestion, patch) : undefined
        }
        onSaveQuestion={() =>
          selectedQuestionData ? saveQuestion(selectedQuestionData) : undefined
        }
        onCloseEditor={() => setSelectedQuestion(null)}
        onDeleteQuestion={() =>
          selectedQuestion ? deleteQuestion(selectedQuestion) : undefined
        }
        formTitle={formTitle}
        formDescription={formDescription}
        isLoadingQuestions={isLoadingQuestions}
        loadExistingQuestions={loadExistingQuestions}
        setFormTitle={setFormTitle}
        setFormDescription={setFormDescription}
        addQuestion={addQuestion as any}
        QUESTION_TYPES={QUESTION_TYPES as any}
      />

      {showExistingQuestionsModal && (
        <ExistingQuestionsModal
          filteredQuestions={filteredQuestions as any}
          onClose={() => setShowExistingQuestionsModal(false)}
          addExistingQuestion={addExistingQuestion as any}
          isAlreadyAdded={(id: string) =>
            questions.some((q: any) => q.id === id)
          }
          searchQuery={searchQuery}
          setSearchQuery={(s: string) => setSearchQuery(s)}
          filterType={filterType as any}
          setFilterType={(t: string) => setFilterType(t as any)}
          QUESTION_TYPES={QUESTION_TYPES as any}
        />
      )}
    </div>
  );
}

export default StaffFormBuilder;
