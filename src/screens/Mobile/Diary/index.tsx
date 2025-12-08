import type { Screen } from "../../../App";
import { useEffect } from "react";
import { ScreenHeader } from "../../../components/ui/screen-header";
import { UserBackgroundLayout } from "../../../layout/UserBackgroundLayout";
import useDiaryScreen from "./useDiaryScreen";
import DiaryHeader from "./components/DiaryHeader";
import DayPicker from "./components/DayPicker";
import DiaryEditor from "./components/DiaryEditor";
import EntryFooter from "./components/EntryFooter";

interface DiaryScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

// Página transformada em Diário
// Mantém botão de sair no cabeçalho e substitui conteúdo por editor diário.
export function DiaryScreen({ onNavigate, onLogout }: DiaryScreenProps) {
  const {
    selectedDate,
    setSelectedDate,
    entries,
    responsesByDate,
    formatDayLabel,
    days,
    currentText,
    todayStr,
    updateEntry,
  } = useDiaryScreen();

  const today = new Date();

  return (
    <UserBackgroundLayout>
      <DiaryHeader onLogout={onLogout} />
      <div className="relative z-10 flex-1 bg-white p-6 space-y-6 rounded-[32px] mx-[10px] my-[0px] mb-4 pb-20 flex flex-col">
        {/* Cabeçalho de dias */}
        <DayPicker
          days={days}
          selected={selectedDate}
          onSelect={setSelectedDate}
        />
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
          <DiaryEditor
            value={currentText}
            isEditable={selectedDate === todayStr}
            onChange={updateEntry}
            placeholder="Escreva suas reflexões..."
          />
          <EntryFooter charCount={currentText.length} />
        </div>
      </div>
    </UserBackgroundLayout>
  );
}
