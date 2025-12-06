import React from "react";
import { FileText, Users, Activity, TrendingUp } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface Props {
  dashboardData: any;
}

export function OverviewCards({ dashboardData }: Props) {
  return (
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
  );
}

export default OverviewCards;
