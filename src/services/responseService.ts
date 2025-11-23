// /src/services/responseService.ts
import api from "./api";

// Types
export interface Answer {
  questionId: string;
  // Accept common answer shapes: single string, multiple choices, numeric scales, dates or null
  answer: string | string[] | number | Date | null;
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
    // form type from schema ('form' | 'diary')
    type: "form" | "diary";
    // convenience flag consumers may use
    isDiary?: boolean;
    createdAt?: string;
  };
  userId: {
    _id?: string; // pode não existir quando usuário foi deletado
    name: string;
    email: string;
    anonymous?: boolean;
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
      // optional metadata for scale/text questions
      min?: number;
      max?: number;
      required?: boolean;
    };
    answer: string | string[] | number | Date | null;
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

export interface DraftData {
  _id: string;
  formId: string | { _id: string; title?: string; type?: "form" | "diary" };
  userId: string | { _id?: string; name?: string; email?: string };
  answers: { questionId: string; answer: any }[];
  isDraft: boolean;
  // server-provided timestamp when draft was last modified
  lastModified?: string;
  updatedAt?: string;
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

/**
 * Salva ou atualiza um rascunho (POST /responses/draft)
 */
export const saveDraft = async (
  formId: string,
  answers: Answer[] = []
): Promise<ApiResponse<DraftData>> => {
  try {
    const response = await api.post("/responses/draft", { formId, answers });
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao salvar rascunho") };
  }
};

/**
 * Recupera rascunho do usuário para um formulário (GET /responses/draft/:formId)
 */
export const getDraft = async (
  formId: string
): Promise<ApiResponse<DraftData | null>> => {
  try {
    const response = await api.get(`/responses/draft/${formId}`);
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao recuperar rascunho") };
  }
};

/**
 * Deleta (soft-delete) o rascunho do usuário para um formulário (DELETE /responses/draft/:formId)
 */
export const deleteDraft = async (
  formId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/responses/draft/${formId}`);
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao deletar rascunho") };
  }
};

/**
 * Obtém todas as respostas (ADMIN)
 * @returns Lista de respostas com dados completos
 */
export const getAllResponsesAdmin = async (): Promise<
  ApiResponse<ResponseData[]>
> => {
  try {
    const response = await api.get("/responses/admins/all");
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao buscar respostas") };
  }
};

/**
 * Obtém todas as respostas (ANALYST)
 * @returns Lista de respostas com anonimização quando necessário
 */
export const getAllResponsesAnalyst = async (): Promise<
  ApiResponse<ResponseData[]>
> => {
  try {
    const response = await api.get("/responses/analysts/all");
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao buscar respostas") };
  }
};

/**
 * Obtém todas as respostas baseado no role do usuário
 * @param role - Role do usuário ("admin" ou "teacher_analyst")
 * @returns Lista de respostas
 */
export const getAllResponses = async (
  role?: string
): Promise<ApiResponse<ResponseData[]>> => {
  return role === "admin" || role === undefined
    ? getAllResponsesAdmin()
    : getAllResponsesAnalyst();
};

/**
 * Obtém uma resposta por ID (ADMIN)
 * @param id - ID da resposta
 * @returns Resposta com dados completos
 */
export const getResponseByIdAdmin = async (
  id: string
): Promise<ApiResponse<ResponseData>> => {
  try {
    const response = await api.get(`/responses/admins/${id}`);
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao buscar resposta") };
  }
};

/**
 * Obtém uma resposta por ID (ANALYST)
 * @param id - ID da resposta
 * @returns Resposta com anonimização quando necessário
 */
export const getResponseByIdAnalyst = async (
  id: string
): Promise<ApiResponse<ResponseData>> => {
  try {
    const response = await api.get(`/responses/analysts/${id}`);
    return response.data;
  } catch (error: any) {
    return { error: extractError(error, "Erro ao buscar resposta") };
  }
};

/**
 * Obtém uma resposta por ID baseado no role do usuário
 * @param id - ID da resposta
 * @param role - Role do usuário ("admin" ou "teacher_analyst")
 * @returns Resposta
 */
export const getResponseById = async (
  id: string,
  role?: string
): Promise<ApiResponse<ResponseData>> => {
  return role === "admin" || role === undefined
    ? getResponseByIdAdmin(id)
    : getResponseByIdAnalyst(id);
};

/**
 * Deleta uma resposta por ID (apenas ADMIN)
 * @param id - ID da resposta
 * @returns Confirmação da deleção
 */
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

/**
 * Obtém respondentes de um formulário (ADMIN)
 * @param formId - ID do formulário
 * @returns Lista de respondentes com dados completos
 */
export const getFormRespondentsAdmin = async (
  formId: string
): Promise<GetFormRespondentsResponse> => {
  try {
    const response = await api.get(`/responses/admins/${formId}/respondents`);
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

/**
 * Obtém respondentes de um formulário (ANALYST)
 * @param formId - ID do formulário
 * @returns Lista de respondentes com anonimização quando necessário
 */
export const getFormRespondentsAnalyst = async (
  formId: string
): Promise<GetFormRespondentsResponse> => {
  try {
    const response = await api.get(`/responses/analysts/${formId}/respondents`);
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

/**
 * Obtém respondentes de um formulário baseado no role do usuário
 * @param formId - ID do formulário
 * @param role - Role do usuário ("admin" ou "teacher_analyst")
 * @returns Lista de respondentes
 */
export const getFormRespondents = async (
  formId: string,
  role?: string
): Promise<GetFormRespondentsResponse> => {
  return role === "admin" || role === undefined
    ? getFormRespondentsAdmin(formId)
    : getFormRespondentsAnalyst(formId);
};

/**
 * Verifica se o usuário pode responder ao diário hoje
 * GET /responses/diary/:formId/can-respond
 */
export const canRespondToDiary = async (
  formId: string
): Promise<ApiResponse<{ canRespond: boolean }>> => {
  try {
    const response = await api.get(`/responses/diary/${formId}/can-respond`);
    return response.data;
  } catch (error: any) {
    return {
      error: extractError(
        error,
        "Erro ao verificar se o usuário pode responder o diário hoje"
      ),
    };
  }
};
