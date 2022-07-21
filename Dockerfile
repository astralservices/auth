FROM node:17.9.1-alpine AS build

USER root

WORKDIR /build

ADD . .

ENV PUBLIC_API_ENDPOINT=https://api.astralapp.io
ENV SECRET_NODE_ENV=production
ENV PUBLIC_DASHBOARD_URL=https://auth.astralapp.io

RUN yarn

RUN yarn build

FROM denoland/deno:alpine

WORKDIR /app

COPY --from=build /build/dist /app/dist
COPY --from=build /build/server.deno.js /app/server.deno.js

RUN ls /app

ENTRYPOINT [ "deno" ]

CMD [ "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--allow-run", "/app/server.deno.js" ] 