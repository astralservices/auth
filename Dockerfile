FROM node:alpine

WORKDIR /app

COPY ./dist/apps/one-auth .

ENV NODE_ENV production
ENV PORT 3000
ENV NEXT_PUBLIC_SUPABASE_URL https://aoeinliucinfkgwibqgr.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDkxNTQ5MSwiZXhwIjoxOTU2NDkxNDkxfQ.s0qahlGo_qstkY0v8dGwiILEorRpKiF0crIJPieSvCU
ENV STRIPE_SECRET_KEY ""
ENV NEXT_PUBLIC_API_ENDPOINT https://api.astralapp.io
ENV NEXT_PUBLIC_DASHBOARD_URL https://dash.astralapp.io
ENV SUPABASE_SECRET_KEY eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQwOTE1NDkxLCJleHAiOjE5NTY0OTE0OTF9.F1bFBq4c3-xls2srHGbbo5fDlZW_U5W0DRk9FI7_z5Y

RUN yarn

CMD yarn next start
