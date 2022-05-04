import { ActivitiesOptions, PresenceData } from "discord.js";
import { CommandOptions } from "discord-akairo";

export type SessionAPI = {
  id: string;
  created_at: string;
  user: string;
  ip: string;
  useragent: string;
  country: string;
  city: string;
  ip_isp: string;
};

export type ProfileAPI = {
  id: string;
  created_at: string;
  discord_id: string;
  roblox_id: string;
  email: string;
  preferred_name: string;
  sessions: string[];
  geosessions: string[];
  access: "beta" | "alpha" | null;
  stripe_customer_id: string;
  identity_data: {
    iss: string;
    sub: string;
    name: string;
    email: string;
    picture: string;
    full_name: string;
    avatar_url: string;
    provider_id: string;
    email_verified: boolean;
  };
};
// keep both for compatibility
export type Profile = {
  id: string;
  created_at: string;
  discord_id: string;
  roblox_id: string;
  email: string;
  preferred_name: string;
  stripe_customer_id: string;
  identity_data: {
    iss: string;
    sub: string;
    name: string;
    email: string;
    picture: string;
    full_name: string;
    avatar_url: string;
    provider_id: string;
    email_verified: boolean;
  };
  access?: "beta" | "alpha" | null;
  location?: string;
  language?: string;
  pronouns?: string[];
  hireable?: boolean;
  about?: string;
  strengths?: string[];
  weaknesses?: string[];
  verified?: boolean;
  banner?: string;
  public?: boolean;

  // inserted data
  workspaces?: (Workspace & { role?: string })[] | string[];
  providers?: Provider[] | string[];
  isOwner?: boolean;
};

export type WorkspaceMember = {
  id: string;
  created_at: string;
  profile: Profile | string;
  workspace: Workspace | string;
  role: string;
  pending: boolean;
  invited_by: WorkspaceMember | string;
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
  discord_id?: string;
}

export interface RobloxProvider extends Provider {
  provider_data: {
    username?: string;
    id?: string;
    auth_code: string;
    status: "pending" | "active";
    displayName?: string;
  };
}

export interface LastfmProvider extends Provider {
  provider_data: {
    [k: string]: any;
  };
}

export type Factor = {
  id: string;
  data: Record<string, unknown>;
};

export type Geosession = {
  id: string;
  created_at: string;
  user: string;
  factors: Factor[];
};

export type Bot = {
  id: string;
  created_at: string;
  region: string;
  owner: string;
  workspace: Workspace | string;
  settings: {
    guild: string;
    prefix: string;
    status: PresenceData["status"];
    activities: ActivitiesOptions[];
    randomizeActivities: boolean;
    activityInterval: number;
    currentActivity: number;
    modules: {
      fun?: {
        enabled: boolean;
      };
      moderation?: {
        enabled: boolean;
        options?: {
          logging: {
            enabled: boolean;
            channel: string;
          };
        };
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
  token: string;
  commands: BotCommand[];
  analytics: {
    commands: number;
    [key: string]: any;
  };
};

export type BotCommand = {
  id: string;
  options: CommandOptions;
  enabled: boolean;
};

export type Blacklist = {
  id: string;
  created_at: string;
  moderator: string | Profile;
  user: string;
  discord_id: string;
  reason: string;
  expires: boolean;
  expiry: Date;
  flags: Record<string, any>;
  factorMatching: string[];
  notes: string;
};

export enum WorkspacePlan {
  Free = 1,
  Starter,
  Pro,
}

export type Workspace = {
  id: string;
  created_at: string;
  name: string;
  owner: string;
  members?: string[] | WorkspaceMember[];
  logo: string;
  plan: WorkspacePlan;
  settings: {
    about?: string;
    stripe?: {
      subscription?: string;
    };
    [key: string]: any;
  };
  visibility: "public" | "unlisted" | "private";
};

export type Integration = {
  id: string;
  created_at: string;
  name: string;
  prettyName: string;
  icon: string;
  isIconSimpleIcon: boolean;
  website: string;
  enabled: boolean;
  description: string;
  schema: Record<string, any>;
};

export type WorkspaceIntegration<T = Record<string, unknown>> = {
  id: string;
  created_at: string;
  workspace: Workspace | string;
  integration: Integration | string;
  settings: T;
  enabled: boolean;
};

export type APIResponse<T> = {
  result: T;
  error: boolean;
};

export type WorkspaceStats = {
  memberCount: number;
  workspaceMemberCount: number;
  discordCount?: number; // optional because some bots may not be set up
};

export type ROAuth = {
  id: number;
  created_at: string;
  astral_user: string;
  discord_id: string;
  roblox_id: string;
  verification_code: string;
  status: "pending" | "verified";
};

export type MemberCounter = {
  id: string;
  created_at: string;
  workspace: Workspace | string;
  webhook: string;
  message: string;
  enabled: boolean;
  count: number;
  last_run: {
    end: Date;
    count: number;
  };
};

export type ShoutProxy = {
  webhook: string;
  enabled: boolean;
  groupId: string;
  cookie?: string;
};

export type WallFilter = {
  webhook: string;
  enabled: boolean;
  groupId: string;
  cookie?: string;
  bannedPhrases: string[];
  deleteOnTrigger: boolean;
};

export type BadActorDetection = {
  webhook: string;
  enabled: boolean;
  groupId: string;
  cookie?: string;
  factors: {
    accountAgeLessThan: number;
    sketchyUsername: boolean;
    noDescription: boolean;
    bannedGroups: string[];
    noFriends: boolean;
  };
};

export type BadActor = {
  id: string;
  created_at: string;
  group_id: string;
  user_id: string;
  factors: {
    accountAgeLessThan?: number;
    sketchyUsername?: boolean;
    noDescription?: boolean;
    bannedGroups?: string[];
    noFriends?: boolean;
  };
};

export type RobloxSettings = {
  token?: string;
  shout_proxy?: ShoutProxy;
  wall_filter?: WallFilter;
  bad_actor_detection?: BadActorDetection;
};

export type ModerationActions = {
  id: string;
  created_at: string;
  bot: Bot | string;
  guild: string;
  action: string;
  moderator: string;
  reason: string;
  expires: boolean;
  expiry: Date | null;
  user: string;
};

export type Region = {
  id: string;
  flag: string;
  ip: string;
  city: string;
  country: string;
  region: string;
  prettyName: string;
  lat?: number;
  long?: number;
  maxBots: number;
  status: "online" | "offline";
};

export type BotAnalytics = {
  id: number;
  commands: {
    [key: string]: number;
  };
  timestamp: Date;
  members: number;
  messages: number;
  bot: string;
};
