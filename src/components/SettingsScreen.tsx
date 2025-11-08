import {
  Bell,
  Lock,
  Globe,
  Moon,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import type { Screen } from "../App";

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function SettingsScreen({ onNavigate, onLogout }: SettingsScreenProps) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      {/* Header */}
      <div className="p-6 bg-white border-b-2 border-gray-200">
        <h1>Configurações</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Conta */}
        <div>
          <h3 className="mb-3 text-sm text-gray-500">CONTA</h3>
          <div className="bg-white rounded-lg border-2 border-gray-200 divide-y-2 divide-gray-200">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-600" />
                <span>Alterar senha</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Aparência */}
        <div>
          <h3 className="mb-3 text-sm text-gray-500">APARÊNCIA</h3>
          <div className="bg-white rounded-lg border-2 border-gray-200">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600" />
                <span>Modo escuro</span>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Suporte */}
        <div>
          <h3 className="mb-3 text-sm text-gray-500">SUPORTE</h3>
          <div className="bg-white rounded-lg border-2 border-gray-200 divide-y-2 divide-gray-200">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span>Central de ajuda</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <span>Política de privacidade</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Versão */}
        <div className="text-center text-sm text-gray-500">Versão 1.0.0</div>

        {/* Logout */}
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
