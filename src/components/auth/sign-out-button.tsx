"use client";

import { useMsal } from "@azure/msal-react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { instance } = useMsal();

  const handleSignOut = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-[#6c757d] transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
    >
      <LogOut className="h-3.5 w-3.5" />
      Cerrar sesión
    </button>
  );
}
