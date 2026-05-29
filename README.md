# alumbrera-web

Frontend PWA para el portal de gestión Alumbrera. Construido con Next.js 16, shadcn/ui y autenticación via Microsoft Entra External ID (MSAL).

## Requisitos

- Node.js 20+
- pnpm 9+

## Setup

```bash
pnpm install
cp .env.example .env.local
# Completar los valores en .env.local con las credenciales provistas por DevOps
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_AZURE_CLIENT_ID` | Client ID de la app registrada en Entra External ID |
| `NEXT_PUBLIC_AZURE_AUTHORITY` | `https://<tenant>.ciamlogin.com/<tenant-id>` |
| `NEXT_PUBLIC_AZURE_API_SCOPE` | `api://<api-client-id>/access_as_user` |
| `NEXT_PUBLIC_API_BASE_URL` | URL base del backend (ej: `http://localhost:3001`) |

## Desarrollo

```bash
pnpm dev
```

La app corre en [http://localhost:3000](http://localhost:3000). El service worker está deshabilitado en modo desarrollo.

## Tests E2E

Los tests corren contra un build de producción:

```bash
pnpm build
pnpm exec playwright test
```

El test de autenticación (`auth.spec.ts`) requiere `NEXT_PUBLIC_AZURE_CLIENT_ID` configurado en `.env.local` para no ser salteado.

## Build de producción

```bash
pnpm build
node .next/standalone/server.js
```

## Docker

```bash
docker build -t alumbrera-web .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_AZURE_CLIENT_ID=... \
  -e NEXT_PUBLIC_AZURE_AUTHORITY=... \
  -e NEXT_PUBLIC_AZURE_API_SCOPE=... \
  -e NEXT_PUBLIC_API_BASE_URL=... \
  alumbrera-web
```
