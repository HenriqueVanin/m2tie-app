import React from "react";
import RespondentRow from "./RespondentRow";
import { Button } from "../../../components/ui/button";
import { UserMinus, UserPlus } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { getRoleLabel, getRoleColor } from "../../../utils/roleLabels";

interface Props {
  form: any;
  isAnalyst: boolean;
  selectedUsers: Record<string, Set<string>>;
  toggleUserSelection: (formId: string, userId: string) => void;
  toggleSelectAll: (formId: string) => void;
  handleRemoveSelectedUsers: (formId: string) => Promise<void> | void;
  handleOpenAddUserModal: (formId: string) => void;
  handleAddUsers?: (userIds: string[]) => Promise<void> | void;
  userSearchTerm?: string;
  setUserSearchTerm?: (s: string) => void;
  formatDate: (s?: string) => string;
  allUsers?: any[];
  currentFormId?: string | null;
}

export default function RespondentsTable({
  form,
  isAnalyst,
  selectedUsers,
  toggleUserSelection,
  toggleSelectAll,
  handleRemoveSelectedUsers,
  handleOpenAddUserModal,
  formatDate,
}: Props) {
  return (
    <div className="max-h-96 overflow-y-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
          <tr>
            {!isAnalyst && (
              <th className="text-left px-6 py-3 w-12">
                <input
                  type="checkbox"
                  checked={
                    form.respondents.length > 0 &&
                    (selectedUsers[form.id]?.size || 0) ===
                      form.respondents.length
                  }
                  onChange={() => toggleSelectAll(form.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </th>
            )}
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              Nome
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              Cargo
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              Status
            </th>
            {!isAnalyst && (
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400"></th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900">
          {form.respondents.length > 0 ? (
            <>
              {form.respondents.map((user: any) => (
                <RespondentRow
                  key={user._id || user.email}
                  formId={form.id}
                  user={user}
                  isAnalyst={isAnalyst}
                  selected={!!selectedUsers[form.id]?.has(user._id || "")}
                  onToggleSelect={toggleUserSelection}
                  formatDate={formatDate}
                />
              ))}

              {!isAnalyst && (
                <tr className="border-t-2 border-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td colSpan={6} className="px-6 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAddUserModal(form.id)}
                      className="w-full gap-2 border-dashed border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                    >
                      <UserPlus className="w-4 h-4" />
                      Adicionar Usuários
                    </Button>
                  </td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td
                colSpan={isAnalyst ? 5 : 6}
                className="px-6 py-8 text-center text-gray-500"
              >
                <div className="flex flex-col items-center gap-3">
                  <p>Nenhum usuário atribuído</p>
                  {!isAnalyst && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAddUserModal(form.id)}
                      className="gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Adicionar Usuários
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
