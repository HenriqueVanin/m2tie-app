import React from "react";

interface IconBlockProps {
  className?: string;
  children?: React.ReactNode;
}

export function IconBlock({ className = "", children }: IconBlockProps) {
  return (
    <div
      className={`w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 mb-4 rounded-xl flex items-center justify-center shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}
