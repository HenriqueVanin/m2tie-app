import React from "react";
import { Check } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";
import { Checkbox } from "../../../../components/ui/checkbox";
import { SimpleDatePicker } from "../../../../components/ui/simple-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface Props {
  question: any;
  value: any;
  onChange: (v: any) => void;
}

export default function QuestionRenderer({ question, value, onChange }: Props) {
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
                      if (checked) onChange([...selected, optionValue]);
                      else
                        onChange(
                          selected.filter((v: string) => v !== optionValue)
                        );
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
