import { useState, useEffect, useRef } from "react";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { BarChart3, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

type DashboardType = "overview" | "users" | "forms" | "analytics";

// MongoDB Charts Configuration
// Substitua pela URL base do seu MongoDB Charts
const CHARTS_BASE_URL = "https://charts.mongodb.com/charts-project-0-xxxxx";

// IDs dos gráficos (você precisa criar esses gráficos no MongoDB Charts e pegar os IDs)
const CHART_IDS = {
  responsesByInstitution: "chart-id-1", // Gráfico de respostas por instituição
  formsPopularity: "chart-id-2", // Formulários mais respondidos
  userGrowth: "chart-id-3", // Crescimento de usuários
  formStatus: "chart-id-4", // Status dos formulários
  completionTime: "chart-id-5", // Tempo médio de conclusão
  abandonmentRate: "chart-id-6", // Taxa de abandono
  engagementHeatmap: "chart-id-7", // Engajamento por hora
};

export function StaffDashboardViewer() {
  const [selectedDashboard, setSelectedDashboard] =
    useState<DashboardType>("overview");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-gray-900 text-2xl">Dashboards</h1>
            <p className="text-gray-500">Análise e métricas da plataforma</p>
          </div>

          <div className="flex gap-3">
            <Button className="gap-2 h-12 bg-[#003087] hover:bg-[#002070] text-white shadow-lg rounded-2xl">
              <Download className="w-4 h-4" />
              Baixar Relatório
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Select
            value={selectedDashboard}
            onValueChange={(value: string) =>
              setSelectedDashboard(value as DashboardType)
            }
          >
            <SelectTrigger className="w-64 h-12 border-gray-200 bg-white rounded-2xl">
              <SelectValue placeholder="Selecione um dashboard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Visão Geral</SelectItem>
              <SelectItem value="users">Usuários</SelectItem>
              <SelectItem value="forms">Formulários</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <p></p>
      </div>
    </div>
  );
}

// Componente reutilizável para renderizar gráficos do MongoDB Charts
interface MongoDBChartProps {
  chartId: string;
  height?: string;
  filter?: Record<string, any>;
}

function MongoDBChart({ chartId, height = "h-64", filter }: MongoDBChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const sdk = new ChartsEmbedSDK({
      baseUrl: CHARTS_BASE_URL,
    });

    const chart = sdk.createChart({
      chartId: chartId,
      height: chartRef.current.offsetHeight,
      width: chartRef.current.offsetWidth,
      theme: "light",
      autoRefresh: true,
      maxDataAge: 60, // Refresh data every 60 seconds
    });

    // Apply filter if provided
    if (filter) {
      chart.setFilter(filter);
    }

    chart
      .render(chartRef.current)
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Error rendering chart:", err);
        setError("Erro ao carregar gráfico");
        setLoading(false);
      });

    // Cleanup on unmount - MongoDB Charts SDK doesn't expose dispose method
    // The chart will be cleaned up when the DOM element is removed
  }, [chartId, filter]);

  if (error) {
    return (
      <div
        className={`${height} bg-gray-100 rounded-lg flex items-center justify-center`}
      >
        <div className="text-center text-red-600">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`${height} bg-gray-100 rounded-lg flex items-center justify-center`}
      >
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087] mx-auto mb-4"></div>
          <p>Carregando gráfico...</p>
        </div>
      </div>
    );
  }

  return <div ref={chartRef} className={`${height} w-full`} />;
}
