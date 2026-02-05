import { PrayTimes } from './adhan.js';

export class PrayerManager {
    constructor() {
        this.coords = null;
        this.times = null;
    }

    /**
     * Request Geolocation Access
     */
    async requestLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation not supported");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.coords = [position.coords.latitude, position.coords.longitude];
                    resolve(this.coords);
                },
                (error) => {
                    reject("Location permission denied or unavailable.");
                }
            );
        });
    }

    /**
     * Request Notification Permission
     */
    async requestNotifications() {
        if (!("Notification" in window)) return false;

        if (Notification.permission === "granted") return true;

        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    /**
     * Calculate times for today
     */
    getTodayTimes() {
        if (!this.coords) return null;

        const date = new Date();
        const timezone = date.getTimezoneOffset() / -60;

        // Use our utility to calculate
        this.times = PrayTimes.getTimes(date, this.coords, timezone);
        return this.times;
    }

    /**
     * Check if it's prayer time (called every minute)
     */
    checkTime() {
        if (!this.times) return; // Keep the guard clause

        const now = new Date();
        const currentStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        // Simple exact match check (production would check within a minute window)
        for (const [prayer, time] of Object.entries(this.times)) {
            // Convert time 14:30 to comparison if needed. 
            // My simplified times are in 24h format.
            if (time === currentStr) {
                this.triggerAdhan(prayer);
            }
        }
    }

    /**
     * Calculate Qibla direction from True North
     * Mecca coordinates: 21.4225° N, 39.8262° E
     */
    getQiblaDirection(lat, lng) {
        const meccaLat = 21.4225;
        const meccaLng = 39.8262;

        const toRad = deg => deg * Math.PI / 180;
        const toDeg = rad => rad * 180 / Math.PI;

        const phiK = toRad(meccaLat);
        const lambdaK = toRad(meccaLng);
        const phi = toRad(lat);
        const lambda = toRad(lng);

        const y = Math.sin(lambdaK - lambda);
        const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

        let angle = toDeg(Math.atan2(y, x));

        // Normalize to 0-360
        if (angle < 0) angle += 360;

        return Math.round(angle);
    }

    triggerAdhan(prayerName) {
        // 1. Play Audio
        if (!this.audio) {
            // Using a reliable online Adhan source
            this.audio = new Audio('https://media.blubrry.com/muslim_central_quran/podcasts.qurancentral.com/adhan/adhan-makkah-2.mp3');
        }
        this.audio.play().catch(e => console.log("Audio play failed (interaction needed)", e));

        // 2. Send Notification
        if (Notification.permission === "granted") {
            new Notification("Prayer Time", {
                body: `It is time for ${prayerName}`,
                icon: 'assets/icon.png'
            });
        }

        alert(`Time for ${prayerName} Prayer`);
    }
}
