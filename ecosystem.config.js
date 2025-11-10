module.exports = {
  apps: [{
    name: 'anti-scamer-bot',
    script: './bot/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      BOT_TOKEN: 'YOUR_BOT_TOKEN',
      WEB_APP_URL: 'https://your-domain.com/mini-app',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};