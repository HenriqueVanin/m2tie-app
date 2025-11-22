import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "../../ui/button";

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <div className="p-4">
      <Button
        onClick={onLogout}
        variant="outline"
        className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2 rounded-2xl cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
        Sair
      </Button>
    </div>
  );
}
