import React from "react";

interface DayPickerProps {
  days: string[];
  selected: string;
  onSelect: (d: string) => void;
}

export function DayPicker({ days, selected, onSelect }: DayPickerProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1">
      {days.map((d) => {
        const isToday = d === new Date().toISOString().slice(0, 10);
        const isSelected = d === selected;
        return (
          <button
            key={d}
            onClick={() => onSelect(d)}
            className={[
              "px-4 py-3 rounded-2xl border text-sm flex flex-col items-center min-w-[90px]",
              isSelected
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
            ].join(" ")}
          >
            <span className="font-medium">
              {new Date(d + "T00:00:00").toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
              })}
            </span>
            {isToday && (
              <span className="mt-1 text-[10px] tracking-wide uppercase font-semibold opacity-80">
                Hoje
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default DayPicker;
