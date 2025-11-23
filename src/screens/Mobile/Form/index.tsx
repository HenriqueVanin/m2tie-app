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
  } = useFormWizard();

  // Helpers to work with FormQuestion.questionId which may be either a string (id)
  // or a populated QuestionDetails object depending on the API response
  const getQuestionId = (q: FormQuestion) =>
    typeof q.questionId === "string" ? q.questionId : q.questionId._id;

  const getQuestionDetails = (q: FormQuestion) =>
    typeof q.questionId === "string" ? null : q.questionId;

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
    // availableForms was already updated after a successful submission
    // so remaining forms are exactly the current availableForms
    const remainingForms = availableForms;
    const hasMoreForms = remainingForms.length > 0;

    return (
      <UserBackgroundLayout centered>
        <div className="flex flex-col items-center justify-center flex-1 p-6 space-y-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl animate-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          <div
            role="status"
            aria-live="polite"
            className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <h1 className="text-white text-2xl font-bold">
              Formulário Enviado!
            </h1>
            <p className="text-white text-sm">
              Suas respostas foram registradas com sucesso.
            </p>
          </div>

          {form && (
            <div className="w-full max-w-sm p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              <div className="pt-2 border-t border-white/20 text-center">
                <p className="text-white text-sm mb-1 mt-2">Data de envio</p>
                <p className="text-white font-semibold text-base">
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}

          {hasMoreForms ? (
            <>
              <p className="text-white text-center">
                Você ainda tem {remainingForms.length} formulário
                {remainingForms.length > 1 ? "s" : ""} para responder
              </p>
              <Button
                type="button"
                onClick={() => {
                  setSubmissionSuccess(false);
                  if (remainingForms.length === 1) {
                    // Se só resta um, ir direto para ele
                    selectForm(0);
                    setAvailableForms(remainingForms);
                  } else {
                    // Se tem mais de um, mostrar lista
                    setShowFormList(true);
                    setAvailableForms(remainingForms);
                    setForm(null);
                    setSelectedFormIndex(null);
                  }
                }}
                className="w-full max-w-sm h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 cursor-pointer"
              >
                {remainingForms.length === 1
                  ? "Responder Próximo"
                  : "Ver Formulários Restantes"}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => onNavigate("home")}
              className="w-full max-w-sm h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 cursor-pointer"
            >
              Voltar para Home
            </Button>
          )}
        </div>
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
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {[...availableForms]
            .sort(
              (a, b) =>
                new Date(a?.createdAt ?? "").getTime() -
                new Date(b?.createdAt ?? "").getTime()
            )
            .map((formItem, index) => (
              <button
                key={formItem._id}
                type="button"
                onClick={() => selectForm(index)}
                className="w-full text-left bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-indigo-300"
                aria-label={`Selecionar formulário ${formItem.title}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center"
                    aria-hidden
                  >
                    <FileText className="w-6 h-6 text-white" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {formItem.title}
                    </h3>
                    {formItem.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {formItem.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" aria-hidden />
                        {formItem.questions?.length || 0} questões
                      </span>
                      {formItem.createdAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" aria-hidden />
                          {new Date(formItem.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" aria-hidden />
                </div>
              </button>
            ))}
        </div>
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
          <div
            role="progressbar"
            aria-label="Progresso do formulário"
            aria-valuemin={0}
            aria-valuemax={totalSteps - 1}
            aria-valuenow={currentStep}
            className="flex gap-2"
          >
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index <= currentStep ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
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
          {/* Draft status indicator */}
          {/** draftStatus: "idle" | "saving" | "saved" | "error" **/}
          {typeof (draftStatus as any) !== "undefined" && (
            <div className="text-center mb-2">
              {draftStatus === "saving" && (
                <p className="text-sm text-gray-500">Salvando rascunho...</p>
              )}
              {draftStatus === "saved" && draftSavedAt && (
                <p className="text-sm text-gray-500">
                  Rascunho salvo às{" "}
                  {new Date(draftSavedAt).toLocaleTimeString()}
                </p>
              )}
              {draftStatus === "error" && (
                <p className="text-sm text-red-500">Erro ao salvar rascunho</p>
              )}
            </div>
          )}
          <Button
            onClick={nextStep}
            disabled={submitting}
            className="w-full h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white gap-2 shadow-lg rounded-2xl disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : isReviewStep ? (
              <>
                <Check className="w-5 h-5" />
                Enviar Formulário
              </>
            ) : currentStep === totalSteps - 2 ? (
              <>
                <Check className="w-5 h-5" />
                Revisar Respostas
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </Button>
          {currentStep > 0 && (
            <Button
              onClick={() => {
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
              disabled={submitting}
              variant="outline"
              className="w-full h-12 border-2 border-gray-200 rounded-2xl"
            >
              Voltar
            </Button>
          )}
        </div>
      </main>
    </UserBackgroundLayout>
  );
}

// Componente para revisão final das respostas
interface ReviewStepProps {
  form: Form;
  answers: Record<string, any>;
  onEditQuestion: (questionIndex: number) => void;
}

function ReviewStep({ form, answers, onEditQuestion }: ReviewStepProps) {
  const formatAnswer = (question: FormQuestion, answer: any): string => {
    if (!answer) return "Não respondida";

    const questionDetails =
      typeof question.questionId === "string" ? null : question.questionId;

    // Array (checkbox)
    if (Array.isArray(answer)) {
      if (answer.length === 0) return "Não respondida";
      return answer.join(", ");
    }

    // Options (multiple_choice, dropdown, scale)
    if (
      questionDetails &&
      questionDetails.options &&
      questionDetails.options.length > 0
    ) {
      const option = questionDetails.options.find(
        (opt: any) => opt.value === answer || opt.label === answer
      );
      return option ? option.label : String(answer);
    }

    // Text, date, etc.
    return String(answer);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Revisão das Respostas
        </h2>
        <p className="text-gray-600">
          Confira suas respostas antes de enviar o formulário
        </p>
      </div>

      <div className="space-y-4">
        {form.questions.map((question, index) => {
          const questionId =
            typeof question.questionId === "string"
              ? question.questionId
              : question.questionId._id;
          const answer = answers[questionId];
          const questionDetails =
            typeof question.questionId === "string"
              ? null
              : question.questionId;

          return (
            <div
              key={questionId}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group"
              onClick={() => onEditQuestion(index)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {questionDetails ? questionDetails.title : "Pergunta"}
                    {question.required && (
                      <span className="text-red-600 ml-1">*</span>
                    )}
                  </h3>
                  <div className="text-sm">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                      {formatAnswer(question, answer)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-gray-400 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <p className="text-sm text-indigo-900 text-center">
          ✓ Ao clicar em "Enviar Formulário", suas respostas serão submetidas
        </p>
      </div>
    </div>
  );
}

// Componente para renderizar cada tipo de questão
interface QuestionRendererProps {
  question: FormQuestion;
  value: any;
  onChange: (value: any) => void;
}

function QuestionRenderer({
  question,
  value,
  onChange,
}: QuestionRendererProps) {
  const questionDetails =
    typeof question.questionId === "string" ? null : question.questionId;
  const type = questionDetails?.type ?? "text";

  if (!questionDetails) {
    return (
      <div className="p-6 text-center text-gray-600">Carregando questão...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">{questionDetails.title}</h2>
        {question.required && (
          <p className="text-sm text-red-600">* Obrigatório</p>
        )}
      </div>

      <div className="space-y-4">
        {type === "text" && (
          <div className="space-y-2">
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Digite sua resposta"
              className="h-12 border"
            />
          </div>
        )}

        {type === "multiple_choice" && questionDetails.options && (
          <RadioGroup value={value || ""} onValueChange={onChange}>
            {questionDetails.options.map((option: any, index: number) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:border-indigo-300 transition-colors"
              >
                <RadioGroupItem
                  value={option.value || option.label}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="cursor-pointer flex-1"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {type === "checkbox" && questionDetails.options && (
          <div className="space-y-2">
            {questionDetails.options.map((option: any, index: number) => {
              const selected = Array.isArray(value) ? value : [];
              const isChecked = selected.includes(option.value || option.label);

              return (
                <div
                  key={index}
                  className="flex items-start space-x-2 p-3 border border-gray-300 rounded-lg hover:border-indigo-300 transition-colors"
                >
                  <Checkbox
                    id={`checkbox-${index}`}
                    checked={isChecked}
                    onCheckedChange={(checked: boolean) => {
                      const optionValue = option.value || option.label;
                      if (checked) {
                        onChange([...selected, optionValue]);
                      } else {
                        onChange(
                          selected.filter((v: string) => v !== optionValue)
                        );
                      }
                    }}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={`checkbox-${index}`}
                    className="cursor-pointer flex-1 text-sm"
                  >
                    <p className="text-gray-900">{option.label}</p>
                  </label>
                </div>
              );
            })}
          </div>
        )}

        {type === "dropdown" && questionDetails.options && (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className="h-12 border">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {questionDetails.options.map((option: any, index: number) => (
                <SelectItem key={index} value={option.value || option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {type === "scale" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Mínimo
              </span>
              <span className="flex items-center gap-2">
                Máximo
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </span>
            </div>

            <div className="relative">
              {/* Barra de progresso de fundo */}
              <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 rounded-full"></div>

              {/* Grid de botões */}
              <div
                className="relative grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(var(--scale-steps, 11), minmax(0, 1fr))`,
                }}
              >
                {(() => {
                  // Prefer numeric min/max if provided
                  const min = questionDetails?.min;
                  const max = questionDetails?.max;
                  if (
                    typeof min === "number" &&
                    typeof max === "number" &&
                    max >= min
                  ) {
                    const steps = max - min + 1;
                    return Array.from({ length: steps }).map((_, i) => {
                      const valueForIndex = min + i;
                      const percentage =
                        steps > 1 ? (i / (steps - 1)) * 100 : 0;
                      let colorClass = "from-red-500 to-red-600";
                      if (percentage > 66)
                        colorClass = "from-green-500 to-green-600";
                      else if (percentage > 33)
                        colorClass = "from-yellow-500 to-yellow-600";
                      const isSelected =
                        value === valueForIndex ||
                        value === String(valueForIndex);
                      return (
                        <div
                          key={valueForIndex}
                          className="flex flex-col items-center gap-2"
                        >
                          <button
                            type="button"
                            onClick={() => onChange(valueForIndex)}
                            className={`relative w-full aspect-square flex items-center justify-center text-xl font-bold rounded-2xl transition-all duration-300 ${
                              isSelected
                                ? `bg-gradient-to-br ${colorClass} text-white shadow-2xl transform scale-110`
                                : "bg-white border-3 border-gray-200 text-gray-700 hover:border-gray-400 hover:shadow-lg hover:scale-105"
                            }`}
                          >
                            <span className={isSelected ? "animate-pulse" : ""}>
                              {valueForIndex}
                            </span>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Check className="w-4 h-4 text-green-600" />
                              </div>
                            )}
                          </button>
                          <span
                            className={`text-xs font-medium transition-colors ${
                              isSelected ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {valueForIndex}
                          </span>
                        </div>
                      );
                    });
                  }

                  // Else fallback to options array if present
                  const opts = questionDetails?.options || [];
                  if (opts.length > 0) {
                    const totalOptions = opts.length;
                    return opts.map((option: any, index: number) => {
                      const label =
                        option?.label ?? option?.value ?? String(option);
                      const optValue = option?.value ?? label ?? String(index);
                      const percentage =
                        totalOptions > 1
                          ? (index / (totalOptions - 1)) * 100
                          : 0;
                      let colorClass = "from-red-500 to-red-600";
                      if (percentage > 66)
                        colorClass = "from-green-500 to-green-600";
                      else if (percentage > 33)
                        colorClass = "from-yellow-500 to-yellow-600";
                      const isSelected = value === optValue || value === label;
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2"
                        >
                          <button
                            type="button"
                            onClick={() => onChange(optValue)}
                            className={`relative w-full aspect-square flex items-center justify-center text-xl font-bold rounded-2xl transition-all duration-300 ${
                              isSelected
                                ? `bg-gradient-to-br ${colorClass} text-white shadow-2xl transform scale-110`
                                : "bg-white border-3 border-gray-200 text-gray-700 hover:border-gray-400 hover:shadow-lg hover:scale-105"
                            }`}
                          >
                            <span className={isSelected ? "animate-pulse" : ""}>
                              {label}
                            </span>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Check className="w-4 h-4 text-green-600" />
                              </div>
                            )}
                          </button>
                          <span
                            className={`text-xs font-medium transition-colors ${
                              isSelected ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                      );
                    });
                  }

                  // Default numeric 0..10
                  const defaultSteps = 11;
                  return Array.from({ length: defaultSteps }).map((_, i) => {
                    const percentage =
                      defaultSteps > 1 ? (i / (defaultSteps - 1)) * 100 : 0;
                    let colorClass = "from-red-500 to-red-600";
                    if (percentage > 66)
                      colorClass = "from-green-500 to-green-600";
                    else if (percentage > 33)
                      colorClass = "from-yellow-500 to-yellow-600";
                    const isSelected = value === i || value === String(i);
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onChange(i)}
                          className={`relative w-full aspect-square flex items-center justify-center text-xl font-bold rounded-2xl transition-all duration-300 ${
                            isSelected
                              ? `bg-gradient-to-br ${colorClass} text-white shadow-2xl transform scale-110`
                              : "bg-white border-3 border-gray-200 text-gray-700 hover:border-gray-400 hover:shadow-lg hover:scale-105"
                          }`}
                        >
                          <span className={isSelected ? "animate-pulse" : ""}>
                            {i}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                        </button>
                        <span
                          className={`text-xs font-medium transition-colors ${
                            isSelected ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {i}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {type === "date" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Selecione a data
            </Label>
            <SimpleDatePicker
              value={value}
              onChange={onChange}
              className="p-3 rounded-lg"
            />
            {value && (
              <div className="mt-3 p-3 bg-indigo-50 rounded-xl">
                <p className="text-sm text-center">
                  <span className="font-semibold text-base">
                    {value
                      ? new Date(value).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
