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
import { GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";
import { APIResponse, Blacklist } from "../util/types";

interface StatusResponse {
  authenticated: boolean;
  blacklist?: Blacklist;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const accessToken = getCookie("access_token", ctx);

  if (!accessToken) {
    return {
      props: {
        ...ctx.params,
        session: null,
        user: null,
        providers: null,
      },
    };
  }

  const status: APIResponse<StatusResponse> = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/status`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => res.json());

  if (!status.result.authenticated) {
    return {
      props: {
        ...ctx.params,
        session: null,
        user: null,
        providers: null,
      },
    };
  }

  if (status.result.blacklist) {
    return {
      props: {},
      redirect: {
        destination: "/restricted",
        permanent: true,
      },
    };
  }
}

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
