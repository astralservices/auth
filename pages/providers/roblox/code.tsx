import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
} from "@heroicons/react/outline";
import Card from "components/Card";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // get the code query param
  const code = ctx.query.code;

  console.log(code);

  // if there is no code, redirect to the home page
  if (!code) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // otherwise, return the code

  return {
    props: {
      code: code,
    },
  };
}

export default function RobloxProviderCodePage({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Card>
      <h1 className="text-2xl font-bold text-center text-white">
        Roblox Settings
      </h1>

      <h3 className="text-xl font-bold text-center text-white">Linking code</h3>

      {/* put the code in an input with a copy button */}
      <div className="flex items-center justify-center w-full">
        <input
          className="p-2 border rounded-l-lg"
          value={code}
          readOnly
          onFocus={(e) => {
            e.target.select();
          }}
        />
        <button
          className="p-2 bg-white border rounded-r-lg"
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 750);
          }}
        >
          {copied ? (
            <ClipboardCheckIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <ClipboardCopyIcon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      <p className="text-sm text-center text-gray-200">
        Put this anywhere in your profile's description.
      </p>

      <form
        action={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/callback/roblox`}
        method="POST"
      >
        <input type="hidden" name="code" value={code} />
        <button
          type="submit"
          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
        >
          Link
        </button>
      </form>
    </Card>
  );
}
