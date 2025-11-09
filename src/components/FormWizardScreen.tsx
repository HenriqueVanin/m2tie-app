import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import type { Screen } from "../App";

interface FormWizardScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function FormWizardScreen({ onNavigate }: FormWizardScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Formulário completo
      onNavigate("home");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() =>
              currentStep === 1 ? onNavigate("home") : prevStep()
            }
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1>Novo Formulário</h1>
            <p className="text-sm text-gray-500">
              Passo {currentStep} de {totalSteps}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${
                index + 1 <= currentStep ? "bg-gray-800 " : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
      </div>

      {/* Footer */}
      <div className="p-6 border-t-2 border-gray-200 space-y-3">
        <Button
          onClick={nextStep}
          className="w-full h-12 bg-gray-800  hover:bg-blue-700 gap-2"
        >
          {currentStep === totalSteps ? (
            <>
              <Check className="w-5 h-5" />
              Finalizar
            </>
          ) : (
            <>
              Continuar
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
        {currentStep > 1 && (
          <Button
            onClick={prevStep}
            variant="outline"
            className="w-full h-12 border-2"
          >
            Voltar
          </Button>
        )}
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Etapa 1</h2>
        <p className="text-gray-500">
          Preencha os dados iniciais do formulário
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Pergunta 1</Label>
          <Textarea
            id="description"
            placeholder="Escreva aqui"
            className="min-h-32 border-2 border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Etapa 2</h2>
        <p className="text-gray-500">Descrição da segunda etapa</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <select
          id="category"
          className="w-full h-12 px-3 border-2 border-gray-300 rounded-md bg-white"
        >
          <option>Selecione uma categoria</option>
          <option>Categoria A</option>
          <option>Categoria B</option>
          <option>Categoria C</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Multiplas opções</Label>
        <RadioGroup defaultValue="not-specified">
          <div className="flex items-center space-x-2 p-3 border-2 border-gray-300 rounded-lg">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male" className="cursor-pointer flex-1">
              Opção 1
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border-2 border-gray-300 rounded-lg">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female" className="cursor-pointer flex-1">
              Opção 2
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border-2 border-gray-300 rounded-lg">
            <RadioGroupItem value="not-specified" id="not-specified" />
            <Label htmlFor="not-specified" className="cursor-pointer flex-1">
              Opção 3
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Etapa 3</h2>
        <p className="text-gray-500">Descrição da terceira etapa</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cep">Pergunta 1</Label>
          <Input
            id="cep"
            placeholder="Responda aqui"
            className="h-12 border-2 border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="street">Pergunta 2</Label>
          <Input
            id="street"
            placeholder="Responda aqui"
            className="h-12 border-2 border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">Pergunta 3</Label>
          <Input
            id="neighborhood"
            placeholder="Responda aqui"
            className="h-12 border-2 border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}

function Step4() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Revisão e Confirmação</h2>
        <p className="text-gray-500">Revise suas informações antes de enviar</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <h3 className="mb-3">Informações Básicas</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Título:</span>
              <span>Formulário de exemplo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Categoria:</span>
              <span>Categoria A</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <h3 className="mb-3">Dados Pessoais</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pergunta 1</span>
              <span>Resposta 1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pergunta 2</span>
              <span>Resposta 2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pergunta 3</span>
              <span>Resposta 3</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <h3 className="mb-3">Endereço</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pergunta 4</span>
              <span>Resposta 4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pergunta 5</span>
              <span>Resposta 5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pergunta 6</span>
              <span>Resposta 6</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <input type="checkbox" id="confirm" className="mt-1" />
          <label htmlFor="confirm" className="text-sm">
            Confirmo que as informações fornecidas estão corretas.
          </label>
        </div>
      </div>
    </div>
  );
}
