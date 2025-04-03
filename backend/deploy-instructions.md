
# Deployment Instructions for ATSAT API Server

This guide provides instructions for deploying the ATSAT API server to a production environment.

## Prerequisites

- A Linux server (Ubuntu/Debian recommended)
- Node.js (v14+) installed
- MySQL/MariaDB installed
- Domain name with DNS configured (e.g., ats.aztecas.com)
- SSH access to the server

## Step 1: Server Preparation

Update the system and install essential packages:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git nginx certbot python3-certbot-nginx
```

## Step 2: Create a Database

```bash
sudo mysql -u root -p
```

In the MySQL console:

```sql
CREATE DATABASE atsat;
CREATE USER 'atsat'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON atsat.* TO 'atsat'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Import the database schema:

```bash
mysql -u atsat -p atsat < mysql-schema.sql
```

## Step 3: Clone the Repository

```bash
git clone <repository-url> /var/www/atsat-api
cd /var/www/atsat-api/backend
```

## Step 4: Install Dependencies and Build

```bash
npm install
npm run build
```

## Step 5: Configure Environment Variables

Create a production .env file:

```bash
cp .env.example .env
nano .env
```

Update the values for production:

```
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=atsat
DB_PASSWORD=secure_password_here
DB_NAME=atsat
DB_CONNECTION_LIMIT=10
JWT_SECRET=long_random_secure_string
JWT_EXPIRY=24h
CORS_ORIGIN=https://ats.aztecas.com
```

## Step 6: Install PM2 Process Manager

```bash
sudo npm install -g pm2
```

Create a PM2 ecosystem file:

```bash
touch ecosystem.config.js
nano ecosystem.config.js
```

Add the following content:

```javascript
module.exports = {
  apps: [{
    name: 'atsat-api',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    max_memory_restart: '200M'
  }]
};
```

Start the application with PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 7: Configure Nginx as a Reverse Proxy

Create a new Nginx site configuration:

```bash
sudo nano /etc/nginx/sites-available/atsat-api
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name api.ats.aztecas.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and test the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/atsat-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: Set Up SSL with Let's Encrypt

```bash
sudo certbot --nginx -d api.ats.aztecas.com
```

Follow the prompts to complete the SSL setup.

## Step 9: Set Up Firewall

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

## Step 10: Set Up Monitoring and Logging

Install Netdata for system monitoring:

```bash
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

Set up log rotation:

```bash
sudo nano /etc/logrotate.d/atsat-api
```

Add the following configuration:

```
/var/www/atsat-api/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 640 www-data adm
    sharedscripts
    postrotate
        pm2 reload atsat-api
    endscript
}
```

## Step 11: Database Backups

Set up automated database backups:

```bash
sudo apt install -y automysqlbackup
sudo nano /etc/default/automysqlbackup
```

Update the configuration with your database credentials.

## Step 12: Set Up CI/CD (Optional)

For continuous deployment, you can use GitHub Actions or GitLab CI to automate the deployment process.

Example workflow steps:
1. Pull the latest code changes
2. Install dependencies
3. Run tests
4. Build the application
5. Restart the PM2 process

## Step 13: Update Frontend Configuration

Ensure the frontend application is configured to use the new API endpoint:

```
VITE_API_BASE_URL=https://api.ats.aztecas.com
```

## Step 14: Final Checks

1. Verify the API is accessible: `curl https://api.ats.aztecas.com/api/health`
2. Check logs for any errors: `pm2 logs atsat-api`
3. Monitor system resources: `http://your-server-ip:19999/`

## Maintenance

- Regularly update dependencies: `npm audit fix`
- Apply security patches: `sudo apt update && sudo apt upgrade -y`
- Monitor disk space: `df -h`
- Check logs: `pm2 logs atsat-api`
