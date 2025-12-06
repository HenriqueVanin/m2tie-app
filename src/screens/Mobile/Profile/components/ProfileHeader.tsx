import React from "react";

interface Props {
  initials?: string | null;
  name?: string | null;
  institution?: string | null;
  id?: string;
}

export default function ProfileHeader({
  initials,
  name,
  institution,
  id = "profile-heading",
}: Props) {
  return (
    <header className="flex flex-col items-center gap-4" id={id}>
      <figure className="relative">
        <div
          className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl"
          aria-hidden
        >
          <span className="text-white text-2xl" aria-hidden>
            {initials}
          </span>
        </div>
        <figcaption className="sr-only">Avatar do usuário {name}</figcaption>
      </figure>
      <div className="text-center">
        <p className="text-gray-900">{name || "Usuário"}</p>
        {institution && <p className="text-sm text-gray-500">{institution}</p>}
      </div>
    </header>
  );
}
