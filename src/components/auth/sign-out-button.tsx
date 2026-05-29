"use client";

import { useMsal } from "@azure/msal-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { instance } = useMsal();

  const handleSignOut = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });
  };

  return (
    <Button onClick={handleSignOut} variant="outline" size="sm" className="gap-2">
      <LogOut className="h-4 w-4" />
      Cerrar sesión
    </Button>
  );
}
