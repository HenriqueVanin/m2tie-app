import {
  Plus,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  BookOpen,
} from "lucide-react";
import type { Screen } from "../App";
import { useEffect, useState } from "react";
import { getUserCookie } from "../utils/userCookie";
import { ScreenHeader } from "./ui/screen-header";
import { UserBackgroundLayout } from "./UserBackgroundLayout";

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function HomeScreen({ onNavigate, onLogout }: HomeScreenProps) {
  const [userName, setUserName] = useState("");
  const [lastDiaryEntry, setLastDiaryEntry] = useState<{
    date: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    const user = getUserCookie();
    if (user?.name) setUserName(user.name);

    // Buscar última anotação do diário
    try {
      const diaryEntries = localStorage.getItem("diaryEntries");
      if (diaryEntries) {
        const entries = JSON.parse(diaryEntries);
        const dates = Object.keys(entries).sort().reverse();
        if (dates.length > 0) {
          const lastDate = dates[0];
          const text = entries[lastDate];
          if (text && text.trim()) {
            setLastDiaryEntry({ date: lastDate, text });
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar última anotação do diário:", error);
    }
  }, []);
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
        onLogout={onLogout}
      />
      <div className="relative z-10 flex-1 bg-white p-6 space-y-6 rounded-[32px] mx-[10px] my-[0px] mb-4  pb-20">
        <div className="mt-4 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-emerald-600 text-xl font-bold text-[24px]">
                18
              </p>
              <p className="text-xs text-gray-500 mt-1 font-bold">
                Formulários
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-emerald-600 text-xl font-bold text-[24px]">
                15
              </p>
              <p className="text-xs text-gray-500 mt-1 font-bold">Completos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-emerald-600 text-xl font-bold text-[24px]">
                3
              </p>
              <p className="text-xs text-gray-500 mt-1 font-bold">Pendentes</p>
            </div>
          </div>

          {/* Última Anotação do Diário */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 mb-4 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-semibold mb-1">
                  Última Anotação do Diário
                </h3>
                {lastDiaryEntry ? (
                  <p className="text-xs text-gray-500">
                    {new Date(lastDiaryEntry.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Nenhuma anotação ainda
                  </p>
                )}
              </div>
            </div>
            <div className="bg-white/50 rounded-xl p-4 border border-emerald-100">
              {lastDiaryEntry ? (
                <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-wrap">
                  {lastDiaryEntry.text}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Comece a escrever suas anotações diárias para acompanhar seu
                  progresso e reflexões.
                </p>
              )}
            </div>
            {lastDiaryEntry ? (
              <button
                onClick={() => onNavigate("diary")}
                className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
              >
                Ver diário completo →
              </button>
            ) : (
              <button
                onClick={() => onNavigate("diary")}
                className="mt-4 w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Começar a escrever
              </button>
            )}
          </div>

          {/* Your Schedule */}
          {/* <div>
            <h2 className="mb-4 text-gray-900">Notificações</h2>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${notification.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      {notification.icon === "info" && (
                        <Info className="w-5 h-5 text-white" />
                      )}
                      {notification.icon === "alert" && (
                        <AlertCircle className="w-5 h-5 text-white" />
                      )}
                      {notification.icon === "success" && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 mb-1">{notification.title}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </UserBackgroundLayout>
  );
}
