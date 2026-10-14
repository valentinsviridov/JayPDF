FROM oven/bun:1 AS build

WORKDIR /usr/src/app

COPY package.json bun.lock bunfig.toml ./
COPY scripts/setup-pdf-worker.mjs ./scripts/setup-pdf-worker.mjs

RUN bun install --frozen-lockfile
RUN bun run setup-worker

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build


FROM nginx:alpine AS release

COPY --from=build /usr/src/app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
