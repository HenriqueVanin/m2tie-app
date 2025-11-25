import React from "react";

interface Props {
  charCount: number;
}

export function EntryFooter({ charCount }: Props) {
  return (
    <div className="flex justify-end text-xs text-gray-500">
      <span>{charCount} caracteres</span>
    </div>
  );
}

export default EntryFooter;
