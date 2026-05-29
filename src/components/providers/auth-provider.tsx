"use client";

import { useEffect } from "react";
import { MsalProvider, useMsal } from "@azure/msal-react";
import {
  PublicClientApplication,
  EventType,
  type AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from "@/lib/msal-config";
import { apiFetch } from "@/lib/api-client";
import { ReactNode } from "react";

const msalInstance = new PublicClientApplication(msalConfig);

function SyncOnLogin() {
  const { instance } = useMsal();

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
        await apiFetch(instance, "/users/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    });

    return () => {
      if (callbackId) instance.removeEventCallback(callbackId);
    };
  }, [instance]);

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
