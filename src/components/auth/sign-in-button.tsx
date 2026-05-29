"use client";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/msal-config";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function SignInButton() {
  const { instance } = useMsal();

  const handleSignIn = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <Button onClick={handleSignIn} size="lg" className="gap-2">
      <LogIn className="h-4 w-4" />
      Iniciar sesión
    </Button>
  );
}
