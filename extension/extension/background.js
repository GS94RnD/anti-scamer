const SERVER_URL_BASE = "https://monitor.videoit.ru/api/alert";

// Кэш chat_id
let emergencyUids = [];

// При запуске загружаем chat_id из storage
chrome.storage.local.get(["emergencyUids"], (res) => {
  emergencyUids = Array.isArray(res.emergencyUids) ? res.emergencyUids : [];
  console.log("[BACKGROUND] Загруженные chat_id из storage:", emergencyUids);
});

// Слушаем сообщения от popup и content
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === "SAVE_CHAT_ID") {
    const ids = Array.isArray(msg.ids) ? msg.ids : [msg.ids];
    chrome.storage.local.set({ emergencyUids: ids }, () => {
      emergencyUids = ids;
      console.log("[BACKGROUND] chat_id сохранены в storage:", emergencyUids);
      sendResponse({ status: "ok" });
    });
    return true;
  }

  if (msg.type === "TEST_ALERT") {
    if (!emergencyUids.length) {
      console.log("[BACKGROUND] chat_id отсутствует, тест не отправлен");
      sendResponse({ status: "fail" });
      return;
    }

    emergencyUids.forEach(uid => {
      const url = `${SERVER_URL_BASE}?user_id=${uid}&text=🔔 Тестовое сообщение (демонстрация НЕ обнаружена)`;
      console.log("[BACKGROUND] TEST отправка:", url);
      fetch(url)
        .then(res => res.text())
        .then(text => console.log(`[BACKGROUND] Сервер ответил (тест ${uid}):`, text))
        .catch(err => console.error(`[BACKGROUND] Ошибка TEST (${uid}):`, err));
    });

    sendResponse({ status: "ok" });
    return;
  }

  if (msg.type === "SCREEN_SHARE_DETECTED") {
    console.log("[BACKGROUND] Пойман SCREEN_SHARE_DETECTED");
    console.log("[BACKGROUND] Активные chat_id:", emergencyUids);

    if (!emergencyUids.length) {
      console.log("[BACKGROUND] Нет chat_id — уведомление не отправлено");
      return;
    }

    emergencyUids.forEach(uid => {
      const url = `${SERVER_URL_BASE}?user_id=${uid}&text=🚨 Обнаружена демонстрация экрана`;
      console.log("[BACKGROUND] ALERT отправка:", url);
      fetch(url)
        .then(res => res.text())
        .then(text => console.log(`[BACKGROUND] Сервер ответил (alert ${uid}):`, text))
        .catch(err => console.error(`[BACKGROUND] Ошибка ALERT (${uid}):`, err));
    });
  }
});
