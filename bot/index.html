const { Telegraf, session, Markup } = require('telegraf');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://your-domain.com/mini-app';
const PORT = process.env.PORT || 3000;

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(cors());
app.use(express.json());
app.use('/mini-app', express.static(path.join(__dirname, '../mini-app')));

const db = new sqlite3.Database('./anti-scamer.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      trusted_contacts TEXT DEFAULT '[]',
      emergency_message TEXT DEFAULT '🚨 ВНИМАНИЕ! Меня принуждают демонстрировать экран в Telegram. Требуется помощь!',
      cancel_password TEXT DEFAULT '123456',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      user_id INTEGER PRIMARY KEY,
      is_protection_active BOOLEAN DEFAULT FALSE,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

bot.use(session());

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || '';
  const firstName = ctx.from.first_name || '';
  
  db.run(`
    INSERT OR REPLACE INTO users (user_id, username, first_name, last_name) 
    VALUES (?, ?, ?, ?)
  `, [userId, username, firstName, ctx.from.last_name || '']);
  
  const message = await ctx.reply(
    `🛡️ *AntiScamer - Защита от принудительной демонстрации экрана*\n\n` +
    `Привет, ${firstName}! Защити свои данные от мошенников и принудительного показа экрана.\n\n` +
    `*Как работает защита:*\n` +
    `• Автоматически обнаруживает демонстрацию экрана\n` +
    `• Отправляет тревожные уведомления доверенным контактам\n` +
    `• Дает 60 секунд для безопасной отмены\n\n` +
    `*Нажмите кнопку ниже для запуска защиты:*`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🛡️ Запустить AntiScamer', WEB_APP_URL)],
        [Markup.button.callback('📋 Как найти ID?', 'help_id')],
        [Markup.button.callback('⚙️ Настройки', 'open_settings')]
      ])
    }
  );
  
  try {
    await ctx.pinChatMessage(message.message_id);
    await ctx.reply('✅ Сообщение защиты закреплено! Вы всегда можете быстро запустить AntiScamer.');
  } catch (error) {
    console.log('Не удалось закрепить сообщение');
  }
});

bot.command('id', (ctx) => {
  const userId = ctx.from.id;
  ctx.reply(
    `📋 *Ваши идентификаторы для AntiScamer*\n\n` +
    `👤 Ваш User ID: \`${userId}\`\n` +
    `💬 ID этого чата: \`${ctx.chat.id}\`\n\n` +
    `*Как добавить доверенный контакт:*\n` +
    `1. Попросите друга отправить /id\n` +
    `2. Скопируйте его User ID\n` +
    `3. Добавьте в настройки AntiScamer`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('help', (ctx) => {
  ctx.reply(
    `🛡️ *AntiScamer - Помощь*\n\n` +
    `*Основные команды:*\n` +
    `/start - Запустить бота и закрепить сообщение\n` +
    `/id - Показать ваш ID для настроек\n` +
    `/help - Показать эту справку\n\n` +
    `*Как использовать:*\n` +
    `1. Запустите защиту через закрепленное сообщение\n` +
    `2. Настройте доверенные контакты\n` +
    `3. При демонстрации экрана сработает защита\n\n` +
    `*Поддержка:* @your_support_contact`,
    { parse_mode: 'Markdown' }
  );
});

bot.action('help_id', async (ctx) => {
  await ctx.editMessageText(
    `🔍 *Как найти ID пользователя для AntiScamer?*\n\n` +
    `*Способ 1 (простой):*\n` +
    `• Попросите пользователя написать /id нашему боту\n` +
    `• Скопируйте его User ID\n\n` +
    `*Способ 2 (через бота):*\n` +
    `• Используйте @userinfobot\n` +
    `• Перешлите сообщение пользователя боту\n\n` +
    `*Способ 3 (пересылка):*\n` +
    `• Перешлите мне сообщение от нужного пользователя\n` +
    `• Я автоматически определю его ID\n\n` +
    `*Важно:* User ID - это цифры, а не username!`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🛡️ Назад в главное меню', 'back_to_main')]
      ])
    }
  );
});

