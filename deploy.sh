#!/bin/bash

echo "🚀 Deploying AntiScamer..."

PROJECT_DIR="/home/username/anti-scamer"
BACKUP_DIR="/home/username/backups"
CURRENT_DATE=$(date +%Y%m%d_%H%M%S)

echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/anti-scamer-backup_$CURRENT_DATE.tar.gz $PROJECT_DIR

echo "🛑 Stopping application..."
cd $PROJECT_DIR
pm2 stop anti-scamer-bot || true

echo "📥 Updating code..."
git pull origin main

echo "📦 Installing dependencies..."
cd $PROJECT_DIR/bot
npm install --production

echo "🔐 Setting permissions..."
chmod +x $PROJECT_DIR/deploy.sh
chmod -R 755 $PROJECT_DIR

echo "🚀 Starting application..."
pm2 start ecosystem.config.js --env production
pm2 save

echo "✅ AntiScamer deployment completed!"
echo "📊 Status:"
pm2 status anti-scamer-bot