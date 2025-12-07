import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Search } from "lucide-react";

export interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  autoFocus?: boolean;
  onSubmit?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  label,
  className,
  autoFocus,
  onSubmit,
}: SearchBarProps) {
  return (
    <div className={"flex flex-col gap-1 " + (className || "")}>
      {label && <Label className="text-sm text-gray-700">{label}</Label>}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          aria-hidden
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) onSubmit();
          }}
          className="h-10 pl-10 rounded-2xl border border-gray-200 focus-visible:ring-1 focus-visible:ring-[#003087]"
          aria-label={label || "Barra de pesquisa"}
        />
      </div>
    </div>
  );
}
