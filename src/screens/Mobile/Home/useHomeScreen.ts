import { useEffect, useState } from "react";
import { getUserCookie } from "../../../utils/userCookie";
import { getActiveForm } from "../../../services/formService";

export function useHomeScreen() {
  const [userName, setUserName] = useState("");
  const [lastDiaryEntry, setLastDiaryEntry] = useState<{
    date: string;
    text: string;
  } | null>(null);
  const [hasActiveForm, setHasActiveForm] = useState(false);

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
      // keep silent; caller can still render
      // but log for debugging
      // eslint-disable-next-line no-console
      console.error("Erro ao carregar última anotação do diário:", error);
    }

    // Verificar se há formulário ativo disponível para o usuário
    (async () => {
      try {
        const res = await getActiveForm();
        console.log(res);
        setHasActiveForm(
          Array.isArray(res.data) &&
            res.data.filter(
              (form: any) => form.type !== "diary" && form.hasResponded !== true
            ).length > 0
        );
      } catch (e) {
        setHasActiveForm(false);
      }
    })();
  }, []);

  return {
    userName,
    lastDiaryEntry,
    hasActiveForm,
  } as const;
}

export default useHomeScreen;
