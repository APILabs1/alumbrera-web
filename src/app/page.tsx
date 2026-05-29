import { SignInButton } from "@/components/auth/sign-in-button";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground text-background text-2xl font-bold select-none">
            A
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Alumbrera</h1>
          <p className="text-sm text-muted-foreground">
            Portal de gestión. Iniciá sesión con tu cuenta organizacional.
          </p>
        </div>

        <SignInButton />

        <p className="text-xs text-muted-foreground">
          Autenticación gestionada por Microsoft Entra External ID
        </p>
      </div>
    </main>
  );
}
