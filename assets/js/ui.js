export const UIManager = {
    renderHome: () => {
        return `
            <div class="container text-center">
                <section class="hero" style="padding: 60px 0;">
                    <h1 style="font-size: 3rem; color: var(--accent);">Al Zahraa</h1>
                    <p style="font-size: 1.2rem; color: var(--text-light); margin-bottom: 30px;">
                        The Holy Quran, Authentic Ahadith, and Islamic Resources
                    </p>
                    <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                        <a href="#quran" class="cta-button" 
                           style="background: var(--accent); color: white; padding: 15px 30px; border-radius: 30px; font-weight: 600;">
                           Read Quran
                        </a>
                        <a href="#prayers" class="cta-button" 
                           style="border: 2px solid var(--accent); color: var(--accent); padding: 15px 30px; border-radius: 30px; font-weight: 600;">
                           Prayer Times
                        </a>
                         <a href="#qibla" class="cta-button" 
                           style="background: var(--primary); color: white; padding: 15px 30px; border-radius: 30px; font-weight: 600;">
                           Qibla
                        </a>
                    </div>
                </section>
                
                <section class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-top: 50px;">
                    <div class="card">
                        <i class="fa-solid fa-book-quran" style="font-size: 2rem; color: var(--accent); margin-bottom: 15px;"></i>
                        <h3>The Holy Quran</h3>
                        <p>Complete text with Yasser Al-Dosari recitation.</p>
                    </div>
                    <div class="card">
                        <i class="fa-solid fa-clock" style="font-size: 2rem; color: var(--accent); margin-bottom: 15px;"></i>
                        <h3>Prayer Times</h3>
                        <p>Accurate times based on your location.</p>
                    </div>
                    <div class="card">
                        <i class="fa-solid fa-compass" style="font-size: 2rem; color: var(--accent); margin-bottom: 15px;"></i>
                        <h3>Qibla Compass</h3>
                        <p>Find the Kaaba direction.</p>
                    </div>
                </section>
            </div>
            ${UIManager.renderFooter()}
        `;
    },

    /**
     * Render Qibla Compass
     */
    renderQibla: (angle = 0, isDefault = true) => {
        // If isDefault is true, it means we haven't calculated real angle yet (user location missing).
        // UI should prompt for location if angle is 0/null.

        const content = isDefault
            ? `<div style="padding: 20px;"><button id="enableQiblaBtn" class="cta-button" style="background: var(--accent); color: white; padding: 10px 20px; border-radius: 20px;">Enable Location for Qibla</button></div>`
            : `<div style="margin-top: 20px; font-size: 1.2rem;">Qibla is <strong>${angle}°</strong> from North</div>`;

        return `
            <div class="container text-center">
                <h2>Qibla Compass</h2>
                <div class="compass-container">
                    <div class="compass-arrow" style="transform: translate(-50%, -100%) rotate(${angle}deg);"></div>
                    <div class="compass-degree">${angle}°</div>
                </div>
                ${content}
                <p style="color: var(--text-light); max-width: 400px; margin: 20px auto;">
                    Note: On desktop, this shows the static direction from your city to Makkah. On mobile, rotate your phone to align.
                </p>
                <div style="margin-top: 40px;">
                    <button onclick="window.history.back()" style="color: var(--accent);">Go Back</button>
                </div>
            </div>
             ${UIManager.renderFooter()}
        `;
    },

    renderFooter: () => {
        return `
            <footer style="margin-top: 80px; padding: 40px 20px; background: var(--primary); color: white; text-align: center; border-top: 5px solid var(--accent);">
                <div style="max-width: 800px; margin: 0 auto;">
                    <p style="font-family: var(--font-ar); font-size: 1.1rem; line-height: 1.8; margin-bottom: 15px;">
                        تم والحمدلله هذا عمل بسيط صدقة جارية بأذن الله عني و زهراء و عن والدينا و عن المسلمين كافة يارب ان يتقبل منا و يكتب لنا فيه حسنة و اجر من عنده و هو الرحيم الكريم
                    </p>
                    <p style="font-size: 0.9rem; color: #ddd;">
                        Praise be to Allah. This humble effort is intended as a Sadaqah Jariyah (ongoing charity) on behalf of myself, Zahraa, our parents, and all Muslims. May Allah accept it from us and grant us reward for it. He is the Most Merciful, the Most Generous.
                    </p>
                </div>
            </footer>
        `;
    },


    renderLoading: (msg = 'Loading...') => {
        return `<div class="container text-center fade-in" style="padding: 50px;"><i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--accent);"></i><p style="margin-top: 15px;">${msg}</p></div>`;
    },

    renderError: (msg) => {
        return `<div class="container text-center fade-in" style="padding: 50px; color: red;"><i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem;"></i><p style="margin-top: 15px;">${msg}</p><button class="cta-button cta-secondary" onclick="window.history.back()">Go Back</button></div>`;
    },

    renderQuran: (surahs) => {
        if (!surahs || surahs.length === 0) return UIManager.renderError("Unable to fetch Quran data. Please check connection.");

        return `
            <div class="container fade-in">
                <header class="surah-header">
                   <h2>The Holy Quran</h2>
                    <input type="text" id="surahSearch" class="search-input" placeholder="Search Surah..." 
                           oninput="document.querySelectorAll('.surah-card').forEach(el => {
                               const term = this.value.toLowerCase();
                               if(el.dataset.name.toLowerCase().includes(term)) el.style.display = 'block';
                               else el.style.display = 'none';
                           })"
                    >
                </header>
                <div class="surah-grid">
                    ${surahs.map(surah => `
                        <div class="card surah-card" 
                             onclick="window.location.hash='quran/${surah.number}'"
                             data-name="${surah.englishName} ${surah.name}"
                        >
                            <div class="surah-card-header">
                                <span class="surah-number">${surah.number}</span>
                                <span class="surah-name-ar">${surah.name}</span>
                            </div>
                            <h4 class="surah-name-en">${surah.englishName}</h4>
                            <p class="surah-meta">${surah.englishNameTranslation} • ${surah.numberOfAyahs} Ayahs</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderSurahDetail: (surahData) => {
        const { info, verses } = surahData;
        const audioUrl = verses[0].audio;

        return `
            <div class="container fade-in">
                <div style="margin-bottom: 20px;">
                    <button onclick="window.history.back()" style="color: var(--accent);"><i class="fa-solid fa-arrow-left"></i> Back to List</button>
                </div>
                
                <div class="surah-detail-header">
                    <h1>${info.name}</h1>
                    <h3>${info.englishName}</h3>
                    <p>${info.revelationType} • ${info.numberOfAyahs} Verses</p>
                    
                    <div style="margin-top: 20px;">
                        <button id="playSurahBtn" class="cta-button cta-primary"
                                onclick="
                                    const audio = document.getElementById('globalAudio');
                                    audio.src = '${audioUrl}';
                                    audio.play();
                                    document.getElementById('track-title').textContent = '${info.englishName}';
                                    document.getElementById('playBtn').querySelector('i').classList.replace('fa-play', 'fa-pause');
                                    document.getElementById('audioDock').classList.remove('hidden');
                                "
                        >
                            <i class="fa-solid fa-play"></i> Play Recitation
                        </button>
                    </div>
                </div>

                <div class="verse-container">
                    ${verses.map(ayah => `
                        <div class="ayah-block">
                            <div class="ayah-meta">
                                <span>${info.number}:${ayah.number}</span>
                            </div>
                            <p class="ayah-ar">
                                ${ayah.text_ar} <span class="ayah-number-symbol">${ayah.number}</span>
                            </p>
                            <p class="ayah-en">
                                ${ayah.text_en}
                            </p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderPrayers: (prayerData = null) => {
        if (!prayerData) {
            return `
                <div class="container text-center fade-in" style="padding: 50px 0;">
                    <i class="fa-solid fa-location-dot" style="font-size: 3rem; color: var(--accent); margin-bottom: 20px;"></i>
                    <h2>Enable Location</h2>
                    <p style="color: var(--text-light); margin-bottom: 30px;">
                        To get accurate prayer times for your city, please allow location access.
                    </p>
                    <button id="enableLocationBtn" class="cta-button cta-primary">
                        Enable Location & Get Times
                    </button>
                    <p id="locationError" style="color: red; margin-top: 15px; display: none;"></p>
                </div>
            `;
        }

        return `
            <div class="container text-center fade-in">
                <h2>Prayer Times</h2>
                <div class="card prayer-display-card">
                    <div class="prayer-header">
                        <i class="fa-solid fa-kaaba" style="font-size: 3rem; color: var(--accent);"></i>
                        <h1 class="current-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>
                        <p style="color: var(--text-light);">Your Local Time</p>
                    </div>
                    <div class="prayer-list">
                        ${Object.entries(prayerData).map(([name, time]) => `
                            <div class="prayer-list-item">
                                <span style="font-weight: 600;">${name}</span> 
                                <span style="font-family: monospace; font-size: 1.1rem;">${time}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button onclick="window.location.reload()" style="background: transparent; color: var(--text-light); border: 1px solid #ddd; padding: 8px 15px; border-radius: 5px; margin-top: 10px;">
                    <i class="fa-solid fa-rotate-right"></i> Refresh
                </button>
            </div>
        `;
    },

    setupPrayerEvents: (prayerManager) => {
        const enableBtn = document.getElementById('enableLocationBtn');
        if (enableBtn) {
            enableBtn.onclick = async () => {
                try {
                    enableBtn.textContent = "Locating...";
                    await prayerManager.requestNotifications();
                    await prayerManager.requestLocation();
                    const times = prayerManager.getTodayTimes();
                    document.getElementById('main-content').innerHTML = UIManager.renderPrayers(times);
                    setInterval(() => prayerManager.checkTime(), 60000);
                } catch (err) {
                    const errEl = document.getElementById('locationError');
                    if (errEl) {
                        errEl.style.display = 'block';
                        errEl.textContent = String(err);
                    }
                    enableBtn.textContent = "Retry";
                }
            };
        }
    },

    renderLibrary: (books) => {
        return `
            <div class="container fade-in">
                <h2>Hadith Library</h2>
                <p>Authentic Collections</p>
                <div class="content-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
                    ${books.map(book => `
                        <div class="card feature-card" style="cursor: pointer;" onclick="window.location.hash='hadith-book/${book.id}'">
                             <h3>${book.name}</h3>
                             <p style="color: var(--text-light);">${book.author}</p>
                             <div style="margin-top: 15px; text-align: right; color: var(--accent);">Browse <i class="fa-solid fa-arrow-right"></i></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderHadithChapters: (bookId, sections) => {
        return `
            <div class="container fade-in">
                <button onclick="window.location.hash='library'" style="margin-bottom: 20px; color: var(--accent);"><i class="fa-solid fa-arrow-left"></i> Back to Books</button>
                <h2>Chapters (${bookId})</h2>
                <div class="list-group">
                    ${sections.map(sec => `
                        <div class="card" style="margin-bottom: 10px; cursor: pointer; padding: 15px;" 
                             onclick="window.location.hash='hadith-section/${bookId}/${sec.id}'">
                            <strong>${sec.id}. ${sec.title || 'Chapter ' + sec.id}</strong>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderHadithList: (hadiths) => {
        return `
             <div class="container fade-in">
                <button onclick="window.history.back()" style="margin-bottom: 20px; color: var(--accent);"><i class="fa-solid fa-arrow-left"></i> Back to Chapters</button>
                <h2>Hadiths</h2>
                <div>
                    ${hadiths.map(h => `
                        <div class="card" style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span class="badge" style="background: #eee; padding: 2px 8px; border-radius: 4px;">#${h.id}</span>
                            </div>
                            <p class="text-right" style="font-family: var(--font-ar); font-size: 1.4rem; line-height: 1.8; margin-bottom: 15px;">${h.text_ar}</p>
                            <hr style="border: 0; border-top: 1px solid #f0f0f0;">
                            <p style="font-size: 1rem; color: var(--text-main); line-height: 1.6;">${h.text_en}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderSearchResults: (categorizedResults) => {
        const { quran, library } = categorizedResults;
        const total = quran.length + library.length;
        if (total === 0) return `<div class="text-center" style="padding: 40px; color: var(--text-light);">No results found.</div>`;

        return `<div class="results-container fade-in"><h3>Results</h3><p>Detailed Search coming soon for dynamic content.</p></div>`;
    },

    render404: () => `<div class="container text-center fade-in"><h1>404</h1><p>Page not found</p></div>`
};
