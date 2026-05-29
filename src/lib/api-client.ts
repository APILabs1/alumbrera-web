import { IPublicClientApplication } from "@azure/msal-browser";
import { tokenRequest } from "./msal-config";

async function getAccessToken(instance: IPublicClientApplication): Promise<string> {
  const accounts = instance.getAllAccounts();

  if (accounts.length === 0) {
    await instance.acquireTokenRedirect(tokenRequest);
    throw new Error("Redirecting for authentication");
  }

  try {
    const result = await instance.acquireTokenSilent({
      ...tokenRequest,
      account: accounts[0],
    });
    return result.accessToken;
  } catch {
    await instance.acquireTokenRedirect(tokenRequest);
    throw new Error("Redirecting for authentication");
  }
}

export async function apiFetch(
  instance: IPublicClientApplication,
  path: string,
  init?: RequestInit
): Promise<Response> {
  const token = await getAccessToken(instance);
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
