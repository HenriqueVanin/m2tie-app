import * as React from "react";
import { cn } from "./utils";

interface SimpleDatePickerProps {
  // Accept Date, ISO string, or timestamp
  value?: Date | string | number | null;
  onChange?: (date: Date | null) => void;
  className?: string;
}

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Base input classes copied from `Input` component for visual consistency
const inputBase =
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

export function SimpleDatePicker({
  value,
  onChange,
  className,
}: SimpleDatePickerProps) {
  const today = new Date();

  // parse incoming value safely into a Date (if possible)
  const parsedValue: Date | null = React.useMemo(() => {
    if (value === undefined || value === null) return null;
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }
    try {
      const d = new Date(value as any);
      return isNaN(d.getTime()) ? null : d;
    } catch (e) {
      return null;
    }
  }, [value]);

  // internal state used only in uncontrolled mode
  const [internalYear, setInternalYear] = React.useState(
    parsedValue ? parsedValue.getFullYear() : today.getFullYear()
  );
  const [internalMonth, setInternalMonth] = React.useState(
    parsedValue ? parsedValue.getMonth() : today.getMonth()
  );
  const [internalDay, setInternalDay] = React.useState(
    parsedValue ? parsedValue.getDate() : today.getDate()
  );

  const isControlled = parsedValue !== null;

  const displayYear = isControlled
    ? (parsedValue as Date).getFullYear()
    : internalYear;
  const displayMonth = isControlled
    ? (parsedValue as Date).getMonth()
    : internalMonth;
  const displayDay = isControlled
    ? (parsedValue as Date).getDate()
    : internalDay;

  const daysInMonth = getDaysInMonth(displayYear, displayMonth);
  const firstDayOfWeek = new Date(displayYear, displayMonth, 1).getDay();

  // Cria matriz de semanas
  const weeks: Array<Array<number | null>> = [];
  let currentDay = 1;
  while (currentDay <= daysInMonth) {
    const week: Array<number | null> = [];
    for (let i = 0; i < 7; i++) {
      if (weeks.length === 0 && i < firstDayOfWeek) {
        week.push(null);
      } else if (currentDay > daysInMonth) {
        week.push(null);
      } else {
        week.push(currentDay);
        currentDay++;
      }
    }
    weeks.push(week);
  }

  return (
    <div
      className={cn(
        "w-full max-w-xs mx-auto p-4 rounded-xl bg-card flex flex-col gap-4 items-center justify-center",
        className
      )}
    >
      <div className="flex gap-2 w-full justify-center">
        <select
          className={cn(inputBase, "flex-1 pr-2")}
          value={displayMonth}
          onChange={(e) => {
            const newMonth = Number(e.target.value);
            const newDays = getDaysInMonth(displayYear, newMonth);
            const newDay = Math.min(displayDay, newDays);

            if (isControlled) {
              onChange?.(new Date(displayYear, newMonth, newDay));
            } else {
              setInternalMonth(newMonth);
              setInternalDay(newDay);
              onChange?.(new Date(internalYear, newMonth, newDay));
            }
          }}
        >
          {months.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="number"
          className={cn(inputBase, "w-24 text-center")}
          value={displayYear}
          min={1900}
          max={2100}
          onChange={(e) => {
            const newYear = Number(e.target.value);
            const newDays = getDaysInMonth(newYear, displayMonth);
            const newDay = Math.min(displayDay, newDays);

            if (isControlled) {
              onChange?.(new Date(newYear, displayMonth, newDay));
            } else {
              setInternalYear(newYear);
              setInternalDay(newDay);
              onChange?.(new Date(newYear, internalMonth, newDay));
            }
          }}
        />
      </div>
      <div className="w-full mt-2">
        {/* Cabeçalho dos dias da semana */}
        <div className="flex gap-2 w-full mb-1 justify-start">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, i) => (
            <span
              key={dia}
              className="text-xs text-muted-foreground font-medium flex items-center justify-center w-9 h-6"
            >
              {dia}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2 w-full">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex gap-2 w-full justify-start">
              {week.map((d, di) =>
                d ? (
                  <button
                    key={d + "-" + wi}
                    type="button"
                    className={cn(
                      "h-9 w-9 rounded-md text-base font-medium border border-border transition-all duration-150 flex items-center justify-center",
                      displayDay === d
                        ? "bg-primary text-primary-foreground shadow focus:ring-2 focus:ring-ring"
                        : "bg-input text-foreground hover:bg-secondary"
                    )}
                    onClick={() => {
                      if (isControlled) {
                        onChange?.(new Date(displayYear, displayMonth, d));
                      } else {
                        setInternalDay(d);
                        onChange?.(new Date(internalYear, internalMonth, d));
                      }
                    }}
                  >
                    {d}
                  </button>
                ) : (
                  <span
                    key={"empty-" + wi + "-" + di}
                    className="w-9 h-9"
                  ></span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
