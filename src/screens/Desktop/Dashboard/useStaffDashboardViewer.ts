import { useEffect, useState } from "react";
import { getAllForms, type Form } from "../../../services/formService";
import {
  dashboardService,
  type FullAnalysisResponse,
} from "../../../services/dashboardService";
import { getUserCookie } from "../../../utils/userCookie";
import { toast } from "sonner";

interface FormOption {
  _id: string;
  title: string;
}

export default function useStaffDashboardViewer() {
  const [forms, setForms] = useState<FormOption[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const [dashboardData, setDashboardData] =
    useState<FullAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedFormId) {
      loadDashboardData(selectedFormId);
    }
  }, [selectedFormId]);

  const loadForms = async () => {
    try {
      const user = getUserCookie();
      const userRole = user?.role || "teacher_analyst";
      const formsData = await getAllForms(userRole);
      setForms(formsData as any);
      if (formsData && (formsData as any).length > 0) {
        setSelectedFormId((formsData as any)[0]._id);
      }
    } catch (err) {
      console.error("Erro ao carregar formulários:", err);
      setError("Erro ao carregar formulários");
    }
  };

  const loadDashboardData = async (formId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getFullAnalysis(formId);
      setDashboardData(data);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
      setError("Erro ao carregar análise do formulário");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!selectedFormId) return;
    try {
      const user = getUserCookie();
      const userRole = user?.role || "teacher_analyst";
      const exportData = await dashboardService.exportFormData(
        selectedFormId,
        userRole
      );

      const headers = Object.keys(exportData.data[0] || {});
      const csvContent = [
        headers.join(","),
        ...exportData.data.map((row: any) =>
          headers
            .map((header) => {
              const value = row[header];
              if (
                typeof value === "string" &&
                (value.includes(",") || value.includes('"'))
              ) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${exportData.formTitle}_export_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Erro ao exportar dados:", err);
      toast.error("Erro ao exportar dados");
    }
  };

  return {
    forms,
    setForms,
    selectedFormId,
    setSelectedFormId,
    dashboardData,
    loading,
    error,
    loadForms,
    loadDashboardData,
    handleExportData,
  } as const;
}
