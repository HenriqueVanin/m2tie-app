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
    _id: string;
    name: string;
    email: string;
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

// Submit a form response
export const submitResponse = async (
  data: SubmitResponseRequest
): Promise<ApiResponse<ResponseData>> => {
  try {
    const response = await api.post("/responses", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return {
        error: error.response.data.error || "Erro ao enviar resposta",
        data: undefined,
      };
    }
    return {
      error: "Erro ao enviar resposta",
      data: undefined,
    };
  }
};

// Get all responses (admin/staff only)
export const getAllResponses = async (): Promise<
  ApiResponse<ResponseData[]>
> => {
  try {
    const response = await api.get("/responses/all");
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return {
        error: error.response.data.error || "Erro ao buscar respostas",
        data: undefined,
      };
    }
    return {
      error: "Erro ao buscar respostas",
      data: undefined,
    };
  }
};

// Get response by ID (admin/staff only)
export const getResponseById = async (
  id: string
): Promise<ApiResponse<ResponseData>> => {
  try {
    const response = await api.get(`/responses/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return {
        error: error.response.data.error || "Erro ao buscar resposta",
        data: undefined,
      };
    }
    return {
      error: "Erro ao buscar resposta",
      data: undefined,
    };
  }
};
