import React from "react";

interface Props {
  draftStatus?: "idle" | "saving" | "saved" | "error";
  draftSavedAt?: string | null;
}

export default function DraftStatus({ draftStatus, draftSavedAt }: Props) {
  if (typeof draftStatus === "undefined") return null;

  return (
    <div className="text-center mb-2">
      {draftStatus === "saving" && (
        <p className="text-sm text-gray-500">Salvando rascunho...</p>
      )}
      {draftStatus === "saved" && draftSavedAt && (
        <p className="text-sm text-white">
          Rascunho salvo às {new Date(draftSavedAt).toLocaleTimeString()}
        </p>
      )}
      {draftStatus === "error" && (
        <p className="text-sm text-red-500">Erro ao salvar rascunho</p>
      )}
    </div>
  );
}
