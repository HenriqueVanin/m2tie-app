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
  createdBy: string;
  createdAt: string;
  __v?: number;
}

export interface FormQuestion {
  _id: string;
  questionId: QuestionDetails;
  order: number;
  required: boolean;
}

export interface Form {
  formTitle: ReactNode;
  _id: string;
  title: string;
  description: string;
  questions: FormQuestion[];
  isActive: boolean;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFormPayload {
  title: string;
  description?: string;
  questions: Array<{
    questionId: string;
    order?: number;
    required?: boolean;
  }>;
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
  isActive?: boolean;
}

export interface ActiveFormResponse {
  error: string | null;
  msg?: string;
  data?: Form | null;
}

export async function getActiveForm(): Promise<ActiveFormResponse> {
  try {
    const response = await api.get<ActiveFormResponse>("/forms/active");
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return {
        error: error.response.data.error || "Erro ao buscar formulário",
        msg: error.response.data.msg,
        data: null,
      };
    }
    return {
      error: "Erro ao buscar formulário",
      data: null,
    };
  }
}
export async function createForm(payload: CreateFormPayload): Promise<Form> {
  const response = await api.post<{ data?: Form } | Form>("/forms", payload);
  // @ts-ignore
  return response.data?.data || response.data;
}

export async function getAllForms(): Promise<Form[]> {
  const response = await api.get<{ data?: Form[] } | Form[]>("/forms/all");
  // Backend pode retornar wrapper { data, error, msg } ou array direto
  if (Array.isArray(response.data)) {
    return response.data;
  }
  // @ts-ignore
  return response.data?.data || [];
}

export async function getFormById(id: string): Promise<Form> {
  const response = await api.get<{ data?: Form } | Form>(`/forms/${id}`);
  // @ts-ignore
  return response.data?.data || response.data;
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
