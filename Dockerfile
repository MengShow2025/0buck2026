# v3.4.9: 0Buck Full-Stack Monorepo Dockerfile (Railway Build-Time Fixed)
FROM node:20-slim AS frontend-builder
WORKDIR /frontend

# Build-time arguments (Passed from Railway Variables)
ARG VITE_STREAM_API_KEY
ARG VITE_SHOPIFY_STOREFRONT_TOKEN
ARG VITE_SHOPIFY_STORE_DOMAIN
ARG VITE_STREAM_API_REGION
ARG VITE_CLOUDINARY_CLOUD_NAME

# Convert ARGs to ENVs for Vite to pick up
ENV VITE_STREAM_API_KEY=$VITE_STREAM_API_KEY
ENV VITE_SHOPIFY_STOREFRONT_TOKEN=$VITE_SHOPIFY_STOREFRONT_TOKEN
ENV VITE_SHOPIFY_STORE_DOMAIN=$VITE_SHOPIFY_STORE_DOMAIN
ENV VITE_STREAM_API_REGION=$VITE_STREAM_API_REGION
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM python:3.9-slim
WORKDIR /app

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .
# Copy frontend build to static folder inside backend
COPY --from=frontend-builder /frontend/dist ./static

# Expose port (Railway will override this with $PORT)
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
