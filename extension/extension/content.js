console.log("[CONTENT] content.js загружен");

let chatIds = [];
let screenShareDetected = false;

// Загружаем chat_id и состояние
chrome.storage.local.get(["emergencyUids", "screenShareDetected"], (res) => {
  chatIds = Array.isArray(res.emergencyUids) ? res.emergencyUids : [];
  screenShareDetected = !!res.screenShareDetected;
  console.log("[CONTENT] Загружены chat_id:", chatIds, "screenShareDetected:", screenShareDetected);
});

// Функция уведомления background
const notifyBackground = () => {
  if (!screenShareDetected) {
    screenShareDetected = true;
    chrome.storage.local.set({ screenShareDetected: true });
    console.log("[CONTENT] SCREEN_SHARE_DETECTED пойман, отправляю background");
    chrome.runtime.sendMessage({ type: "SCREEN_SHARE_DETECTED" }, (res) => {
      console.log("[CONTENT] Ответ background:", res);
    });
  }
};

// Функция сброса после окончания демонстрации
const resetDetection = () => {
  if (screenShareDetected) {
    screenShareDetected = false;
    chrome.storage.local.set({ screenShareDetected: false });
    console.log("[CONTENT] SCREEN_SHARE_DETECTED сброшен");
  }
};

// Простая проверка демонстрации (вместо запроса к пользователю)
const detectScreenShare = () => {
  const isSharing = document.querySelectorAll("video").length > 0; // пример, можно заменить
  if (isSharing) notifyBackground();
  else resetDetection();
};

// Интервал детекции
setInterval(detectScreenShare, 3000);
