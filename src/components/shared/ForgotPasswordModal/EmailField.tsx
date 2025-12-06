import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import React from "react";

interface EmailFieldProps {
  email: string;
  onEmailChange: (email: string) => void;
}

export function EmailField({ email, onEmailChange }: EmailFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="forgot-email" className="text-sm text-gray-700">
        Email
      </Label>
      <Input
        id="forgot-email"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="h-12 border-gray-200 rounded-xl"
        placeholder="seu.email@exemplo.com"
      />
    </div>
  );
}
