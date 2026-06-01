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
    <div className="flex min-h-[100dvh]" style={{ backgroundColor: "#0c1422", color: "#e9eef5" }}>

      {/* Left panel */}
      <div
        className="flex flex-col w-full lg:w-[45%] lg:flex-none px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-10"
        style={{ backgroundColor: "#101a2e" }}
      >
        {/* Brand lockup */}
        <div>
          <div
            className="text-lg leading-none"
            style={{
              fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif",
              letterSpacing: "-0.01em",
              color: "#e9eef5",
            }}
          >
            Alumbrera
          </div>
          <div
            className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "#7f8ba0" }}
          >
            una empresa Glencore
          </div>
        </div>

        {/* Central block */}
        <div className="my-auto py-10 max-w-[420px]">
          <p
            className="mb-4 text-[13px] tracking-wide"
            style={{ color: "#7f8ba0" }}
          >
            Portal de gestión
          </p>

          <h1
            className="mb-4 text-[26px] sm:text-[32px] lg:text-[38px] font-bold leading-[1.15]"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              letterSpacing: "-0.01em",
              color: "#e9eef5",
            }}
          >
            Iniciá sesión en tu cuenta
          </h1>

          <p
            className="mb-8 text-[15px] leading-relaxed"
            style={{ color: "#8a99ad" }}
          >
            Accedé con tu cuenta organizacional de Alumbrera.
          </p>

          <SignInButton />

          {/* Separator */}
          <div className="flex items-center gap-3.5 my-7">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,.08)" }} />
            <span
              className="text-[11.5px] tracking-widest lowercase whitespace-nowrap"
              style={{ color: "#5f6c80" }}
            >
              autenticación segura
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,.08)" }} />
          </div>

          {/* Entra ID row */}
          <div
            className="flex items-center gap-2.5 h-[46px] px-4 text-[13px] rounded-[10px] whitespace-nowrap overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.015)",
              color: "#8a99ad",
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
              className="shrink-0"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Gestionado por Microsoft Entra External ID
          </div>
        </div>

        {/* Footer */}
        <p className="mt-auto text-[12.5px]" style={{ color: "#5f6c80" }}>
          © 2026 Alumbrera. Todos los derechos reservados.
        </p>
      </div>

      {/* Right panel — brand image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
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
