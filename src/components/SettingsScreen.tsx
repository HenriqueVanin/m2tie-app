import {
  Bell,
  Lock,
  Moon,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import type { Screen } from "../App";
import { useState } from "react";
import { ScreenHeader } from "./ui/screen-header";
import { UserBackgroundLayout } from "./UserBackgroundLayout";

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function SettingsScreen({ onNavigate, onLogout }: SettingsScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <UserBackgroundLayout>
      <ScreenHeader
        title="Configurações"
        subtitle="Personalize sua experiência"
      />
      <div className="relative z-10 flex-1 bg-white p-6 space-y-4 rounded-[32px] mx-[10px] my-[0px] mb-4 pb-20">
        <div className="mt-4 space-y-4">
          {/* Preferências */}
          <div className="bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <p className="text-gray-900">Preferências</p>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center">
                    <Moon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm">Modo escuro</p>
                    <p className="text-xs text-gray-500">Ativar tema escuro</p>
                  </div>
                </div>
                <Switch
                  checked={darkModeEnabled}
                  onCheckedChange={setDarkModeEnabled}
                />
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <p className="text-gray-900">Segurança</p>
            </div>

            <div className="divide-y divide-gray-100">
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 text-sm">Alterar senha</p>
                    <p className="text-xs text-gray-500">
                      Atualizar senha de acesso
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Suporte */}
          <div className="bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <p className="text-gray-900">Suporte</p>
            </div>

            <div className="divide-y divide-gray-100">
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 text-sm">Central de ajuda</p>
                    <p className="text-xs text-gray-500">Tire suas dúvidas</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Logout */}
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-14 border-2 border-red-200 text-red-600 hover:bg-red-50 gap-2 rounded-2xl"
          >
            <LogOut className="w-5 h-5" />
            Sair da conta
          </Button>
        </div>
      </div>
    </UserBackgroundLayout>
  );
}
