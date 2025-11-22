import React from "react";

interface Props {
  name?: string;
  initials?: string;
  institution?: string;
}

export default function StaffHeader({ name, initials, institution }: Props) {
  return (
    <header className="flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-gray-900 font-semibold">{name || "Usuário"}</p>
        {institution && <p className="text-sm text-gray-500">{institution}</p>}
      </div>
    </header>
  );
}
