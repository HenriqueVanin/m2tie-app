import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { LoginScreen } from "./screens/In";
import ResetPasswordScreen from "./screens/In/ResetPassword";
import { HomeScreen } from "./screens/Mobile/Home";
import { ProfileScreen } from "./screens/Mobile/Profile";
import { DiaryScreen } from "./screens/Mobile/Diary";
import { FormWizardScreen } from "./screens/Mobile/Form";
import { MobileNav } from "./components/shared/MobileNav";
import { StaffDashboardViewer } from "./screens/Desktop/Dashboard";
import { StaffFormBuilder } from "./screens/Desktop/FormBuilder";
import { StaffFormResponses } from "./screens/Desktop/Responses";
import { StaffFormResponsesByForm } from "./screens/Desktop/Forms";
import { StaffNav } from "./components/shared/StaffNav";
import { ProtectedRoute } from "./layout/ProtectedRoute";
import { AuthFallback } from "./layout/AuthFallback";
import { getUserFromToken } from "./utils/auth";
import { StaffQuestionManager } from "./screens/Desktop/Question";
import { AboutScreen } from "./screens/Mobile/About";
import { StaffUserManagement } from "./screens/Desktop/UserManagement";
import { FAQScreen } from "./screens/Mobile/FAQ";

export type Screen =
  | "login"
  | "signup"
  | "home"
  | "profile"
  | "diary"
  | "form"
  | "about"
  | "staff-dashboards"
  | "staff-form-builder"
  | "staff-form-responses"
  | "staff-form-responses-by-form"
  | "faq"
  | "staff-user-management"
  | "staff-question-bank"
  | "notification";

export type UserType = "user" | "staff";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>("user");
  const navigate = useNavigate();
  const location = useLocation();

  const routeMap: Record<Screen, string> = {
    login: "/login",
    signup: "/signup",
    home: "/home",
    profile: "/profile",
    diary: "/diary",
    form: "/form",
    about: "/about",
    faq: "/faq",
    "staff-dashboards": "/staff/dashboards",
    "staff-form-builder": "/staff/form-builder",
    "staff-form-responses": "/staff/forms/responses",
    "staff-form-responses-by-form": "/staff/forms/responses/by-form",
    "staff-question-bank": "/staff/questions",
    "staff-user-management": "/staff/users",
    notification: "/notifications",
  };
  const reverseRouteMap: Record<string, Screen> = Object.fromEntries(
    Object.entries(routeMap).map(([k, v]) => [v, k as Screen])
  );

  // Encontrar screen baseado no pathname (ignorando query params)
  const findCurrentScreen = (): Screen => {
    const pathname = location.pathname;

    // Verificar match exato
    if (reverseRouteMap[pathname]) {
      return reverseRouteMap[pathname];
    }

    // Verificar se pathname começa com alguma rota conhecida
    for (const [route, screen] of Object.entries(reverseRouteMap)) {
      if (pathname.startsWith(route)) {
        return screen;
      }
    }

    // Fallback padrão
    return isAuthenticated
      ? userType === "staff"
        ? "staff-dashboards"
        : "home"
      : "login";
  };

  const currentScreen: Screen = findCurrentScreen();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      const type: UserType =
        user.role === "teacher_analyst" || user.role === "admin"
          ? "staff"
          : "user";
      setIsAuthenticated(true);
      setUserType(type);
      if (["/", "/login", "/signup"].includes(location.pathname)) {
        navigate(
          type === "staff" ? routeMap["staff-dashboards"] : routeMap.home,
          { replace: true }
        );
      }
    }
  }, []);

  const handleLogin = (type: UserType = "user") => {
    setIsAuthenticated(true);
    setUserType(type);
    navigate(type === "staff" ? routeMap["staff-dashboards"] : routeMap.home, {
      replace: true,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserType("user");
    navigate(routeMap.login, { replace: true });
  };

  const navigateTo = (screen: Screen) => {
    const path = routeMap[screen];
    if (path) navigate(path);
  };

  return (
    <Routes>
      <Route
        path="/faq"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType}>
            <div className="min-h-screen bg-gray-50">
              <FAQScreen onLogout={handleLogout} />
              <MobileNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
              />
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
      <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType}>
            <div className="min-h-screen bg-gray-50">
              <HomeScreen onNavigate={navigateTo} onLogout={handleLogout} />
              <MobileNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
              />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType}>
            <div className="min-h-screen bg-gray-50">
              <ProfileScreen onNavigate={navigateTo} onLogout={handleLogout} />
              <MobileNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
              />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/diary"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType}>
            <div className="min-h-screen bg-gray-50">
              <DiaryScreen onNavigate={navigateTo} onLogout={handleLogout} />
              <MobileNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
              />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType}>
            <div className="min-h-screen bg-gray-50">
              <AboutScreen onNavigate={navigateTo} onLogout={handleLogout} />
              <MobileNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
              />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/form"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userType={userType}>
            <div className="min-h-screen bg-gray-50">
              <FormWizardScreen onNavigate={navigateTo} />
              <MobileNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
              />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/dashboards"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userType={userType}
            requireStaff
          >
            <div className="min-h-screen bg-gray-50 flex">
              <StaffNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
              <div className="flex-1">
                <StaffDashboardViewer />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/form-builder"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userType={userType}
            requireStaff
          >
            <div className="min-h-screen bg-gray-50 flex">
              <StaffNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
              <div className="flex-1">
                <StaffFormBuilder />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/forms/responses"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userType={userType}
            requireStaff
          >
            <div className="min-h-screen bg-gray-50 flex">
              <StaffNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
              <div className="flex-1">
                <StaffFormResponses />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/forms/responses/by-form"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userType={userType}
            requireStaff
          >
            <div className="min-h-screen bg-gray-50 flex">
              <StaffNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
              <div className="flex-1">
                <StaffFormResponsesByForm />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/questions"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userType={userType}
            requireStaff
          >
            <div className="min-h-screen bg-gray-50 flex">
              <StaffNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
              <div className="flex-1">
                <StaffQuestionManager />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/users"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userType={userType}
            requireStaff
          >
            <div className="min-h-screen bg-gray-50 flex">
              <StaffNav
                currentScreen={currentScreen}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
              <div className="flex-1">
                <StaffUserManagement />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? userType === "staff"
                  ? "/staff/dashboards"
                  : "/home"
                : "/login"
            }
            replace
          />
        }
      />
      <Route path="*" element={<AuthFallback />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
