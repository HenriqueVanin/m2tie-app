import { ReactNode } from "react";
import { UIQuestionType } from "../utils/questionTypes";
import api from "./api";

export interface QuestionDetails {
  _id: string;
  title: string;
  type: UIQuestionType;
  options?: Array<{
    label: string;
    value: string;
    _id: string;
  }>;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
  // optional numeric bounds for scale-type questions
  min?: number;
  max?: number;
  createdBy: string;
  createdAt: string;
  __v?: number;
}

export interface FormQuestion {
  _id?: string;
  // either an ObjectId string or a populated QuestionDetails
  questionId: string | QuestionDetails;
  order?: number;
  required?: boolean;
}

export interface UserBasic {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher_analyst" | "teacher_respondent" | "student";
  city?: string;
  state?: string;
  institution?: string;
}

export interface Form {
  // UI legacy label (optional)
  formTitle?: ReactNode;
  _id: string;
  title: string;
  description?: string;
  // form type according to schema
  type?: "form" | "diary";
  isDiary?: boolean;
  questions: FormQuestion[];
  // assignedUsers may be populated or just IDs
  assignedUsers: string[] | UserBasic[];
  isActive: boolean;
  deleted?: boolean;
  createdBy: UserBasic | string;
  createdAt?: string;
  updatedAt?: string;
  totalResponses?: number;
  totalAssigned?: number;
  hasResponded?: boolean;
  responseId?: string;
  submittedAt?: string;
}

export interface CreateFormPayload {
  title: string;
  description?: string;
  questions: Array<{
    questionId: string;
    order?: number;
    required?: boolean;
  }>;
  assignedUsers?: string[];
  // optional: 'form' | 'diary'
  type?: "form" | "diary";
  isActive?: boolean;
}

export interface UpdateFormPayload {
  title?: string;
  description?: string;
  questions?: Array<{
    questionId: string;
    order?: number;
    required?: boolean;
  }>;
  assignedUsers?: string[];
  type?: "form" | "diary";
  isActive?: boolean;
}

export interface ActiveFormResponse {
  error: string | null;
  msg: string;
  data: Form[];
}

export async function getActiveForm(): Promise<ActiveFormResponse> {
  try {
    const response = await api.get<ActiveFormResponse>("/forms/active");
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return {
        error: error.response.data.error || "Erro ao buscar formulários",
        msg: error.response.data.msg || "",
        data: [],
      };
    }
    return {
      error: "Erro ao buscar formulários",
      msg: "",
      data: [],
    };
  }
}
export async function createForm(payload: CreateFormPayload): Promise<Form> {
  const response = await api.post<{ data?: Form } | Form>("/forms", payload);
  // @ts-ignore
  return response.data?.data || response.data;
}

/**
 * Obtém todos os formulários (ADMIN)
 * @returns Lista de formulários com dados completos
 */
export async function getAllFormsAdmin(): Promise<Form[]> {
  const response = await api.get<{ data?: Form[] } | Form[]>(
    "/forms/admins/all"
  );
  if (Array.isArray(response.data)) {
    return response.data;
  }
  // @ts-ignore
  return response.data?.data || [];
}

/**
 * Obtém todos os formulários (ANALYST)
 * @returns Lista de formulários com dados anonimizados quando necessário
 */
export async function getAllFormsAnalyst(): Promise<Form[]> {
  const response = await api.get<{ data?: Form[] } | Form[]>(
    "/forms/analysts/all"
  );
  if (Array.isArray(response.data)) {
    return response.data;
  }
  // @ts-ignore
  return response.data?.data || [];
}

/**
 * Obtém todos os formulários baseado no role do usuário
 * @param role - Role do usuário ("admin" ou "teacher_analyst")
 * @returns Lista de formulários
 */
export async function getAllForms(role?: string): Promise<Form[]> {
  return role === "admin" || role === undefined
    ? getAllFormsAdmin()
    : getAllFormsAnalyst();
}

/**
 * Obtém um formulário por ID (ADMIN)
 * @param id - ID do formulário
 * @returns Formulário com dados completos
 */
export async function getFormByIdAdmin(id: string): Promise<Form> {
  const response = await api.get<{ data?: Form } | Form>(`/forms/admins/${id}`);
  // @ts-ignore
  return response.data?.data || response.data;
}

/**
 * Obtém um formulário por ID (ANALYST)
 * @param id - ID do formulário
 * @returns Formulário com dados anonimizados quando necessário
 */
export async function getFormByIdAnalyst(id: string): Promise<Form> {
  const response = await api.get<{ data?: Form } | Form>(
    `/forms/analysts/${id}`
  );
  // @ts-ignore
  return response.data?.data || response.data;
}

/**
 * Obtém um formulário por ID baseado no role do usuário
 * @param id - ID do formulário
 * @param role - Role do usuário ("admin" ou "teacher_analyst")
 * @returns Formulário
 */
export async function getFormById(id: string, role?: string): Promise<Form> {
  return role === "admin" || role === undefined
    ? getFormByIdAdmin(id)
    : getFormByIdAnalyst(id);
}

export async function deleteForm(id: string): Promise<void> {
  await api.delete(`/forms/${id}`);
}

export async function updateForm(
  id: string,
  payload: UpdateFormPayload
): Promise<Form> {
  const response = await api.put<{ data?: Form } | Form>(
    `/forms/${id}`,
    payload
  );
  // @ts-ignore
  return response.data?.data || response.data;
}
