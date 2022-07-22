import * as Sentry from "https://deno.land/x/sentry_deno/main.ts";
import "./dist/server/entry.mjs";

Sentry.init({
  dsn: "https://dee54b8cee614b7eb6ae97dafff697b0@gt.astralapp.io/2",
});

Sentry.captureMessage("Hello World");
