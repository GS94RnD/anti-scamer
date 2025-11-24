# AntiScamer Screen Share Monitor  
MIT License © 2025 Skorodinskiy Georgiy Pavlovich  
Telegram: https://t.me/GeorgSK21  

---

# 🇷🇺 Русская версия

## 🔍 Что делает это расширение?

**AntiScamer Screen Share Monitor** — это расширение для браузеров Chromium (Chrome, Opera), созданное для защиты пользователей от мошенников, которые обманом пытаются заставить вас включить демонстрацию экрана или начать видеозвонок.

Расширение автоматически:

✔ Отслеживает начало WebRTC-вызовов  
✔ фикcирует, если сайт вызывает `getDisplayMedia()`  
✔ обнаруживает запросы на демонстрацию экрана  
✔ понимает, когда пользователь нажал «Поделиться экраном»  
✔ отправляет предупреждение в Telegram-бот  

Расширение **не читает экран**, **не записывает видео**, **не собирает личные данные** — оно лишь фиксирует сам факт активации экранного доступа.

---

## 🛠 Установка через режим разработчика

1. Скачайте репозиторий:  
   https://github.com/GS94RnD/anti-scamer

2. Распакуйте в любую папку.

3. Откройте:
```
chrome://extensions/
opera://extensions/
browser://extensions/ -- For YandexBrowser
```

4. Включите «Режим разработчика».

5. Нажмите **Load unpacked** / **Загрузить распакованное**.

6. Укажите папку проекта.

Готово — расширение установлено.

---

## 💬 Как пользоваться

### Шаг 1 — Открыть popup

Нажмите на иконку расширения → появится окно настроек.

### Шаг 2 — Добавить Telegram_id экстренных контактов

Введите Telegram  идентификатор Ваших экстренных контактов **Telegram_id** → нажмите **Добавить / Push New Contact**.

Можно сохранять несколько chat_id.

### Шаг 3 — Тестирование

Нажмите **Test mge for Contacts** — вы получите тестовое сообщение от бота.

### Шаг 4 — Обычное использование [Простыми словами весь путь пользователя]
Как пользоваться:
1. Установите расширение;
2. Перейти в Telegram бот, @AntiScumersBot (https://t.me/AntiScumersBot), написать команду /start , 
написать нужно как Вам, так и Вашим экстренным контактам иначе сообщение о тревоге  не сможет прийти Вашим экстренным контактам 
3. Введите в расширении Telegram ID Ваших экстренных контактов, если Вы не знаете как их найти воспользуйтесть сторонним Telegram ботом - @username_to_id_bot (https://t.me/username_to_id_bot);
4. При попытке демонстрировать ваш экран браузера — Ваши экстренные контакты получат моментальное предупреждение в виде сообщения Telegram.  

---

Просто браузьте сайты.  
Если:

- сайт запускает видеозвонок и вы нажали «Поделиться экраном»  

Расширение отправит предупреждение в Telegram.

---

## 🔔 Когда приходит предупреждение [Техническое пояснение]

Вы получите уведомление, если:

- сайт вызвал `navigator.mediaDevices.getDisplayMedia()`  
- сайт вызвал `getUserMedia()`  
- создаётся `RTCPeerConnection`  
- начинается обмен SDP (offer/answer)  
- пользователь разрешил экран → реальная демонстрация началась  

---

## 📦 Какие разрешения используются

```
"permissions": ["storage", "tabs", "activeTab", "scripting"]
```

storage — хранение chat_id  
tabs, activeTab, scripting — внедрение скриптов в сайт  
content_scripts — отслеживание WebRTC API  

---

# 🇬🇧 English Version

## 🔍 What does this extension do?

**AntiScamer Screen Share Monitor** is a Chromium extension (Chrome, Opera) designed to protect users from scammers who try to trick you into sharing your screen or starting a video call.

The extension automatically:

✔ Detects WebRTC calls  
✔ Detects when a site invokes `getDisplayMedia()`  
✔ Detects screen-share permission prompts  
✔ Detects when the user clicks “Share screen”  
✔ Sends an instant alert to your Telegram bot  

The extension **does NOT capture screen content**, **does NOT record video**, and **never collects personal data**.  
It only monitors the *fact* of screen-sharing activation.

---

## 🛠 Installation (Developer Mode)

1. Download the repo:  
   https://github.com/GS94RnD/anti-scamer
2. Unzip it
3. Open:
```
chrome://extensions/
opera://extensions/
browser://extensions/ -- For YandexBrowser

```
4. Enable **Developer mode**
5. Click **Load unpacked**
6. Select the project folder

Done.

---

## 💬 How to use

1.How to use:
1. Install the extension;
2. Go to the Telegram bot, @AntiScumersBot (https://t.me/AntiScumersBot), and write the command /start.
You need to write it to both yourself and your emergency contacts, otherwise the alarm message will not be sent to your emergency contacts.
3. Enter the Telegram ID of your emergency contacts in the extension. If you don't know how to use it, use the Telegram bot - @username_to_id_bot (https://t.me/username_to_id_bot).
4. If you try to display your browser screen, your emergency contacts will receive an instant warning via Telegram.

---

## 🔔 Alert is triggered when:

- A website calls `getDisplayMedia()`
- A website calls `getUserMedia()`
- A `RTCPeerConnection` is created
- SDP offer/answer exchange begins
- The user approves screen sharing  

---

## 📦 Permissions

```
"permissions": ["storage", "tabs", "activeTab", "scripting"]
```

MIT License © 2025  
Author: **Skorodinskiy Georgiy Pavlovich**  
Telegram: https://t.me/GeorgSK21  
