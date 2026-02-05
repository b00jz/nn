export class SearchManager {
    constructor() {
        this.baseUrl = 'http://api.alquran.cloud/v1/search';
    }

    /**
     * Search the Quran via API
     * @param {string} query 
     * @returns {Promise<Array>} Sorted results
     */
    async search(query) {
        if (!query || query.length < 3) return [];

        try {
            // Search in English (Sahih International) logic
            // Endpoint: /search/{keyword}/all/en.sahih
            const response = await fetch(`${this.baseUrl}/${encodeURIComponent(query)}/all/en.sahih`);
            const data = await response.json();

            if (data.code === 200 && data.data) {
                // Map API results to our app structure
                return data.data.matches.map(match => ({
                    type: 'quran',
                    title: `Surah ${match.surah.englishName} (${match.surah.number}:${match.numberInSurah})`,
                    content_en: match.text,
                    content_ar: '', // API search usually returns one edition. We could fetch Arabic text if needed but let's keep it simple.
                    id: match.surah.number, // Link to Surah
                    matchType: 'verse'
                }));
            }
            return [];
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    }

    categorizeResults(results) {
        return {
            quran: results,
            library: [] // Hadith search API not easily available in this straightforward way without massive index.
        };
    }
}
