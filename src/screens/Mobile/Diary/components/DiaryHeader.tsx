import React from "react";
import { ScreenHeader } from "../../../../components/ui/screen-header";

interface Props {
  onLogout: () => void;
}

export function DiaryHeader({ onLogout }: Props) {
  return (
    <ScreenHeader
      title="Diário"
      subtitle="Registre suas anotações diárias"
      onLogout={onLogout}
    />
  );
}

export default DiaryHeader;
