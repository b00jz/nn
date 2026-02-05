export class QuranManager {
    constructor() {
        this.baseUrl = 'https://api.alquran.cloud/v1';
        this.audioBaseUrl = 'https://server11.mp3quran.net/yasser'; // Yasser Al-Dosari
    }

    /**
     * Fetch list of all Surahs
     */
    async getSurahList() {
        try {
            const response = await fetch(`${this.baseUrl}/surah`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Failed to fetch Surah list:', error);
            return [];
        }
    }

    /**
     * Fetch full text for a specific Surah (Arabic & English)
     * @param {number} surahNumber 
     */
    async getSurahDetails(surahNumber) {
        try {
            // Fetch Arabic (Original) and English (Sahih International)
            const response = await fetch(`${this.baseUrl}/surah/${surahNumber}/editions/quran-uthmani,en.sahih`);
            const data = await response.json();

            // Merge the two editions
            const arabic = data.data[0];
            const english = data.data[1];

            const verses = arabic.ayahs.map((ayah, index) => ({
                number: ayah.numberInSurah,
                text_ar: ayah.text,
                text_en: english.ayahs[index].text,
                audio: this.getAudioUrl(surahNumber) // We use full surah audio for now
            }));

            return {
                info: {
                    number: arabic.number,
                    name: arabic.name,
                    englishName: arabic.englishName,
                    englishNameTranslation: arabic.englishNameTranslation,
                    numberOfAyahs: arabic.numberOfAyahs,
                    revelationType: arabic.revelationType
                },
                verses: verses
            };
        } catch (error) {
            console.error(`Failed to fetch Surah ${surahNumber}:`, error);
            return null;
        }
    }

    /**
     * Get Audio URL for the full Surah
     * Format: 001.mp3, 012.mp3, 114.mp3
     */
    getAudioUrl(surahNumber) {
        const paddedNumber = String(surahNumber).padStart(3, '0');
        return `${this.audioBaseUrl}/${paddedNumber}.mp3`;
    }
}
