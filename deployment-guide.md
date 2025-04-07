
# ATSAT Application Deployment Guide

This guide provides detailed instructions for deploying the complete ATSAT application, including both frontend and backend components.

## Prerequisites

- Linux server (Ubuntu/Debian recommended)
- Node.js (v14+) installed
- MySQL/MariaDB database
- Nginx web server
- Domain name with DNS configured (e.g., ats.aztecas.com)

## Deployment Options

You have two options for deployment:

1. **Automated Deployment**: Using the provided `deploy.sh` script
2. **Manual Deployment**: Following step-by-step instructions

## Option 1: Automated Deployment

### Step 1: Clone the Repository

```bash
git clone <repository-url> atsat
cd atsat
```

### Step 2: Configure Environment

Create a `.env` file in the backend directory:

```bash
cd backend
cp .env.example .env
nano .env
```

Update the values for your environment:

```
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=atsat
DB_CONNECTION_LIMIT=10
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRY=24h
CORS_ORIGIN=https://ats.aztecas.com
```

### Step 3: Make the Deployment Script Executable

```bash
cd ..
chmod +x deploy.sh
```

### Step 4: Run the Deployment Script

```bash
sudo ./deploy.sh
```

The script will:
- Build the backend
- Set up PM2 for process management
- Build the frontend
- Configure Nginx
- Copy files to the appropriate locations
- Restart services

## Option 2: Manual Deployment

### Step 1: Backend Deployment

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (see Step 2 in the automated deployment section)

4. Build the application:
   ```bash
   npm run build
   ```

5. Set up PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Step 2: Frontend Deployment

1. Navigate to the frontend directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend:
   ```bash
   npm run build
   ```

4. Create a directory for the frontend files:
   ```bash
   sudo mkdir -p /var/www/atsat/dist
   ```

5. Copy the build files:
   ```bash
   sudo cp -r dist/* /var/www/atsat/dist/
   ```

6. Set proper permissions:
   ```bash
   sudo chown -R www-data:www-data /var/www/atsat
   ```

### Step 3: Nginx Configuration

1. Create a new Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/atsat
   ```

2. Add the following configuration:
   ```nginx
   server {
     listen 80;
     server_name ats.aztecas.com;

     # Frontend
     location / {
       root /var/www/atsat/dist;
       try_files $uri /index.html;
       add_header Cache-Control "public, max-age=3600";
     }

     # Backend API
     location /api {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/atsat /etc/nginx/sites-enabled/
   ```

4. Test and reload Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Step 4: SSL Configuration (Recommended)

1. Install Certbot:
   ```bash
   sudo apt update
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Obtain an SSL certificate:
   ```bash
   sudo certbot --nginx -d ats.aztecas.com
   ```

3. Follow the prompts to complete the SSL setup

## Database Setup

1. Create the database:
   ```bash
   mysql -u root -p
   ```

2. In the MySQL console:
   ```sql
   CREATE DATABASE atsat;
   CREATE USER 'atsat'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON atsat.* TO 'atsat'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. Import the database schema:
   ```bash
   mysql -u atsat -p atsat < backend/mysql-schema.sql
   ```

## Maintenance and Monitoring

### Log Monitoring

- Backend logs:
  ```bash
  pm2 logs atsat-api
  ```

- Nginx logs:
  ```bash
  sudo tail -f /var/log/nginx/access.log
  sudo tail -f /var/log/nginx/error.log
  ```

### Updates

1. Pull the latest code:
   ```bash
   git pull origin main
   ```

2. Run the deployment script:
   ```bash
   sudo ./deploy.sh
   ```

### Backup Strategy

1. Database backups:
   ```bash
   mysqldump -u atsat -p atsat > atsat_backup_$(date +%Y%m%d).sql
   ```

2. Consider setting up automated backups with a cron job:
   ```bash
   sudo crontab -e
   ```

   Add this line to run daily backups at 2 AM:
   ```
   0 2 * * * mysqldump -u atsat -p'your_password' atsat > /path/to/backups/atsat_backup_$(date +\%Y\%m\%d).sql
   ```

## Troubleshooting

1. **Backend not starting**: Check PM2 logs with `pm2 logs atsat-api`
2. **Frontend showing 404**: Ensure Nginx configuration is correct and files are in the right location
3. **Database connection issues**: Verify database credentials in `.env` file
4. **Permission problems**: Check permissions with `ls -la /var/www/atsat`

## Security Considerations

1. Set up a firewall:
   ```bash
   sudo ufw allow ssh
   sudo ufw allow http
   sudo ufw allow https
   sudo ufw enable
   ```

2. Regularly update system packages:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

3. Secure MySQL installation:
   ```bash
   sudo mysql_secure_installation
   ```

4. Keep JWT_SECRET secure and rotate it periodically

## Support and Help

If you encounter any issues during deployment, please contact:
- Technical Support: support@aztecas.com
