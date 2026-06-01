"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MsalProvider, useMsal } from "@azure/msal-react";
import {
  PublicClientApplication,
  EventType,
  type AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from "@/lib/msal-config";
import { ReactNode } from "react";

const msalInstance = new PublicClientApplication(msalConfig);

function SyncOnLogin() {
  const { instance } = useMsal();
  const router = useRouter();

  useEffect(() => {
    const callbackId = instance.addEventCallback(async (event) => {
      if (event.eventType !== EventType.LOGIN_SUCCESS || !event.payload) return;

      const result = event.payload as AuthenticationResult;
      const account = result.account;
      if (!account?.idTokenClaims?.oid) return;

      const claims = account.idTokenClaims as Record<string, unknown>;
      const email =
        (claims["email"] as string | undefined) ??
        (Array.isArray(claims["emails"])
          ? (claims["emails"][0] as string)
          : undefined) ??
        account.username;

      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.accessToken}`,
          },
          body: JSON.stringify({
            oid: claims["oid"],
            email,
            displayName: claims["name"],
            givenName: claims["given_name"],
            familyName: claims["family_name"],
          }),
        });
      } catch (err) {
        console.error("Post-login sync failed:", err);
      }

      router.push("/profile");
    });

    return () => {
      if (callbackId) instance.removeEventCallback(callbackId);
    };
  }, [instance, router]);

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      <SyncOnLogin />
      {children}
    </MsalProvider>
  );
}
