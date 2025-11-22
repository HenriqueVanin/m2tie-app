import type { Screen } from "../../../App";
import { useEffect, useState } from "react";
import { ScreenHeader } from "../../../components/ui/screen-header";
import { UserBackgroundLayout } from "../../../layout/UserBackgroundLayout";

interface DiaryScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

// Página transformada em Diário
// Mantém botão de sair no cabeçalho e substitui conteúdo por editor diário.
export function DiaryScreen({ onNavigate, onLogout }: DiaryScreenProps) {
  // Dias em volta do hoje (ontem, hoje, amanhã, etc.)
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [entries, setEntries] = useState<Record<string, string>>({});

  // Carrega entradas do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("diaryEntries");
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
  }, []);

  // Salva quando muda
  useEffect(() => {
    try {
      localStorage.setItem("diaryEntries", JSON.stringify(entries));
    } catch {}
  }, [entries]);

  function updateEntry(text: string) {
    setEntries((prev) => ({ ...prev, [selectedDate]: text }));
  }

  function formatDayLabel(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  }

  function buildRange(center: Date, total = 5) {
    const range: string[] = [];
    const half = Math.floor(total / 2);
    for (let i = -half; i <= half; i++) {
      const d = new Date(center);
      d.setDate(center.getDate() + i);
      range.push(d.toISOString().slice(0, 10));
    }
    return range;
  }

  const today = new Date();
  const days = buildRange(today, 7); // 7 dias (3 antes, hoje, 3 depois)
  const currentText = entries[selectedDate] || "";

  return (
    <UserBackgroundLayout>
      <ScreenHeader
        title="Diário"
        subtitle="Registre suas anotações diárias"
        onLogout={onLogout}
      />
      <div className="relative z-10 flex-1 bg-white p-6 space-y-6 rounded-[32px] mx-[10px] my-[0px] mb-4 pb-20 flex flex-col">
        {/* Cabeçalho de dias */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1">
          {days.map((d) => {
            const isToday = d === new Date().toISOString().slice(0, 10);
            const isSelected = d === selectedDate;
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={[
                  "px-4 py-3 rounded-2xl border text-sm flex flex-col items-center min-w-[90px]",
                  isSelected
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                <span className="font-medium">{formatDayLabel(d)}</span>
                {isToday && (
                  <span className="mt-1 text-[10px] tracking-wide uppercase font-semibold opacity-80">
                    Hoje
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* Editor */}
        <div className="flex flex-col flex-1 min-h-0 pb-20 gap-3">
          <div className="flex items-center justify-between">
            <p className="text-gray-900 text-sm font-medium">
              Entrada de {formatDayLabel(selectedDate)}
            </p>
            <span className="text-xs text-gray-500">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                "pt-BR",
                { day: "2-digit", month: "long", year: "numeric" }
              )}
            </span>
          </div>
          <textarea
            value={currentText}
            onChange={(e) => updateEntry(e.target.value)}
            placeholder="Escreva suas reflexões, tarefas concluídas, impedimentos..."
            className="flex-1 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <div className="flex justify-end text-xs text-gray-500">
            <span>{currentText.length} caracteres</span>
          </div>
        </div>
      </div>
    </UserBackgroundLayout>
  );
}
