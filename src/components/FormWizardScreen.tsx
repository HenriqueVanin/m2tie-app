import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ErrorState } from "./ui/error-state";
import type { Screen } from "../App";
import {
  getActiveForm,
  Form,
  FormQuestion,
  ActiveFormResponse,
} from "../services/formService";
import { submitResponse } from "../services/responseService";
import { UserBackgroundLayout } from "./UserBackgroundLayout";

interface FormWizardScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function FormWizardScreen({ onNavigate }: FormWizardScreenProps) {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [responseDate, setResponseDate] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const totalSteps = (form?.questions?.length || 0) + 1; // +1 para a etapa de revisão
  const isReviewStep = currentStep === (form?.questions?.length || 0);
  const currentQuestion = isReviewStep ? null : form?.questions?.[currentStep];

  useEffect(() => {
    fetchActiveForm();
  }, []);

  const fetchActiveForm = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActiveForm();
      console.log(response);
      // Verificar se houve erro ou formulário já respondido
      if (
        response.error ||
        response.msg === "Nenhum formulário ativo encontrado para este usuário"
      ) {
        setAlreadyAnswered(true);
        setResponseDate(new Date().toLocaleDateString("pt-BR"));
        // Se houver dados do formulário, manté-los para exibir o nome
        if (response.data) {
          // Se a API retornar um array, usar o primeiro formulário
          setForm(
            Array.isArray(response.data) ? response.data[0] : response.data
          );
        }
        return;
      }
      // Se data for null ou undefined, não há formulário ativo
      if (!response.data) {
        setError("Nenhum formulário ativo disponível no momento.");
        return;
      }

      // Se vier um array vazio
      if (Array.isArray(response.data) && response.data.length === 0) {
        setError("Nenhum formulário ativo disponível no momento.");
        return;
      }

      // Aceitar tanto objeto único quanto array
      setForm(Array.isArray(response.data) ? response.data[0] : response.data);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar formulário");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const nextStep = async () => {
    if (!form) return;

    // Se estiver na etapa de revisão, submeter
    if (isReviewStep) {
      await handleSubmit();
      return;
    }

    // Validar resposta obrigatória nas questões
    if (currentQuestion) {
      const questionId = currentQuestion.questionId._id;
      if (currentQuestion.required && !answers[questionId]) {
        alert("Esta questão é obrigatória");
        return;
      }
    }

    // Avançar para próxima etapa (questão ou revisão)
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToQuestion = (questionIndex: number) => {
    setCurrentStep(questionIndex);
  };

  const handleSubmit = async () => {
    if (!form) return;

    try {
      setSubmitting(true);

      // Mapear respostas para o formato da API
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

      // Verificar se houve erro na resposta
      if (response.error) {
        // Caso especial: formulário já respondido
        if (response.msg === "Formulário já respondido") {
          setAlreadyAnswered(true);
          setResponseDate(new Date().toLocaleDateString("pt-BR"));
          return;
        }
        throw new Error(response.error);
      }

      // Marcar submissão como bem-sucedida
      setSubmissionSuccess(true);
    } catch (e: any) {
      alert(e?.message || "Erro ao enviar formulário");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <UserBackgroundLayout centered>
        <div className="flex items-center justify-center flex-1 p-6">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando formulário...</p>
          </div>
        </div>
      </UserBackgroundLayout>
    );
  }

  // Submission success state
  if (submissionSuccess) {
    return (
      <UserBackgroundLayout centered>
        <div className="flex flex-col items-center justify-center flex-1 p-6 space-y-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl animate-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-white text-3xl font-bold">
              Formulário Enviado!
            </h1>
            <p className="text-white text-md">
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

          <Button
            onClick={() => onNavigate("home")}
            className="w-full max-w-sm h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
          >
            Voltar para Home
          </Button>
        </div>
      </UserBackgroundLayout>
    );
  }

