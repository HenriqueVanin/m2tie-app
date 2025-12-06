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
  onOpenStaffProfile?: () => void; // optional staff profile button
  titleId?: string;
}

export function ScreenHeader({
  title,
  subtitle,
  gradientFrom = "from-emerald-500",
  gradientTo = "to-emerald-700",
  action,
  onLogout,
  onOpenStaffProfile,
  titleId,
}: ScreenHeaderProps) {
  const gradientClass = `bg-gradient-to-br ${gradientFrom} via-emerald-600 ${gradientTo}`;
  return (
    <div className="relative z-10 p-6 pt-12">
      <div className="m-[0px] flex items-start justify-between gap-4">
        <div>
          <h1
            id={titleId}
            className="text-white text-3xl mb-2 text-[24px] font-semibold"
          >
            {title}
          </h1>
          {subtitle && <p className="text-emerald-100">{subtitle}</p>}
        </div>
        <div className="shrink-0">
          {action ? (
            action
          ) : (
            <div className="flex items-center gap-2">
              {onOpenStaffProfile ? (
                <Button
                  onClick={onOpenStaffProfile}
                  variant="ghost"
                  className="h-10 w-10 rounded-xl"
                  aria-label="Abrir perfil"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                  </svg>
                </Button>
              ) : null}

              {onLogout ? (
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="h-10 bg-white text-red-600 gap-2 rounded-xl backdrop-blur-md transition-all shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sair</span>
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
