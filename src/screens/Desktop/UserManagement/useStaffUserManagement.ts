import { useState, useEffect, useCallback, useMemo } from "react";
import { getUserCookie } from "../../../utils/userCookie";
import { hasPermission, type UserRole } from "../../../utils/permissions";
import {
  getAllUsers,
  deleteUser as deleteUserAPI,
  type User as APIUser,
} from "../../../services/userService";
import type { User } from "../../../services/userService";
import { updateUser } from "../../../services/userService";
import { authService } from "../../../services/authService";
import { toast } from "sonner";

export type UserTab =
  | "all"
  | "student"
  | "teacher_respondent"
  | "teacher_analyst"
  | "admin";

export function useStaffUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [activeTab, setActiveTab] = useState<UserTab>("all");
  const [institutionFilter, setInstitutionFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<UserTab | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const user = getUserCookie();
    if (user?.role) setUserRole(user.role as UserRole);
  }, []);

  const canManage = hasPermission(userRole, "canManageUsers");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data as User[]);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar usuários");
      console.error("Error fetching users:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab =
          activeTab === "all" ||
          (activeTab === "student" && user.role === "student") ||
          (activeTab === "teacher_respondent" &&
            user.role === "teacher_respondent") ||
          (activeTab === "teacher_analyst" &&
            user.role === "teacher_analyst") ||
          (activeTab === "admin" && user.role === "admin");

        const matchesRoleFilter =
          roleFilter === "all" || user.role === roleFilter;

        const matchesInstitutionFilter =
          institutionFilter === "all" ||
          (user.institution || "") === institutionFilter;

        return (
          matchesSearch &&
          matchesTab &&
          matchesRoleFilter &&
          matchesInstitutionFilter
        );
      }),
    [users, searchTerm, activeTab, roleFilter, institutionFilter]
  );

  const handleDeleteUser = useCallback(
    (id: string) => {
      const user = users.find((u) => u._id === id);
      if (!user) return;
      setUserToDelete(user);
      setDeleteDialogOpen(true);
    },
    [users]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteUserAPI(userToDelete._id);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (e: any) {
      setError(e?.message || "Erro ao excluir usuário");
    } finally {
      setDeleting(false);
    }
  }, [userToDelete]);

  const handleSaveUser = useCallback(
    async (user: User, password?: string, confirmPassword?: string) => {
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
          setUsers((prev) => prev.map((u) => (u._id === user._id ? user : u)));
        } else {
          if (!password || !confirmPassword) {
            toast.error("Senha é obrigatória para criar usuário");
            return;
          }

          await authService.register({
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
    },
    [editingUser, fetchUsers]
  );

  return {
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
    handleSaveUser,
  } as const;
}

export default useStaffUserManagement;
