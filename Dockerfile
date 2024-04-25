FROM node:18-alpine AS base

ENV SKIP_ENV_VALIDATION=true

# 设置 pnpm 的源为淘宝镜像
RUN echo 'registry=https://registry.npmmirror.com/' >> .npmrc

# Install pnpm
RUN npm install -g pnpm

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /app


# Install dependencies based on the preferred package manager
#COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml*  .npmrc  ./
#RUN pnpm config set registry https://registry.npmmirror.com/ && pnpm i --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml*  .npmrc  ./
RUN pnpm config set registry https://registry.npmmirror.com/ && pnpm i --frozen-lockfile
COPY . .
RUN pnpm run  postinstall && pnpm run build

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1


# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1


COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder  /app/.next/standalone ./
COPY --from=builder  /app/.next/static ./.next/static


EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js