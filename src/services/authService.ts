import api from "./api";

// Tipos
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  error: string | null;
  msg: string;
  token: string;
  userId: string;
}

export interface RegisterRequest {
  name: string;
  anonymous: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "student" | "teacher_analyst" | "teacher_respondent";
  city: string;
  state: string;
  institution: string;
}

export interface RegisterResponse {
  error: string | null;
  msg: string;
  token: string;
  userId: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
export interface ForgotPasswordResponse {
  message: string;
}
export interface ResetPasswordRequest {
  token: string; // token recebido por email (placeholder)
  password: string;
  confirmPassword: string;
}
export interface ResetPasswordResponse {
  message: string;
}

// Serviço de autenticação
export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>(
      "/auth/reset-password",
      data
    );
    return response.data;
  },

  getUserById: async (
    id: string
  ): Promise<{
    error: string | null;
    msg: string;
    data: { id: string; name: string; email: string; role: string } | null;
  }> => {
    const response = await api.get<{
      error: string | null;
      msg: string;
      data: { id: string; name: string; email: string; role: string } | null;
    }>(`/users/${id}`);
    return response.data;
  },
};
