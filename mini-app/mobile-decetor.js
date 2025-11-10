class MobileScreenDetector {
    constructor() {
        this.isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        this.platform = this.detectPlatform();
    }
    
    detectPlatform() {
        const ua = navigator.userAgent;
        if (/Android/i.test(ua)) return 'android';
        if (/iPhone|iPad/i.test(ua)) return 'ios';
        if (/Windows/i.test(ua)) return 'windows';
        if (/Macintosh/i.test(ua)) return 'macos';
        return 'web';
    }
    
    async startMonitoring() {
        if (this.isMobile) {
            return await this.startMobileMonitoring();
        }
        return await this.startDesktopMonitoring();
    }
    
    async startMobileMonitoring() {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false
                });
                
                stream.getTracks().forEach(track => {
                    track.onended = () => {
                        this.onScreenShareEnd?.();
                    };
                });
                
                return true;
            } else {
                this.showMobileLimitations();
                return false;
            }
        } catch (error) {
            console.error('Mobile monitoring failed:', error);
            this.showMobileLimitations();
            return false;
        }
    }
    
    async startDesktopMonitoring() {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        cursor: 'always',
                        displaySurface: 'window'
                    },
                    audio: false
                });
                
                stream.getTracks().forEach(track => {
                    track.onended = () => {
                        this.onScreenShareEnd?.();
                    };
                });
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Desktop monitoring failed:', error);
            return false;
        }
    }
    
    showMobileLimitations() {
        const message = this.platform === 'ios' 
            ? 'На iOS обнаружение демонстрации экрана работает ограниченно. Рекомендуем использовать веб-версию Telegram в браузере Safari.'
            : 'На Android для полной работы требуется веб-версия Telegram и разрешение на запись экрана.';
        
        if (typeof showPlatformWarning === 'function') {
            showPlatformWarning(this.platform);
        }
    }
    
    stopMonitoring() {
        // Останавливаем все медиа-потоки
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
    }
}