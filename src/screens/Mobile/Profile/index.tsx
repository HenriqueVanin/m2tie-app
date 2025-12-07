import {
  Mail,
  Lock,
  HelpCircle,
  ChevronRight,
  MapPin,
  Building2,
} from "lucide-react";
import type { Screen } from "../../../App";
import { ScreenHeader } from "../../../components/ui/screen-header";
import { UserBackgroundLayout } from "../../../layout/UserBackgroundLayout";
import { ForgotPasswordModal } from "../../../components/shared/ForgotPasswordModal";
import { useProfileScreen } from "./useProfileScreen";
import ProfileHeader from "./components/ProfileHeader";
import ProfileDetails from "./components/ProfileDetails";

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function ProfileScreen({ onNavigate, onLogout }: ProfileScreenProps) {
  const {
    name,
    email,
    institution,
    city,
    state,
    loading,
    showForgot,
    setShowForgot,
    forgotEmail,
    setForgotEmail,
    forgotStatus,
    setForgotStatus,
    forgotLoading,
    setForgotLoading,
    handleForgotPassword,
    initials,
    location,
    anonymous,
    setAnonymous,
    showPrivacy,
    setShowPrivacy,
    privacyStatus,
    setPrivacyStatus,
    privacyLoading,
    setPrivacyLoading,
    handleUpdatePrivacy,
  } = useProfileScreen();
  return (
    <UserBackgroundLayout>
      <ScreenHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações"
        onLogout={onLogout}
      />

      <main className="relative z-10 flex-1 bg-white mb-4 p-6 space-y-6 rounded-[32px] mx-[10px] my-[0px] pb-20">
        <section
          aria-labelledby="profile-heading"
          className="mt-4 space-y-6 mb-4"
        >
          <ProfileHeader
            initials={initials}
            name={name}
            institution={institution}
          />
          <ProfileDetails
            name={name}
            email={email}
            institution={institution}
            city={city}
            state={state}
            location={location}
            showForgot={showForgot}
            setShowForgot={setShowForgot}
            forgotEmail={forgotEmail}
            setForgotEmail={setForgotEmail}
            forgotStatus={forgotStatus}
            setForgotStatus={setForgotStatus}
            forgotLoading={forgotLoading}
            setForgotLoading={setForgotLoading}
            handleForgotPassword={handleForgotPassword}
            onNavigateToFAQ={() => onNavigate("faq")}
            anonymous={anonymous}
            setAnonymous={setAnonymous}
            showPrivacy={showPrivacy}
            setShowPrivacy={setShowPrivacy}
            privacyStatus={privacyStatus}
            setPrivacyStatus={setPrivacyStatus}
            privacyLoading={privacyLoading}
            setPrivacyLoading={setPrivacyLoading}
            handleUpdatePrivacy={handleUpdatePrivacy}
          />
        </section>
      </main>
    </UserBackgroundLayout>
  );
}
