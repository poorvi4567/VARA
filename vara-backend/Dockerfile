# ── Stage 1: base image ──
# We start from an official Node.js image
# 'alpine' is a minimal Linux distribution — keeps the image small
FROM node:18-alpine

# Set the working directory inside the container
# All subsequent commands run from here
WORKDIR /app

# Copy package.json and package-lock.json FIRST
# Docker caches each step — copying package files separately means
# npm install only re-runs when dependencies actually change,
# not every time you change your code
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of your source code
COPY . .

# Tell Docker this container listens on port 8000
# This is documentation — it doesn't actually open the port
EXPOSE 8000

# Command that runs when the container starts
CMD ["node", "server.js"]