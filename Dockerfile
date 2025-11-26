# ✅ FIX 1: Use Node 20 (Slim version is smaller & faster)
# This matches the "engines" requirement in your package.json
FROM node:20-slim

# ✅ FIX 2: Install system build tools required for sqlite3, canvas, etc.
# Without this, 'npm install' will fail for native modules like better-sqlite3 or canvas.
RUN apt-get update && \
    apt-get install -y python3 make g++ build-essential && \
    rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
# This makes re-deployments faster if dependencies haven't changed
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# ✅ FIX 3: Expose port 8080
# This matches the port used in the 'index.js' Render fix provided earlier.
EXPOSE 8080

# Start the bot using the main entry point
CMD [ "node", "index.js" ]
