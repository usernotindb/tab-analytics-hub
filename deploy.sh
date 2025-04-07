
#!/bin/bash

# Exit on error
set -e

echo "Starting ATSAT deployment process..."

# Build the backend
echo "Building backend..."
cd ./backend
npm install
npm run build
echo "Backend build complete."

# Set up PM2 for backend if not already set up
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2 globally..."
  npm install -g pm2
fi

# Start/restart backend with PM2
echo "Starting backend with PM2..."
pm2 startOrRestart ecosystem.config.js
pm2 save

# Build the frontend
echo "Building frontend..."
cd ..
npm install
npm run build
echo "Frontend build complete."

# Set up Nginx if not already set up
if [ ! -f "/etc/nginx/sites-available/atsat" ]; then
  echo "Setting up Nginx configuration..."
  
  # Create Nginx config
  cat > /tmp/atsat-nginx << EOL
server {
  listen 80;
  server_name ats.aztecas.com;

  # Frontend
  location / {
    root /var/www/atsat/dist;
    try_files \$uri /index.html;
    add_header Cache-Control "public, max-age=3600";
  }

  # Backend API
  location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_cache_bypass \$http_upgrade;
  }
}
EOL

  # Move config to Nginx directory
  sudo mv /tmp/atsat-nginx /etc/nginx/sites-available/atsat
  
  # Enable the site
  sudo ln -s /etc/nginx/sites-available/atsat /etc/nginx/sites-enabled/
  
  # Test and restart Nginx
  sudo nginx -t
  sudo systemctl restart nginx
  
  echo "Nginx configuration complete."
else
  echo "Nginx configuration already exists."
  sudo nginx -t
  sudo systemctl restart nginx
fi

# Copy frontend build to web root
echo "Copying frontend to web root..."
sudo mkdir -p /var/www/atsat
sudo cp -r dist/* /var/www/atsat/dist/
sudo chown -R www-data:www-data /var/www/atsat

echo "Deployment complete! Application is now running."
echo "Frontend: http://ats.aztecas.com"
echo "Backend API: http://ats.aztecas.com/api"
