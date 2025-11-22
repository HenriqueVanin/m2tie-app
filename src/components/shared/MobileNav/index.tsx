import { Home, FileText, User, BookOpen, Info } from "lucide-react";
import type { Screen } from "../../../App";
import { NavButton } from "./NavButton";
import { FabButton } from "./FabButton";

interface MobileNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function MobileNav({ currentScreen, onNavigate }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
      <div className="mx-4 mb-4 backdrop-blur-2xl bg-white/80 border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] rounded-3xl">
        <div className="flex items-center justify-around h-20 px-6">
          <NavButton
            active={currentScreen === "home"}
            label="Início"
            onClick={() => onNavigate("home")}
          >
            <Home className="w-6 h-6" />
          </NavButton>

          <NavButton
            active={currentScreen === "diary"}
            label="Diário"
            ariaLabel="Diário"
            onClick={() => onNavigate("diary")}
          >
            <BookOpen className="w-6 h-6" />
          </NavButton>

          <FabButton onClick={() => onNavigate("form")}>
            <FileText className="w-7 h-7" />
          </FabButton>

          <NavButton
            active={currentScreen === "profile"}
            label="Perfil"
            onClick={() => onNavigate("profile")}
          >
            <User className="w-6 h-6" />
          </NavButton>

          <NavButton
            active={currentScreen === "about"}
            label="Sobre"
            onClick={() => onNavigate("about")}
          >
            <Info className="w-6 h-6" />
          </NavButton>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
