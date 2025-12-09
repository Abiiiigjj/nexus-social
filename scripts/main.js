/**
 * Nexus Social - Enhanced Interactive JavaScript
 * Spectacular animations, full functionality, modern features
 */

// ============================================================================
// Global State
// ============================================================================
const NexusApp = {
    darkMode: false,
    searchOpen: false,
    mobileMenuOpen: false,
    cookieConsent: localStorage.getItem('cookieConsent') === 'true',
    newsletter: localStorage.getItem('newsletterDismissed') !== 'true'
};

// ============================================================================
// DOM Ready
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    initDarkMode();
    initMobileMenu();
    initCategoryFilter();
    initSearchFilter();
    initImpactCounter();
    initStickyNav();
    initSmoothScroll();
    initCardHoverEffects();

    // Enhanced features
    initParallax();
    initScrollAnimations();
    initCookieConsent();
    initNewsletterPopup();
    initParticleBackground();
    initLoadingAnimations();
    initTooltips();
    initLiveSearch();
    initTickerAnimation();

    // Remove loading state
    document.body.classList.add('loaded');
});

// ============================================================================
// Dark Mode Toggle
// ============================================================================
function initDarkMode() {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        NexusApp.darkMode = true;
    }

    // Create toggle button
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Farbmodus wechseln');
    toggle.innerHTML = `
        <svg class="theme-toggle__sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg class="theme-toggle__moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
    `;

    toggle.addEventListener('click', () => {
        NexusApp.darkMode = !NexusApp.darkMode;
        document.documentElement.setAttribute('data-theme', NexusApp.darkMode ? 'dark' : 'light');
        localStorage.setItem('theme', NexusApp.darkMode ? 'dark' : 'light');

        // Animate toggle
        toggle.classList.add('theme-toggle--animating');
        setTimeout(() => toggle.classList.remove('theme-toggle--animating'), 300);
    });

    document.querySelector('.header__inner')?.appendChild(toggle);
}

// ============================================================================
// Mobile Menu
// ============================================================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const body = document.body;

    if (!menuToggle || !nav) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);

    menuToggle.addEventListener('click', () => {
        NexusApp.mobileMenuOpen = !NexusApp.mobileMenuOpen;
        menuToggle.setAttribute('aria-expanded', NexusApp.mobileMenuOpen);
        menuToggle.classList.toggle('is-active', NexusApp.mobileMenuOpen);
        nav.classList.toggle('nav--mobile-open', NexusApp.mobileMenuOpen);
        overlay.classList.toggle('active', NexusApp.mobileMenuOpen);
        body.classList.toggle('menu-open', NexusApp.mobileMenuOpen);
    });

    overlay.addEventListener('click', () => {
        NexusApp.mobileMenuOpen = false;
        menuToggle.setAttribute('aria-expanded', false);
        menuToggle.classList.remove('is-active');
        nav.classList.remove('nav--mobile-open');
        overlay.classList.remove('active');
        body.classList.remove('menu-open');
    });

    // Close on nav link click
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            if (NexusApp.mobileMenuOpen) {
                overlay.click();
            }
        });
    });
}

// ============================================================================
// Category Filter
// ============================================================================
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const appCards = document.querySelectorAll('.app-card');

    const handleFilter = (category) => {
        // Update button states
        categoryButtons.forEach(btn => {
            btn.classList.toggle('category-btn--active', btn.dataset.category === category);
        });
        filterButtons.forEach(btn => {
            btn.classList.toggle('filter-btn--active', btn.dataset.category === category);
        });

        // Filter with staggered animation
        appCards.forEach((card, index) => {
            const cardCategory = card.dataset.category;
            const shouldShow = category === 'all' || cardCategory === category;

            card.style.transitionDelay = `${index * 30}ms`;

            if (shouldShow) {
                card.style.display = '';
                requestAnimationFrame(() => {
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                });
            } else {
                card.classList.remove('visible');
                card.classList.add('hidden');
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Reset delays
        setTimeout(() => {
            appCards.forEach(card => card.style.transitionDelay = '0ms');
        }, appCards.length * 30 + 300);
    };

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => handleFilter(btn.dataset.category));
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => handleFilter(btn.dataset.category));
    });
}

