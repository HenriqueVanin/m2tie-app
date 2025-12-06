import { useEffect, useState } from "react";
import { getUserCookie } from "../../../utils/userCookie";

export function useHomeScreen() {
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
      // keep silent; caller can still render
      // but log for debugging
      // eslint-disable-next-line no-console
      console.error("Erro ao carregar última anotação do diário:", error);
    }
  }, []);

  return {
    userName,
    lastDiaryEntry,
  } as const;
}

export default useHomeScreen;
