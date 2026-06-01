"use client";

import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/msal-config";

export function SignInButton() {
  const { instance } = useMsal();
  const [hovered, setHovered] = useState(false);

  const handleSignIn = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (e) {
      console.error("loginRedirect error:", e);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        width: "100%",
        height: 44,
        padding: "0 22px",
        whiteSpace: "nowrap",
        borderRadius: 12,
        background: hovered ? "#5B8FB5" : "rgba(45,111,160,0.14)",
        color: hovered ? "#ffffff" : "#dcebf8",
        border: hovered ? "1px solid transparent" : "1px solid rgba(45,111,160,0.28)",
        boxShadow: "none",
        fontSize: 14.5,
        fontWeight: 600,
        letterSpacing: "0.01em",
        cursor: "pointer",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        transition: "all .2s cubic-bezier(.4,0,.2,1)",
      }}
    >
      Iniciar sesión
      <svg
        viewBox="0 0 24 24"
        width={16}
        height={16}
        fill="none"
        stroke={hovered ? "#ffffff" : "#cfe2f2"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: hovered ? "translateX(3px)" : "translateX(0)",
          transition: "transform .2s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <line x1="4" y1="12" x2="18" y2="12" />
        <polyline points="12 6 18 12 12 18" />
      </svg>
    </button>
  );
}
