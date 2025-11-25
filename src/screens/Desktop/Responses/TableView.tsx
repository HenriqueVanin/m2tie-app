import React from "react";
import { User, Calendar, Eye, Trash2, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { ErrorState } from "../../../components/ui/error-state";
import { DeleteConfirmationDialog } from "../../../components/ui/delete-confirmation-dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table";
import type { FormResponse } from "./useStaffFormResponses";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  loading: boolean;
  error: string | null;
  filteredResponses: FormResponse[];
  isAnalyst: boolean;
  setSelectedResponse: Dispatch<SetStateAction<FormResponse | null>>;
  fetchResponses: () => void;
  handleDeleteClick: (r: FormResponse) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (v: boolean) => void;
  handleDeleteConfirm: () => void;
  deleting: boolean;
  responseToDelete?: FormResponse | null;
  formatDate: (s: string) => string;
}

export function TableView(props: Props) {
  const {
    loading,
    error,
    filteredResponses,
    isAnalyst,
    setSelectedResponse,
    fetchResponses,
    handleDeleteClick,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteConfirm,
    deleting,
    responseToDelete,
    formatDate,
  } = props;

  return (
    <div className="flex-1 overflow-auto">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchResponses} />
      ) : (
        <Table className="w-full">
          <TableHeader className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <TableHead className="text-left px-6 py-4 text-sm text-gray-500">
                Usuário
              </TableHead>
              <TableHead className="text-left px-6 py-4 text-sm text-gray-500">
                Formulário
              </TableHead>
              <TableHead className="text-left px-6 py-4 text-sm text-gray-500">
                Data de Envio
              </TableHead>
              <TableHead className="text-left px-6 py-4 text-sm text-gray-500">
                Respostas
              </TableHead>
              <TableHead className="text-left px-6 py-4 text-sm text-gray-500">
                Ações
              </TableHead>
            </tr>
          </TableHeader>
          <TableBody className="bg-white">
            {filteredResponses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Nenhuma resposta encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredResponses.map((response) => (
                <TableRow
                  key={response.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-800">{response.userName}</p>
                        <p className="text-sm text-gray-500">
                          {response.userEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="text-gray-800">{response.formTitle}</p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(response.submittedAt)}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {response.answers.length}{" "}
                      {response.answers.length === 1 ? "resposta" : "respostas"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedResponse(response)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        {" "}
                        <Eye className="w-4 h-4" /> Ver Detalhes
                      </Button>
                      {!isAnalyst && (
                        <Button
                          onClick={() => handleDeleteClick(response)}
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          {" "}
                          <Trash2 className="w-4 h-4" /> Excluir
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
        description={
          <>
            Tem certeza que deseja excluir a resposta de{" "}
            <strong>{responseToDelete?.userName}</strong> para o formulário{" "}
            <strong>{responseToDelete?.formTitle}</strong>?
          </>
        }
        countdownSeconds={3}
      />
    </div>
  );
}

export default TableView;
