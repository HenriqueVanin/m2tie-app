import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import type { UIQuestionType } from "../../../utils/questionTypes";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  formData: any;
  setFormData: (d: any) => void;
  onCreate: () => void;
}

export default function CreateQuestionDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onCreate,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>Nova Questão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título da Questão</Label>
            <Input
              id="title"
              placeholder="Digite o título da questão"
              autoComplete="off"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="h-12 rounded-2xl"
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Adicione instruções ou detalhes sobre a questão"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="rounded-2xl"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo de Questão</Label>
              <Select
                value={formData.type}
                onValueChange={(val: string) =>
                  setFormData({ ...formData, type: val as UIQuestionType })
                }
              >
                <SelectTrigger className="h-12 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="multiple_choice">
                    Múltipla Escolha
                  </SelectItem>
                  <SelectItem value="checkbox">Caixas de Seleção</SelectItem>
                  <SelectItem value="dropdown">Lista Suspensa</SelectItem>
                  <SelectItem value="scale">Escala Linear</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(formData.type === "multiple_choice" ||
            formData.type === "checkbox" ||
            formData.type === "dropdown") && (
            <div>
              <Label htmlFor="options">Opções (uma por linha)</Label>
              <Textarea
                id="options"
                placeholder="Digite cada opção em uma nova linha"
                value={formData.options}
                onChange={(e) =>
                  setFormData({ ...formData, options: e.target.value })
                }
                className="min-h-32 rounded-2xl"
              />
            </div>
          )}
          {formData.type === "text" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minLength">Mín. Caracteres</Label>
                <Input
                  id="minLength"
                  type="number"
                  min={0}
                  value={formData.minLength ?? ""}
                  autoComplete="off"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minLength: e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined,
                    })
                  }
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="maxLength">Máx. Caracteres</Label>
                <Input
                  id="maxLength"
                  type="number"
                  min={0}
                  value={formData.maxLength ?? ""}
                  autoComplete="off"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxLength: e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined,
                    })
                  }
                  className="h-12 rounded-2xl"
                />
              </div>
            </div>
          )}
          {formData.type === "scale" && (
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="scaleMin">Valor Inicial</Label>
                <Input
                  id="scaleMin"
                  type="number"
                  value={formData.scaleMin}
                  autoComplete="off"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scaleMin: parseInt(e.target.value, 10),
                    })
                  }
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="scaleMax">Valor Final</Label>
                <Input
                  id="scaleMax"
                  type="number"
                  value={formData.scaleMax}
                  autoComplete="off"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scaleMax: parseInt(e.target.value, 10),
                    })
                  }
                  className="h-12 rounded-2xl"
                />
              </div>
              <div className="text-sm text-gray-600">
                {formData.scaleMin < formData.scaleMax
                  ? `${formData.scaleMax - formData.scaleMin + 1} pontos`
                  : "Intervalo inválido"}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={formData.required}
              onChange={(e) =>
                setFormData({ ...formData, required: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded"
            />
            <Label htmlFor="required" className="cursor-pointer">
              Questão obrigatória
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-2xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={onCreate}
            disabled={
              !formData.title ||
              (formData.type === "scale" &&
                formData.scaleMin >= formData.scaleMax)
            }
            className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl"
          >
            Criar Questão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
