# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Copy lock + package.json
COPY package*.json ./
COPY nx.json tsconfig.base.json ./
COPY apps/service-a ./apps/service-a
# COPY libs ./libs

RUN npm ci
RUN npx nx build service-a

# Stage 2: Run
FROM node:24-alpine AS runner

WORKDIR /app

# Copy only built output
COPY --from=builder /app/apps/service-b/dist ./dist

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

CMD ["node", "dist/main.js"]
