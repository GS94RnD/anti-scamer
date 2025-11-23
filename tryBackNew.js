console.log("[CONTENT] content.js загружен");

let chatIds = [];
let screenShareDetected = false;
let callActive = false;
let prevCallState = false; // новое: фиксируем прошлое состояние звонка

// Загружаем chat_id и состояние
chrome.storage.local.get(["emergencyUids", "screenShareDetected"], (res) => {
  chatIds = Array.isArray(res.emergencyUids) ? res.emergencyUids : [];
  screenShareDetected = !!res.screenShareDetected;
  console.log("[CONTENT] Загружены chat_id:", chatIds, "screenShareDetected:", screenShareDetected);
});

// Уведомление background
const notifyBackground = () => {
  if (!screenShareDetected && callActive) { 
    screenShareDetected = true;
    chrome.storage.local.set({ screenShareDetected: true });
    console.log("[CONTENT] SCREEN_SHARE_DETECTED пойман, отправляю background");

    chrome.runtime.sendMessage({ 
      type: "SCREEN_SHARE_DETECTED", 
      callActive, 
      screenActive: true 
    }, (res) => {
      console.log("[CONTENT] Ответ background:", res);
    });
  }
};

// Новый сброс в начале нового звонка
const resetBeforeNewCall = () => {
  if (callActive && !prevCallState) {
    console.log("[CONTENT] Новый звонок — сбрасываю прошлые флаги");
    screenShareDetected = false;
    chrome.storage.local.set({ screenShareDetected: false });
  }
};

// Сброс состояния после окончания демонстрации
const resetDetection = () => {
  if (!callActive && screenShareDetected) {
    console.log("[CONTENT] Звонок завершён — сбрасываю screenShareDetected");
    screenShareDetected = false;
    chrome.storage.local.set({ screenShareDetected: false });
  }
};

// Улучшенная проверка звонка — смотрим активные tracks
const detectCall = () => {
  const videos = document.querySelectorAll("video");
  let activeCall = false;

  videos.forEach(video => {
    if (!video.srcObject) return;
    const hasLiveTracks = video.srcObject.getTracks().some(t => t.readyState === "live");
    if (hasLiveTracks) activeCall = true;
  });

  callActive = activeCall;
};

// Отслеживание потоков экрана
const monitorScreenShare = () => {
  const videos = document.querySelectorAll("video");
  let foundScreen = false;

  videos.forEach(video => {
    if (video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => {
        if (track.kind === "video" && track.label.toLowerCase().includes("screen")) {
          foundScreen = true;
        }
      });
    }
  });

  if (foundScreen && callActive) notifyBackground();
  else if (!foundScreen) resetDetection();
};

// Интервал проверки
setInterval(() => {
  detectCall();

  // новый звонок — сброс флагов
  resetBeforeNewCall();

  monitorScreenShare();

  prevCallState = callActive;
}, 2500);

console.log("[CONTENT] Ловушка демонстрации экрана активна. Повторные звонки теперь поддерживаются.");
