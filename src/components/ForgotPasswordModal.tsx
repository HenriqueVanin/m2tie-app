import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface ForgotPasswordModalProps {
  open: boolean;
  email: string;
  status: string | null;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSend: () => void;
  onClose: () => void;
}

export function ForgotPasswordModal({
  open,
  email,
  status,
  loading,
  onEmailChange,
  onSend,
  onClose,
}: ForgotPasswordModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Recuperar senha
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Informe seu email para receber instruções de redefinição.
        </p>
        <div className="space-y-2">
          <Label htmlFor="forgot-email" className="text-sm text-gray-700">
            Email
          </Label>
          <Input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="h-12 border-gray-200 rounded-xl"
            placeholder="seu.email@exemplo.com"
          />
        </div>
        {status && (
          <div className="text-xs p-2 rounded bg-gray-50 border border-gray-200 text-gray-600">
            {status}
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSend}
            disabled={loading || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl"
          >
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
