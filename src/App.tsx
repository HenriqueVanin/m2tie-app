import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { FormWizardScreen } from "./components/FormWizardScreen";
import { MobileNav } from "./components/MobileNav";

export type Screen =
  | "login"
  | "signup"
  | "home"
  | "profile"
  | "settings"
  | "form";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen("home");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen("login");
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  // Renderiza telas de autenticação
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {currentScreen === "login" && (
          <LoginScreen
            onLogin={handleLogin}
            onNavigateToSignup={() => navigateTo("signup")}
          />
        )}
      </div>
    );
  }

  // Renderiza telas autenticadas com navegação
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {currentScreen === "home" && <HomeScreen onNavigate={navigateTo} />}
      {currentScreen === "profile" && <ProfileScreen onNavigate={navigateTo} />}
      {currentScreen === "settings" && (
        <SettingsScreen onNavigate={navigateTo} onLogout={handleLogout} />
      )}
      {currentScreen === "form" && <FormWizardScreen onNavigate={navigateTo} />}

      <MobileNav currentScreen={currentScreen} onNavigate={navigateTo} />
    </div>
  );
}
