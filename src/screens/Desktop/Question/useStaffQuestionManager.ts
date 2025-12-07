import { useEffect, useState } from "react";
import { getUserCookie } from "../../../utils/userCookie";
import { hasPermission, type UserRole } from "../../../utils/permissions";
import { toast } from "sonner";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  updateQuestion,
  Question as BackendQuestion,
  QuestionOption,
} from "../../../services/questionService";
import {
  backendToUIType,
  uiToBackendType,
  UIQuestionType,
  QUESTION_TYPE_ICONS,
  getQuestionTypeLabel,
} from "../../../utils/questionTypes";

interface UIQuestion {
  _id: string;
  title: string;
  description?: string;
  type: UIQuestionType;
  options?: string[];
  required: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt?: string;
  validation?: BackendQuestion["validation"];
}

interface FormState {
  title: string;
  description: string;
  type: UIQuestionType;
  options: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  scaleMin: number;
  scaleMax: number;
}

function deriveScaleRange(options: QuestionOption[] | undefined): {
  min: number;
  max: number;
} {
  const nums = (options || [])
    .map((o) => parseInt(o.value, 10))
    .filter((n) => !isNaN(n));
  if (!nums.length) return { min: 0, max: 10 };
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

function mapBackendToUI(q: BackendQuestion): UIQuestion {
  const uiType = backendToUIType(q.type);
  const { min, max } =
    uiType === "scale" ? deriveScaleRange(q.options) : { min: 0, max: 0 };
  return {
    _id: q._id,
    title: q.title,
    description: q.description,
    type: uiType,
    options: q.options?.map((o) => o.label) || undefined,
    required: !!q.validation?.required,
    createdBy: q.createdBy || {
      _id: "",
      name: "Desconhecido",
      email: "",
      role: "",
    },
    createdAt: q.createdAt,
    validation: q.validation,
  };
}

function buildOptions(optionsText: string): QuestionOption[] | undefined {
  const lines = optionsText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return undefined;
  return lines.map((l) => ({
    label: l,
    value: l,
  }));
}

export function useStaffQuestionManager() {
  const [questions, setQuestions] = useState<UIQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRequired, setFilterRequired] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<UIQuestion | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const user = getUserCookie();
    if (user?.role) setUserRole(user.role as UserRole);
  }, []);

  const canManage = hasPermission(userRole, "canManageQuestions");
  const canCreate = hasPermission(userRole, "canCreateQuestions");
  const canEdit = hasPermission(userRole, "canEditQuestions");
  const canDelete = hasPermission(userRole, "canDeleteQuestions");

  const currentUser = getUserCookie();
  const isAnalyst = currentUser?.role === "teacher_analyst";

  const [currentQuestion, setCurrentQuestion] = useState<UIQuestion | null>(
    null
  );
  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    type: "text",
    options: "",
    required: true,
    minLength: undefined,
    maxLength: undefined,
    pattern: "",
    scaleMin: 0,
    scaleMax: 10,
  });

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllQuestions();
      setQuestions(Array.isArray(data) ? data.map(mapBackendToUI) : []);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar questões");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || q.type === filterType;
    const matchesRequired =
      filterRequired === "all" ||
      (filterRequired === "required" && q.required) ||
      (filterRequired === "optional" && !q.required);
    return matchesSearch && matchesType && matchesRequired;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "text",
      options: "",
      required: true,
      minLength: undefined,
      maxLength: undefined,
      pattern: "",
      scaleMin: 0,
      scaleMax: 10,
    });
    setCurrentQuestion(null);
  };

  async function handleCreate() {
    try {
      const validation: any = { required: formData.required };
      if (formData.type === "text") {
        if (formData.minLength) validation.minLength = formData.minLength;
        if (formData.maxLength) validation.maxLength = formData.maxLength;
        if (formData.pattern) validation.pattern = formData.pattern;
      }
      let options: QuestionOption[] | undefined;
      if (
        formData.type === "multiple_choice" ||
        formData.type === "checkbox" ||
        formData.type === "dropdown"
      ) {
        options = buildOptions(formData.options);
      } else if (formData.type === "scale") {
        const { scaleMin, scaleMax } = formData;
        options = [];
        for (let i = scaleMin; i <= scaleMax; i++) {
          options.push({ label: String(i), value: String(i) });
        }
      }
      const created = await createQuestion({
        title: formData.title,
        description: formData.description || undefined,
        type: uiToBackendType(formData.type),
        options,
        validation,
      });
      setQuestions((prev) => [mapBackendToUI(created), ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao criar questão");
    }
  }

  async function handleUpdate() {
    if (!currentQuestion) return;
    try {
      const validation: any = { required: formData.required };
      if (formData.type === "text") {
        if (formData.minLength) validation.minLength = formData.minLength;
        if (formData.maxLength) validation.maxLength = formData.maxLength;
        if (formData.pattern) validation.pattern = formData.pattern;
      }
      let options: QuestionOption[] | undefined;
      if (
        formData.type === "multiple_choice" ||
        formData.type === "checkbox" ||
        formData.type === "dropdown"
      ) {
        options = buildOptions(formData.options);
      } else if (formData.type === "scale") {
        const { scaleMin, scaleMax } = formData;
        options = [];
        for (let i = scaleMin; i <= scaleMax; i++) {
          options.push({ label: String(i), value: String(i) });
        }
      }
      const updated = await updateQuestion(currentQuestion._id, {
        title: formData.title,
        description: formData.description || undefined,
        type: uiToBackendType(formData.type),
        options,
        validation,
      });
      const updatedUI = mapBackendToUI(updated);
      if (
        !updatedUI.createdBy.name ||
        updatedUI.createdBy.name === "Desconhecido"
      ) {
        updatedUI.createdBy = currentQuestion.createdBy;
      }
      if (!updatedUI.description && formData.description) {
        updatedUI.description = formData.description;
      }
      setQuestions((prev) =>
        prev.map((q) => (q._id === updated._id ? updatedUI : q))
      );
      setIsEditDialogOpen(false);
      resetForm();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao atualizar questão");
    }
  }

  async function handleDelete(id: string) {
    const question = questions.find((q) => q._id === id);
    if (!question) return;
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!questionToDelete) return;
    setDeleting(true);
    try {
      await deleteQuestion(questionToDelete._id);
      setQuestions((prev) =>
        prev.filter((q) => q._id !== questionToDelete._id)
      );
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
    } catch (e: any) {
      setError(e?.message || "Erro ao excluir questão");
    } finally {
      setDeleting(false);
    }
  }

  function handleEdit(q: UIQuestion) {
    let scaleMin = 0;
    let scaleMax = 10;
    if (q.type === "scale" && q.options && q.options.length) {
      const nums = q.options
        .map((o) => parseInt(o, 10))
        .filter((n) => !isNaN(n));
      if (nums.length) {
        scaleMin = Math.min(...nums);
        scaleMax = Math.max(...nums);
      }
    }
    setCurrentQuestion(q);
    setFormData({
      title: q.title,
      description: q.description || "",
      type: q.type,
      options:
        q.type === "multiple_choice" ||
        q.type === "checkbox" ||
        q.type === "dropdown"
          ? q.options?.join("\n") || ""
          : "",
      required: q.required,
      minLength: q.validation?.minLength,
      maxLength: q.validation?.maxLength,
      pattern: q.validation?.pattern || "",
      scaleMin,
      scaleMax,
    });
    setIsEditDialogOpen(true);
  }

  return {
    questions,
    setQuestions,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterRequired,
    setFilterRequired,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    userRole,
    deleteDialogOpen,
    setDeleteDialogOpen,
    questionToDelete,
    setQuestionToDelete,
    deleting,
    setDeleting,
    canManage,
    canCreate,
    canEdit,
    canDelete,
    isAnalyst,
    currentQuestion,
    setCurrentQuestion,
    formData,
    setFormData,
    fetchQuestions,
    filteredQuestions,
    resetForm,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDeleteConfirm,
    handleEdit,
    QUESTION_TYPE_ICONS,
    getQuestionTypeLabel,
  } as const;
}

export default useStaffQuestionManager;
