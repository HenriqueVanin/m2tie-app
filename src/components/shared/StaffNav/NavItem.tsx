import React from "react";
import type { Screen } from "../../../App";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavItemProps {
  id: Screen;
  label: string;
  Icon: IconType;
  active?: boolean;
  onNavigate: (screen: Screen) => void;
}

export function NavItem({ id, label, Icon, active, onNavigate }: NavItemProps) {
  return (
    <button
      key={id}
      onClick={() => onNavigate(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${
        active
          ? "bg-[#003087] text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          active ? "bg-white/20" : "bg-gray-100"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm">{label}</span>
    </button>
  );
}
