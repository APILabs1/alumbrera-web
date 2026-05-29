"use client";

import { useEffect, useState } from "react";
import { useMsal, MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { apiFetch } from "@/lib/api-client";
import { loginRequest } from "@/lib/msal-config";
import { SignOutButton } from "@/components/auth/sign-out-button";

interface UserProfile {
  name: string;
  email: string;
  oid: string;
}

function ProfileContent() {
  const { instance } = useMsal();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await apiFetch(instance, "/me");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [instance]);

  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];
  const initials = account?.name
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground text-sm">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-foreground text-background text-2xl font-semibold select-none">
            {initials}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {profile?.name ?? account?.name ?? "Usuario"}
          </h1>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive text-center">
            {error}
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <ProfileField label="Nombre" value={profile?.name ?? "—"} />
            <ProfileField label="Correo" value={profile?.email ?? "—"} />
            <ProfileField label="OID" value={profile?.oid ?? "—"} mono />
          </div>
        )}

        <div className="flex justify-center">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}

function ProfileField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-sm ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={loginRequest}
      loadingComponent={() => (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground text-sm">Verificando sesión...</p>
        </div>
      )}
    >
      <ProfileContent />
    </MsalAuthenticationTemplate>
  );
}
