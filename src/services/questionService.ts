// questionService.ts
// Question service using centralized axios instance (api.ts)

import api from "./api";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface QuestionValidation {
  required?: boolean;
  [key: string]: any;
}

export interface Question {
  _id: string;
  title: string;
  description?: string;
  type: string;
  options: QuestionOption[];
  validation: QuestionValidation;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "teacher_analyst" | "teacher_respondent" | "student";
    city?: string;
    state?: string;
    institution?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuestionDto {
  title: string;
  description?: string;
  type: string;
  options?: QuestionOption[];
  validation?: QuestionValidation;
}

export interface UpdateQuestionDto {
  title?: string;
  description?: string;
  type?: string;
  options?: QuestionOption[];
  validation?: QuestionValidation;
}

const RESOURCE = "/questions";

/**
 * Cria uma nova questão (apenas ADMIN)
 * @param body - Dados da questão
 * @returns Questão criada
 */
export async function createQuestion(
  body: CreateQuestionDto
): Promise<Question> {
  const res = await api.post<{ data: Question }>(RESOURCE, body);
  // Backend pode retornar wrapper { error, msg, data }
  // Se data estiver direto, faz fallback
  // @ts-ignore
  return (res.data?.data || res.data) as Question;
}

/**
 * Obtém todas as questões (ADMIN e ANALYST)
 * @returns Lista de questões
 */
export async function getAllQuestions(): Promise<Question[]> {
  const res = await api.get<{ data?: Question[]; msg?: string; error?: any }>(
    `${RESOURCE}/all`
  );
  // Esperado: wrapper com data: []
  if (Array.isArray(res.data)) {
    // Caso o backend retorne diretamente um array
    return res.data as unknown as Question[];
  }
  return res.data.data || [];
}

/**
 * Obtém uma questão por ID (ADMIN e ANALYST)
 * @param id - ID da questão
 * @returns Questão
 */
export async function getQuestion(id: string): Promise<Question> {
  const res = await api.get<{ data: Question }>(`${RESOURCE}/${id}`);
  // @ts-ignore
  return (res.data?.data || res.data) as Question;
}

/**
 * Atualiza uma questão existente (apenas ADMIN)
 * @param id - ID da questão
 * @param body - Dados a atualizar
 * @returns Questão atualizada
 */
export async function updateQuestion(
  id: string,
  body: UpdateQuestionDto
): Promise<Question> {
  const res = await api.put<{ data: Question }>(`${RESOURCE}/${id}`, body);
  // @ts-ignore
  return (res.data?.data || res.data) as Question;
}

/**
 * Deleta uma questão (soft delete - apenas ADMIN)
 * @param id - ID da questão
 */
export async function deleteQuestion(id: string): Promise<void> {
  await api.delete(`${RESOURCE}/${id}`);
}

// Abort-capable fetch (axios supports AbortController signals)
export async function getAllQuestionsWithAbort(
  controller: AbortController
): Promise<Question[]> {
  const res = await api.get<{ data?: Question[] }>(`${RESOURCE}/all`, {
    signal: controller.signal,
  });
  return res.data.data || [];
}

export function createAbortController() {
  return new AbortController();
}
