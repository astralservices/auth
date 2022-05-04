import { AuthContext, AuthProvider } from "../util/auth";
import { AppProps } from "next/app";
import Head from "next/head";
import "../tailwind/tailwind.css";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";
import { supabase } from "../util/supabase";
import { Session, User } from "@supabase/supabase-js";
import { hotjar } from "react-hotjar";
import { useState, useEffect } from "react";

function OneAuthApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSession(supabase.auth.session());
    setUser(supabase.auth.user());
    setLoading(false);

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(supabase.auth.user());
    });
  }, []);
  return (
    <>
      <Head>
        <title>Astral OneAuth</title>
      </Head>
      <main className="h-screen bg-black">
        <Toaster />
        <AuthProvider>
          <SWRConfig
            value={{
              fetcher: (resource, init) => {
                return fetch(resource, {
                  ...init,
                  credentials: "same-origin",
                  headers: {
                    authorization: `Bearer ${session.access_token}`,
                  },
                }).then((res) => {
                  return res.json();
                });
              },
            }}
          >
            {" "}
            <Component {...pageProps} />
          </SWRConfig>
        </AuthProvider>
      </main>
    </>
  );
}

export default OneAuthApp;
