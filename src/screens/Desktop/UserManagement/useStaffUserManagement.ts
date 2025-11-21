import { useState, useEffect } from "react";
import { getUserCookie } from "../../../utils/userCookie";
import { hasPermission, type UserRole } from "../../../utils/permissions";
import {
  getAllUsers,
  deleteUser as deleteUserAPI,
  type User as APIUser,
} from "../../../services/userService";
import { toast } from "sonner";

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

export function useStaffUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [activeTab, setActiveTab] = useState<
    "all" | "student" | "teacher_respondent" | "teacher_analyst" | "admin"
  >("all");
  const [institutionFilter, setInstitutionFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "student" | "teacher_respondent" | "teacher_analyst" | "admin"
  >("all");
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data as any);
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
      (activeTab === "student" && user.role === "student") ||
      (activeTab === "teacher_respondent" &&
        user.role === "teacher_respondent") ||
      (activeTab === "teacher_analyst" && user.role === "teacher_analyst") ||
      (activeTab === "admin" && user.role === "admin");

    const matchesRoleFilter = roleFilter === "all" || user.role === roleFilter;

    const matchesInstitutionFilter =
      institutionFilter === "all" ||
      (user.institution || "") === institutionFilter;

    return (
      matchesSearch &&
      matchesTab &&
      matchesRoleFilter &&
      matchesInstitutionFilter
    );
  });

  const handleDeleteUser = async (id: string) => {
    const user = users.find((u) => u._id === id);
    if (!user) return;
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteUserAPI(userToDelete._id);
      setUsers(users.filter((u) => u._id !== userToDelete._id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (e: any) {
      setError(e?.message || "Erro ao excluir usuário");
    } finally {
      setDeleting(false);
    }
  };

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
  } as const;
}

export default useStaffUserManagement;
