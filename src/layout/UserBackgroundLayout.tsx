import React from "react";

/**
 * UserBackgroundLayout
 * Wrapper for user-facing screens providing unified gradient background + subtle SVG texture.
 * Usage:
 * <UserBackgroundLayout>
 *   <YourScreenContent />
 * </UserBackgroundLayout>
 *
 * Props:
 * - centered: vertically centers children (use for auth screens like login/signup)
 * - maxWidth: tailwind max-width class (defaults to max-w-md)
 */
interface UserBackgroundLayoutProps {
  children: React.ReactNode;
  centered?: boolean;
  maxWidthClass?: string; // e.g. "max-w-md" or "max-w-2xl"
}

export function UserBackgroundLayout({
  children,
  centered = false,
  maxWidthClass = "max-w-md",
}: UserBackgroundLayoutProps) {
  return (
    <div
      className={`relative flex flex-col min-h-screen w-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 overflow-hidden`}
    >
      {/* SVG Texture Background */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25 mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="ubg-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <rect width="40" height="40" fill="none" />
            <circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.35)" />
            <circle cx="40" cy="0" r="1" fill="rgba(255,255,255,0.35)" />
            <circle cx="0" cy="40" r="1" fill="rgba(255,255,255,0.35)" />
            <circle cx="40" cy="40" r="1" fill="rgba(255,255,255,0.35)" />
            <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.25)" />
          </pattern>
          <radialGradient id="ubg-fade" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#ubg-grid)" />
        <rect width="100%" height="100%" fill="url(#ubg-fade)" />
      </svg>
      <div
        className={`relative flex flex-col flex-1 w-full mx-auto ${maxWidthClass} ${
          centered ? "justify-center" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default UserBackgroundLayout;
