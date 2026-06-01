"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMsal, MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType, InteractionStatus } from "@azure/msal-browser";
import { User, Mail, Clock, Calendar, Hash, Copy, Zap, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { loginRequest } from "@/lib/msal-config";
import { Navbar } from "@/components/layout/navbar";

interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  loginCount: number;
  lastLoginAt: string | null;
  createdAt: string;
}

const MONTHS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

function formatDate(iso: string | null | undefined, withTime: boolean): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const base = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  if (!withTime) return base;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${base}, ${hh}:${mm}`;
}

function getInitials(displayName: string | null, email?: string): string {
  const source = displayName ?? email ?? "";
  if (!source) return "?";
  return source
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ── Copy chip for user ID row ── */
function CopyChip({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <button
      onClick={handleCopy}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#eaf0f8";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#9aa6b8";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
      }}
      style={{
        marginLeft: "auto",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 7,
        padding: "6px 10px",
        fontSize: 12,
        color: "#9aa6b8",
        background: "transparent",
        cursor: "pointer",
        transition: "color .18s ease, border-color .18s ease",
        flexShrink: 0,
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
    >
      <Copy size={13} strokeWidth={1.8} />
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

/* ── Account info rows ── */
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
  isLast?: boolean;
}

function InfoRow({ icon, label, value, mono = false, copyable = false, isLast = false }: InfoRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "17px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,.08)",
      }}
    >
      {/* Icon box */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 34,
          borderRadius: 9,
          background: "rgba(255,255,255,.03)",
          border: "1px solid rgba(255,255,255,.08)",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>

      {/* Label */}
      <span
        style={{
          width: 170,
          flexShrink: 0,
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: 13,
          color: "#9aa6b8",
        }}
      >
        {label}
      </span>

      {/* Value */}
      <span
        style={{
          fontFamily: mono ? "var(--font-geist-mono), monospace" : "var(--font-geist-sans), sans-serif",
          fontWeight: mono ? 400 : 500,
          fontSize: mono ? 13 : 14.5,
          color: mono ? "#9aa6b8" : "#eaf0f8",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
          minWidth: 0,
        }}
      >
        {value}
      </span>

      {copyable && <CopyChip text={value} />}
    </div>
  );
}

/* ── Loading state ── */
function StateLoading() {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 16,
        background: "#1b1f2e",
        padding: 54,
        maxWidth: 520,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,.1)",
          borderTopColor: "#3d7edc",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: 15, color: "#9aa6b8", fontFamily: "var(--font-geist-sans), sans-serif" }}>
        Cargando tu perfil…
      </span>
    </div>
  );
}

/* ── Error state ── */
function StateError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      style={{
        border: "1px solid rgba(224,85,107,.30)",
        borderRadius: 16,
        background: "rgba(224,85,107,.10)",
        padding: 54,
        maxWidth: 520,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: "rgba(224,85,107,.16)",
        }}
      >
        <AlertCircle size={22} strokeWidth={1.9} style={{ stroke: "#e0556b" }} />
      </div>
      <div>
        <p
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#ffd7de",
            margin: "0 0 8px",
            fontFamily: "var(--font-geist-sans), sans-serif",
          }}
        >
          No pudimos cargar tu perfil
        </p>
        <p
          style={{
            fontSize: 13.5,
            color: "#e9a7b2",
            margin: 0,
            lineHeight: 1.5,
            fontFamily: "var(--font-geist-sans), sans-serif",
          }}
        >
          Ocurrió un error al obtener tus datos. Volvé a intentarlo en unos instantes.
        </p>
      </div>
      <button
        onClick={onRetry}
        style={{
          marginTop: 4,
          padding: "8px 18px",
          borderRadius: 8,
          border: "1px solid rgba(224,85,107,.35)",
          background: "rgba(224,85,107,.15)",
          color: "#ffd7de",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          transition: "background .18s ease",
          fontFamily: "var(--font-geist-sans), sans-serif",
        }}
      >
        Reintentar
      </button>
    </div>
  );
}

/* ── Main profile content ── */
function ProfileContent() {
  const { instance, inProgress } = useMsal();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchKey, setFetchKey] = useState(0);

  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];
  const displayName = profile?.displayName ?? account?.name ?? null;
  const initials = getInitials(displayName, account?.username);

  useEffect(() => {
    if (inProgress !== InteractionStatus.None) return;

    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);
      setError(false);
      try {
        let response = await apiFetch(instance, "/me");

        if (response.status === 404) {
          const claims = account?.idTokenClaims as Record<string, unknown> | undefined;
          const email =
            (claims?.["email"] as string | undefined) ??
            (Array.isArray(claims?.["emails"]) ? (claims["emails"][0] as string) : undefined) ??
            account?.username;

          await apiFetch(instance, "/users/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              oid: claims?.["oid"],
              email,
              displayName: claims?.["name"],
              givenName: claims?.["given_name"],
              familyName: claims?.["family_name"],
            }),
          });

          response = await apiFetch(instance, "/me");
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!cancelled) setProfile(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => { cancelled = true; };
  }, [instance, inProgress, fetchKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: "100vh", background: "#192437", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          padding: 34,
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {loading ? (
            <StateLoading />
          ) : error ? (
            <StateError onRetry={() => setFetchKey((k) => k + 1)} />
          ) : (
            <>
              {/* ── Hero ── */}
              <div
                style={{
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "#1b1f2e",
                  position: "relative",
                }}
              >
                {/* Topo strip image */}
                <Image
                  src="/topo-strip.svg"
                  alt=""
                  aria-hidden="true"
                  width={0}
                  height={0}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    opacity: 0.9,
                  }}
                />
                {/* Fade overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(27,31,46,.1), #1b1f2e 72%)",
                  }}
                />

                {/* Inner content */}
                <div
                  style={{
                    position: "relative",
                    padding: "30px 32px 28px",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 22,
                  }}
                >
                  {/* Large avatar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      background: "linear-gradient(140deg,#5b9bf0,#3d7edc)",
                      color: "#fff",
                      fontSize: 34,
                      fontWeight: 700,
                      userSelect: "none",
                      flexShrink: 0,
                      boxShadow:
                        "0 0 0 4px #1b1f2e, 0 0 0 6px rgba(61,126,220,.55), 0 16px 30px -12px rgba(0,0,0,.6)",
                      fontFamily: "var(--font-geist-sans), sans-serif",
                    }}
                  >
                    {initials}
                  </div>

                  {/* Identity */}
                  <div>
                    <h1
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-geist-sans), sans-serif",
                        fontWeight: 600,
                        fontSize: 26,
                        letterSpacing: "-0.01em",
                        color: "#eaf0f8",
                        lineHeight: 1.2,
                      }}
                    >
                      {displayName ?? "Usuario"}
                    </h1>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontFamily: "var(--font-geist-sans), sans-serif",
                        fontSize: 14,
                        color: "#9aa6b8",
                      }}
                    >
                      {profile?.email}
                    </p>
                  </div>

                  {/* Login count badge */}
                  {profile && (
                    <div style={{ marginLeft: "auto" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          height: 30,
                          padding: "0 13px",
                          borderRadius: 999,
                          fontSize: 12.5,
                          fontWeight: 500,
                          color: "#5b9bf0",
                          background: "rgba(61,126,220,.12)",
                          border: "1px solid rgba(61,126,220,.24)",
                          fontFamily: "var(--font-geist-sans), sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Zap size={14} strokeWidth={1.7} style={{ stroke: "#5b9bf0", fill: "none" }} />
                        <b style={{ color: "#cfe2ff", fontWeight: 600 }}>{profile.loginCount}</b>
                        &nbsp;inicios de sesión
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Account info card ── */}
              <div
                style={{
                  marginTop: 22,
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 16,
                  background: "#1b1f2e",
                  overflow: "hidden",
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    padding: "18px 24px",
                    borderBottom: "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "#9aa6b8",
                    }}
                  >
                    Información de la cuenta
                  </h2>
                </div>

                {/* Rows */}
                <div style={{ padding: "6px 24px 10px" }}>
                  <InfoRow
                    icon={<User size={17} strokeWidth={1.7} style={{ stroke: "#9aa6b8" }} />}
                    label="Nombre completo"
                    value={profile?.displayName ?? "—"}
                  />
                  <InfoRow
                    icon={<Mail size={17} strokeWidth={1.7} style={{ stroke: "#9aa6b8" }} />}
                    label="Correo electrónico"
                    value={profile?.email ?? "—"}
                  />
                  <InfoRow
                    icon={<Clock size={17} strokeWidth={1.7} style={{ stroke: "#9aa6b8" }} />}
                    label="Último acceso"
                    value={formatDate(profile?.lastLoginAt, true)}
                  />
                  <InfoRow
                    icon={<Calendar size={17} strokeWidth={1.7} style={{ stroke: "#9aa6b8" }} />}
                    label="Miembro desde"
                    value={formatDate(profile?.createdAt, false)}
                  />
                  <InfoRow
                    icon={<Hash size={17} strokeWidth={1.7} style={{ stroke: "#9aa6b8" }} />}
                    label="ID de usuario"
                    value={profile?.id ?? "—"}
                    mono
                    copyable
                    isLast
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={loginRequest}
      loadingComponent={() => (
        <div style={{ minHeight: "100vh", background: "#192437", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "3px solid rgba(255,255,255,.1)",
                borderTopColor: "#3d7edc",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      )}
    >
      <ProfileContent />
    </MsalAuthenticationTemplate>
  );
}
