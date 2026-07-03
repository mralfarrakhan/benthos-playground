FROM oven/bun:1.3.14 AS builder
WORKDIR /app
COPY package*.json ./
RUN bun ci
COPY . .
RUN bun run build

FROM oven/bun:1.3.14
WORKDIR /app
COPY --from=builder /app/build build/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "bun", "run", "build/index.js" ]