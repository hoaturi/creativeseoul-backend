# Build stage
FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./

# Install all dependencies
RUN yarn install

# Copy the rest of the code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:22-alpine AS production

RUN corepack enable

WORKDIR /app

# Copy package files and yarn configuration
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install only production dependencies using Yarn 4 syntax
RUN yarn workspaces focus --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist


# Start the application
CMD ["node", "dist/main"]