import { useState } from "react";
import { BarChart3, TrendingUp, Users, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type DashboardType = "overview" | "users" | "forms" | "analytics";

export function StaffDashboardViewer() {
  const [selectedDashboard, setSelectedDashboard] =
    useState<DashboardType>("overview");

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 bg-white border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1>Visualizador de Dashboards</h1>
            <p className="text-gray-500">Análise e métricas da plataforma</p>
          </div>

          <Select
            value={selectedDashboard}
            onValueChange={(value: DashboardType) =>
              setSelectedDashboard(value as DashboardType)
            }
          >
            <SelectTrigger className="w-64 h-12 border">
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
        {selectedDashboard === "overview" && <OverviewDashboard />}
        {selectedDashboard === "users" && <UsersDashboard />}
        {selectedDashboard === "forms" && <FormsDashboard />}
        {selectedDashboard === "analytics" && <AnalyticsDashboard />}
      </div>
    </div>
  );
}

function OverviewDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">1,248</p>
            <p className="text-sm text-green-600">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Formulários Enviados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">3,567</p>
            <p className="text-sm text-green-600">+8% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">87.3%</p>
            <p className="text-sm text-red-600">-2% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Novos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">42</p>
            <p className="text-sm text-gray-500">Formulários ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Formulários por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Gráfico de linha - Últimos 30 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Gráfico de pizza - Por categoria</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UsersDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">892</p>
            <p className="text-sm text-gray-500">Últimos 7 dias</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">
              Novos Cadastros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">156</p>
            <p className="text-sm text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">
              Taxa de Retenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">78.4%</p>
            <p className="text-sm text-gray-500">Últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border">
        <CardHeader>
          <CardTitle>Crescimento de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Gráfico de crescimento - Últimos 12 meses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FormsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">3,567</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">Completos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">2,845</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">Em Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">512</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">210</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border">
        <CardHeader>
          <CardTitle>Status dos Formulários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Visualização de status por período</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Tempo Médio de Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Métrica de tempo por etapa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>Taxa de Abandono por Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Funil de conversão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border">
        <CardHeader>
          <CardTitle>Engajamento por Hora do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Heatmap de atividade</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
