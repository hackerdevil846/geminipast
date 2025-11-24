# Use Playwright image to ensure all browser dependencies are met
FROM mcr.microsoft.com/playwright:v1.41.2-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the bot code
COPY . .

# Expose port for dashboard/uptime
EXPOSE 3000

# Start the bot
CMD [ "node", "index.js" ]
