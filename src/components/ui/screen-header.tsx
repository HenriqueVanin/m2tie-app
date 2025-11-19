import { ReactNode } from "react";
import { Button } from "./button";
import { LogOut } from "lucide-react";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  gradientFrom?: string; // tailwind from-* class
  gradientTo?: string; // tailwind to-* class
  action?: ReactNode; // optional custom action element overrides default
  onLogout?: () => void; // if provided and no custom action, renders default logout button
}

export function ScreenHeader({
  title,
  subtitle,
  gradientFrom = "from-emerald-500",
  gradientTo = "to-emerald-700",
  action,
  onLogout,
}: ScreenHeaderProps) {
  const gradientClass = `bg-gradient-to-br ${gradientFrom} via-emerald-600 ${gradientTo}`;
  return (
    <div className="relative z-10 p-6 pt-12">
      <div className="m-[0px] flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl mb-2 text-[24px]">{title}</h1>
          {subtitle && <p className="text-emerald-100">{subtitle}</p>}
        </div>
        <div className="shrink-0">
          {action ? (
            action
          ) : onLogout ? (
            <Button
              onClick={onLogout}
              variant="outline"
              className="h-10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 gap-2 rounded-xl bg-white/10 backdrop-blur-md transition-all shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sair</span>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
