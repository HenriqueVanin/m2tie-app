import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import LoginForm from "./LoginForm";
import type { UserType } from "../../App";
import useLoginScreen from "./useLoginScreen";
import { UserBackgroundLayout } from "../../layout/UserBackgroundLayout";
import { ForgotPasswordModal } from "../../components/shared/ForgotPasswordModal";

interface LoginScreenProps {
  onLogin: (type: UserType) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const {
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    emailTouched,
    setEmailTouched,
    passwordTouched,
    setPasswordTouched,
    showForgot,
    setShowForgot,
    forgotEmail,
    setForgotEmail,
    forgotStatus,
    forgotLoading,
    setForgotStatus,
    setForgotLoading,
    emailValid,
    passwordValid,
    handleLogin,
    handleForgotPassword,
  } = useLoginScreen(onLogin as (type: UserType) => void);

  return (
    <UserBackgroundLayout centered>
      <div className="pt-[48px] pr-[24px] pb-[24px] pl-[30px]" />
      <div className="justify-center items-center">
        <LoginForm
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
          error={error}
          emailTouched={emailTouched}
          setEmailTouched={setEmailTouched}
          passwordTouched={passwordTouched}
          setPasswordTouched={setPasswordTouched}
          emailValid={emailValid}
          passwordValid={passwordValid}
          handleLogin={handleLogin}
          setShowForgot={setShowForgot}
        />
      </div>
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
    </UserBackgroundLayout>
  );
}
