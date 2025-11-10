const tg = window.Telegram.WebApp;
const mobileDetector = new MobileScreenDetector();
const screenDetector = new ScreenShareDetector();
let countdownTimer = null;
let currentCountdown = 60;
const API_BASE = 'https://your-domain.com/api';

class AntiScamerApp {
    constructor() {
        this.userId = tg.initDataUnsafe?.user?.id;
        this.isProtectionActive = false;
        this.userSettings = null;
        this.detector = mobileDetector;
    }

    async init() {
        try {
            tg.expand();
            tg.enableClosingConfirmation();
            tg.BackButton.show();
            
            tg.BackButton.onClick(() => {
                this.closeApp();
            });

            await this.loadUserSettings();
            
            this.detector.onScreenShareStart = this.handleScreenShareStarted.bind(this);
            this.detector.onScreenShareEnd = this.handleScreenShareEnded.bind(this);
            
            await this.checkProtectionStatus();
            this.updateUI();
            
        } catch (error) {
            console.error('AntiScamer: App initialization error:', error);
            this.showError('Ошибка инициализации приложения');
        }
    }

    async loadUserSettings() {
        if (!this.userId) {
            this.showError('User ID not found');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/user/${this.userId}/settings`);
            if (response.ok) {
                this.userSettings = await response.json();
                this.populateSettingsForm();
            } else {
                this.userSettings = {
                    trusted_contacts: [],
                    emergency_message: '🚨 ВНИМАНИЕ! Меня принуждают демонстрировать экран в Telegram. Требуется помощь!',
                    cancel_password: '123456'
                };
            }
        } catch (error) {
            console.error('AntiScamer: Error loading settings:', error);
        }
    }

    populateSettingsForm() {
        if (this.userSettings) {
            document.getElementById('trustedContacts').value = 
                this.userSettings.trusted_contacts?.join(', ') || '';
            document.getElementById('cancelPassword').value = 
                this.userSettings.cancel_password || '123456';
            document.getElementById('emergencyMessage').value = 
                this.userSettings.emergency_message || '🚨 ВНИМАНИЕ! Меня принуждают демонстрировать экран в Telegram. Требуется помощь!';
        }
    }

    async startProtection() {
        if (!this.userId) {
            this.showError('User ID not found');
            return;
        }

        try {
            const started = await this.detector.startMonitoring();
            if (started) {
                await fetch(`${API_BASE}/user/${this.userId}/protection/start`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                this.isProtectionActive = true;
                this.updateUI();
                this.showNotification('🛡️ AntiScamer активирован! Мониторинг экрана запущен.');
            } else {
                this.showError('Не удалось получить доступ к экрану. Проверьте разрешения.');
            }
        } catch (error) {
            console.error('AntiScamer: Error starting protection:', error);
            this.showError('Ошибка при запуске защиты');
        }
    }

    async stopProtection() {
        this.detector.stopMonitoring();
        
        if (this.userId) {
            await fetch(`${API_BASE}/user/${this.userId}/protection/stop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
        this.isProtectionActive = false;
        this.updateUI();
        this.showNotification('🛡️ Защита AntiScamer остановлена');
        
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
            this.hideCountdownModal();
        }
    }

    handleScreenShareStarted() {
        console.log('AntiScamer: Screen share started - showing countdown');
        this.showCountdownModal();
        
        currentCountdown = 60;
        this.updateCountdownDisplay();
        
        countdownTimer = setInterval(() => {
            currentCountdown--;
            this.updateCountdownDisplay();
            
            if (currentCountdown <= 0) {
                this.sendEmergencyNotifications();
                clearInterval(countdownTimer);
                countdownTimer = null;
                this.hideCountdownModal();
            }
        }, 1000);
    }

    handleScreenShareEnded() {
        console.log('AntiScamer: Screen share ended');
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
        this.hideCountdownModal();
    }

    updateCountdownDisplay() {
        const countdownElement = document.getElementById('countdownNumber');
        if (countdownElement) {
            countdownElement.textContent = currentCountdown;
        }
    }

