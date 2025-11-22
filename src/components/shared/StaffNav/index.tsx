import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileEdit,
  ClipboardList,
  Users,
  FolderOpen,
  HelpCircle,
} from "lucide-react";
import { getUserCookie } from "../../../utils/userCookie";
import { canAccessScreen, type UserRole } from "../../../utils/permissions";
import type { Screen } from "../../../App";
import { NavItem } from "./NavItem";
import { LogoutButton } from "./LogoutButton";

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
      <div className="p-6 bg-[#003087]">
        <h2 className="text-white">{name ? name.split(" ")[0] : "Painel"}</h2>
        <p className="text-blue-200 text-sm mt-1">Painel de Administração</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems
          .filter((item) => canAccessScreen(userRole, item.id))
          .map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              Icon={item.icon}
              label={item.label}
              active={currentScreen === item.id}
              onNavigate={onNavigate}
            />
          ))}
      </nav>

      <LogoutButton onLogout={onLogout} />
    </aside>
  );
}

export default StaffNav;
