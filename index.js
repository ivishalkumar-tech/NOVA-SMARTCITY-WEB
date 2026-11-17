/* ==========================================
   NOVA - Home Page Search, Loader & Scroll Reveal Script
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Dynamic Cyber Loader & Scroll Reveal Setup
    // ==========================================
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <div class="loader-text">INITIALIZING NOVA CORE...</div>
        </div>
    `;

    const animStyles = document.createElement('style');
    animStyles.innerHTML = `
        #pageLoader {
            position: fixed;
            inset: 0;
            background: #040711;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        #pageLoader.fade-out {
            opacity: 0;
            visibility: hidden;
        }
        .loader-content {
            text-align: center;
        }
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 243, 255, 0.1);
            border-top-color: #00f3ff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 1rem;
            box-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
        }
        .loader-text {
            font-family: 'Orbitron', sans-serif;
            color: #00ff88;
            font-size: 0.85rem;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .reveal-item {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-item.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    
    document.head.appendChild(animStyles);
    document.body.prepend(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 500);
        }, 600);
    });

    // ==========================================
    // 2. DOM Elements & Scroll Reveal Observers
    // ==========================================
    const searchInput = document.getElementById('citySearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const sectorsGrid = document.getElementById('sectorsGrid');
    const cards = sectorsGrid ? Array.from(sectorsGrid.querySelectorAll('.sector-card')) : [];
    const noResults = document.getElementById('noResults');
    const searchIndicator = document.getElementById('searchIndicator');

    const revealTargets = document.querySelectorAll('.hero-section, .section-header, .sector-card');
    revealTargets.forEach(el => el.classList.add('reveal-item'));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach(el => observer.observe(el));

    // ==========================================
    // 3. Accurate Multi-Token Live Search Filtering
    // ==========================================
    const filterSectors = () => {
        const rawQuery = searchInput.value.toLowerCase().trim();
        const tokens = rawQuery.split(/\s+/).filter(Boolean);
        let matchCount = 0;

        // Toggle clear button visibility
        if (clearSearchBtn) {
            clearSearchBtn.classList.toggle('hidden', rawQuery.length === 0);
        }

        cards.forEach(card => {
            const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
            const tag = (card.querySelector('.sector-tag')?.textContent || '').toLowerCase();
            const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
            const description = (card.querySelector('p')?.textContent || '').toLowerCase();

            // Combine all searchable fields into one normalized string
            const searchableContent = `${keywords} ${tag} ${title} ${description}`;

            // Every typed word must match somewhere in the card's searchable content
            const isMatch = tokens.every(token => searchableContent.includes(token));

            if (isMatch) {
                card.classList.remove('hidden');
                // Ensure matched card is immediately visible even if user hasn't scrolled
                card.classList.add('active');
                matchCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Update UI feedback
        if (rawQuery === '') {
            searchIndicator.textContent = 'Type to filter sectors';
            searchIndicator.style.color = 'var(--text-muted)';
        } else {
            searchIndicator.textContent = `Found ${matchCount} matching sector${matchCount === 1 ? '' : 's'}`;
            searchIndicator.style.color = matchCount > 0 ? 'var(--neon-emerald)' : '#ff5f6d';
        }

        if (noResults) {
            noResults.classList.toggle('hidden', matchCount > 0);
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', filterSectors);
    }

    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterSectors();
            searchInput.focus();
        });
    }
});