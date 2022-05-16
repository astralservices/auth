import { User } from "@supabase/supabase-js";
import Card from "components/Card";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { supabase } from "../../../util/supabase";
import { APIResponse, Blacklist, Provider } from "../../../util/types";

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

  const user = await supabase.auth.api.getUser(accessToken.toString());

  const provider: APIResponse<Provider> = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/providers/roblox`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => res.json());

  console.log(provider);

  return {
    props: {
      ...ctx.params,
      provider: provider.result,
      user: user.data,
    },
  };
}

export default function RobloxProviderPage({
  user,
  provider,
}: {
  user: User;
  provider: Provider;
}) {
  return (
    <Card>
      <h1 className="text-2xl font-bold text-center text-white">
        Roblox Settings
      </h1>

      {provider ? (
        <>
          <h2 className="text-xl font-semibold text-center text-white">
            Linked Account
          </h2>

          <h3 className="text-base font-medium text-center text-white">
            <span className="font-bold">Username:</span>{" "}
            {provider.provider_data.username}
          </h3>

          <form
            action={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/logout/roblox`}
            method="POST"
          >
            <button
              className="w-full px-6 py-2 text-lg font-black text-center text-white bg-red-500 rounded-md gap-x-4"
              type="submit"
            >
              Sign out
            </button>
          </form>

          <Link href="/" passHref>
            <a>
              <p className="w-full mt-2 text-sm font-bold text-center text-blue-500">
                Go Back
              </p>
            </a>
          </Link>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold text-center text-white">
            Link your Roblox account
          </h3>

          <form
            action={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/login/roblox`}
            method="POST"
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-left text-gray-50"
              >
                Roblox Username
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="username"
                  className="block w-full text-white bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Builderman"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
            >
              Generate Code
            </button>
          </form>
        </>
      )}
    </Card>
  );
}
