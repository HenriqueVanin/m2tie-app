import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getActiveForm,
  Form,
  FormQuestion,
} from "../../../services/formService";
import {
  submitResponse,
  saveDraft,
  getDraft,
  deleteDraft,
} from "../../../services/responseService";
import { canRespondToDiary } from "../../../services/responseService";
import { useNavigate } from "react-router-dom";

export interface UseFormWizardReturn {
  availableForms: Form[];
  selectedFormIndex: number | null;
  form: Form | null;
  loading: boolean;
  error: string | null;
  allFormsAnswered: boolean;
  currentStep: number;
  totalSteps: number;
  answers: Record<string, any>;
  submitting: boolean;
  submissionSuccess: boolean;
  showFormList: boolean;
  hasVisitedReview: boolean;
  isReviewStep: boolean;
  currentQuestion: FormQuestion | null;
  fetchActiveForms: () => Promise<void>;
  selectForm: (index: number) => void;
  handleAnswerChange: (questionId: string, value: any) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  goToQuestion: (questionIndex: number) => void;
  areRequiredQuestionsAnswered: (
    frm: Form | null,
    ans: Record<string, any>
  ) => boolean;
  handleSubmit: () => Promise<void>;
  // Expose some setters for UI interactions that the component may use
  setSubmissionSuccess: (v: boolean) => void;
  setAvailableForms: (f: Form[]) => void;
  setForm: (f: Form | null) => void;
  setSelectedFormIndex: (i: number | null) => void;
  setShowFormList: (v: boolean) => void;
  setAnswers: (a: Record<string, any>) => void;
  setCurrentStep: (s: number) => void;
  draftStatus?: "idle" | "saving" | "saved" | "error";
  draftSavedAt?: string | null;
}

