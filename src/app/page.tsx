"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { SignInButton } from "@/components/auth/sign-in-button";

export default function HomePage() {
  const { instance, inProgress } = useMsal();
  const router = useRouter();

  useEffect(() => {
    if (inProgress !== InteractionStatus.None) return;
    const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];
    if (account) router.replace("/profile");
  }, [instance, router, inProgress]);

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "#0c1422", color: "#e9eef5", fontFamily: '-apple-system, "Segoe UI", Helvetica, Arial, sans-serif' }}
    >
      {/* Left panel */}
      <div
        className="flex flex-col w-full lg:flex-none"
        style={{
          flex: "0 0 45%",
          maxWidth: 860,
          backgroundColor: "#101a2e",
          padding: "40px 56px",
        }}
      >
        {/* Brand lockup */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif",
              fontWeight: 400,
              fontSize: 18,
              letterSpacing: "-0.01em",
              lineHeight: 1,
              color: "#e9eef5",
            }}
          >
            Alumbrera
          </div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              fontWeight: 600,
              color: "#7f8ba0",
              marginTop: 5,
            }}
          >
            una empresa Glencore
          </div>
        </div>

        {/* Central block */}
        <div style={{ margin: "auto 0", maxWidth: 420 }}>
          <p
            style={{
              fontSize: 13,
              color: "#7f8ba0",
              margin: "0 0 16px",
              letterSpacing: "0.02em",
            }}
          >
            Portal de gestión
          </p>

          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 700,
              fontSize: 38,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "#e9eef5",
              margin: "0 0 16px",
            }}
          >
            Iniciá sesión en tu cuenta
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "#8a99ad",
              lineHeight: 1.5,
              margin: "0 0 30px",
            }}
          >
            Accedé con tu cuenta organizacional de Alumbrera.
          </p>

          <SignInButton />

          {/* Separator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              margin: "28px 0 16px",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.08)" }} />
            <span
              style={{
                fontSize: 11.5,
                color: "#5f6c80",
                letterSpacing: "0.06em",
                textTransform: "lowercase",
                whiteSpace: "nowrap",
              }}
            >
              autenticación segura
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.08)" }} />
          </div>

          {/* Entra ID row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              height: 46,
              padding: "0 16px",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 10,
              background: "rgba(255,255,255,.015)",
              color: "#8a99ad",
              fontSize: 13,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={16}
              height={16}
              fill="none"
              stroke="rgba(45,111,160,0.9)"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Gestionado por Microsoft Entra External ID
          </div>
        </div>

        {/* Footer */}
        <p style={{ marginTop: "auto", color: "#5f6c80", fontSize: 12.5 }}>
          © 2026 Alumbrera. Todos los derechos reservados.
        </p>
      </div>

      {/* Right panel — brand image */}
      <div
        className="hidden lg:block"
        style={{ flex: 1, position: "relative", overflow: "hidden" }}
      >
        <Image
          src="/images/topo-panel.svg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="55vw"
          priority
        />
      </div>
    </div>
  );
}