// ============================================================================
// Live Search
// ============================================================================
function initLiveSearch() {
    const searchInput = document.getElementById('search-input');
    const appCards = document.querySelectorAll('.app-card');

    if (!searchInput) return;

    // Create search results dropdown
    const resultsDropdown = document.createElement('div');
    resultsDropdown.className = 'search-results-dropdown';
    searchInput.parentElement.appendChild(resultsDropdown);

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            resultsDropdown.classList.remove('active');
            resultsDropdown.innerHTML = '';
            return;
        }

        debounceTimer = setTimeout(() => {
            const results = [];

            appCards.forEach(card => {
                const title = card.querySelector('.app-card__title')?.textContent || '';
                const desc = card.querySelector('.app-card__description')?.textContent || '';
                const category = card.querySelector('.app-card__category')?.textContent || '';

                if (title.toLowerCase().includes(query) ||
                    desc.toLowerCase().includes(query) ||
                    category.toLowerCase().includes(query)) {
                    results.push({
                        title,
                        category,
                        href: card.href || '#apps'
                    });
                }
            });

            if (results.length > 0) {
                resultsDropdown.innerHTML = results.map(r => `
                    <a href="${r.href}" class="search-result-item">
                        <span class="search-result-title">${highlightMatch(r.title, query)}</span>
                        <span class="search-result-category">${r.category}</span>
                    </a>
                `).join('');
                resultsDropdown.classList.add('active');
            } else {
                resultsDropdown.innerHTML = `
                    <div class="search-result-empty">
                        <span>😕</span>
                        <p>Keine Ergebnisse für "${query}"</p>
                    </div>
                `;
                resultsDropdown.classList.add('active');
            }
        }, 200);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            resultsDropdown.classList.remove('active');
        }
    });

    // Handle search submit
    const searchSubmit = document.querySelector('.search-bar__submit');
    searchSubmit?.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query) {
            // Scroll to apps and filter
            document.querySelector('#apps')?.scrollIntoView({ behavior: 'smooth' });

            appCards.forEach(card => {
                const title = card.querySelector('.app-card__title')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('.app-card__description')?.textContent.toLowerCase() || '';
                const matches = title.includes(query) || desc.includes(query);

                card.style.display = matches ? '' : 'none';
                card.classList.toggle('search-highlight', matches);
            });
        }
    });
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// ============================================================================
// Impact Counter Animation
// ============================================================================
function initImpactCounter() {
    const counters = document.querySelectorAll('.impact-stat__value');
    if (!counters.length) return;

    const animateCounter = (element) => {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2500;
        const startTime = performance.now();
        const formatter = new Intl.NumberFormat('de-DE');

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing: easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);

            element.textContent = formatter.format(current);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Add completion effect
                element.classList.add('counter-complete');
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ============================================================================
// Sticky Navigation
// ============================================================================
function initStickyNav() {
    const header = document.querySelector('.header');
    const categoryNav = document.querySelector('.category-nav');

    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNav = () => {
        const scrollY = window.scrollY;

        // Header shadow
        header.classList.toggle('header--scrolled', scrollY > 10);

        // Category nav hide/show
        if (categoryNav) {
            categoryNav.style.transform = (scrollY > lastScrollY && scrollY > 200)
                ? 'translateY(-100%)'
                : 'translateY(0)';
        }

        lastScrollY = scrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });
}

// ============================================================================
// Smooth Scroll
// ============================================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const categoryNavHeight = document.querySelector('.category-nav')?.offsetHeight || 0;
            const offset = headerHeight + categoryNavHeight + 20;

            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update focus
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });
}

// ============================================================================
// Card Hover Effects
// ============================================================================
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.app-card');

    cards.forEach(card => {
        // 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });

        // Keyboard support
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (card.href) {
                    window.location.href = card.href;
                } else {
                    card.click();
                }
            }
        });
    });
}

// ============================================================================
// Parallax Effects
// ============================================================================
function initParallax() {
    const hero = document.querySelector('.hero');
    const vizOrbit = document.querySelector('.viz-orbit');

    if (!hero || !vizOrbit) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            vizOrbit.style.transform = `rotate(${scrollY * 0.1}deg) scale(${1 - progress * 0.3})`;
            vizOrbit.style.opacity = 1 - progress;
        }
    }, { passive: true });
}

// ============================================================================
// Scroll Animations (Intersection Observer)
// ============================================================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.app-card, .testimonial, .impact-stat, .sidebar-card, .cta-box, .section-title'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach((el, i) => {
        el.style.setProperty('--animation-order', i % 8);
        observer.observe(el);
    });
}

// ============================================================================
// Cookie Consent
// ============================================================================
function initCookieConsent() {
    if (NexusApp.cookieConsent) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-banner__content">
            <div class="cookie-banner__text">
                <span class="cookie-banner__icon">🍪</span>
                <p>Wir verwenden nur technisch notwendige Cookies. <a href="datenschutz.html">Mehr erfahren</a></p>
            </div>
            <div class="cookie-banner__actions">
                <button class="btn btn--primary btn--small cookie-accept">Verstanden</button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);

    // Animate in
    requestAnimationFrame(() => {
        banner.classList.add('visible');
    });

    banner.querySelector('.cookie-accept')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        NexusApp.cookieConsent = true;
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 300);
    });
}

