import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  CheckCircle2,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import ProgressBar from "./components/ProgressBar";
import FormActions from "./components/FormActions";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Checkbox } from "../../../components/ui/checkbox";
import { SimpleDatePicker } from "../../../components/ui/simple-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ErrorState } from "../../../components/ui/error-state";
import type { Screen } from "../../../App";
import { Form, FormQuestion } from "../../../services/formService";
import { useFormWizard } from "./useFormWizard";
import FormHeader from "./components/FormHeader";
import FormList from "./components/FormList";
import QuestionRenderer from "./components/QuestionRenderer";
import ReviewStep from "./components/ReviewStep";
import SubmissionStatus from "./components/SubmissionStatus";
import { UserBackgroundLayout } from "../../../layout/UserBackgroundLayout";

interface FormWizardScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function FormWizardScreen({ onNavigate }: FormWizardScreenProps) {
  const {
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
    getQuestionId,
    getQuestionDetails,
  } = useFormWizard();

  // Loading state
  if (loading) {
    return (
      <UserBackgroundLayout centered>
        <div className="flex items-center justify-center flex-1 p-6">
          <div className="text-center">
            <div role="status" aria-live="polite">
              <Loader2
                className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4"
                aria-hidden
              />
              <p className="text-gray-600">Carregando formulário...</p>
            </div>
          </div>
        </div>
      </UserBackgroundLayout>
    );
  }

  // Submission success state
  if (submissionSuccess) {
    const remainingForms = availableForms;
    return (
      <UserBackgroundLayout centered>
        <SubmissionStatus
          submissionSuccess={submissionSuccess}
          remainingForms={remainingForms}
          form={form}
          onMoreForms={() => {
            setSubmissionSuccess(false);
            if (remainingForms.length === 1) {
              selectForm(0);
              setAvailableForms(remainingForms);
            } else {
              setShowFormList(true);
              setAvailableForms(remainingForms);
              setForm(null);
              setSelectedFormIndex(null);
            }
          }}
          onBackHome={() => onNavigate("home")}
        />
      </UserBackgroundLayout>
    );
  }

  // All forms answered state
  if (allFormsAnswered) {
    return (
      <UserBackgroundLayout centered>
        <div className="flex flex-col items-center justify-center flex-1 p-6 space-y-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          <div
            role="status"
            aria-live="polite"
            className="text-center space-y-3"
          >
            <h1 className="text-white text-2xl font-bold">Tudo Respondido!</h1>
            <p className="text-white text-sm">
              Você já respondeu todos os formulários ativos disponíveis.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => onNavigate("home")}
            className="w-full max-w-sm h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold rounded-2xl shadow-lg cursor-pointer"
          >
            Voltar para Home
          </Button>
        </div>
      </UserBackgroundLayout>
    );
  }

  // Form selection screen (multiple forms available)
  if (showFormList && availableForms.length > 0) {
    return (
      <UserBackgroundLayout>
        <div className="p-6 bg-gradient-to-br from-indigo-500 mt-2 rounded-md to-indigo-600 text-white shadow-lg mx-4">
          <div className="flex items-center gap-4 ">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Voltar para Home"
            >
              <ArrowLeft className="w-6 h-6 text-white" aria-hidden />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-xl font-bold">
                Formulários Disponíveis
              </h1>
              <p className="text-sm text-indigo-100">
                Selecione um formulário para responder
              </p>
            </div>
          </div>
        </div>
        <FormList forms={availableForms as any} onSelect={selectForm} />
      </UserBackgroundLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <UserBackgroundLayout centered>
        <div className="flex items-center justify-center flex-1 bg-gray-50 p-6">
          <ErrorState message={error} onRetry={fetchActiveForms} />
        </div>
      </UserBackgroundLayout>
    );
  }

  // No form available
  if (!form || !form.questions || form.questions.length === 0) {
    return (
      <UserBackgroundLayout centered>
        <div className="flex items-center justify-center flex-1 bg-gray-50 p-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Nenhum formulário ativo disponível no momento.
            </p>
            <Button onClick={() => onNavigate("home")} variant="outline">
              Voltar para Home
            </Button>
          </div>
        </div>
      </UserBackgroundLayout>
    );
  }

  return (
    <UserBackgroundLayout>
      <main aria-labelledby="form-heading">
        <div className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg rounded-md mt-2 mx-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={prevStep}
              className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-6 h-6 text-white" aria-hidden />
            </button>
            <div className="flex-1">
              <h1 id="form-heading" className="text-white">
                {form?.title || "Formulário"}
              </h1>
              <p className="text-sm text-indigo-100">
                {isReviewStep
                  ? "Revisão Final"
                  : `Questão ${currentStep + 1} de ${totalSteps - 1}`}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar total={totalSteps} current={currentStep} />
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-md p-6">
            {isReviewStep ? (
              <ReviewStep
                form={form}
                answers={answers}
                onEditQuestion={goToQuestion}
              />
            ) : (
              currentQuestion && (
                <QuestionRenderer
                  question={currentQuestion}
                  value={answers[getQuestionId(currentQuestion)]}
                  onChange={(value) =>
                    handleAnswerChange(getQuestionId(currentQuestion), value)
                  }
                />
              )
            )}
          </div>
        </div>
        <div className="p-6 space-y-3 pb-30">
          <FormActions
            onNext={nextStep}
            onBack={() => {
              // Se houver mais de um formulário disponível, voltar para tela intermediária
              if (availableForms.length > 1) {
                setForm(null);
                setSelectedFormIndex(null);
                setShowFormList(true);
                setAnswers({});
                setCurrentStep(0);
              } else {
                prevStep();
              }
            }}
            submitting={submitting}
            isReviewStep={isReviewStep}
            currentStep={currentStep}
            totalSteps={totalSteps}
            draftStatus={draftStatus}
            draftSavedAt={draftSavedAt}
          />
        </div>
      </main>
    </UserBackgroundLayout>
  );
}
