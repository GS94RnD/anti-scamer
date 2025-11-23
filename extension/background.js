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

  // Сохранение chat_id
  if (msg.type === "SAVE_CHAT_ID") {
    const ids = Array.isArray(msg.ids) ? msg.ids : [msg.ids];
    chrome.storage.local.set({ emergencyUids: ids }, () => {
      emergencyUids = ids;
      console.log("[BACKGROUND] chat_id сохранены в storage:", emergencyUids);
      sendResponse({ status: "ok" });
    });
    return true; // keep sendResponse async
  }

  // Тестовое сообщение
  if (msg.type === "TEST_ALERT") {
    chrome.storage.local.get(["emergencyUids"], (res) => {
      const uids = Array.isArray(res.emergencyUids) ? res.emergencyUids : [];
      if (!uids.length) {
        console.log("[BACKGROUND] chat_id отсутствует, тест не отправлен");
        sendResponse({ status: "fail" });
        return;
      }

      uids.forEach(uid => {
        const url = `${SERVER_URL_BASE}?user_id=${uid}&text=🔔 Тестовое сообщение (демонстрация НЕ обнаружена)`;
        console.log("[BACKGROUND] TEST отправка:", url);

        fetch(url)
          .then(res => res.text())
          .then(text => console.log(`[BACKGROUND] Сервер ответил (тест ${uid}):`, text))
          .catch(err => console.error(`[BACKGROUND] Ошибка TEST (${uid}):`, err));
      });

      sendResponse({ status: "ok" });
    });
    return true;
  }

  // Реальная демонстрация + звонок
  if (msg.type === "SCREEN_SHARE_DETECTED") {
    chrome.storage.local.get(["emergencyUids"], (res) => {
      const uids = Array.isArray(res.emergencyUids) ? res.emergencyUids : [];
      console.log("[BACKGROUND] Активные chat_id из storage:", uids);

      // Проверка условий: звонок и разрешённая демонстрация
      if (!uids.length || !msg.callActive || !msg.screenActive) {
        console.log("[BACKGROUND] Не выполнены условия: alert не отправлен");
        return;
      }

      uids.forEach(uid => {
        const url = `${SERVER_URL_BASE}?user_id=${uid}&text=🚨 Обнаружена демонстрация экрана во время звонка`;
        console.log("[BACKGROUND] ALERT отправка:", url);

        fetch(url)
          .then(res => res.text())
          .then(text => console.log(`[BACKGROUND] Сервер ответил (alert ${uid}):`, text))
          .catch(err => console.error(`[BACKGROUND] Ошибка ALERT (${uid}):`, err));
      });
    });

    return true; // keep sendResponse async
  }
});
