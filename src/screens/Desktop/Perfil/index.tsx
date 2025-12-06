import React from "react";
import { ScreenHeader } from "../../../components/ui/screen-header";
import UserBackgroundLayout from "../../../layout/UserBackgroundLayout";
import StaffHeader from "./StaffHeader";
import StaffInfo from "./StaffInfo";
import StaffActions from "./StaffActions";
import { ForgotPasswordModal } from "../../../components/shared/ForgotPasswordModal";
import { PageHeader } from "../../../components/ui/page-header";

interface Props {
  name?: string;
  email?: string;
  institution?: string;
  location?: string;
  initials?: string;
  onLogout?: () => void;
}

export default function StaffProfile({
  name,
  email,
  institution,
  location,
  initials,
  onLogout,
}: Props) {
  const [showForgot, setShowForgot] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState(email || "");
  const [forgotStatus, setForgotStatus] = React.useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = React.useState(false);

  const handleForgotPassword = async () => {
    // Placeholder: integrate with forgot password logic
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStatus("Enviado");
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Perfil"
        description="Mude suas configurações pessoais e de conta"
      />
      <main className="relative z-10 flex-1 mb-4 p-6 space-y-6 mx-[10px] my-[0px] pb-20">
        <section className="mt-4 space-y-6 mb-4">
          <StaffHeader
            name={name}
            initials={initials}
            institution={institution}
          />

          <StaffInfo
            name={name}
            email={email}
            institution={institution}
            location={location}
          />

          <StaffActions
            onChangePassword={() => setShowForgot(true)}
            onHelp={() => window.location.assign("/faq")}
          />

          <ForgotPasswordModal
            open={showForgot}
            email={forgotEmail}
            status={forgotStatus}
            loading={forgotLoading}
            onEmailChange={setForgotEmail}
            onSend={handleForgotPassword}
            onClose={() => {
              setShowForgot(false);
              setForgotStatus(null);
            }}
          />
        </section>
      </main>
    </div>
  );
}
