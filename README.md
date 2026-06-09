  <div align="center">
  
  # alumbrera-web

  PWA del portal de gestión Alumbrera — Next.js · MSAL · Azure Entra External ID
  
  ![CI](https://github.com/APILabs1/alumbrera-web/actions/workflows/ci.yml/badge.svg?branch=dev)
  ![Node](https://img.shields.io/badge/Node.js-22-1a365d?logo=node.js&logoColor=white)
  ![Next.js](https://img.shields.io/badge/Next.js-16-1a365d?logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-1a365d?logo=typescript&logoColor=white)

  </div>

  ---

  ## Stack

  | | Tecnología | Versión |
  |---|---|---|
  | Framework | Next.js | 16 |
  | Runtime | React | 19 |
  | Autenticación | MSAL Browser + MSAL React (Azure Entra CIAM) | 5.x |
  | UI | shadcn/ui + Tailwind CSS | 4 |
  | PWA | @ducanh2912/next-pwa | 10 |
  | Tests E2E | Playwright + playwright-lighthouse | 1.60 |
  | Gestor de paquetes | pnpm | 11 |

  ---

  ## Servicios de Azure
  
  | Servicio | Rol |
  |---|---|
  | **Azure Entra External ID (CIAM)** | Proveedor de identidad para usuarios finales. MSAL gestiona el flujo Authorization Code con PKCE: redirige a `ciamlogin.com`, obtiene tokens y los renueva silenciosamente en background. |
  | **Azure Container Registry (ACR)** | Almacena las imágenes Docker del CD pipeline. La autenticación se realiza vía OIDC, sin credenciales almacenadas en GitHub. |
  | **Azure Container Apps** | Hospeda la app en ejecución. El CD pipeline dispara una nueva revisión en cada push a `dev` a través del repositorio de infraestructura. |

  ---

  ## Requisitos

  - Node.js >= 22
  - pnpm >= 11

  ---

  ## Setup

  ```bash
  pnpm install
  cp .env.example .env.local
  # Completar los valores en .env.local con las credenciales provistas por DevOps
  pnpm dev
  ```

  La app corre en `http://localhost:3000`. El service worker está deshabilitado en modo desarrollo.
  
  ---

  ## Variables de entorno

  | Variable | Descripción |
  |---|---|
  | `NEXT_PUBLIC_AZURE_CLIENT_ID` | Client ID de la app registrada en Entra External ID |
  | `NEXT_PUBLIC_AZURE_AUTHORITY` | `https://<tenant>.ciamlogin.com/<tenant-id>` |
  | `NEXT_PUBLIC_AZURE_API_SCOPE` | `api://<api-client-id>/access_as_user` |
  | `NEXT_PUBLIC_API_BASE_URL` | URL base del backend (ej: `http://localhost:3001`) |

  > **Importante:** las variables `NEXT_PUBLIC_*` se hornean en el bundle de JavaScript en tiempo de compilación. No se leen en runtime. Para cada ambiente se necesita reconstruir la imagen con los valores 
  correspondientes.

  ---

  ## Comandos

  ```bash
  pnpm dev          # Servidor de desarrollo
  pnpm build        # Build de producción
  pnpm lint         # ESLint
  pnpm test:e2e     # Tests E2E con Playwright (requiere build previo)
  ```
  
  ---

  ## Tests E2E

  Los tests corren contra un build de producción:

  ```bash
  pnpm build
  pnpm exec playwright test
  ```
  
  | Test | Qué verifica |
  |---|---|
  | `home.spec.ts` | Renderizado del título y botón de login; manifest accesible; service worker servido |
  | `auth.spec.ts` | Redirección a `ciamlogin.com` al hacer click en "Iniciar sesión" |
  | `lighthouse.spec.ts` | Performance, accesibilidad y best-practices con score mínimo de 80 |

  El test de autenticación se saltea si `NEXT_PUBLIC_AZURE_CLIENT_ID` no está configurado en `.env.local`.

  ---

  ## Docker

  ```bash
  docker build -t alumbrera-web \
    --build-arg NEXT_PUBLIC_AZURE_CLIENT_ID=... \
    --build-arg NEXT_PUBLIC_AZURE_AUTHORITY=... \
    --build-arg NEXT_PUBLIC_AZURE_API_SCOPE=... \
    .

  docker run -p 3000:3000 alumbrera-web
  ```
  
  ---

  ## CI / CD

  GitHub Actions ejecuta el pipeline de CI en cada push a `main`/`dev` y en PRs a `main`:
  type check · lint · build · E2E tests (Playwright + Lighthouse) · Docker build + smoke test.

  El pipeline de CD se dispara cuando CI pasa en `dev`: construye la imagen con las variables de Entra del ambiente correspondiente, la publica en ACR y despliega en Azure Container Apps usando autenticación 
  OIDC.
 
  ---

  ## Mejoras potenciales
  
  ### Application Insights en el cliente

  El SDK `@microsoft/applicationinsights-web` permite registrar automáticamente page views, errores de JavaScript, tiempos de carga y eventos personalizados desde el browser, enviándolos al mismo recurso de 
  Application Insights que el backend. Esto daría una visión end-to-end del comportamiento del usuario. El logger de MSAL también podría redirigir sus advertencias a Application Insights en lugar de solo a la 
  consola.
  
  **Qué cambia:** inicializar el SDK en `layout.tsx` con la connection string expuesta como variable `NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING`.

  ---
  
  ### Azure Front Door para distribución global de assets
  
  Los assets estáticos de Next.js (`/_next/static/`) son inmutables por diseño. Azure Front Door o Azure CDN pueden cachearlos en puntos de presencia globales, reduciendo la latencia para usuarios 
  geográficamente alejados del Container App.
 
  **Qué cambia:** un recurso de Azure Front Door en el repo de infraestructura apuntando al Container App como origin.

  ---
