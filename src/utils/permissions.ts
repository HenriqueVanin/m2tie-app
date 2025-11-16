// Sistema de permissões por role

export type UserRole = "admin" | "staff" | "user";

export interface Permission {
  canViewDashboards: boolean;
  canViewResponses: boolean;
  canManageUsers: boolean;
  canManageQuestions: boolean;
  canManageForms: boolean;
  canCreateForms: boolean;
  canCreateQuestions: boolean;
  canEditForms: boolean;
  canEditQuestions: boolean;
  canDeleteForms: boolean;
  canDeleteQuestions: boolean;
  canDeleteUsers: boolean;
}

const PERMISSIONS: Record<UserRole, Permission> = {
  admin: {
    canViewDashboards: true,
    canViewResponses: true,
    canManageUsers: true,
    canManageQuestions: true,
    canManageForms: true,
    canCreateForms: true,
    canCreateQuestions: true,
    canEditForms: true,
    canEditQuestions: true,
    canDeleteForms: true,
    canDeleteQuestions: true,
    canDeleteUsers: true,
  },
  staff: {
    canViewDashboards: true,
    canViewResponses: true,
    canManageUsers: false,
    canManageQuestions: false,
    canManageForms: false,
    canCreateForms: false,
    canCreateQuestions: false,
    canEditForms: false,
    canEditQuestions: false,
    canDeleteForms: false,
    canDeleteQuestions: false,
    canDeleteUsers: false,
  },
  user: {
    canViewDashboards: false,
    canViewResponses: false,
    canManageUsers: false,
    canManageQuestions: false,
    canManageForms: false,
    canCreateForms: false,
    canCreateQuestions: false,
    canEditForms: false,
    canEditQuestions: false,
    canDeleteForms: false,
    canDeleteQuestions: false,
    canDeleteUsers: false,
  },
};

export function getPermissions(role: UserRole): Permission {
  return PERMISSIONS[role] || PERMISSIONS.user;
}

export function hasPermission(
  role: UserRole,
  permission: keyof Permission
): boolean {
  return getPermissions(role)[permission];
}

// Função auxiliar para verificar se pode acessar uma tela
export function canAccessScreen(role: UserRole, screen: string): boolean {
  const permissions = getPermissions(role);

  switch (screen) {
    case "staff-dashboards":
      return permissions.canViewDashboards;
    case "staff-form-responses":
    case "staff-form-responses-by-form":
      return permissions.canViewResponses;
    case "staff-user-management":
      return permissions.canManageUsers;
    case "staff-question-bank":
    case "staff-question-manager":
      return permissions.canManageQuestions;
    case "staff-form-builder":
      return permissions.canManageForms;
    default:
      return false;
  }
}
