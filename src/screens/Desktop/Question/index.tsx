import React from "react";
import { Plus, Edit, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ErrorState } from "../../../components/ui/error-state";
import SearchBar from "../../../components/shared/SearchBar";
import FilterSelect from "../../../components/shared/FilterSelect";
import { PageHeaderWithSearch } from "../../../components/ui/page-header";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { DeleteConfirmationDialog } from "../../../components/ui/delete-confirmation-dialog";
import useStaffQuestionManager from "./useStaffQuestionManager";
import type { UIQuestionType } from "../../../utils/questionTypes";

export function StaffQuestionManager() {
  const {
    filteredQuestions,
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
    canCreate,
    canEdit,
    canDelete,
    canManage,
    questions,
    formData,
    setFormData,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDeleteConfirm,
    handleEdit,
    deleteDialogOpen,
    setDeleteDialogOpen,
    questionToDelete,
    deleting,
    fetchQuestions,
    resetForm,
    QUESTION_TYPE_ICONS,
    getQuestionTypeLabel,
    isAnalyst,
  } = useStaffQuestionManager();

  if (!canManage) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Você não tem permissão para gerenciar questões.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <PageHeaderWithSearch
        title="Banco de Questões"
        description="Gerencie todas as questões disponíveis"
        searchComponent={
          <div className="flex gap-3">
            <SearchBar
              placeholder="Buscar questões por título ou categoria..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1 min-w-[240px]"
            />
            <FilterSelect
              value={filterType}
              onChange={setFilterType as any}
              label="Tipo"
              options={[
                { value: "all", label: "Todos os tipos" },
                { value: "text", label: "Texto" },
                { value: "multiple_choice", label: "Múltipla Escolha" },
                { value: "checkbox", label: "Caixas de Seleção" },
                { value: "dropdown", label: "Lista Suspensa" },
                { value: "scale", label: "Escala Linear" },
                { value: "date", label: "Data" },
              ]}
              className="w-48"
            />
            <FilterSelect
              value={filterRequired}
              onChange={setFilterRequired as any}
              label="Obrigatória"
              options={[
                { value: "all", label: "Todas" },
                { value: "required", label: "Obrigatórias" },
                { value: "optional", label: "Opcionais" },
              ]}
              className="w-48"
            />
          </div>
        }
      >
        {!isAnalyst && (
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-2xl"
          >
            <Plus className="w-5 h-5" />
            Nova Questão
          </Button>
        )}
      </PageHeaderWithSearch>

      <div className="flex-1 overflow-auto min-h-0">
        {loading ? (
          <div
            className="text-center py-12 text-gray-500"
            role="status"
            aria-live="polite"
          >
            Carregando...
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchQuestions} />
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-900 mb-2">Nenhuma questão encontrada</p>
            <p className="text-gray-500">
              {searchTerm
                ? "Tente buscar por outros termos"
                : "Crie sua primeira questão para começar"}
            </p>
          </div>
        ) : (
          <section aria-labelledby="question-list-heading">
            <h2 id="question-list-heading" className="sr-only">
              Lista de Questões
            </h2>
            <table className="w-full">
              <caption className="sr-only">
                Lista de questões disponíveis
              </caption>
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th
                    scope="col"
                    className="text-left px-6 py-4 text-sm font-medium text-gray-500"
                  >
                    Questão
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-4 text-sm font-medium text-gray-500"
                  >
                    Tipo
                  </th>
                  <th
                    scope="col"
                    className="text-center px-6 py-4 text-sm font-medium text-gray-500"
                  >
                    Obrigatória
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-4 text-sm font-medium text-gray-500"
                  >
                    Criado Por
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-4 text-sm font-medium text-gray-500"
                  >
                    Data de Criação
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-4 text-sm font-medium text-gray-500"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredQuestions.map((q) => {
                  const Icon = QUESTION_TYPE_ICONS[q.type];
                  return (
                    <tr
                      key={q._id}
                      onClick={() => handleEdit(q)}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <th scope="row" className="px-6 py-4 text-left align-top">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 bg-linear-to-br bg-[#003087] rounded-xl flex items-center justify-center shrink-0"
                            aria-hidden
                          >
                            {Icon && (
                              <Icon
                                className="w-5 h-5 text-white"
                                aria-hidden
                              />
                            )}
                          </div>
                          {Icon && (
                            <span className="sr-only">
                              {getQuestionTypeLabel(q.type)}
                            </span>
                          )}
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium">
                              {q.title}
                            </p>
                            {q.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {q.description}
                              </p>
                            )}
                            {q.options && q.options.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {q.options.length}{" "}
                                {q.options.length === 1 ? "opção" : "opções"}
                              </p>
                            )}
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700 hover:bg-gray-100"
                        >
                          {getQuestionTypeLabel(q.type)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {q.required ? (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            Sim
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Não
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-800 font-medium">
                            {q.createdBy.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {q.createdBy.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {q.createdAt
                          ? new Date(q.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--"}
                      </td>
                      <td className="px-6 py-4">
                        {!isAnalyst ? (
                          <div
                            className="flex gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              onClick={() => handleEdit(q)}
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Edit className="w-4 h-4" aria-hidden />
                              Editar
                            </Button>
                            <Button
                              onClick={() => handleDelete(q._id)}
                              variant="outline"
                              size="sm"
                              className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden />
                              Excluir
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Somente visualização
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                    value={formData.scaleMin ?? ""}
                    autoComplete="off"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scaleMin:
                          e.target.value === ""
                            ? Number.NaN
                            : parseInt(e.target.value, 10),
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
                    value={formData.scaleMax ?? ""}
                    autoComplete="off"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scaleMax:
                          e.target.value === ""
                            ? Number.NaN
                            : parseInt(e.target.value, 10),
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {Number.isFinite(formData.scaleMin) &&
                  Number.isFinite(formData.scaleMax) &&
                  (formData.scaleMin as number) < (formData.scaleMax as number)
                    ? `${
                        (formData.scaleMax as number) -
                        (formData.scaleMin as number) +
                        1
                      } pontos`
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
              onClick={() => setIsCreateDialogOpen(false)}
              className="rounded-2xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !formData.title ||
                (formData.type === "scale" &&
                  (!Number.isFinite(formData.scaleMin) ||
                    !Number.isFinite(formData.scaleMax) ||
                    (formData.scaleMin as number) >=
                      (formData.scaleMax as number)))
              }
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl"
            >
              Criar Questão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>Editar Questão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título da Questão</Label>
              <Input
                id="edit-title"
                placeholder="Digite o título da questão"
                autoComplete="off"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="h-12 rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Tipo de Questão</Label>
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
                <Label htmlFor="edit-options">Opções (uma por linha)</Label>
                <Textarea
                  id="edit-options"
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
                  <Label htmlFor="edit-minLength">Mín. Caracteres</Label>
                  <Input
                    id="edit-minLength"
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
                  <Label htmlFor="edit-maxLength">Máx. Caracteres</Label>
                  <Input
                    id="edit-maxLength"
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
                  <Label htmlFor="edit-scaleMin">Valor Inicial</Label>
                  <Input
                    id="edit-scaleMin"
                    type="number"
                    value={formData.scaleMin ?? ""}
                    autoComplete="off"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scaleMin:
                          e.target.value === ""
                            ? Number.NaN
                            : parseInt(e.target.value, 10),
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-scaleMax">Valor Final</Label>
                  <Input
                    id="edit-scaleMax"
                    type="number"
                    value={formData.scaleMax ?? ""}
                    autoComplete="off"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scaleMax:
                          e.target.value === ""
                            ? Number.NaN
                            : parseInt(e.target.value, 10),
                      })
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {Number.isFinite(formData.scaleMin) &&
                  Number.isFinite(formData.scaleMax) &&
                  (formData.scaleMin as number) < (formData.scaleMax as number)
                    ? `${
                        (formData.scaleMax as number) -
                        (formData.scaleMin as number) +
                        1
                      } pontos`
                    : "Intervalo inválido"}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-required"
                checked={formData.required}
                onChange={(e) =>
                  setFormData({ ...formData, required: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <Label htmlFor="edit-required" className="cursor-pointer">
                Questão obrigatória
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="rounded-2xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                !formData.title ||
                (formData.type === "scale" &&
                  (!Number.isFinite(formData.scaleMin) ||
                    !Number.isFinite(formData.scaleMax) ||
                    (formData.scaleMin as number) >=
                      (formData.scaleMax as number)))
              }
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
        description={
          <>
            Tem certeza que deseja excluir a questão{" "}
            <strong>{questionToDelete?.title}</strong>?
          </>
        }
        countdownSeconds={3}
      />
    </div>
  );
}

// Backwards compatibility export if other parts still import the old name
export const StaffQuestionBank = StaffQuestionManager;
