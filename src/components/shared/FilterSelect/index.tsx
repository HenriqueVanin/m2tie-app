import React from "react";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Selecione",
  label,
  className,
  disabled,
}: FilterSelectProps) {
  return (
    <div className={"flex flex-col gap-1 " + (className || "")}>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-12 rounded-2xl border border-gray-200 focus:ring-1 focus:ring-[#003087]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
