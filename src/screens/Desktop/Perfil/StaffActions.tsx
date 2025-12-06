import React from "react";
import { Lock, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface Props {
  onChangePassword: () => void;
  onHelp: () => void;
}

export default function StaffActions({ onChangePassword, onHelp }: Props) {
  return (
    <div className="pt-4 mt-2 border-t border-gray-200 space-y-2 pt-6">
      <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden">
        <button
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          onClick={onChangePassword}
          aria-label="Alterar senha"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-gray-900 text-sm">Alterar senha</p>
              <p className="text-xs text-gray-500">Atualizar senha de acesso</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" aria-hidden />
          <span className="sr-only">Ir para alterar senha</span>
        </button>
      </div>
    </div>
  );
}
