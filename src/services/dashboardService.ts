import api from "./api";

// Types
export interface QuestionAnalysis {
  questionId: string;
  title: string;
  type: "text" | "multiple_choice" | "checkbox" | "dropdown" | "scale" | "date";
  average?: string;
  min?: number;
  max?: number;
  distribution?: Record<string, number>;
  sampleAnswers?: string[];
  range?: {
    earliest: string;
    latest: string;
  } | null;
  totalAnswers: number;
}

export interface FullAnalysisResponse {
  formTitle: string;
  totalResponses: number;
  questionsAnalysis: QuestionAnalysis[];
}

export interface SingleQuestionAnalysisResponse {
  question: string;
  questionType:
    | "text"
    | "multiple_choice"
    | "checkbox"
    | "dropdown"
    | "scale"
    | "date";
  analysis: {
    type: string;
    average?: string;
    min?: number;
    max?: number;
    distribution?: Record<string, number>;
    answers?: string[];
    earliest?: string;
    latest?: string;
    totalAnswers: number;
  };
}

export interface ExportDataResponse {
  formTitle: string;
  totalResponses: number;
  data: Array<Record<string, any>>;
}

export interface RawResponse {
  _id: string;
  formId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  answers: Array<{
    questionId: string;
    answer: string | string[];
  }>;
  submittedAt: string;
}

export interface AllResponsesResponse {
  error: null;
  message: string;
  form: string;
  totalResponses: number;
  responses: RawResponse[];
}

// Dashboard Service
export const dashboardService = {
  /**
   * Obtém análise de uma questão específica do formulário
   * @param formId - ID do formulário
   * @param questionId - ID da questão
   * @returns Análise detalhada da questão
   */
  async getQuestionAnalysis(
    formId: string,
    questionId: string
  ): Promise<SingleQuestionAnalysisResponse> {
    const response = await api.get(
      `/dashboards/analysis/${formId}/${questionId}`
    );
    return response.data;
  },

  /**
   * Obtém análise completa de todas as questões do formulário
   * @param formId - ID do formulário
   * @returns Análise estatística de todas as questões
   */
  async getFullAnalysis(formId: string): Promise<FullAnalysisResponse> {
    const response = await api.get(`/dashboards/full-analysis/${formId}`);
    return response.data;
  },

  /**
   * Exporta dados do formulário em formato tabular (ADMIN)
   * @param formId - ID do formulário
   * @returns Dados formatados para exportação CSV/Excel
   */
  async exportFormDataAdmin(formId: string): Promise<ExportDataResponse> {
    const response = await api.get(`/dashboards/admins/export/${formId}`);
    return response.data;
  },

  /**
   * Exporta dados do formulário em formato tabular (ANALYST)
   * @param formId - ID do formulário
   * @returns Dados formatados para exportação CSV/Excel (com anonimização)
   */
  async exportFormDataAnalyst(formId: string): Promise<ExportDataResponse> {
    const response = await api.get(`/dashboards/analysts/export/${formId}`);
    return response.data;
  },

  /**
   * Obtém todas as respostas brutas do formulário (ADMIN)
   * @param formId - ID do formulário
   * @returns Todas as respostas sem processamento estatístico
   */
  async getAllResponsesAdmin(formId: string): Promise<AllResponsesResponse> {
    const response = await api.get(`/dashboards/admins/${formId}`);
    return response.data;
  },

  /**
   * Obtém todas as respostas brutas do formulário (ANALYST)
   * @param formId - ID do formulário
   * @returns Todas as respostas sem processamento estatístico (com anonimização)
   */
  async getAllResponsesAnalyst(formId: string): Promise<AllResponsesResponse> {
    const response = await api.get(`/dashboards/analysts/${formId}`);
    return response.data;
  },

  /**
   * Exporta dados do formulário baseado no role do usuário
   * @param formId - ID do formulário
   * @param role - Role do usuário ("admin" ou "teacher_analyst")
   * @returns Dados formatados para exportação
   */
  async exportFormData(
    formId: string,
    role: string
  ): Promise<ExportDataResponse> {
    return role === "admin"
      ? this.exportFormDataAdmin(formId)
      : this.exportFormDataAnalyst(formId);
  },

  /**
   * Obtém todas as respostas brutas baseado no role do usuário
   * @param formId - ID do formulário
   * @param role - Role do usuário ("admin" ou "teacher_analyst")
   * @returns Todas as respostas sem processamento
   */
  async getAllResponses(
    formId: string,
    role: string
  ): Promise<AllResponsesResponse> {
    return role === "admin"
      ? this.getAllResponsesAdmin(formId)
      : this.getAllResponsesAnalyst(formId);
  },
};

export default dashboardService;
