import { NotificationCard } from "../../../components/ui/NotificationCard";
import { BookOpen, FileText } from "lucide-react";
import type { Screen } from "../../../App";
import { useEffect, useState } from "react";
import useHomeScreen from "./useHomeScreen";
import { ScreenHeader } from "../../../components/ui/screen-header";
import { UserBackgroundLayout } from "../../../layout/UserBackgroundLayout";

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function HomeScreen({ onNavigate, onLogout }: HomeScreenProps) {
  const { userName, lastDiaryEntry } = useHomeScreen();
  const notifications = [
    {
      id: 1,
      title: "Novo formulário disponível",
      message: "Questionário Socioeconômico - UNIFESP",
      date: "05/11/2025",
      time: "Há 2 horas",
      type: "info",
      color: "from-emerald-500 to-emerald-600",
      icon: "info",
    },
    {
      id: 2,
      title: "Formulário em análise",
      message: "Avaliação de Curso - USP",
      date: "04/11/2025",
      time: "Há 1 dia",
      type: "warning",
      color: "from-indigo-500 to-indigo-600",
      icon: "alert",
    },
    {
      id: 3,
      title: "Formulário pendente",
      message: "Pesquisa de Infraestrutura - UNESP",
      date: "03/11/2025",
      time: "Há 2 dias",
      type: "alert",
      color: "from-purple-500 to-purple-600",
      icon: "alert",
    },
  ];

  const recentForms = [
    {
      id: 1,
      title: "Questionário Socioeconômico",
      status: "Completo",
      date: "05/11/2025",
      institution: "UNIFESP",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: 2,
      title: "Avaliação de Curso",
      status: "Em análise",
      date: "04/11/2025",
      institution: "USP",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: 3,
      title: "Pesquisa de Infraestrutura",
      status: "Pendente",
      date: "03/11/2025",
      institution: "UNESP",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const subjects = [
    {
      id: 1,
      name: "Formulários Ativos",
      count: "5",
      color: "from-orange-400 to-orange-500",
    },
    {
      id: 2,
      name: "Completos",
      count: "15",
      color: "from-indigo-400 to-indigo-500",
    },
    {
      id: 3,
      name: "Pendentes",
      count: "3",
      color: "from-purple-400 to-purple-500",
    },
    {
      id: 4,
      name: "Em Análise",
      count: "2",
      color: "from-pink-400 to-pink-500",
    },
  ];

  return (
    <UserBackgroundLayout>
      <ScreenHeader
        title={`Olá${userName ? `, ${userName.split(" ")[0]}!` : "!"}`}
        subtitle="Navegue pelos seus formulários"
        titleId="home-heading"
        onLogout={onLogout}
      />
      <main aria-labelledby="home-heading">
        <div className="relative z-10 flex-1 bg-white p-6 space-y-6 rounded-[32px] mx-[10px] my-[0px] mb-4  pb-20">
          <div className="pb-4 space-y-6">
            <NotificationCard
              icon={<FileText className="w-5 h-5 text-white" aria-hidden />}
              title="Novo formulário disponível"
              subtitle="Você tem um novo formulário para preencher."
              buttonText="Responder formulário"
              onButtonClick={() => onNavigate("form")}
              buttonColor="emerald"
            />
            <NotificationCard
              icon={<BookOpen className="w-5 h-5 text-white" aria-hidden />}
              title="Última anotação do diário"
              subtitle={
                lastDiaryEntry
                  ? new Date(lastDiaryEntry.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Nenhuma anotação ainda"
              }
              content={
                lastDiaryEntry ? (
                  <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-wrap">
                    {lastDiaryEntry.text}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Comece a escrever suas anotações diárias para acompanhar seu
                    progresso e reflexões.
                  </p>
                )
              }
              buttonText={
                lastDiaryEntry ? "Ver diário completo →" : "Começar a escrever"
              }
              onButtonClick={() => onNavigate("diary")}
              buttonAriaLabel={
                lastDiaryEntry
                  ? "Ver diário completo"
                  : "Começar a escrever diário"
              }
              buttonColor="emerald"
            />
          </div>
        </div>
      </main>
    </UserBackgroundLayout>
  );
}
