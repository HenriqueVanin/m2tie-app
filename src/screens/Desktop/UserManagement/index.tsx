import { ShieldAlert } from "lucide-react";
import { DeleteConfirmationDialog } from "../../../components/ui/delete-confirmation-dialog";
import { getRoleLabel, getRoleColor } from "../../../utils/roleLabels";
import { useStaffUserManagement } from "./useStaffUserManagement";
import Header from "./Header";
import TableView from "./TableView";
import UserModal from "./Modals";

import type { User } from "../../../services/userService";

export function StaffUserManagement() {
  const {
    users,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    editingUser,
    setEditingUser,
    institutionFilter,
    setInstitutionFilter,
    roleFilter,
    setRoleFilter,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    deleting,
    canManage,
    fetchUsers,
    filteredUsers,
    handleDeleteUser,
    handleDeleteConfirm,
    handleSaveUser,
  } = useStaffUserManagement();

  if (!canManage) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Você não tem permissão para gerenciar usuários.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        institutionFilter={institutionFilter}
        setInstitutionFilter={setInstitutionFilter}
        users={users}
        onAdd={() => setShowAddModal(true)}
      />

      <TableView
        loading={loading}
        error={error}
        users={users}
        filteredUsers={filteredUsers}
        fetchUsers={fetchUsers}
        onEdit={(u: User) => setEditingUser(u)}
        onDelete={(id) => handleDeleteUser(id)}
        getRoleLabel={getRoleLabel}
        getRoleColor={getRoleColor}
      />

      {/* Add/Edit Modal */}
      {(showAddModal || editingUser) && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowAddModal(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
        description={
          <>
            Tem certeza que deseja excluir o usuário{" "}
            <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
          </>
        }
        countdownSeconds={3}
      />
    </div>
  );
}

// UserModal moved to ./Modals (UserModal component)
