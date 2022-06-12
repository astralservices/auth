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
      env.SECRET_NODE_ENV === "production"
        ? import.meta.env.PUBLIC_API_ENDPOINT
        : "http://127.0.0.1:3000"
    }/api/v1/auth/session`,
    {
      headers: Astro.request.headers,
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
      env.SECRET_NODE_ENV === "production"
        ? import.meta.env.PUBLIC_API_ENDPOINT
        : "http://127.0.0.1:3000"
    }/api/v1/auth/providers`,
    {
      headers: Astro.request.headers,
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
      env.SECRET_NODE_ENV === "production"
        ? import.meta.env.PUBLIC_API_ENDPOINT
        : "http://127.0.0.1:3000"
    }/api/v1/auth/providers/${provider}`,
    {
      headers: Astro.request.headers,
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
