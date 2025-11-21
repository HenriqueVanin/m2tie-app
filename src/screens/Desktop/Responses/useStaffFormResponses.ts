import { useState, useEffect } from "react";
import {
  getAllResponses,
  ResponseData,
  deleteResponse,
} from "../../../services/responseService";
import { getUserCookie } from "../../../utils/userCookie";

interface FormResponse {
  id: string;
  formTitle: string;
  formDescription?: string;
  userName: string;
  userEmail: string;
  submittedAt: string;
  answers: {
    questionId: string;
    questionTitle: string;
    questionType: string;
    questionOptions?: string[];
    answer: string | string[] | number;
  }[];
}

export function useStaffFormResponses() {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterForm, setFilterForm] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("all");
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState<FormResponse | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const currentUser = getUserCookie();
  const isAnalyst = currentUser?.role === "teacher_analyst";

  useEffect(() => {
    fetchResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResponses = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = getUserCookie();
      const userRole = user?.role || "teacher_analyst";
      const result = await getAllResponses(userRole);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        const mappedResponses: FormResponse[] = result.data.map(
          (r: ResponseData) => ({
            id: r._id,
            formTitle: r.formId.title,
            formDescription: r.formId.description,
            userName: r.userId.anonymous ? "Usuário Anônimo" : r.userId.name,
            userEmail: r.userId.anonymous ? "N/A" : r.userId.email,
            submittedAt: r.submittedAt,
            answers: r.answers.map((a) => ({
              questionId: a.questionId._id,
              questionTitle: a.questionId.title,
              questionType: a.questionId.type,
              questionOptions: a.questionId.options,
              answer: a.answer,
            })),
          })
        );
        setResponses(mappedResponses);
      }
    } catch (err) {
      setError("Erro ao carregar respostas");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (response: FormResponse) => {
    setResponseToDelete(response);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!responseToDelete) return;

    setDeleting(true);
    try {
      const result = await deleteResponse(responseToDelete.id);
      if (result.error) {
        setError(result.error);
      } else {
        setResponses((prev) =>
          prev.filter((r) => r.id !== responseToDelete.id)
        );
        setDeleteDialogOpen(false);
        setResponseToDelete(null);
      }
    } catch (err) {
      setError("Erro ao deletar resposta");
    } finally {
      setDeleting(false);
    }
  };

  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.formTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesForm =
      filterForm === "all" || response.formTitle === filterForm;

    const matchesUser =
      filterUser === "all" || response.userName === filterUser;

    return matchesSearch && matchesForm && matchesUser;
  });

  const uniqueForms = Array.from(new Set(responses.map((r) => r.formTitle)));
  const uniqueUsers = Array.from(
    new Set(responses.map((r) => r.userName))
  ).sort();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return {
    responses,
    setResponses,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterForm,
    setFilterForm,
    filterUser,
    setFilterUser,
    selectedResponse,
    setSelectedResponse,
    deleteDialogOpen,
    setDeleteDialogOpen,
    responseToDelete,
    setResponseToDelete,
    deleting,
    setDeleting,
    isAnalyst,
    fetchResponses,
    handleDeleteClick,
    handleDeleteConfirm,
    filteredResponses,
    uniqueForms,
    uniqueUsers,
    formatDate,
  } as const;
}

export default useStaffFormResponses;
