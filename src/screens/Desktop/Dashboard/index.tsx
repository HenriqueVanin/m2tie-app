import { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { useRef } from "react";
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  FileText,
  Activity,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { PageHeaderWithSearch } from "../../../components/ui/page-header";
import useStaffDashboardViewer from "./useStaffDashboardViewer";
import type { FullAnalysisResponse } from "../../../services/dashboardService";
import { StatsCard } from "./StatsCard";
import OverviewCards from "./OverviewCards";
import ChartsGrid from "./ChartsGrid";
import { useEchartsExport } from "./useEchartsExport";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { ErrorAlert } from "./ErrorAlert";
import { EmptyState } from "./EmptyState";

interface FormOption {
  _id: string;
  title: string;
}

export function StaffDashboardViewer() {
  const {
    forms,
    selectedFormId,
    setSelectedFormId,
    dashboardData,
    loading,
    error,
    handleExportData,
  } = useStaffDashboardViewer();

  const { registerChart } = useEchartsExport();

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeaderWithSearch
        title="Gráficos e Análises"
        description="Análise e métricas dos formulários"
        searchComponent={
          <Select
            value={selectedFormId}
            onValueChange={setSelectedFormId}
            disabled={forms.length === 0}
          >
            <SelectTrigger className="w-96 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-2xl">
              <SelectValue placeholder="Selecione um formulário" />
            </SelectTrigger>
            <SelectContent>
              {forms.map((form) => (
                <SelectItem key={form._id} value={form._id}>
                  {form.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportData}
            disabled={!selectedFormId || loading}
            className="gap-2 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-2xl disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Exportar Dados
          </Button>

          <Button
            // onClick={() => exportPdf()}
            disabled={!selectedFormId || loading}
            variant="ghost"
            className="gap-2 h-12 border border-gray-200 rounded-2xl"
          >
            <FileText className="w-5 h-5" />
            Exportar PDF
          </Button>
        </div>
      </PageHeaderWithSearch>

      {/* Content */}
      <div id="staff-dashboard-root" className="flex-1 overflow-auto p-6">
        {error && <ErrorAlert message={error} />}

        {loading && <LoadingPlaceholder />}

        {!loading && !error && dashboardData && (
          <div className="space-y-6">
            <OverviewCards dashboardData={dashboardData} />
            <ChartsGrid
              questionsAnalysis={dashboardData.questionsAnalysis}
              registerChart={registerChart}
            />
          </div>
        )}

        {!loading && !error && !dashboardData && <EmptyState />}
      </div>
    </div>
  );
}
