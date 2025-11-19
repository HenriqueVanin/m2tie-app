// Role labels mapping for UI display
export type UserRole =
  | "admin"
  | "teacher_analyst"
  | "teacher_respondent"
  | "student";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  teacher_analyst: "Professor Analista",
  teacher_respondent: "Professor Respondente",
  student: "Estudante",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  teacher_analyst: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  teacher_respondent: "bg-green-100 text-green-800 hover:bg-green-100",
  student: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

/**
 * Get display label for a role
 */
export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role as UserRole] ?? role;
}

/**
 * Get badge color classes for a role
 */
export function getRoleColor(role: string): string {
  return (
    ROLE_COLORS[role as UserRole] ??
    "bg-gray-100 text-gray-800 hover:bg-gray-100"
  );
}
