export type APIResponse<T> = {
  result: T;
  error?: string;
  code: number;
};

export type JWTResponse = {
  UserInfo: DiscordUserInfo;
  exp: number;
  sub: string;
};

export interface Provider {
  id: string;
  created_at: string;
  user: string;
  type: string;
  provider_id: string;
  provider_access_token: string;
  provider_refresh_token: string;
  provider_expires_at: Date;
  provider_data: {
    [k: string]: any;
  };
}

export interface DiscordUserInfo extends UserInfo {}

export interface UserInfo {
  created_at: Date;
  id: string;
  provider_access_token: string;
  provider_avatar_url: string;
  provider_data: ProviderData;
  provider_email: string;
  provider_expires_at: Date;
  provider_id: string;
  provider_refresh_token: string;
  type: string;
  user: string;
}

export interface LastfmUserInfo extends UserInfo {}

export interface ProviderData {
  accent_color: number;
  avatar: string;
  avatar_decoration: null;
  banner: string;
  banner_color: string;
  discriminator: string;
  email: string;
  flags: number;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  public_flags: number;
  username: string;
  verified: boolean;
}
