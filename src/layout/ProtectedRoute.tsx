import { Navigate } from "react-router-dom";
import { AuthFallback } from "./AuthFallback";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  userType: "user" | "staff";
  requireStaff?: boolean;
  children: React.ReactElement;
  fallbackMode?: "redirect" | "component"; // redirect to /login or show fallback component
}

export function ProtectedRoute({
  isAuthenticated,
  userType,
  requireStaff = false,
  children,
  fallbackMode = "component",
}: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return fallbackMode === "redirect" ? (
      <Navigate to="/login" replace />
    ) : (
      <AuthFallback />
    );
  }
  if (requireStaff && userType !== "staff") {
    return <AuthFallback />;
  }
  return children;
}
