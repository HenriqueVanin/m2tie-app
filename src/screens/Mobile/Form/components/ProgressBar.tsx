import React from "react";

interface Props {
  total: number;
  current: number;
}

export default function ProgressBar({ total, current }: Props) {
  return (
    <div
      role="progressbar"
      aria-label="Progresso do formulário"
      aria-valuemin={0}
      aria-valuemax={total - 1}
      aria-valuenow={current}
      className="flex gap-2"
    >
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-2 flex-1 rounded-full transition-all ${
            index <= current ? "bg-white" : "bg-white/30"
          }`}
        />
      ))}
    </div>
  );
}
