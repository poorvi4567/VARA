# ── Stage 1: Build the React app ──
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the production React bundle
# This creates the /app/build folder with static HTML/CSS/JS
RUN npm run build

# ── Stage 2: Serve with Nginx ──
# We don't need Node.js to serve a built React app
# Nginx is a lightweight web server — much smaller final image
FROM nginx:alpine

# Copy the built React files into Nginx's serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config to handle React Router
# Without this, refreshing on /shop gives a 404
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]