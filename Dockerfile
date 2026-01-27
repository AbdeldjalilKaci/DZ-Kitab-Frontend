# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_BASE_URL=http://127.0.0.1:8000
RUN npm run build

# Stage 2: Production - Use vite preview
FROM node:20-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Use vite preview instead of serve
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]