    showCountdownModal() {
        const modal = document.getElementById('countdownModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideCountdownModal() {
        const modal = document.getElementById('countdownModal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.getElementById('cancelPasswordInput').value = '';
    }

    cancelAlert() {
        const passwordInput = document.getElementById('cancelPasswordInput').value;
        const correctPassword = this.userSettings?.cancel_password || '123456';
        
        if (passwordInput === correctPassword) {
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
            this.hideCountdownModal();
            this.showNotification('✅ Уведомления отменены');
        } else {
            this.showError('❌ Неверный пароль');
        }
    }

    async sendEmergencyNotifications() {
        if (!this.userId || !this.userSettings) return;

        try {
            const response = await fetch(`${API_BASE}/user/${this.userId}/emergency`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.showNotification('🚨 Уведомления отправлены доверенным контактам!');
            } else {
                this.showError('Ошибка при отправке уведомлений');
            }
        } catch (error) {
            console.error('AntiScamer: Error sending notifications:', error);
            this.showError('Ошибка при отправке уведомлений');
        }
    }

    async saveSettings() {
        if (!this.userId) {
            this.showError('User ID not found');
            return;
        }

        try {
            const trustedContacts = document.getElementById('trustedContacts').value
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0);
            
            const cancelPassword = document.getElementById('cancelPassword').value;
            const emergencyMessage = document.getElementById('emergencyMessage').value;

            const response = await fetch(`${API_BASE}/user/${this.userId}/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trusted_contacts: trustedContacts,
                    cancel_password: cancelPassword,
                    emergency_message: emergencyMessage
                })
            });

            if (response.ok) {
                this.showNotification('✅ Настройки AntiScamer сохранены');
                await this.loadUserSettings();
            } else {
                this.showError('Ошибка при сохранении настроек');
            }
        } catch (error) {
            console.error('AntiScamer: Error saving settings:', error);
            this.showError('Ошибка при сохранении настроек');
        }
    }

    updateUI() {
        const statusCard = document.getElementById('statusCard');
        const statusText = document.getElementById('statusText');
        const statusDescription = document.getElementById('statusDescription');
        const statusIcon = document.getElementById('statusIcon');
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');

        if (this.isProtectionActive) {
            statusCard.className = 'status-card status-active';
            statusText.textContent = 'Защита активна';
            statusDescription.textContent = 'AntiScamer мониторит ваш экран';
            statusIcon.textContent = '🛡️';
            startBtn.style.display = 'none';
            stopBtn.style.display = 'block';
        } else {
            statusCard.className = 'status-card status-inactive';
            statusText.textContent = 'Защита отключена';
            statusDescription.textContent = 'Мониторинг экрана не активен';
            statusIcon.textContent = '🔒';
            startBtn.style.display = 'block';
            stopBtn.style.display = 'none';
        }
    }

    toggleSettings() {
        const settingsPanel = document.getElementById('settingsPanel');
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    }

    closeApp() {
        this.stopProtection();
        tg.close();
    }

    showNotification(message) {
        if (tg.showPopup) {
            tg.showPopup({
                title: 'AntiScamer',
                message: message,
                buttons: [{ type: 'ok' }]
            });
        } else {
            alert(message);
        }
    }

    showError(message) {
        this.showNotification(`❌ ${message}`);
    }
}

const antiScamerApp = new AntiScamerApp();

function startProtection() {
    antiScamerApp.startProtection();
}

function stopProtection() {
    antiScamerApp.stopProtection();
}

function toggleSettings() {
    antiScamerApp.toggleSettings();
}

function saveSettings() {
    antiScamerApp.saveSettings();
}

function cancelAlert() {
    antiScamerApp.cancelAlert();
}

function showPlatformWarning(platform) {
    const warnings = {
        'ios': 'На iOS обнаружение демонстрации экрана работает ограниченно. Рекомендуем использовать веб-версию Telegram в браузере Safari.',
        'android': 'На Android для полной работы требуется веб-версия Telegram и разрешение на запись экрана.',
        'web': 'Для работы AntiScamer используйте последнюю версию браузера с поддержкой WebRTC.'
    };
    
    document.getElementById('warningText').textContent = warnings[platform] || warnings.web;
    document.getElementById('platformWarning').style.display = 'block';
}

function hidePlatformWarning() {
    document.getElementById('platformWarning').style.display = 'none';
}

function copyBotLink() {
    const botUsername = tg.initDataUnsafe?.bot?.username || 'your_antiscamer_bot';
    const botLink = `https://t.me/${botUsername}?start=find_id`;
    
    navigator.clipboard.writeText(botLink).then(() => {
        antiScamerApp.showNotification('✅ Ссылка скопирована! Отправьте другу для нахождения ID.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    antiScamerApp.init();
});

window.addEventListener('beforeunload', () => {
    antiScamerApp.stopProtection();
});