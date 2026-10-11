FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY config ./config
USER node
EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://localhost:3000/books || exit 1
CMD ["npx", "tsx", "src/server.ts"]
