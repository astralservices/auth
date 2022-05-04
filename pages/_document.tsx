import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
          <link
            rel="preload"
            href="/assets/fonts/TypoGrotesk/TypoGroteskBlack.otf"
            as="font"
            type="font/otf"
          />
          <link
            rel="preload"
            href="/assets/fonts/TypoGrotesk/TypoGroteskBold.otf"
            as="font"
            type="font/otf"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/assets/img/IconMeshed.svg"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>

        <noscript>
          <img src="https://shy.maatt.ch/ingress/5bad3fba-8968-486b-a60c-7e8719ad2c1d/pixel.gif" />
        </noscript>
        <script
          defer
          src="https://shy.maatt.ch/ingress/5bad3fba-8968-486b-a60c-7e8719ad2c1d/script.js"
          type="text/javascript"
        ></script>
      </Html>
    );
  }
}

export default MyDocument;
