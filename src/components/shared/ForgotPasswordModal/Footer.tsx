import React from "react";
import { Button } from "../../ui/button";

interface FooterProps {
  loading: boolean;
  email: string;
  onClose: () => void;
  onSend: () => void;
}

export function Footer({ loading, email, onClose, onSend }: FooterProps) {
  return (
    <div className="flex w-full gap-2">
      <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">
        Cancelar
      </Button>
      <Button
        onClick={onSend}
        disabled={loading || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)}
        className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl"
      >
        {loading ? "Enviando..." : "Enviar"}
      </Button>
    </div>
  );
}
