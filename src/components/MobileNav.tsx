import { Home, FileText, User, BookOpen, Info } from "lucide-react";
import type { Screen } from "../App";

interface MobileNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function MobileNav({ currentScreen, onNavigate }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
      <div className="mx-4 mb-4 backdrop-blur-2xl bg-white/80 border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] rounded-3xl">
        <div className="flex items-center justify-around h-20 px-6">
          <button
            onClick={() => onNavigate("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
              currentScreen === "home"
                ? "text-[#003087] bg-white/80 shadow-sm"
                : "text-gray-600 hover:bg-white/50"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Início</span>
          </button>
          <button
            onClick={() => onNavigate("diary")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
              currentScreen === "diary"
                ? "text-[#003087] bg-white/80 shadow-sm"
                : "text-gray-600 hover:bg-white/50"
            }`}
            aria-label="Diário"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Diário</span>
          </button>

          {/* FAB - Form Button */}
          <button
            onClick={() => onNavigate("form")}
            className="flex items-center justify-center w-16 h-16 -mt-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <FileText className="w-7 h-7" />
          </button>

          <button
            onClick={() => onNavigate("profile")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
              currentScreen === "profile"
                ? "text-[#003087] bg-white/80 shadow-sm"
                : "text-gray-600 hover:bg-white/50"
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </button>
          <button
            onClick={() => onNavigate("about")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
              currentScreen === "about"
                ? "text-[#003087] bg-white/80 shadow-sm"
                : "text-gray-600 hover:bg-white/50"
            }`}
          >
            <Info className="w-6 h-6" />
            <span className="text-xs">Sobre</span>
          </button>
        </div>
      </div>
    </div>
  );
}
