import {
  LayoutDashboard,
  FileEdit,
  LogOut,
  ClipboardList,
  Users,
  FolderOpen,
  HelpCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { getUserCookie } from "../utils/userCookie";
import { canAccessScreen, type UserRole } from "../utils/permissions";
import type { Screen } from "../App";

interface StaffNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function StaffNav({
  currentScreen,
  onNavigate,
  onLogout,
}: StaffNavProps) {
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("student");

  useEffect(() => {
    const user = getUserCookie();
    if (user?.name) setName(user.name);
    if (user?.role) setUserRole(user.role as UserRole);
  }, []);

  const navItems = [
    {
      id: "staff-dashboards" as Screen,
      icon: LayoutDashboard,
      label: "Gráficos e Análises",
    },
    {
      id: "staff-user-management" as Screen,
      icon: Users,
      label: "Gerenciar Usuários",
    },
    {
      id: "staff-question-bank" as Screen,
      icon: HelpCircle,
      label: "Banco de Questões",
    },
    {
      id: "staff-form-builder" as Screen,
      icon: FileEdit,
      label: "Criador de Formulários",
    },
    {
      id: "staff-form-responses-by-form" as Screen,
      icon: FolderOpen,
      label: "Respostas por Formulário",
    },
    {
      id: "staff-form-responses" as Screen,
      icon: ClipboardList,
      label: "Todas as Respostas",
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 bg-[#003087]">
        {/* <div className="flex items-center gap-3 mb-4">
          <img
            src={logoImage}
            alt="M2TIC"
            className="h-12 bg-white rounded-[40px] py-[1px] px-[31px] py-[7px]"
          />
        </div> */}
        <h2 className="text-white">{name ? name.split(" ")[0] : "Painel"}</h2>
        <p className="text-blue-200 text-sm mt-1">Painel de Administração</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems
          .filter((item) => canAccessScreen(userRole, item.id))
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#003087] text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? "bg-white/20" : "bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2 rounded-2xl cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
