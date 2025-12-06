import {
  ListChecks,
  Type,
  BarChart3,
  Calendar,
  CheckSquare,
  ChevronDown,
} from "lucide-react";

// Backend types: ['text', 'multiple_choice', 'checkbox', 'dropdown', 'scale', 'date']
export type BackendQuestionType =
  | "text"
  | "multiple_choice"
  | "checkbox"
  | "dropdown"
  | "scale"
  | "date";

// UI types: same as backend for simplicity
export type UIQuestionType = BackendQuestionType;

export const QUESTION_TYPE_LABELS_PT: Record<BackendQuestionType, string> = {
  text: "Texto",
  multiple_choice: "Múltipla Escolha",
  checkbox: "Caixas de Seleção",
  dropdown: "Lista Suspensa",
  scale: "Escala Linear",
  date: "Data",
};

export const QUESTION_TYPE_ICONS: Record<BackendQuestionType, any> = {
  text: Type,
  multiple_choice: ListChecks,
  checkbox: CheckSquare,
  dropdown: ChevronDown,
  scale: BarChart3,
  date: Calendar,
};

export interface QuestionTypeDef {
  type: BackendQuestionType;
  label: string;
  icon: any;
}

export const QUESTION_TYPES: QuestionTypeDef[] = [
  { type: "text", label: QUESTION_TYPE_LABELS_PT.text, icon: Type },
  {
    type: "multiple_choice",
    label: QUESTION_TYPE_LABELS_PT.multiple_choice,
    icon: ListChecks,
  },
  {
    type: "checkbox",
    label: QUESTION_TYPE_LABELS_PT.checkbox,
    icon: CheckSquare,
  },
  {
    type: "dropdown",
    label: QUESTION_TYPE_LABELS_PT.dropdown,
    icon: ChevronDown,
  },
  { type: "scale", label: QUESTION_TYPE_LABELS_PT.scale, icon: BarChart3 },
  { type: "date", label: QUESTION_TYPE_LABELS_PT.date, icon: Calendar },
];

// UI and backend types are identical now, just pass through
export function uiToBackendType(t: UIQuestionType): BackendQuestionType {
  return t;
}

export function backendToUIType(t: string): UIQuestionType {
  // Direct mapping
  return t as UIQuestionType;
}

export function getQuestionTypeLabel(type: BackendQuestionType) {
  return QUESTION_TYPE_LABELS_PT[type] || type;
}
