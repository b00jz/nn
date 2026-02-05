import { Router } from './router.js';
import { UIManager } from './ui.js';
import { SearchManager } from './searchManager.js';
import { PrayerManager } from './prayerManager.js';
import { QuranManager } from './QuranManager.js';
import { HadithManager } from './HadithManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const mainContent = document.getElementById('main-content');

    // Initialize Managers
    const searchManager = new SearchManager();
    const prayerManager = new PrayerManager();
    const quranManager = new QuranManager();
    const hadithManager = new HadithManager();

    // Search Logic
    const searchInput = document.getElementById('globalSearchInput');
    const searchResultsContainer = document.getElementById('searchResults');

    if (searchInput) {
        searchInput.addEventListener('input', async (e) => {
            const query = e.target.value;
            if (query.length < 3) {
                searchResultsContainer.innerHTML = '';
                return;
            }

            searchResultsContainer.innerHTML = UIManager.renderLoading('Searching...');
            const results = await searchManager.search(query);
            const categorized = searchManager.categorizeResults(results);
            searchResultsContainer.innerHTML = UIManager.renderSearchResults(categorized);
        });
    }

    // Define Routes
    const routes = {
        'home': () => {
            mainContent.innerHTML = UIManager.renderHome();
        },
        'quran': async () => {
            mainContent.innerHTML = UIManager.renderLoading('Loading Quran...');
            const surahs = await quranManager.getSurahList();
            mainContent.innerHTML = UIManager.renderQuran(surahs);
        },
        'quran-detail': async (params) => {
            const surahId = params.id;
            mainContent.innerHTML = UIManager.renderLoading(`Loading Surah...`);
            const surahData = await quranManager.getSurahDetails(surahId);
            if (surahData) {
                mainContent.innerHTML = UIManager.renderSurahDetail(surahData);
            } else {
                mainContent.innerHTML = UIManager.renderError('Failed to load Surah');
            }
        },
        'prayers': () => {
            mainContent.innerHTML = UIManager.renderPrayers(prayerManager.times);
            UIManager.setupPrayerEvents(prayerManager);
        },
        'library': async () => {
            // Default to listing books
            const books = await hadithManager.getBooks();
            mainContent.innerHTML = UIManager.renderLibrary(books);
        },
        'hadith-book': async (params) => {
            const bookId = params.id;
            mainContent.innerHTML = UIManager.renderLoading('Loading Chapters...');
            const sections = await hadithManager.getSections(bookId);
            mainContent.innerHTML = UIManager.renderHadithChapters(bookId, sections);
        },
        'hadith-section': async (params) => {
            const { bookId, sectionId } = params;
            mainContent.innerHTML = UIManager.renderLoading('Loading Hadiths...');
            const hadiths = await hadithManager.getHadiths(bookId, sectionId);
            mainContent.innerHTML = UIManager.renderHadithList(hadiths);
        },
        'qibla': async () => {
            // Check if we have location in prayerManager
            if (prayerManager.lat && prayerManager.lng) {
                const angle = prayerManager.getQiblaDirection(prayerManager.lat, prayerManager.lng);
                mainContent.innerHTML = UIManager.renderQibla(angle, false);
            } else {
                mainContent.innerHTML = UIManager.renderQibla(0, true);
                // Bind button
                setTimeout(() => {
                    const btn = document.getElementById('enableQiblaBtn');
                    if (btn) {
                        btn.onclick = async () => {
                            try {
                                btn.textContent = "Locating...";
                                await prayerManager.requestLocation();
                                const angle = prayerManager.getQiblaDirection(prayerManager.lat, prayerManager.lng);
                                mainContent.innerHTML = UIManager.renderQibla(angle, false);
                            } catch (e) {
                                alert("Could not get location.");
                            }
                        };
                    }
                }, 0);
            }
        },
        '404': () => {
            mainContent.innerHTML = UIManager.render404();
        }
    };

    // Initialize Router
    window.appRouter = new Router(routes);

    // Dark Mode Toggle
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle';
    themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    themeBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: var(--accent); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2); font-size: 1.2rem; z-index: 1000;';
    document.body.appendChild(themeBtn);

    // Check LocalStorage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    // Audio Player Toggle (Visual Test) logic preserved
    setupGlobalListeners();
});

function setupGlobalListeners() {
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            // Fixed logic to ensure audio plays
            const icon = playBtn.querySelector('i');
            const audio = document.getElementById('globalAudio');

            // Check if src is set (if not, might be empty)
            if (!audio.src) return;

            if (audio.paused) {
                audio.play();
                icon.classList.replace('fa-play', 'fa-pause');
            } else {
                audio.pause();
                icon.classList.replace('fa-pause', 'fa-play');
            }
        });
    }

    // Search listener currently stubs
    const searchTrigger = document.getElementById('searchTrigger');
    if (searchTrigger) {
        const searchOverlay = document.getElementById('searchOverlay');
        const closeSearch = document.getElementById('closeSearch');
        searchTrigger.addEventListener('click', () => searchOverlay.classList.remove('hidden'));
        closeSearch.addEventListener('click', () => searchOverlay.classList.add('hidden'));
    }
}
