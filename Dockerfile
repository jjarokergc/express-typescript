# Dockerfile - Production Image
# Multi-stage Dockerfile for a Node.js application using pnpm and TypeScript
#

# ────────────────────────────────────────────────
# Stage 0: Common base with pnpm prepared
# ────────────────────────────────────────────────
FROM node:23.11.1-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable 
WORKDIR /app

# ────────────────────────────────────────────────
# Stage 1: Only production dependencies
# Persistent cache across builds (same id reuses it)
# Generate node_modules with only runtime dependencies
# ────────────────────────────────────────────────
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

# ────────────────────────────────────────────────
# Stage 2: Install all dependencies and build
# Re-use cache mount where dependencies already exist
# ────────────────────────────────────────────────
FROM base AS build
COPY package.json pnpm-lock.yaml ./
# Install all dependencies (including dev dependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
# Copy full code after dependencies are installed
COPY . .
RUN pnpm run build

# ────────────────────────────────────────────────
# Stage 3: Final production image combining prod deps and build output
# Two folders copied from previous stages
# Omits source code, dev dependencies, and build tools
# ────────────────────────────────────────────────
FROM node:23.11.1-alpine AS runner
WORKDIR /app
# Copy production node_modules from prod-deps stage
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
# Copy compiled output from build stage
# Files belong to non-root user for better security
COPY --from=build --chown=node:node /app/dist ./dist

# Use the node user from the image
USER node

# Expose port 8080
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]
