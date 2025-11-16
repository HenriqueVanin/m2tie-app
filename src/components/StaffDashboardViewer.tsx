import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
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
} from "./ui/select";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { PageHeaderWithSearch } from "./ui/page-header";
import { getAllForms, type Form } from "../services/formService";
import {
  dashboardService,
  type FullAnalysisResponse,
} from "../services/dashboardService";

interface FormOption {
  _id: string;
  title: string;
}

export function StaffDashboardViewer() {
  const [forms, setForms] = useState<FormOption[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const [dashboardData, setDashboardData] =
    useState<FullAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar formulários disponíveis
  useEffect(() => {
    loadForms();
  }, []);

  // Carregar dados do dashboard quando um formulário é selecionado
  useEffect(() => {
    if (selectedFormId) {
      loadDashboardData(selectedFormId);
    }
  }, [selectedFormId]);

  const loadForms = async () => {
    try {
      const formsData = await getAllForms();
      setForms(formsData);
      if (formsData.length > 0) {
        setSelectedFormId(formsData[0]._id);
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
      const exportData = await dashboardService.exportFormData(selectedFormId);

      // Converter para CSV
      const headers = Object.keys(exportData.data[0] || {});
      const csvContent = [
        headers.join(","),
        ...exportData.data.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              // Escapar valores com vírgulas ou aspas
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

      // Download do arquivo
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
      alert("Erro ao exportar dados");
    }
  };

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
        <Button
          onClick={handleExportData}
          disabled={!selectedFormId || loading}
          className="gap-2 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-2xl disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Exportar Dados
        </Button>
      </PageHeaderWithSearch>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Carregando dados...
              </p>
            </div>
          </div>
        )}

        {!loading && !error && dashboardData && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                icon={<FileText className="w-6 h-6" />}
                title="Formulário"
                value={dashboardData.formTitle}
                iconColor="bg-blue-500"
              />
              <StatsCard
                icon={<Users className="w-6 h-6" />}
                title="Total de Respostas"
                value={dashboardData.totalResponses.toString()}
                iconColor="bg-emerald-500"
              />
              <StatsCard
                icon={<Activity className="w-6 h-6" />}
                title="Questões"
                value={dashboardData.questionsAnalysis.length.toString()}
                iconColor="bg-purple-500"
              />
              <StatsCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Taxa de Conclusão"
                value="100%"
                iconColor="bg-orange-500"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardData.questionsAnalysis.map((question) => (
                <QuestionChart key={question.questionId} question={question} />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && !dashboardData && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Selecione um formulário para visualizar os dados</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  iconColor: string;
}

function StatsCard({ icon, title, value, iconColor }: StatsCardProps) {
  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`${iconColor} p-3 rounded-xl text-emerald`}>{icon}</div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <p
            className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[200px]"
            title={value}
          >
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

interface QuestionChartProps {
  question: FullAnalysisResponse["questionsAnalysis"][0];
}

function QuestionChart({ question }: QuestionChartProps) {
  const getChartOption = () => {
    const baseOption = {
      title: {
        text: question.title,
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis" as const,
        axisPointer: {
          type: "shadow" as const,
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
    };

    switch (question.type) {
      case "scale":
        if (!question.distribution) return null;
        const scaleData = Object.entries(question.distribution).sort(
          (a, b) => Number(a[0]) - Number(b[0])
        );
        return {
          ...baseOption,
          xAxis: {
            type: "category" as const,
            data: scaleData.map(([value]) => value),
            name: "Escala",
          },
          yAxis: {
            type: "value" as const,
            name: "Quantidade",
          },
          series: [
            {
              name: "Respostas",
              type: "bar" as const,
              data: scaleData.map(([_, count]) => count),
              itemStyle: {
                color: "#10b981",
                borderRadius: [8, 8, 0, 0],
              },
              label: {
                show: true,
                position: "top" as const,
              },
            },
          ],
        };

      case "multiple_choice":
      case "dropdown":
        if (!question.distribution) return null;
        const choiceData = Object.entries(question.distribution).sort(
          (a, b) => b[1] - a[1]
        );
        return {
          ...baseOption,
          tooltip: {
            trigger: "item" as const,
            formatter: "{b}: {c} ({d}%)",
          },
          legend: {
            orient: "vertical" as const,
            left: "left",
          },
          series: [
            {
              name: "Respostas",
              type: "pie" as const,
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: "#fff",
                borderWidth: 2,
              },
              label: {
                show: true,
                formatter: "{b}: {d}%",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: "bold",
                },
              },
              data: choiceData.map(([name, value]) => ({ name, value })),
            },
          ],
        };

      case "checkbox":
        if (!question.distribution) return null;
        const checkboxData = Object.entries(question.distribution).sort(
          (a, b) => b[1] - a[1]
        );
        return {
          ...baseOption,
          xAxis: {
            type: "value" as const,
            name: "Quantidade",
          },
          yAxis: {
            type: "category" as const,
            data: checkboxData.map(([option]) => option),
            axisLabel: {
              interval: 0,
              rotate: 0,
              formatter: (value: string) => {
                if (value.length > 20) {
                  return value.substring(0, 20) + "...";
                }
                return value;
              },
            },
          },
          series: [
            {
              name: "Seleções",
              type: "bar" as const,
              data: checkboxData.map(([_, count]) => count),
              itemStyle: {
                color: "#8b5cf6",
                borderRadius: [0, 8, 8, 0],
              },
              label: {
                show: true,
                position: "right" as const,
              },
            },
          ],
        };

      case "text":
        return {
          ...baseOption,
          tooltip: {
            show: false,
          },
          xAxis: {
            show: false,
            type: "value" as const,
          },
          yAxis: {
            show: false,
            type: "category" as const,
          },
          series: [],
        };

      case "date":
        return {
          ...baseOption,
          tooltip: {
            show: false,
          },
          xAxis: {
            show: false,
            type: "value" as const,
          },
          yAxis: {
            show: false,
            type: "category" as const,
          },
          series: [],
        };

      default:
        return null;
    }
  };

  const option = getChartOption();

  if (question.type === "text") {
    return (
      <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {question.title}
        </h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total de respostas:{" "}
            <span className="font-semibold">{question.totalAnswers}</span>
          </p>
          {question.sampleAnswers && question.sampleAnswers.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Exemplos de respostas:
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {question.sampleAnswers.map((answer, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                  >
                    {answer}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (question.type === "date") {
    return (
      <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {question.title}
        </h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total de respostas:{" "}
            <span className="font-semibold">{question.totalAnswers}</span>
          </p>
          {question.range && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                  Data mais antiga
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(question.range.earliest).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                  Data mais recente
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(question.range.latest).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (!option) return null;

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mb-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Total de respostas: {question.totalAnswers}
        </p>
        {question.type === "scale" && question.average && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Média:{" "}
            <span className="font-semibold text-emerald-600">
              {question.average}
            </span>
          </p>
        )}
      </div>
      <ReactECharts
        option={option}
        style={{ height: "350px", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </Card>
  );
}
