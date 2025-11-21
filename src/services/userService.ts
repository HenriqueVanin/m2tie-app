import api from "./api";

export interface User {
  _id: string;
  name: string;
  anonymous?: boolean;
  email: string;
  role: "admin" | "teacher_analyst" | "teacher_respondent" | "student";
  city?: string;
  state?: string;
  institution?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  error: string | null;
  msg: string;
  data?: T;
}

export interface UpdateUserPayload {
  id: string;
  name?: string;
  anonymous?: boolean;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: User["role"];
  city?: string;
  state?: string;
  institution?: string;
}

/**
 * Obtém todos os usuários (apenas ADMIN)
 * @returns Lista completa de usuários
 */
export async function getAllUsers(): Promise<User[]> {
  const res = await api.get<ApiResponse<User[]>>("/users/all");
  return res.data.data!;
}

/**
 * Obtém usuários que podem ser atribuídos a formulários (apenas ADMIN)
 * Retorna apenas estudantes e teacher_respondent
 * @returns Lista de usuários atribuíveis
 */
export async function getAssignableUsers(): Promise<User[]> {
  const res = await api.get<ApiResponse<User[]>>("/users/assignable");
  return res.data.data!;
}

/**
 * Obtém um usuário por ID
 * Qualquer usuário autenticado pode visualizar outros usuários
 * @param userId - ID do usuário
 * @returns Dados do usuário (sem senha)
 */
export async function getUserById(userId: string): Promise<User> {
  const res = await api.get<ApiResponse<User>>(`/users/${userId}`);
  return res.data.data!;
}

/**
 * Atualiza um usuário
 * - Usuários podem editar seus próprios dados (exceto role)
 * - ADMIN pode editar qualquer usuário e alterar roles
 * @param payload - Dados a atualizar
 * @returns Usuário atualizado
 */
export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  const { id, ...body } = payload;
  const res = await api.put<ApiResponse<User>>(`/users/${id}`, body);
  return res.data.data!;
}

/**
 * Deleta um usuário (soft delete - apenas ADMIN)
 * @param userId - ID do usuário
 */
export async function deleteUser(userId: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/users/${userId}`);
}

// Remove or keep only if backend has /auth/me
export async function getCurrentUser(): Promise<User> {
  const res = await api.get<ApiResponse<User>>("/auth/me");
  return res.data.data!;
}
