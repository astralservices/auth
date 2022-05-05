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

export function Index() {
  const { user, login, logout, loading, session } = useAuth();

  const [checkingRedirect, setCheckingRedirect] = useState(true);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const redirect = router.query.redirect;

  useEffect(() => {
    if (session) {
      fetch(
        `${process.env["NEXT_PUBLIC_API_ENDPOINT"]}/api/v1/users/@me/status`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )
        .then((res) => res.json())
        .then(({ result: res }) => {
          if (res.status === "blacklisted") {
            router.push("/restricted");
          }
        });
    }
  }, [session]);

  useEffect(() => {
    setMessage("Signing you in!");
    if (redirect && session) {
      toast.success("You're signed in!");
      setMessage("Redirecting");
      router.push(redirect as string);
      setCheckingRedirect(false);
    } else {
      setCheckingRedirect(false);
    }
  }, [redirect]);

  return (
    <>
      <Card>
        {user ? (
          checkingRedirect ? (
            <div className="flex flex-wrap justify-center space-y-4">
              <h1 className="w-full text-2xl text-center text-white font-display">
                {message}
              </h1>
              <svg
                className="w-12 h-12 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center text-white">
                Welcome back, {user.user_metadata.full_name}!
              </h1>
              <Link href={process.env.NEXT_PUBLIC_DASHBOARD_URL} passHref>
                <a className="flex items-center px-10 py-2 text-lg font-black text-center text-white bg-gray-700 rounded-md gap-x-4">
                  <ArrowRightIcon
                    className="w-5 h-5 text-white"
                    color="white"
                  />
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
                  ([provider, ProviderComponent]) => (
                    <ProviderComponent key={provider} user={user} />
                  )
                )}
                <button
                  className="px-6 py-2 text-lg font-black text-center text-white bg-red-500 rounded-md gap-x-4"
                  onClick={() => router.push("/logout")}
                >
                  Sign out
                </button>
              </div>
            </>
          )
        ) : (
          <>
            <h1 className="text-2xl text-center text-white font-display">
              Please sign in
            </h1>

            <div className="flex justify-center space-y-4">
              <form action={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/login/discord`} method="POST">
                <input hidden readOnly name="redirect" value={(redirect as string) || "/"} />
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
