import { createClient } from "@supabase/supabase-js";

// if fetch is missing, use the fetch polyfill
if (!global.fetch) {
  global.fetch = require("node-fetch");
}

const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
const supabaseAnonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const supabaseSecretKey = process.env["SUPABASE_SECRET_KEY"];

if (!supabaseUrl) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

if (!supabaseSecretKey && typeof window === "undefined") {
  console.warn("Missing environment variable SUPABASE_SECRET_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  fetch: fetch,
});

export const supabaseServer = supabaseSecretKey
  ? createClient(supabaseUrl, supabaseSecretKey || "", {
      fetch: fetch,
    })
  : null;
