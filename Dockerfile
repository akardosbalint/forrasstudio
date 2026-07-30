# Self-hosted deploy image — lásd docker-compose.yml és README "Docker
# Compose (self-hosted) deploy" szekció. Két célt szolgál (docker-compose
# `target:` mezővel választva):
#   - `runner`: a Next.js webalkalmazás (kis, standalone image)
#   - `scheduler`: a Google Calendar szinkron + emlékeztető háttérjob
#     (scripts/run-scheduled-tasks.ts), ehhez a teljes node_modules kell

FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# A `prisma generate` (postinstall) csak egy szintaktikailag valid
# DATABASE_URL-t igényel build közben — a tényleges kapcsolati sztring
# futásidőben, a docker-compose env-jéből érkezik.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npm ci

FROM node:22-slim AS builder
WORKDIR /app
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]

FROM node:22-slim AS scheduler
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
# Egyszerű ismétlő ciklus cron helyett — SCHEDULER_INTERVAL_SECONDS-enként
# fut le a szinkron + emlékeztető job (alap: 5 perc).
CMD ["sh", "-c", "while true; do npm run tasks:run; sleep ${SCHEDULER_INTERVAL_SECONDS:-300}; done"]
