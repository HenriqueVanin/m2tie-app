import api from "./api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "user";
}

export interface ApiResponse<T> {
  error: string | null;
  msg: string;
  data?: T;
}

export interface UpdateUserPayload {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: User["role"];
}

export async function getAllUsers(): Promise<User[]> {
  const res = await api.get<ApiResponse<User[]>>("/users/all");
  return res.data.data!;
}

export async function getUserById(userId: string): Promise<User> {
  const res = await api.get<ApiResponse<User>>(`/users/${userId}`);
  return res.data.data!;
}

export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  const { id, ...body } = payload;
  const res = await api.put<ApiResponse<User>>(`/users/${id}`, body);
  return res.data.data!;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/users/${userId}`);
}

// Remove or keep only if backend has /auth/me
export async function getCurrentUser(): Promise<User> {
  const res = await api.get<ApiResponse<User>>("/auth/me");
  return res.data.data!;
}
