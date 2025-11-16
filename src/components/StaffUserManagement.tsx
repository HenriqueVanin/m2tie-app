import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Mail, X, Check, ShieldAlert } from "lucide-react";
import { getUserCookie } from "../utils/userCookie";
import { hasPermission, type UserRole } from "../utils/permissions";
import { Button } from "./ui/button";
import { ErrorState } from "./ui/error-state";
import { SearchBar } from "./ui/search-bar";
import { PageHeaderWithSearch } from "./ui/page-header";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  getAllUsers,
  deleteUser as deleteUserAPI,
  updateUser,
  User as APIUser,
} from "../services/userService";
import { authService } from "../services/authService";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "user";
}

export function StaffUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [activeTab, setActiveTab] = useState<"all" | "user" | "staff">("all");

  useEffect(() => {
    const user = getUserCookie();
    if (user?.role) setUserRole(user.role as UserRole);
  }, []);

  const canManage = hasPermission(userRole, "canManageUsers");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar usuários");
      console.error("Error fetching users:", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "user" && user.role === "user") ||
      (activeTab === "staff" &&
        (user.role === "admin" || user.role === "staff"));

    return matchesSearch && matchesTab;
  });

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await deleteUserAPI(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch (e: any) {
      alert(e?.message || "Erro ao excluir usuário");
    }
  };

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
          <SearchBar
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
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

      {/* Stats */}
      {/* <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total de Usuários</p>
            <p className="text-gray-900 text-2xl">{users.length}</p>
          </div>
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Administradores</p>
            <p className="text-gray-900 text-2xl">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Staff</p>
            <p className="text-gray-900 text-2xl">
              {users.filter((u) => u.role === "staff").length}
            </p>
          </div>
        </div>
      </div> */}

      {/* Tabs */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Tabs
          value={activeTab}
          onValueChange={(v: string) =>
            setActiveTab(v as "all" | "user" | "staff")
          }
        >
          <TabsList>
            <TabsTrigger value="all">Todos ({users.length})</TabsTrigger>
            <TabsTrigger value="user">
              Usuários ({users.filter((u) => u.role === "user").length})
            </TabsTrigger>
            <TabsTrigger value="staff">
              Admin/Staff (
              {
                users.filter((u) => u.role === "admin" || u.role === "staff")
                  .length
              }
              )
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
                    colSpan={4}
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
                      <Badge
                        className={
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : user.role === "staff"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {user.role === "admin"
                          ? "Administrador"
                          : user.role === "staff"
                          ? "Staff"
                          : "Usuário"}
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
                });
                setUsers(users.map((u) => (u._id === user._id ? user : u)));
              } else {
                // Criar novo usuário via register
                if (!password || !confirmPassword) {
                  alert("Senha é obrigatória para criar usuário");
                  return;
                }

                const response = await authService.register({
                  name: user.name,
                  email: user.email,
                  password,
                  confirmPassword,
                  role: user.role,
                });

                alert(response.message || "Usuário criado com sucesso!");
              }
              setShowAddModal(false);
              setEditingUser(null);
              fetchUsers();
            } catch (e: any) {
              alert(e?.message || "Erro ao salvar usuário");
            }
          }}
        />
      )}
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
      role: "user",
    }
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // Validação de senha para novo usuário
      if (!password || !confirmPassword) {
        alert("Senha e confirmação de senha são obrigatórias");
        return;
      }
      if (password !== confirmPassword) {
        alert("As senhas não coincidem");
        return;
      }
      if (password.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres");
        return;
      }
    }

    onSave(formData as User, password, confirmPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
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
          <div className="p-6 space-y-4">
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

            {!user && (
              <>
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
                    role: e.target.value as "admin" | "staff" | "user",
                  })
                }
                className="w-full h-12 px-3 border border-gray-300 rounded-md bg-white"
              >
                <option value="user">Usuário</option>
                <option value="staff">Staff</option>
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