bot.action('open_settings', async (ctx) => {
  await ctx.editMessageText(
    `⚙️ *Настройки AntiScamer*\n\n` +
    `Здесь вы можете настроить параметры защиты.`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('⚙️ Открыть настройки', `${WEB_APP_URL}?settings=1`)],
        [Markup.button.callback('📋 Как найти ID?', 'help_id')],
        [Markup.button.callback('🔙 Назад', 'back_to_main')]
      ])
    }
  );
});

bot.action('back_to_main', async (ctx) => {
  await ctx.editMessageText(
    `🛡️ *AntiScamer - Защита от принудительной демонстрации экрана*\n\n` +
    `Защити свои данные от мошенников и принудительного показа экрана.\n\n` +
    `*Нажмите кнопку ниже для запуска защиты:*`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🛡️ Запустить AntiScamer', WEB_APP_URL)],
        [Markup.button.callback('📋 Как найти ID?', 'help_id')],
        [Markup.button.callback('⚙️ Настройки', 'open_settings')]
      ])
    }
  );
});

bot.on('message', (ctx) => {
  if (ctx.message.forward_from) {
    const user = ctx.message.forward_from;
    ctx.reply(
      `👤 *Найден пользователь для AntiScamer:*\n\n` +
      `🆔 User ID: \`${user.id}\`\n` +
      `👤 Имя: ${user.first_name || 'Не указано'}\n` +
      `📱 Username: ${user.username ? '@' + user.username : 'Не указан'}\n\n` +
      `*Скопируйте User ID и добавьте в настройки AntiScamer*`,
      { 
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.webApp('🛡️ Добавить в AntiScamer', WEB_APP_URL)]
        ])
      }
    );
  }
});

app.post('/api/user/:userId/protection/start', (req, res) => {
  const userId = req.params.userId;
  
  db.run(`
    INSERT OR REPLACE INTO user_sessions (user_id, is_protection_active, last_activity) 
    VALUES (?, TRUE, CURRENT_TIMESTAMP)
  `, [userId]);
  
  res.json({ success: true, message: 'Protection started' });
});

app.post('/api/user/:userId/protection/stop', (req, res) => {
  const userId = req.params.userId;
  
  db.run(`
    INSERT OR REPLACE INTO user_sessions (user_id, is_protection_active, last_activity) 
    VALUES (?, FALSE, CURRENT_TIMESTAMP)
  `, [userId]);
  
  res.json({ success: true, message: 'Protection stopped' });
});

app.get('/api/user/:userId/settings', (req, res) => {
  const userId = req.params.userId;
  
  db.get(
    'SELECT * FROM users WHERE user_id = ?',
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!row) return res.status(404).json({ error: 'User not found' });
      
      res.json({
        ...row,
        trusted_contacts: JSON.parse(row.trusted_contacts || '[]')
      });
    }
  );
});

app.post('/api/user/:userId/settings', (req, res) => {
  const userId = req.params.userId;
  const { trusted_contacts, emergency_message, cancel_password } = req.body;
  
  db.run(`
    UPDATE users 
    SET trusted_contacts = ?, emergency_message = ?, cancel_password = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `, [JSON.stringify(trusted_contacts), emergency_message, cancel_password, userId]);
  
  res.json({ success: true, message: 'Settings updated' });
});

app.post('/api/user/:userId/emergency', (req, res) => {
  const userId = req.params.userId;
  
  db.get(
    'SELECT trusted_contacts, emergency_message FROM users WHERE user_id = ?',
    [userId],
    async (err, row) => {
      if (err || !row) {
        return res.status(500).json({ error: 'User not found' });
      }
      
      const contacts = JSON.parse(row.trusted_contacts || '[]');
      const message = row.emergency_message || '🚨 ЭКСТРЕННОЕ УВЕДОМЛЕНИЕ! Требуется помощь!';
      
      for (const contactId of contacts) {
        try {
          await bot.telegram.sendMessage(
            contactId,
            `${message}\n\n👤 Пользователь: ${userId}\n⏰ Время: ${new Date().toLocaleString('ru-RU')}`
          );
        } catch (error) {
          console.error(`Failed to send to ${contactId}:`, error);
        }
      }
      
      res.json({ success: true, sent_to: contacts.length });
    }
  );
});

bot.launch().then(() => {
  console.log('🛡️ AntiScamer Bot started successfully');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AntiScamer Server running on port ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));