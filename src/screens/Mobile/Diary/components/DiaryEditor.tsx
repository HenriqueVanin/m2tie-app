import React from "react";

interface Props {
  value: string;
  isEditable: boolean;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function DiaryEditor({
  value,
  isEditable,
  onChange,
  placeholder,
}: Props) {
  if (isEditable) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      />
    );
  }

  return (
    <div className="flex-1 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap">
      {value || "Nenhuma entrada para esta data."}
    </div>
  );
}

export default DiaryEditor;
