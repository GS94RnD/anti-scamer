class ScreenShareDetector {
    constructor() {
        this.isMonitoring = false;
        this.mediaStream = null;
        this.onScreenShareStart = null;
        this.onScreenShareEnd = null;
        this.checkInterval = null;
    }

    async startMonitoring() {
        try {
            console.log('AntiScamer: Requesting screen share access...');
            
            this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always',
                    displaySurface: 'window'
                },
                audio: false
            });

            console.log('AntiScamer: Screen share access granted');

            this.mediaStream.getTracks().forEach(track => {
                track.onended = () => {
                    console.log('AntiScamer: Screen share ended');
                    this.stopMonitoring();
                    if (this.onScreenShareEnd) {
                        this.onScreenShareEnd();
                    }
                };
            });

            this.isMonitoring = true;
            
            this.checkInterval = setInterval(() => {
                const hasActiveTracks = this.mediaStream.getTracks().some(track => track.readyState === 'live');
                if (!hasActiveTracks) {
                    this.stopMonitoring();
                    if (this.onScreenShareEnd) {
                        this.onScreenShareEnd();
                    }
                }
            }, 1000);

            if (this.onScreenShareStart) {
                setTimeout(() => {
                    this.onScreenShareStart();
                }, 1000);
            }

            return true;
        } catch (error) {
            console.error('AntiScamer: Error accessing screen share:', error);
            return false;
        }
    }

    stopMonitoring() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        
        this.isMonitoring = false;
        console.log('AntiScamer: Screen monitoring stopped');
    }

    isScreenShared() {
        return this.isMonitoring && this.mediaStream !== null;
    }
}