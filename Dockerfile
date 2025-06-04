# Use Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set NODE_ENV to production by default
ENV NODE_ENV=production

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]