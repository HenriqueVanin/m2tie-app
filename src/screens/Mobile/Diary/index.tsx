import type { Screen } from "../../../App";
import { useEffect, useState, useRef } from "react";
import { ScreenHeader } from "../../../components/ui/screen-header";
import { UserBackgroundLayout } from "../../../layout/UserBackgroundLayout";
import { getActiveForm } from "../../../services/formService";
import { submitDiaryResponse } from "../../../services/responseService";
import { toast } from "sonner";
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
  // Dias em volta do hoje (ontem, hoje, amanhã, etc.)
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [responsesByDate, setResponsesByDate] = useState<
    Record<string, { responseId?: string; submittedAt?: string; text: string }>
  >({});
  const [diaryFormId, setDiaryFormId] = useState<string | null>(null);
  const [diaryQuestionId, setDiaryQuestionId] = useState<string | null>(null);
  const saveTimer = useRef<number | null>(null);

  // Carrega entradas do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("diaryEntries");
      if (raw) setEntries(JSON.parse(raw));
      const rawResp = localStorage.getItem("diaryResponses");
      if (rawResp) setResponsesByDate(JSON.parse(rawResp));
    } catch {}
  }, []);

  // Salva quando muda
  useEffect(() => {
    try {
      localStorage.setItem("diaryEntries", JSON.stringify(entries));
    } catch {}
  }, [entries]);

  // persist responses mapping locally
  useEffect(() => {
    try {
      localStorage.setItem("diaryResponses", JSON.stringify(responsesByDate));
    } catch {}
  }, [responsesByDate]);

  // find diary form and primary question id on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getActiveForm();
        if (!mounted || !res || res.error || !res.data) return;
        const forms = Array.isArray(res.data) ? res.data : [res.data];
        const diary = forms.find((f) => f && (f.type === "diary" || f.isDiary));
        if (!diary) return;
        setDiaryFormId(diary._id);
        const firstQ = diary.questions?.[0];
        if (firstQ) {
          const qid =
            typeof firstQ.questionId === "string"
              ? firstQ.questionId
              : (firstQ.questionId as any)?._id;
          if (qid) setDiaryQuestionId(qid);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
    };
  }, []);

  function updateEntry(text: string) {
    setEntries((prev) => ({ ...prev, [selectedDate]: text }));

    // if not today, do not attempt to submit
    const todayStr = new Date().toISOString().slice(0, 10);
    if (selectedDate !== todayStr) return;

    // debounce submit as a real response (not draft)
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    const timer = window.setTimeout(async () => {
      try {
        if (!diaryFormId || !diaryQuestionId) return;
        const payload = {
          formId: diaryFormId,
          answers: [{ questionId: diaryQuestionId, answer: text }],
        };
        const res = await submitDiaryResponse(payload);
        if (res && res.error) {
          toast.error(res.error);
          return;
        }
        // use returned response info if present
        const responseData = res?.data;
        const submittedAt =
          responseData?.submittedAt || new Date().toISOString();
        const responseId = responseData?._id;
        setResponsesByDate((prev) => ({
          ...prev,
          [selectedDate]: { responseId, submittedAt, text },
        }));
        toast.success("Entrada do diário salva");
      } catch (e: any) {
        toast.error(e?.message || "Erro ao salvar entrada do diário");
      }
    }, 800);

    saveTimer.current = timer as unknown as number;
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
  const currentText =
    entries[selectedDate] ?? responsesByDate[selectedDate]?.text ?? "";
  const todayStr = new Date().toISOString().slice(0, 10);

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
