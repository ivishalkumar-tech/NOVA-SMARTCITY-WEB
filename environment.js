document.addEventListener("DOMContentLoaded", () => {
    // 0. Cyber Page Load / Stream-In Effect
    const loader = document.createElement('div');
    loader.className = 'cyber-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <span class="loader-text">INITIALIZING NOVA ECO-MATRIX...</span>
            <div class="loader-bar"></div>
        </div>
    `;
    document.body.appendChild(loader);

    // Inject dynamic loader styles so you don't have to touch your CSS file
    const loaderStyle = document.createElement('style');
    loaderStyle.innerHTML = `
        .cyber-loader {
            position: fixed;
            inset: 0;
            background: #040711;
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            transition: opacity 0.6s ease, visibility 0.6s ease;
        }
        .cyber-loader.fade-out {
            opacity: 0;
            visibility: hidden;
        }
        .loader-text {
            font-family: 'Orbitron', sans-serif;
            color: #00ff88;
            font-size: 1.1rem;
            letter-spacing: 3px;
            margin-bottom: 1.2rem;
            text-shadow: 0 0 14px rgba(0, 255, 136, 0.6);
        }
        .loader-bar {
            width: 220px;
            height: 3px;
            background: rgba(0, 255, 136, 0.1);
            border-radius: 3px;
            position: relative;
            overflow: hidden;
        }
        .loader-bar::after {
            content: '';
            position: absolute;
            top: 0; left: 0; bottom: 0;
            width: 50%;
            background: linear-gradient(90deg, transparent, #00f3ff, #00ff88);
            animation: loadScan 0.8s infinite linear;
        }
        @keyframes loadScan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
        }
    `;
    document.head.appendChild(loaderStyle);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 600);
        }, 600); // Sleek 0.6s boot sequence
    });

    // 1. Scroll Reveal Animation using Intersection Observer (Bottom-to-Place)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".matrix-card, .aqi-card, .accordion-item, .section-header, .env-hero");
    revealElements.forEach(el => {
        el.classList.add("reveal-hidden");
        observer.observe(el);
    });

    // Inject bottom-to-place scroll reveal styles dynamically
    const revealStyle = document.createElement('style');
    revealStyle.innerHTML = `
        .reveal-hidden {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(revealStyle);

    // 2. Interactive 3D Tilt Effect on Matrix Cards
    const cards = document.querySelectorAll(".matrix-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateX = (-y / 15).toFixed(2);
            const rotateY = (x / 15).toFixed(2);

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
            card.style.transition = "transform 0.5s ease";
        });

        card.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });
    });

    // 3. Smooth Counter Animation for Live AQI Stats
    const aqiNumbers = document.querySelectorAll(".aqi-number");
    let animated = false;

    const runCounters = () => {
        aqiNumbers.forEach(numEl => {
            const text = numEl.textContent.trim();
            const match = text.match(/[\d.]+/);
            if (!match) return;
            
            const target = parseFloat(match[0]);
            const isPercentage = text.includes("%");
            const isDecimal = text.includes(".");
            
            let current = 0;
            const duration = 1500; 
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (isPercentage) {
                    numEl.textContent = Math.round(current) + "%";
                } else if (isDecimal) {
                    numEl.textContent = current.toFixed(2);
                } else {
                    numEl.textContent = String(Math.round(current)).padStart(3, '0');
                }
            }, stepTime);
        });
    };

    const bannerSection = document.querySelector(".aqi-banner-section");
    if (bannerSection) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    runCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(bannerSection);
    }
});