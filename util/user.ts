import { AstroGlobal } from "astro";
import {
  DiscordUserInfo,
  APIResponse,
  JWTResponse,
  ProviderData,
  Provider,
} from "../types";

export async function GetUser(
  env: Record<string, string>,
  Astro: AstroGlobal
): Promise<DiscordUserInfo | null> {
  const data: APIResponse<DiscordUserInfo> = await fetch(
    `${
      import.meta.env.PROD
        ? import.meta.env.PUBLIC_API_ENDPOINT
        : "http://127.0.0.1:3000"
    }/api/v1/auth/session`,
    {
      headers: {
        cookie: Astro.request.headers.get("cookie"),
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (data.error) {
    console.error(data.error);
    return null;
  }

  return data.result;
}

export async function GetProviders(
  env: Record<string, string>,
  Astro: AstroGlobal
): Promise<Provider[] | null> {
  const data: APIResponse<Provider[]> = await fetch(
    `${
      import.meta.env.PROD
        ? import.meta.env.PUBLIC_API_ENDPOINT
        : "http://127.0.0.1:3000"
    }/api/v1/auth/providers`,
    {
      headers: {
        cookie: Astro.request.headers.get("cookie"),
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (data.error) {
    console.error(data.error);
    return null;
  }

  return data.result;
}

export async function GetProvider(
  provider: string,
  env: Record<string, string>,
  Astro: AstroGlobal
): Promise<Provider | null> {
  const data: APIResponse<Provider> = await fetch(
    `${
      import.meta.env.PROD
        ? import.meta.env.PUBLIC_API_ENDPOINT
        : "http://127.0.0.1:3000"
    }/api/v1/auth/providers/${provider}`,
    {
      headers: {
        cookie: Astro.request.headers.get("cookie"),
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (data.error) {
    console.error(data.error);
    return null;
  }

  return data.result;
}

export async function VerifyEmail(
  token: string,
  workspace: string,
  integration: string,
  env: Record<string, string>,
  Astro: AstroGlobal
): Promise<boolean> {
  const data: APIResponse<boolean> = await fetch(
    `${
      import.meta.env.PROD
        ? import.meta.env.PUBLIC_API_ENDPOINT
        : "http://127.0.0.1:3000"
    }/api/v1/workspaces/${workspace}/integrations/${integration}/data/@me`,
    {
      headers: {
        cookie: Astro.request.headers.get("cookie"),
      },
      method: "POST",
      body: JSON.stringify({
        
      }),
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (data.error) {
    console.error(data.error);
    return null;
  }

  return data.result;
}