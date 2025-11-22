import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, UserPlus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { PageHeader } from "../../../components/ui/page-header";
import useStaffFormResponsesByForm from "./useStaffFormResponsesByForm";
import StatsOverview from "./StatsOverview";
import FormHeader from "./FormHeader";
import ViewFormModal from "./ViewFormModal";
import AddUsersModal from "./AddUsersModal";
import RespondentsTable from "./RespondentsTable";

export function StaffFormResponsesByForm() {
  const navigate = useNavigate();
  const hook = useStaffFormResponsesByForm((p) => navigate(p));

  const {
    forms,
    expandedForms,
    loading,
    error,
    viewFormModal,
    loadingRespondents,
    deleteDialogOpen,
    formToDelete,
    deleting,
    selectedUsers,
    addUserModalOpen,
    currentFormId,
    allUsers,
    userSearchTerm,
    toggleUserSelection,
    toggleSelectAll,
    handleRemoveSelectedUsers,
    handleOpenAddUserModal,
    handleAddUsers,
    toggleForm,
    handleEditForm,
    handleDeleteForm,
    handleDeleteConfirm,
    handleViewForm,
    formatDate,
    setViewFormModal,
    setDeleteDialogOpen,
    setAddUserModalOpen,
    setUserSearchTerm,
    isAnalyst,
  } = hook as any;

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Carregando formulários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Erro: {error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Exibindo dados mock enquanto o erro persiste.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Formulários"
        description="Visualize as respostas organizadas por formulário e aluno"
      >
        {!isAnalyst && (
          <Button
            onClick={() => navigate("/staff/form-builder")}
            className="h-12 bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg rounded-2xl"
          >
            <Plus className="w-5 h-5" />
            Criar Formulário
          </Button>
        )}
      </PageHeader>

      <StatsOverview
        formsCount={forms.length}
        totalStudents={forms.find((f: any) => f.isActive)?.totalStudents || 0}
        totalResponses={forms.reduce(
          (acc: number, f: any) => acc + f.respondedCount,
          0
        )}
        activeFormTitle={forms.find((f: any) => f.isActive)?.title || "Nenhum"}
      />

      <div className="flex-1 overflow-auto p-6">
        {forms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Nenhum formulário encontrado
            </h3>
            <p className="text-gray-500">
              Crie um formulário para começar a receber respostas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map((form: any) => {
              const isExpanded = expandedForms.has(form.id);
              const totalUsers = form.totalStudents;
              const respondedUsers = form.respondedCount;
              const percentage =
                totalUsers > 0
                  ? Math.round((respondedUsers / totalUsers) * 100)
                  : 0;

              return (
                <div
                  key={form.id}
                  className={`bg-white border-2 rounded-lg overflow-hidden transition-all ${
                    form.isActive
                      ? "border-green-500 shadow-lg shadow-green-100"
                      : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => toggleForm(form.id, form.isActive)}
                    className="w-full"
                    disabled={!form.isActive}
                  >
                    <FormHeader
                      form={form}
                      isExpanded={isExpanded}
                      percentage={percentage}
                      respondedUsers={respondedUsers}
                      totalUsers={totalUsers}
                      isAnalyst={isAnalyst}
                      onView={handleViewForm}
                      onEdit={handleEditForm}
                      onDelete={handleDeleteForm}
                      onToggle={() => toggleForm(form.id, form.isActive)}
                    />
                  </button>

                  {isExpanded && form.isActive && (
                    <div className="border-t border-gray-200">
                      {loadingRespondents[form.id] ? (
                        <div className="flex items-center justify-center p-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="ml-3 text-gray-600">
                            Carregando usuários...
                          </p>
                        </div>
                      ) : (
                        <RespondentsTable
                          form={form}
                          isAnalyst={isAnalyst}
                          selectedUsers={selectedUsers}
                          toggleUserSelection={toggleUserSelection}
                          toggleSelectAll={toggleSelectAll}
                          handleRemoveSelectedUsers={handleRemoveSelectedUsers}
                          handleOpenAddUserModal={handleOpenAddUserModal}
                          formatDate={formatDate}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ViewFormModal
        open={!!viewFormModal}
        form={viewFormModal}
        onClose={() => setViewFormModal(null)}
        formatDate={formatDate}
      />

      <AddUsersModal
        open={addUserModalOpen}
        onOpenChange={setAddUserModalOpen}
        allUsers={allUsers}
        assignedUserIds={
          currentFormId
            ? forms.find((f: any) => f.id === currentFormId)?.assignedUserIds ||
              []
            : []
        }
        onAddUsers={handleAddUsers}
        searchTerm={userSearchTerm}
        onSearchChange={setUserSearchTerm}
      />
    </div>
  );
}

export default StaffFormResponsesByForm;
// Componente Modal para adicionar usuários
