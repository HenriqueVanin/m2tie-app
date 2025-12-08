import { useEffect, useRef, useState } from "react";
import { getActiveForm } from "../../../services/formService";
import { submitDiaryResponse } from "../../../services/responseService";
import { toast } from "sonner";

export function useDiaryScreen() {
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

  // load persisted entries and responses
  useEffect(() => {
    try {
      const raw = localStorage.getItem("diaryEntries");
      if (raw) setEntries(JSON.parse(raw));
      const rawResp = localStorage.getItem("diaryResponses");
      if (rawResp) setResponsesByDate(JSON.parse(rawResp));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("diaryEntries", JSON.stringify(entries));
    } catch {}
  }, [entries]);

  useEffect(() => {
    try {
      localStorage.setItem("diaryResponses", JSON.stringify(responsesByDate));
    } catch {}
  }, [responsesByDate]);

  // find diary form and question id
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

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
    };
  }, []);

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

  async function submitTodayEntry(text: string) {
    try {
      if (!diaryFormId || !diaryQuestionId) {
        toast.error("Formulário de diário não encontrado.");
        return;
      }
      const payload = {
        formId: diaryFormId,
        answers: [{ questionId: diaryQuestionId, answer: text }],
      };
      const res = await submitDiaryResponse(payload);
      if (res && (res as any).error) {
        toast.error((res as any).error);
        return;
      }
      const responseData = (res as any)?.data;
      const submittedAt = responseData?.submittedAt || new Date().toISOString();
      const responseId = responseData?._id;
      setResponsesByDate((prev) => ({
        ...prev,
        [selectedDate]: { responseId, submittedAt, text },
      }));
      toast.success("Entrada do diário salva");
    } catch (e: any) {
      toast.error(e?.message || "Erro ao salvar entrada do diário");
    }
  }

  function updateEntry(text: string) {
    setEntries((prev) => ({ ...prev, [selectedDate]: text }));

    const todayStr = new Date().toISOString().slice(0, 10);
    if (selectedDate !== todayStr) return;

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    const timer = window.setTimeout(() => {
      submitTodayEntry(text);
    }, 800);

    saveTimer.current = timer as unknown as number;
  }

  const today = new Date();
  const days = buildRange(today, 7);
  const currentText =
    entries[selectedDate] ?? responsesByDate[selectedDate]?.text ?? "";
  const todayStr = new Date().toISOString().slice(0, 10);

  return {
    selectedDate,
    setSelectedDate,
    entries,
    responsesByDate,
    diaryFormId,
    diaryQuestionId,
    formatDayLabel,
    days,
    currentText,
    todayStr,
    updateEntry,
  } as const;
}

export default useDiaryScreen;
