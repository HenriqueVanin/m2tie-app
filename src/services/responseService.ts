// /src/services/responseService.ts
import api from "./api";

// Types
export interface Answer {
  questionId: string;
  answer: string | string[] | number;
}

export interface SubmitResponseRequest {
  formId: string;
  answers: Answer[];
}

export interface ResponseData {
  _id: string;
  formId: {
    _id: string;
    title: string;
    description?: string;
  };
  userId: {
    _id?: string; // pode não existir quando usuário foi deletado
    name: string;
    email: string;
    city?: string;
    state?: string;
    institution?: string;
  };
  answers: {
    questionId: {
      _id: string;
      title: string;
      type: string;
      options?: string[];
    };
    answer: string | string[] | number;
    _id: string;
  }[];
  submittedAt: string;
}

export interface ApiResponse<T> {
  error: string | null;
  msg?: string;
  message?: string;
  data?: T;
}

export interface Respondent {
  _id: string | null;
  name: string;
  email: string;
  role: "admin" | "teacher_analyst" | "teacher_respondent" | "student" | "N/A";
  submittedAt: string;
  responseId: string;
}

export interface GetFormRespondentsResponse {
  error: string | null;
  msg?: string;
  formTitle: string;
  formDescription?: string;
  totalRespondents: number;
  respondents: Respondent[];
}

// Helpers
const extractError = (error: any, fallback: string) => {
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.message) return error.response.data.message;
  return fallback;
};

// Submit a form response (POST /responses)
export const submitResponse = async (
  data: SubmitResponseRequest
): Promise<ApiResponse<ResponseData>> => {
  try {
    const response = await api.post("/responses", data);
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao enviar resposta") };
  }
};

// Get all responses (GET /responses/all)
export const getAllResponses = async (): Promise<
  ApiResponse<ResponseData[]>
> => {
  try {
    const response = await api.get("/responses/all");
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao buscar respostas") };
  }
};

// Get response by ID (GET /responses/:id)
export const getResponseById = async (
  id: string
): Promise<ApiResponse<ResponseData>> => {
  try {
    const response = await api.get(`/responses/${id}`);
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao buscar resposta") };
  }
};

// Delete response by ID (DELETE /responses/:id) - faltava integrar
export const deleteResponse = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/responses/${id}`);
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao deletar resposta") };
  }
};

// Get respondents of a form (GET /responses/:formId/respondents)
export const getFormRespondents = async (
  formId: string
): Promise<GetFormRespondentsResponse> => {
  try {
    const response = await api.get(`/responses/${formId}/respondents`);
    return response.data as GetFormRespondentsResponse;
  } catch (error: any) {
    return {
      error: extractError(error, "Erro ao buscar respondentes"),
      formTitle: "",
      formDescription: "",
      totalRespondents: 0,
      respondents: [],
    };
  }
};
