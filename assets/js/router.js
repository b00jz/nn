/**
 * Enhanced Hash-based Router with Parameter Support
 */
export class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;

        // Bind navigation events
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';

        // Simple Route Matching
        if (this.routes[hash]) {
            this.executeRoute(hash, this.routes[hash]);
            return;
        }

        // Dynamic Matching (e.g., quran/1)
        // We split by '/' and check if the base route exists
        // Convention: 'quran-detail' handled by 'quran' + param check? 
        // Or explicit 'quran-detail' route in router definition triggered by custom parsing?

        // Strategy: Look for specific patterns.
        // If hash starts with 'quran/' -> 'quran-detail'
        if (hash.startsWith('quran/')) {
            const id = hash.split('/')[1];
            if (this.routes['quran-detail']) {
                this.executeRoute('quran', this.routes['quran-detail'], { id });
                return;
            }
        }

        // If hash starts with 'hadith-book/'
        if (hash.startsWith('hadith-book/')) {
            const id = hash.split('/')[1];
            if (this.routes['hadith-book']) {
                this.executeRoute('library', this.routes['hadith-book'], { id }); // Highlight library tab
                return;
            }
        }

        // If hash starts with 'hadith-section/' -> hadith-section/bukhari/1
        if (hash.startsWith('hadith-section/')) {
            const parts = hash.split('/');
            const bookId = parts[1];
            const sectionId = parts[2];
            if (this.routes['hadith-section']) {
                this.executeRoute('library', this.routes['hadith-section'], { bookId, sectionId });
                return;
            }
        }

        // 404
        this.executeRoute('404', this.routes['404']);
    }

    executeRoute(navKey, handler, params = null) {
        this.currentRoute = navKey;
        this.updateActiveLink(navKey);
        handler(params);
        // Scroll to top
        window.scrollTo(0, 0);
    }

    updateActiveLink(key) {
        // key might be 'quran' even if we are deep in 'quran-detail'
        // This keeps the navbar highlighted correctly
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href').slice(1);
            if (href === key) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    navigate(path) {
        window.location.hash = path;
    }
}
