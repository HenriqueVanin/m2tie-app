import { LayoutDashboard, FileEdit, LogOut, ClipboardList } from "lucide-react";
import { Button } from "./ui/button";
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
  const navItems = [
    {
      id: "staff-dashboards" as Screen,
      icon: LayoutDashboard,
      label: "Dashboards",
    },
    {
      id: "staff-form-builder" as Screen,
      icon: FileEdit,
      label: "Editor de Formulários",
    },
    {
      id: "staff-form-responses" as Screen,
      icon: ClipboardList,
      label: "Respostas de Formulários",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-gray-800">Painel Staff</h2>
        <p className="text-sm text-gray-500">Administração</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 ">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center text-sm gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
