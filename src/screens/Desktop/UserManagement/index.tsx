import { toast } from "sonner";
import { useState } from "react";
import { Plus, Edit, Trash2, Mail, X, Check, ShieldAlert } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ErrorState } from "../../../components/ui/error-state";
import { SearchBar } from "../../../components/ui/search-bar";
import { PageHeaderWithSearch } from "../../../components/ui/page-header";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/tabs";
import { DeleteConfirmationDialog } from "../../../components/ui/delete-confirmation-dialog";
import { authService } from "../../../services/authService";
import { updateUser } from "../../../services/userService";
import { getRoleLabel, getRoleColor } from "../../../utils/roleLabels";
import { useStaffUserManagement, UserTab } from "./useStaffUserManagement";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher_analyst" | "teacher_respondent" | "student";
  anonymous?: boolean;
  city?: string;
  state?: string;
  institution?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function StaffUserManagement() {
  const {
    users,
    setUsers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    editingUser,
    setEditingUser,
    userRole,
    setUserRole,
    activeTab,
    setActiveTab,
    institutionFilter,
    setInstitutionFilter,
    roleFilter,
    setRoleFilter,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    deleting,
    setDeleting,
    canManage,
    fetchUsers,
    filteredUsers,
    handleDeleteUser,
    handleDeleteConfirm,
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
      <PageHeaderWithSearch
        title="Gerenciar Usuários"
        description="Cadastre e gerencie os usuários da plataforma"
        searchComponent={
          <div className="flex items-center gap-3">
            <SearchBar
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="h-10 px-3 border rounded-md bg-white"
            >
              <option value="all">Todos os cargos</option>
              <option value="student">Estudante</option>
              <option value="teacher_respondent">Professor</option>
              <option value="teacher_analyst">Pesquisador</option>
              <option value="admin">Administrador</option>
            </select>

            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="h-10 px-3 border rounded-md bg-white"
            >
              <option value="all">Todas as instituições</option>
              {[
                ...new Set(users.map((u) => u.institution).filter(Boolean)),
              ].map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <Button
          onClick={() => setShowAddModal(true)}
          className="h-12 bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg rounded-2xl"
        >
          <Plus className="w-5 h-5" />
          Adicionar Usuário
        </Button>
      </PageHeaderWithSearch>

      {/* Tabs */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Tabs
          value={activeTab}
          onValueChange={(v: string) => setActiveTab(v as UserTab)}
        >
          <TabsList>
            <TabsTrigger value="all">Todos ({users.length})</TabsTrigger>
            <TabsTrigger value="student">
              Estudantes ({users.filter((u) => u.role === "student").length})
            </TabsTrigger>
            <TabsTrigger value="teacher_respondent">
              Prof. Respondentes (
              {users.filter((u) => u.role === "teacher_respondent").length})
            </TabsTrigger>
            <TabsTrigger value="teacher_analyst">
              Prof. Pesquisadors (
              {users.filter((u) => u.role === "teacher_analyst").length})
            </TabsTrigger>
            <TabsTrigger value="admin">
              Administradores ({users.filter((u) => u.role === "admin").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087] mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Carregando usuários...
              </p>
            </div>
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchUsers} />
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Nome
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Instituição / Localização
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Função
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-gray-800 font-medium">{user.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {user.institution && (
                          <p className="font-medium text-gray-800">
                            {user.institution}
                          </p>
                        )}
                        {(user.city || user.state) && (
                          <p className="text-xs text-gray-500">
                            {[user.city, user.state]
                              .filter(Boolean)
                              .join(" - ")}
                          </p>
                        )}
                        {!user.institution && !user.city && !user.state && (
                          <span className="text-gray-400 italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingUser(user)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user._id)}
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingUser) && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowAddModal(false);
            setEditingUser(null);
          }}
          onSave={async (user, password, confirmPassword) => {
            try {
              if (editingUser) {
                await updateUser({
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  anonymous: user.anonymous,
                  city: user.city,
                  state: user.state,
                  institution: user.institution,
                });
                setUsers(users.map((u) => (u._id === user._id ? user : u)));
              } else {
                // Criar novo usuário via register
                if (!password || !confirmPassword) {
                  toast.error("Senha é obrigatória para criar usuário");
                  return;
                }

                const response = await authService.register({
                  name: user.name,
                  email: user.email,
                  password,
                  confirmPassword,
                  role: user.role,
                  anonymous: user.anonymous || false,
                  city: user.city || "",
                  state: user.state || "",
                  institution: user.institution || "",
                });

                toast.success("Usuário criado com sucesso!");
              }
              setShowAddModal(false);
              setEditingUser(null);
              fetchUsers();
            } catch (e: any) {
              toast.error(e?.message || "Erro ao salvar usuário");
            }
          }}
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

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (user: User, password?: string, confirmPassword?: string) => void;
}

function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      name: "",
      email: "",
      role: "student",
      anonymous: false,
      city: "",
      state: "",
      institution: "",
    }
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // Validação de senha para novo usuário
      if (!password || !confirmPassword) {
        toast.error("Senha e confirmação de senha são obrigatórias");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }
      if (password.length < 6) {
        toast.error("A senha deve ter no mínimo 6 caracteres");
        return;
      }
    }

    onSave(formData as User, password, confirmPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2>{user ? "Editar Usuário" : "Novo Usuário"}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Content */}
          <div className="p-6 space-y-4 overflow-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="border"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Instituição</Label>
                <Input
                  id="institution"
                  value={formData.institution || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, institution: e.target.value })
                  }
                  className="border"
                  placeholder="Ex: Universidade Federal do Paraná"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="border"
                  placeholder="Ex: Curitiba"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="border"
                  placeholder="Ex: PR"
                />
              </div>
            </div>

            {!user && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border"
                      placeholder="Confirme a senha"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Função *</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as
                      | "admin"
                      | "teacher_analyst"
                      | "teacher_respondent"
                      | "student",
                  })
                }
                className="w-full h-12 px-3 border border-gray-300 rounded-md bg-white"
              >
                <option value="student">Estudante</option>
                <option value="teacher_respondent">Professor</option>
                <option value="teacher_analyst">Pesquisador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-900 hover:bg-blue-800 text-white gap-2"
            >
              <Check className="w-4 h-4" />
              {user ? "Salvar Alterações" : "Cadastrar Usuário"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
