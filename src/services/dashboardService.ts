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
   * Exporta dados do formulário em formato tabular
   * @param formId - ID do formulário
   * @returns Dados formatados para exportação CSV/Excel
   */
  async exportFormData(formId: string): Promise<ExportDataResponse> {
    const response = await api.get(`/dashboards/export/${formId}`);
    return response.data;
  },

  /**
   * Obtém todas as respostas brutas do formulário
   * @param formId - ID do formulário
   * @returns Todas as respostas sem processamento estatístico
   */
  async getAllResponses(formId: string): Promise<AllResponsesResponse> {
    const response = await api.get(`/dashboards/${formId}`);
    return response.data;
  },
};

export default dashboardService;
