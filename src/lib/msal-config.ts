import { Configuration, LogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
    authority: process.env.NEXT_PUBLIC_AZURE_AUTHORITY!,
    redirectUri: typeof window !== "undefined" ? window.location.origin : "/",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback: (_level, message, containsPii) => {
        if (containsPii) return;
        if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
          console.log(message);
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

export const loginRequest = {
  scopes: [process.env.NEXT_PUBLIC_AZURE_API_SCOPE ?? "openid profile email"],
};

export const tokenRequest = {
  scopes: [process.env.NEXT_PUBLIC_AZURE_API_SCOPE!],
};
