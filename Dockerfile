# =========================
# Stage 1: Build React
# =========================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .

RUN npm run build


# =========================
# Stage 2: Run Express
# =========================
FROM node:22-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./

RUN npm ci --omit=dev

# Copy backend source
COPY backend/ .

# Copy React production build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]