export function useFormWizard(): UseFormWizardReturn {
  const [availableForms, setAvailableForms] = useState<Form[]>([]);
  const [selectedFormIndex, setSelectedFormIndex] = useState<number | null>(
    null
  );
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allFormsAnswered, setAllFormsAnswered] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [showFormList, setShowFormList] = useState(false);
  const [hasVisitedReview, setHasVisitedReview] = useState(false);
  const [draftStatus, setDraftStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchActiveForms();
  }, []);

  // Load draft when a form is selected/opened
  useEffect(() => {
    let mounted = true;
    const loadDraft = async () => {
      if (!form) return;
      try {
        const res = await getDraft(form._id);
        if (res && !res.error && res.data && mounted) {
          const draft = res.data;
          // Convert draft.answers (array) into answers object
          const draftAnswers: Record<string, any> = {};
          if (Array.isArray(draft.answers)) {
            for (const a of draft.answers) {
              // questionId may be populated object or id string
              const qid =
                typeof a.questionId === "string"
                  ? a.questionId
                  : a.questionId &&
                    typeof a.questionId === "object" &&
                    "_id" in a.questionId
                  ? (a.questionId as { _id: string })._id
                  : null;
              if (qid) draftAnswers[qid] = a.answer;
            }
          }
          // Merge draft answers into current answers, prefer draft values
          if (Object.keys(draftAnswers).length > 0) {
            setAnswers((prev) => ({ ...prev, ...draftAnswers }));
          }
        }
      } catch (e: any) {
        // Silently ignore draft load errors for now
        console.warn("Erro ao carregar rascunho:", e?.message || e);
      }
    };

    loadDraft();

    return () => {
      mounted = false;
    };
  }, [form]);

  useEffect(() => {
    if (isReviewStep) setHasVisitedReview(true);
  }, [currentStep]);

  const totalSteps = (form?.questions?.length || 0) + 1;
  const isReviewStep = currentStep === (form?.questions?.length || 0);
  const currentQuestion = isReviewStep
    ? null
    : form?.questions?.[currentStep] || null;

  const fetchActiveForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActiveForm();

      if (
        response.msg ===
          "Nenhum formulário ativo encontrado para este usuário" ||
        !response.data ||
        (Array.isArray(response.data) && response.data.length === 0)
      ) {
        setAllFormsAnswered(true);
        return;
      }

      if (response.error) {
        setError(response.error);
        return;
      }

      const rawForms = Array.isArray(response.data)
        ? response.data
        : [response.data];

      const unrespondedActiveForms = rawForms.filter(
        (f) => f && f.isActive === true && f.hasResponded !== true
      );

      if (unrespondedActiveForms.length === 0) {
        setAvailableForms([]);
        setAllFormsAnswered(true);
        return;
      }

      setAvailableForms(unrespondedActiveForms);

      if (unrespondedActiveForms.length === 1) {
        setForm(unrespondedActiveForms[0]);
        setSelectedFormIndex(0);
      } else {
        setShowFormList(true);
      }
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar formulários");
    } finally {
      setLoading(false);
    }
  };

  const selectForm = (index: number) => {
    const candidate = availableForms[index];
    // If the form is a diary, verify the user can respond today
    (async () => {
      try {
        if (candidate && (candidate.type === "diary" || candidate.isDiary)) {
          const res = await canRespondToDiary(candidate._id);
          if (res && !res.error && res.data && res.data.canRespond === false) {
            toast.error(
              "Você já respondeu ao diário hoje. Tente novamente amanhã."
            );
            return;
          }
        }
        setForm(candidate);
        setSelectedFormIndex(index);
        setShowFormList(false);
        setAnswers({});
        setCurrentStep(0);
      } catch (e: any) {
        // If diary check fails, block selection and notify
        toast.error(e?.message || "Não foi possível abrir o formulário");
      }
    })();
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const nextStep = async () => {
    if (!form) return;

    const total = (form?.questions?.length || 0) + 1;

    if (currentStep === total - 1) {
      await handleSubmit();
      return;
    }

    const currentQuestion = form.questions?.[currentStep];
    if (currentQuestion) {
      const questionId =
        typeof currentQuestion.questionId === "string"
          ? currentQuestion.questionId
          : currentQuestion.questionId._id;
      if (currentQuestion.required && !answers[questionId]) {
        toast.error("Esta questão é obrigatória");
        return;
      }
    }

    if (currentStep < total - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep === 0) {
      if (availableForms.length <= 1) navigate("/home");
      if (availableForms.length > 1) {
        setShowFormList(true);
        setForm(null);
        setSelectedFormIndex(null);
        setAnswers({});
        setCurrentStep(0);
        return;
      }
    }
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToQuestion = (questionIndex: number) => setCurrentStep(questionIndex);

  const areRequiredQuestionsAnswered = (
    _frm: Form | null,
    _ans: Record<string, any>
  ) => {
    return hasVisitedReview === true;
  };

  const handleSubmit = async () => {
    if (!form) return;

    try {
      setSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );

      const response = await submitResponse({
        formId: form._id,
        answers: formattedAnswers,
      });

      if (response.error) {
        if (
          response.error === "Você já respondeu este formulário" ||
          response.msg === "Formulário já respondido"
        ) {
          const updatedForms = availableForms.filter(
            (_, idx) => idx !== selectedFormIndex
          );
          setAvailableForms(updatedForms);

          if (updatedForms.length === 0) {
            setAllFormsAnswered(true);
            setSubmissionSuccess(false);
            return;
          }

          setShowFormList(true);
          setForm(null);
          setSelectedFormIndex(null);
          setAnswers({});
          setCurrentStep(0);
          return;
        }
        throw new Error(response.error);
      }

      const updatedForms = availableForms.filter(
        (_, idx) => idx !== selectedFormIndex
      );
      setAvailableForms(updatedForms);
      // Remove any saved draft for this form after successful submission
      try {
        await deleteDraft(form._id);
      } catch (e) {
        // ignore delete errors
      }
      setSubmissionSuccess(true);
    } catch (e: any) {
      toast.error(e?.message || "Erro ao enviar formulário");
    } finally {
      setSubmitting(false);
    }
  };

  // Autosave drafts (debounced) when answers change
  useEffect(() => {
    if (!form) return;
    // Do not save during submit
    if (submitting) return;

    const handler = setTimeout(async () => {
      try {
        const formattedAnswers = Object.entries(answers).map(
          ([questionId, answer]) => ({ questionId, answer })
        );
        // Only save if there is at least one answer
        if (formattedAnswers.length > 0) {
          setDraftStatus("saving");
          const res = await saveDraft(form._id, formattedAnswers);
          if (res && !res.error) {
            setDraftStatus("saved");
            setDraftSavedAt(new Date().toISOString());
          } else {
            setDraftStatus("error");
          }
        }
      } catch (e: any) {
        console.warn("Erro ao salvar rascunho:", e?.message || e);
        setDraftStatus("error");
      }
    }, 800);

    return () => clearTimeout(handler);
  }, [answers, form, submitting]);

  return {
    availableForms,
    selectedFormIndex,
    form,
    loading,
    error,
    allFormsAnswered,
    currentStep,
    totalSteps,
    answers,
    submitting,
    submissionSuccess,
    showFormList,
    hasVisitedReview,
    isReviewStep,
    currentQuestion,
    fetchActiveForms,
    selectForm,
    handleAnswerChange,
    nextStep,
    prevStep,
    goToQuestion,
    areRequiredQuestionsAnswered,
    handleSubmit,
    setSubmissionSuccess,
    setAvailableForms,
    setForm,
    setSelectedFormIndex,
    setShowFormList,
    setAnswers,
    setCurrentStep,
    draftStatus,
    draftSavedAt,
  };
}

export default useFormWizard;
