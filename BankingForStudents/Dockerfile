# Use Debian-based Node.js image for better compatibility
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json before running npm install
COPY package.json package-lock.json ./

# Ensure npm is up to date
RUN npm install -g npm@latest

# Install dependencies
RUN npm install

# Manually install lightningcss to ensure correct binary
RUN npm install lightningcss --force && npm rebuild lightningcss --update-binary

# Copy the rest of the application files
COPY . .

# Expose Metro bundler and Expo ports
EXPOSE 8081 19000 19001 19002

# Start Expo with the new CLI
CMD ["npx", "expo", "start"]