  // Already answered state
  if (alreadyAnswered) {
    return (
      <UserBackgroundLayout centered>
        <div className="flex flex-col items-center justify-center flex-1 p-6 space-y-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-white text-3xl font-bold">
              Formulário já Respondido!
            </h1>
          </div>

          {form && (
            <div className="w-full max-w-sm p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl space-y-2">
              <div className="text-center">
                <p className="text-white text-sm mb-1">Formulário</p>
                <p className="text-white font-semibold text-base">
                  {form.formTitle}
                </p>
              </div>
              {responseDate && (
                <div className="pt-2 border-t border-white/20 text-center">
                  <p className="text-white text-sm mb-1 mt-2">
                    Data de resposta
                  </p>
                  <p className="text-white font-semibold text-base">
                    {responseDate}
                  </p>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={() => onNavigate("home")}
            className="w-full max-w-sm h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold rounded-2xl shadow-lg"
          >
            Voltar para Home
          </Button>
        </div>
      </UserBackgroundLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <UserBackgroundLayout centered>
        <div className="flex items-center justify-center flex-1 bg-gray-50 p-6">
          <ErrorState message={error} onRetry={fetchActiveForm} />
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
      <div className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() =>
              currentStep === 1 ? onNavigate("home") : prevStep()
            }
            className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white">{form?.title || "Formulário"}</h1>
            <p className="text-sm text-indigo-100">
              {isReviewStep
                ? "Revisão Final"
                : `Questão ${currentStep + 1} de ${totalSteps - 1}`}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
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
                value={answers[currentQuestion.questionId._id]}
                onChange={(value) =>
                  handleAnswerChange(currentQuestion.questionId._id, value)
                }
              />
            )
          )}
        </div>
      </div>
      <div className="p-6 space-y-3 pb-30">
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
            onClick={prevStep}
            disabled={submitting}
            variant="outline"
            className="w-full h-12 border-2 border-gray-200 rounded-2xl"
          >
            Voltar
          </Button>
        )}
      </div>
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

    const questionDetails = question.questionId;

    // Array (checkbox)
    if (Array.isArray(answer)) {
      if (answer.length === 0) return "Não respondida";
      return answer.join(", ");
    }

    // Options (multiple_choice, dropdown, scale)
    if (questionDetails.options && questionDetails.options.length > 0) {
      const option = questionDetails.options.find(
        (opt) => opt.value === answer || opt.label === answer
      );
      return option ? option.label : answer.toString();
    }

    // Text, date, etc.
    return answer.toString();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Revisão das Respostas
        </h2>
        <p className="text-gray-600">
          Confira suas respostas antes de enviar o formulário
        </p>
      </div>

      <div className="space-y-4">
        {form.questions.map((question, index) => {
          const questionId = question.questionId._id;
          const answer = answers[questionId];
          const questionDetails = question.questionId;

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
                    {questionDetails.title}
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
  const questionDetails = question.questionId;
  const type = questionDetails.type;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">{questionDetails.title}</h2>
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

        {type === "scale" && questionDetails.options && (
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
                  gridTemplateColumns: `repeat(${questionDetails.options.length}, minmax(0, 1fr))`,
                }}
              >
                {questionDetails.options.map((option: any, index: number) => {
                  const isSelected = value === (option.value || option.label);
                  const totalOptions = questionDetails.options?.length || 0;
                  const percentage =
                    totalOptions > 1 ? (index / (totalOptions - 1)) * 100 : 0;

                  // Determina a cor baseada na posição
                  let colorClass = "from-red-500 to-red-600";
                  if (percentage > 66) {
                    colorClass = "from-green-500 to-green-600";
                  } else if (percentage > 33) {
                    colorClass = "from-yellow-500 to-yellow-600";
                  }

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => onChange(option.value || option.label)}
                        className={`relative w-full aspect-square flex items-center justify-center text-2xl font-bold rounded-2xl transition-all duration-300 ${
                          isSelected
                            ? `bg-gradient-to-br ${colorClass} text-white shadow-2xl transform scale-110 ring-4 ring-offset-2 ring-${
                                percentage > 66
                                  ? "green"
                                  : percentage > 33
                                  ? "yellow"
                                  : "red"
                              }-300`
                            : "bg-white border-3 border-gray-200 text-gray-700 hover:border-gray-400 hover:shadow-lg hover:scale-105"
                        }`}
                      >
                        <span className={isSelected ? "animate-pulse" : ""}>
                          {option.label}
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
                        {option.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {type === "date" && (
          <div className="space-y-2">
            <Label
              htmlFor="date-input"
              className="text-sm font-medium text-gray-700"
            >
              Selecione a data
            </Label>
            <Input
              id="date-input"
              type="date"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="h-14 border-2 border-gray-300 rounded-xl text-lg focus:border-indigo-500"
            />
            {value && (
              <div className="mt-3 p-3 bg-indigo-50 rounded-xl">
                <p className="text-sm text-indigo-600 text-center">
                  Data selecionada:{" "}
                  <span className="font-semibold">
                    {new Date(value + "T00:00:00").toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
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
