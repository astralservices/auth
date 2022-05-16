import { useAuth } from "../util/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import Card from "../components/Card";
import { Discord, Roblox, Spotify } from "@icons-pack/react-simple-icons";
import { ArrowRightIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Providers from "../components/Providers";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";
import { Session, User } from "@supabase/supabase-js";
import { Provider, APIResponse, Blacklist } from "../util/types";
import { supabase } from "../util/supabase";

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

  const { data: user, error } = await supabase.auth.api.getUser(
    accessToken.toString()
  );

  if (error) {
    console.log(error);
    return {
      props: {
        ...ctx.params,
        user: null,
        error: error.message,
        providers: null,
      },
    };
  }

  const providers: APIResponse<Provider[]> = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/providers`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => res.json());

  const finalProviders = providers.result.filter(
    (provider) => provider.provider_data.status === "active"
  );

  return {
    props: {
      ...ctx.params,
      providers: finalProviders,
      user: user,
    },
  };
}

export function Index({
  session,
  user,
  providers,
}: {
  session: Session;
  user: User;
  providers?: Provider[];
}) {
  const { login, logout } = useAuth();

  const router = useRouter();

  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.redirect) {
      setRedirect(router.query.redirect.toString());
    }
  }, [router]);

  return (
    <>
      <Card>
        {user ? (
          <>
            <h1 className="text-2xl font-bold text-center text-white">
              Welcome back, {user.user_metadata.full_name}!
            </h1>
            <Link href={process.env.NEXT_PUBLIC_DASHBOARD_URL} passHref>
              <a className="flex items-center px-10 py-2 text-lg font-black text-center text-white bg-gray-700 rounded-md gap-x-4">
                <ArrowRightIcon className="w-5 h-5 text-white" color="white" />
                <span className="w-full text-center">
                  Continue to Dashboard
                </span>
              </a>
            </Link>
            <p className="w-full font-semibold text-center text-gray-100">
              Connected accounts
            </p>

            <div className="grid justify-center space-y-4">
              {Object.entries(Providers).map(
                ([providerName, ProviderComponent], i) => {
                  const providerId = providerName
                    .split(/(?=[A-Z])/)[0]
                    .toLowerCase();

                  const provider = providers?.find(
                    (p) => p.type === providerId
                  );

                  return (
                    <ProviderComponent
                      key={i}
                      user={user}
                      provider={provider}
                    />
                  );
                }
              )}
              <form
                action={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/logout/discord`}
                method="POST"
                className="w-full"
              >
                <button
                  className="w-full px-6 py-2 text-lg font-black text-center text-white bg-red-500 rounded-md gap-x-4"
                  type="submit"
                >
                  Sign out
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl text-center text-white font-display">
              Please sign in
            </h1>

            <div className="flex justify-center space-y-4">
              <form
                action={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/login/discord`}
                method="POST"
              >
                <input
                  hidden
                  readOnly
                  name="redirect"
                  value={(redirect as string) || "/"}
                />
                <button
                  className="flex items-center px-10 py-2 text-lg text-white bg-indigo-500 rounded-md gap-x-4 font-display"
                  type="submit"
                >
                  <Discord className="w-5 h-5 text-white" color="white" />
                  Sign in with Discord
                </button>
              </form>
            </div>
          </>
        )}
      </Card>
    </>
  );
}

export default Index;
