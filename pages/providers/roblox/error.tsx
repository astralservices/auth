import Card from "components/Card";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // get the error query param
  const error = ctx.query.error;

  // if there is no error, redirect to the home page
  if (!error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // otherwise, return the error
  return {
    props: {
      error: error,
    },
  };
}

export default function RobloxProviderErrorPage({ error }: { error: string }) {
  return (
    <Card>
      <h1 className="text-2xl font-bold text-center text-white">
        Roblox Settings
      </h1>

      <h3 className="text-xl font-bold text-center text-white">
        Error linking your account
      </h3>

      <p className="text-center text-white">{error}</p>

      <Link href="/" passHref>
        <a>
          <p className="mt-4 text-sm font-bold text-center text-blue-500">
            Go Back
          </p>
        </a>
      </Link>
    </Card>
  );
}