// ============================================================================
// Newsletter Popup
// ============================================================================
function initNewsletterPopup() {
    if (!NexusApp.newsletter) return;

    // Show after 30 seconds or 50% scroll
    let shown = false;

    const showPopup = () => {
        if (shown) return;
        shown = true;

        const popup = document.createElement('div');
        popup.className = 'newsletter-modal';
        popup.innerHTML = `
            <div class="newsletter-modal__backdrop"></div>
            <div class="newsletter-modal__content">
                <button class="newsletter-modal__close" aria-label="Schließen">×</button>
                <div class="newsletter-modal__icon">📬</div>
                <h3>Bleib auf dem Laufenden!</h3>
                <p>Erhalte Updates zu neuen Social Impact Tools und Community-Events.</p>
                <form class="newsletter-form" id="newsletterForm">
                    <input type="email" placeholder="deine@email.de" required class="form-input">
                    <button type="submit" class="btn btn--primary">Anmelden</button>
                </form>
                <button class="newsletter-modal__dismiss">Nein, danke</button>
            </div>
        `;

        document.body.appendChild(popup);
        requestAnimationFrame(() => popup.classList.add('visible'));

        const close = () => {
            popup.classList.remove('visible');
            setTimeout(() => popup.remove(), 300);
        };

        popup.querySelector('.newsletter-modal__close')?.addEventListener('click', close);
        popup.querySelector('.newsletter-modal__backdrop')?.addEventListener('click', close);
        popup.querySelector('.newsletter-modal__dismiss')?.addEventListener('click', () => {
            localStorage.setItem('newsletterDismissed', 'true');
            close();
        });

        popup.querySelector('#newsletterForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input').value;

            // Success animation
            popup.querySelector('.newsletter-modal__content').innerHTML = `
                <div class="newsletter-success">
                    <div class="newsletter-success__icon">✅</div>
                    <h3>Willkommen!</h3>
                    <p>Du erhältst bald Post von uns an ${email}</p>
                </div>
            `;

            localStorage.setItem('newsletterDismissed', 'true');
            setTimeout(close, 3000);
        });
    };

    // Trigger after scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            if (scrollPercent > 0.4) {
                showPopup();
            }
        }, 100);
    }, { passive: true });

    // Or after 45 seconds
    setTimeout(showPopup, 45000);
}

// ============================================================================
// Particle Background
// ============================================================================
function initParticleBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const resize = () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    };

    const createParticles = () => {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(92, 107, 192, ${p.opacity})`;
            ctx.fill();
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(92, 107, 192, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });

        animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    // Pause when not visible
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animate();
        } else {
            cancelAnimationFrame(animationId);
        }
    });
    observer.observe(hero);
}

// ============================================================================
// Loading Animations
// ============================================================================
function initLoadingAnimations() {
    // Add loading class initially
    document.body.classList.add('loading');

    // Remove after content loads
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    });

    // Fallback
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }, 2000);
}

// ============================================================================
// Tooltips
// ============================================================================
function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const text = el.dataset.tooltip;

            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;

            document.body.appendChild(tooltip);

            const rect = el.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10 + window.scrollY}px`;
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;

            requestAnimationFrame(() => tooltip.classList.add('visible'));

            el.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
                setTimeout(() => tooltip.remove(), 200);
            }, { once: true });
        });
    });
}

// ============================================================================
// Ticker Animation
// ============================================================================
function initTickerAnimation() {
    const ticker = document.querySelector('.impact-ticker');
    if (!ticker) return;

    const items = ticker.querySelectorAll('.ticker-item');
    let currentIndex = 0;

    // Position items
    items.forEach((item, i) => {
        item.style.position = i === 0 ? 'relative' : 'absolute';
        item.style.opacity = i === 0 ? '1' : '0';
        item.style.top = '0';
        item.style.left = '0';
        item.style.width = '100%';
    });

    setInterval(() => {
        const current = items[currentIndex];
        const nextIndex = (currentIndex + 1) % items.length;
        const next = items[nextIndex];

        current.style.opacity = '0';
        current.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            current.style.position = 'absolute';
            next.style.position = 'relative';
            next.style.opacity = '1';
            next.style.transform = 'translateY(0)';
        }, 300);

        currentIndex = nextIndex;
    }, 4000);
}

// ============================================================================
// Utility Functions
// ============================================================================
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================================================
// Service Worker Registration (for offline support)
// ============================================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js');
    });
}
