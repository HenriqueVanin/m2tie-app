import React from "react";

interface FabButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export function FabButton({ onClick, children }: FabButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-16 h-16 -mt-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
    >
      {children}
    </button>
  );
}
