export class HadithManager {
    constructor() {
        // Using fawazahmed0/hadith-api (CDN)
        this.baseUrl = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
    }

    /**
     * Get Info (Books list)
     * Note: We mostly care about Bukhari and Muslim
     */
    async getBooks() {
        return [
            { id: 'bukhari', name: 'Sahih Al-Bukhari', author: 'Imam Bukhari' },
            { id: 'muslim', name: 'Sahih Muslim', author: 'Imam Muslim' }
        ];
    }

    /**
     * Get Sections (Chapters) for a specific book
     * @param {string} bookId 'bukhari' or 'muslim'
     */
    async getSections(bookId) {
        // For this API, we need to know the mapping or fetch the info file.
        // We'll use the english edition to get section names.
        try {
            const endpoint = `${this.baseUrl}/editions/eng-${bookId}/sections.json`;
            const response = await fetch(endpoint);
            const data = await response.json();

            // Convert object to array
            return Object.entries(data).map(([id, name]) => ({
                id: id,
                title: name
            }));
        } catch (error) {
            console.error(`Failed to fetch sections for ${bookId}:`, error);
            return [];
        }
    }

    /**
     * Get Hadiths for a specific section
     * @param {string} bookId 
     * @param {string} sectionId 
     */
    async getHadiths(bookId, sectionId) {
        try {
            // We need to fetch both languages to merge them.
            // This API separates languages by "edition".

            // 1. Fetch English
            const enRes = await fetch(`${this.baseUrl}/editions/eng-${bookId}/sections/${sectionId}.json`);
            const enData = await enRes.json();

            // 2. Fetch Arabic
            const arRes = await fetch(`${this.baseUrl}/editions/ara-${bookId}/sections/${sectionId}.json`);
            const arData = await arRes.json();

            // Merge
            const hadiths = enData.hadiths.map((h, i) => {
                const arabicHadith = arData.hadiths.find(ah => ah.hadithnumber === h.hadithnumber);
                return {
                    id: h.hadithnumber,
                    text_en: h.text,
                    text_ar: arabicHadith ? arabicHadith.text : 'Arabic text unavailable',
                    grades: h.grades
                };
            });

            return hadiths;

        } catch (error) {
            console.error(`Failed to fetch hadiths for ${bookId}/${sectionId}:`, error);
            return [];
        }
    }
}
