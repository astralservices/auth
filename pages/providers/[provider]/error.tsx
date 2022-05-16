import Card from "components/Card";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // get the error query param
  const error = ctx.query.error;
  const provider = ctx.query.provider;

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
      provider: provider,
    },
  };
}

export default function ProviderErrorPage({
  error,
  provider,
}: {
  error: string;
  provider: string;
}) {
  return (
    <Card>
      <h1 className="text-2xl font-bold text-center text-white">
        {provider.charAt(0).toUpperCase() + provider.slice(1)} Settings
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
