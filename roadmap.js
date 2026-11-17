/* ==========================================
   NOVA - Portal Animations, Form Handler & Filter
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Dynamic Cyber Loader & Scroll Reveal Setup
    // ==========================================
    
    // Create and inject a sleek cyber loading screen overlay
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <div class="loader-text">INITIALIZING NOVA CORE...</div>
        </div>
    `;

    // Inject lightweight animation styles dynamically so HTML/CSS remain untouched
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
            border: 3px solid rgba(0, 255, 136, 0.1);
            border-top-color: #00ff88;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 1rem;
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
        }
        .loader-text {
            font-family: 'Orbitron', sans-serif;
            color: #00f3ff;
            font-size: 0.85rem;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        /* Premium Bottom-to-Place Scroll Reveal Animation */
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

    // Fade out loader once page assets load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 500);
        }, 600);
    });

    // Attach scroll reveal observers to main sections & timeline cards
    const revealTargets = document.querySelectorAll('.timeline-item, .section-header, .portal-card, .roadmap-hero');
    revealTargets.forEach(el => el.classList.add('reveal-item'));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => observer.observe(el));


    // ==========================================
    // 2. Form Handling & Filtering Logic
    // ==========================================
    const form = document.getElementById('innovationForm');
    const successBox = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Extract form values
            const name = document.getElementById('citizenName').value.trim();
            const email = document.getElementById('citizenEmail').value.trim();
            const category = document.getElementById('ecoCategory').value;
            const proposal = document.getElementById('proposalText').value.trim();

            // 2. Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // 3. Structure the submission object
            const submissionData = {
                id: 'nova_' + Date.now(),
                name: name,
                email: email,
                category: category,
                proposal: proposal,
                timestamp: new Date().toISOString()
            };

            // 4. Save and filter into LocalStorage (Simulated Backend Storage)
            let existingProposals = JSON.parse(localStorage.getItem('novaProposals')) || [];
            existingProposals.push(submissionData);
            localStorage.setItem('novaProposals', JSON.stringify(existingProposals));

            // Optional: Console log filtered view for student evaluation / analysis
            console.log('--- NOVA INNOVATION DATABASE (FILTERED BY CATEGORY) ---');
            const filteredProposals = existingProposals.reduce((acc, item) => {
                acc[item.category] = acc[item.category] || [];
                acc[item.category].push(item);
                return acc;
            }, {});
            console.table(filteredProposals);

            // 5. UI Feedback Transition with subtle animation
            form.style.opacity = '0';
            setTimeout(() => {
                form.classList.add('hidden');
                successBox.classList.remove('hidden');
                successBox.classList.add('reveal-item', 'active');
            }, 300);
        });
    }
});