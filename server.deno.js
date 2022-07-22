import * as Sentry from "https://deno.land/x/sentry_deno/main.ts";
import "./dist/server/entry.mjs";

Sentry.init({
  dsn: "https://ae156eb36b1e4fcc8f3fcf48c7f4d933@gt.astralapp.io/3",
});
