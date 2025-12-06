import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { getUserCookie } from "../../../utils/userCookie";
import { hasPermission, type UserRole } from "../../../utils/permissions";
import {
  createQuestion,
  updateQuestion as updateQuestionAPI,
  QuestionOption,
  getAllQuestions,
  type Question as QuestionFromService,
} from "../../../services/questionService";
import {
  createForm,
  updateForm,
  getFormById,
  type Form,
} from "../../../services/formService";
import type { UIQuestionType } from "../../../utils/questionTypes";

interface Question {
  id: string;
  type: UIQuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: any[];
}

export default function useStaffFormBuilder(
  navigateFn?: (path: string) => void
) {
  const [searchParams] = useSearchParams();
  const formIdFromUrl = searchParams.get("formId");

  const [formId, setFormId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("Novo Formulário");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showExistingQuestionsModal, setShowExistingQuestionsModal] =
    useState(false);
  const [existingQuestions, setExistingQuestions] = useState<
    QuestionFromService[]
  >([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<UIQuestionType | "all">("all");
  const [userRole, setUserRole] = useState<UserRole>("student");

  useEffect(() => {
    const user = getUserCookie();
    if (user?.role) setUserRole(user.role as UserRole);
  }, []);

  const canManage = hasPermission(userRole, "canManageForms");
  const canCreate = hasPermission(userRole, "canCreateForms");
  const canEdit = hasPermission(userRole, "canEditForms");

  // Load form when URL param changes
  useEffect(() => {
    if (formIdFromUrl && formIdFromUrl !== formId) {
      loadForm(formIdFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formIdFromUrl]);

  const loadExistingQuestions = async () => {
    try {
      setIsLoadingQuestions(true);
      const allQuestions = await getAllQuestions();
      setExistingQuestions(allQuestions);
      setShowExistingQuestionsModal(true);
    } catch (e: any) {
      toast.error(e?.message || "Erro ao carregar questões");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const addExistingQuestion = (existingQ: QuestionFromService) => {
    const newQuestion: Question = {
      id: existingQ._id,
      type: existingQ.type as UIQuestionType,
      title: existingQ.title,
      required: existingQ.validation?.required || false,
      options: existingQ.options?.map((o) => o.label),
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setShowExistingQuestionsModal(false);
  };

  const filteredQuestions = existingQuestions.filter((q) => {
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || q.type === filterType;
    return matchesSearch && matchesType;
  });

  const addQuestion = (type: UIQuestionType) => {
    const options: string[] | undefined =
      type === "multiple_choice" || type === "checkbox" || type === "dropdown"
        ? ["Opção 1", "Opção 2"]
        : type === "scale"
        ? Array.from({ length: 11 }, (_, i) => String(i))
        : undefined;

    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      type,
      title: "Nova Pergunta",
      required: false,
      options,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setSelectedQuestion(newQuestion.id);
  };

  const moveQuestion = (dragIndex: number, hoverIndex: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      const [draggedItem] = newQuestions.splice(dragIndex, 1);
      newQuestions.splice(hoverIndex, 0, draggedItem);
      return newQuestions;
    });
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (selectedQuestion === id) {
      setSelectedQuestion(null);
    }
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const saveQuestion = async (question: Question) => {
    if (question.id.startsWith("temp-")) {
      const options: QuestionOption[] | undefined =
        question.type === "multiple_choice" ||
        question.type === "checkbox" ||
        question.type === "dropdown"
          ? question.options?.map((label, i) => ({
              label,
              value: label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
            }))
          : question.type === "scale"
          ? question.options?.map((label) => ({ label, value: label }))
          : undefined;

      const created = await createQuestion({
        title: question.title,
        type: question.type,
        options,
        validation: { required: question.required },
      });

      setQuestions((prev) =>
        prev.map((q) => (q.id === question.id ? { ...q, id: created._id } : q))
      );
      setSelectedQuestion(null);
    } else {
      const options: QuestionOption[] | undefined =
        question.type === "multiple_choice" ||
        question.type === "checkbox" ||
        question.type === "dropdown"
          ? question.options?.map((label, i) => ({
              label,
              value: label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
            }))
          : question.type === "scale"
          ? question.options?.map((label) => ({ label, value: label }))
          : undefined;

      await updateQuestionAPI(question.id, {
        title: question.title,
        type: question.type,
        options,
        validation: { required: question.required },
      });
      setSelectedQuestion(null);
    }
  };

  const saveForm = async () => {
    try {
      setIsSaving(true);

      if (!formTitle.trim()) {
        toast.error("O título do formulário é obrigatório");
        return;
      }

      if (questions.length === 0) {
        toast.error("Adicione pelo menos uma pergunta ao formulário");
        return;
      }

      const payload = {
        title: formTitle,
        description: formDescription || undefined,
        questions: questions.map((q, index) => ({
          questionId: q.id,
          order: index + 1,
          required: q.required,
        })),
        assignedUsers: [],
        isActive: true,
      } as const;

      let savedForm: Form;
      if (formId) {
        savedForm = await updateForm(formId, payload as any);
        toast.success("Formulário atualizado com sucesso!");
      } else {
        savedForm = await createForm(payload as any);
        setFormId(savedForm._id);
        toast.success("Formulário criado com sucesso!");
        if (navigateFn)
          navigateFn(`/staff/forms/responses/by-form?formId=${savedForm._id}`);
      }
    } catch (e: any) {
      toast.error(e?.message || "Erro ao salvar formulário");
    } finally {
      setIsSaving(false);
    }
  };

  const loadForm = async (id: string) => {
    try {
      setIsLoading(true);
      const user = getUserCookie();
      const userRole = user?.role || "admin";
      const form = await getFormById(id, userRole);

      setFormId(form._id);
      setFormTitle(form.title);
      setFormDescription(form.description || "");

      if (form.questions && form.questions.length > 0) {
        const loadedQuestions: Question[] = form.questions
          .sort((a: any, b: any) => a.order - b.order)
          .map((fq: any) => {
            const questionData = fq.questionId;
            return {
              id: questionData._id,
              type: questionData.type,
              title: questionData.title,
              description: "",
              required: fq.required,
              options: questionData.options?.map((o: any) => o.label),
            };
          });
        setQuestions(loadedQuestions);
      }
    } catch (e: any) {
      console.error("Error loading form:", e);
      toast.error(e?.message || "Erro ao carregar formulário");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedQuestionData =
    questions.find((q) => q.id === selectedQuestion) || null;

  return {
    // state
    formId,
    formTitle,
    formDescription,
    questions,
    selectedQuestion,
    isLoading,
    isSaving,
    showExistingQuestionsModal,
    existingQuestions,
    isLoadingQuestions,
    searchQuery,
    filterType,
    userRole,
    // actions
    setFormTitle,
    setFormDescription,
    setQuestions,
    setSelectedQuestion,
    setIsLoading,
    setIsSaving,
    setShowExistingQuestionsModal,
    setExistingQuestions,
    setIsLoadingQuestions,
    setSearchQuery,
    setFilterType,
    loadExistingQuestions,
    addExistingQuestion,
    filteredQuestions,
    addQuestion,
    moveQuestion,
    deleteQuestion,
    updateQuestion,
    saveQuestion,
    saveForm,
    loadForm,
    selectedQuestionData,
    canManage,
    canCreate,
    canEdit,
  } as const;
}
