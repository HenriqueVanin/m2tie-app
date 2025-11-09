import { Home, FileText, User, Settings } from "lucide-react";
import type { Screen } from "../App";

interface MobileNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function MobileNav({ currentScreen, onNavigate }: MobileNavProps) {
  const navItems = [
    { id: "home" as Screen, icon: Home, label: "Home" },
    {
      id: "form" as Screen,
      icon: FileText,
      label: "Formulário",
      highlight: true,
    },
    { id: "profile" as Screen, icon: User, label: "Perfil" },
    { id: "settings" as Screen, icon: Settings, label: "Config" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50">
      <div className="max-w-md mx-auto px-6 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            const isHighlight = item.highlight;

            if (isHighlight) {
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="flex flex-col items-center gap-1 -mt-8"
                >
                  <div className="w-14 h-14 bg-gray-800 cursor-pointer hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-800 font-medium">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 w-14 py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "text-gray-800"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "stroke-2" : ""}`} />
                <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
