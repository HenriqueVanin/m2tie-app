import { ReactNode } from "react";

interface NotificationCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  content?: ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonColor?: string;
}

export function NotificationCard({
  icon,
  title,
  subtitle,
  content,
  buttonText,
  onButtonClick,
  buttonColor = "emerald",
}: NotificationCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-${buttonColor}-50 to-${buttonColor}-50 border border-${buttonColor}-200 rounded-2xl p-5 shadow-sm`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-10 h-10 bg-gradient-to-br from-${buttonColor}-500 to-${buttonColor}-600 mb-4 rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 font-semibold mb-1">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {content && (
        <div
          className={`bg-white/50 rounded-xl p-4 border border-${buttonColor}-100`}
        >
          {content}
        </div>
      )}
      {buttonText && (
        <button
          onClick={onButtonClick}
          className={`mt-3 text-sm text-${buttonColor}-600 hover:text-${buttonColor}-700 font-medium transition-colors cursor-pointer`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
