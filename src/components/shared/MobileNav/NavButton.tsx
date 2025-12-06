import React from "react";

interface NavButtonProps {
  active?: boolean;
  label: string;
  onClick?: () => void;
  ariaLabel?: string;
  children?: React.ReactNode;
}

export function NavButton({
  active,
  label,
  onClick,
  ariaLabel,
  children,
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all cursor-pointer ${
        active
          ? "text-emerald-600 bg-white/80 shadow-sm"
          : "text-gray-600 hover:bg-white/60"
      }`}
    >
      {children}
      <span className="text-xs">{label}</span>
    </button>
  );
}
