import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { FormWizardScreen } from "./components/FormWizardScreen";
import { MobileNav } from "./components/MobileNav";
import { StaffDashboardViewer } from "./components/StaffDashboardViewer";
import { StaffFormBuilder } from "./components/StaffFormBuilder";
import { StaffFormResponses } from "./components/StaffFormResponses";
import { StaffNav } from "./components/StaffNav";
import { getUserFromToken } from "./utils/auth";

export type Screen =
  | "login"
  | "signup"
  | "home"
  | "profile"
  | "settings"
  | "form"
  | "staff-dashboards"
  | "staff-form-builder"
  | "staff-form-responses";
export type UserType = "user" | "staff";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>("user");

  // Verificar token ao carregar a aplicação
  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      const type: UserType = 
        user.role === "staff" || user.role === "admin" 
          ? "staff" 
          : "user";
      
      setIsAuthenticated(true);
      setUserType(type);
      setCurrentScreen(type === "staff" ? "staff-dashboards" : "home");
    }
  }, []);

  const handleLogin = (type: UserType = "user") => {
    setIsAuthenticated(true);
    setUserType(type);
    setCurrentScreen(type === "staff" ? "staff-dashboards" : "home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserType("user");
    setCurrentScreen("login");
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  // Renderiza telas de autenticação
  if (currentScreen === "signup") {
    return (
      <SignupScreen
        onNavigateToLogin={() => setCurrentScreen("login")}
        onSignupSuccess={() => setCurrentScreen("login")}
      />
    );
  }

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

  // Renderiza interface Staff (Desktop)
  if (userType === "staff") {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <StaffNav
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />

        <div className="flex-1">
          {currentScreen === "staff-dashboards" && <StaffDashboardViewer />}
          {currentScreen === "staff-form-builder" && <StaffFormBuilder />}
          {currentScreen === "staff-form-responses" && <StaffFormResponses />}
        </div>
      </div>
    );
  }

  // Renderiza telas autenticadas com navegação (Mobile)
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