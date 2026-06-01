"use client";

import { useMsal } from "@azure/msal-react";
import { LogOut } from "lucide-react";

function getInitials(name: string | undefined, fallback: string | undefined): string {
  const source = name ?? fallback ?? "";
  if (!source) return "?";
  return source
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Navbar() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const initials = getInitials(account?.name, account?.username);

  const handleSignOut = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });
  };

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        height: 64,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(27,31,46,.82)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}
    >
      {/* Logo lockup */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif",
            fontWeight: 400,
            fontSize: 17,
            letterSpacing: "-0.01em",
            color: "#eaf0f8",
            lineHeight: 1,
          }}
        >
          Alumbrera
        </span>
        <span
          className="hidden sm:block"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 600,
            fontSize: 9.5,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#9aa6b8",
            lineHeight: 1,
          }}
        >
          Portal de gestión
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* User pill */}
      {account && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.02)",
            padding: "5px 10px 5px 6px",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(140deg,#5b9bf0,#3d7edc)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            {initials}
          </span>
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: "#eaf0f8",
            }}
          >
            {account.name ?? account.username}
          </span>
        </div>
      )}

      {/* Logout */}
      <LogoutButton onSignOut={handleSignOut} />
    </header>
  );
}

function LogoutButton({ onSignOut }: { onSignOut: () => void }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.style.color = "#fff";
    btn.style.borderColor = "rgba(224,85,107,.30)";
    btn.style.background = "rgba(224,85,107,.10)";
    const icon = btn.querySelector<SVGElement>("svg");
    if (icon) icon.style.stroke = "#e0556b";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.style.color = "#9aa6b8";
    btn.style.borderColor = "rgba(255,255,255,.13)";
    btn.style.background = "transparent";
    const icon = btn.querySelector<SVGElement>("svg");
    if (icon) icon.style.stroke = "#9aa6b8";
  };

  return (
    <button
      onClick={onSignOut}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 36,
        padding: "0 10px",
        borderRadius: 9,
        background: "transparent",
        border: "1px solid rgba(255,255,255,.13)",
        color: "#9aa6b8",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all .18s ease",
        fontFamily: "var(--font-geist-sans), sans-serif",
        flexShrink: 0,
      }}
    >
      <LogOut
        size={15}
        strokeWidth={1.8}
        style={{ stroke: "#9aa6b8", transition: "stroke .18s ease", flex: "none" }}
      />
      <span className="hidden sm:inline">Cerrar sesión</span>
    </button>
  );
}
