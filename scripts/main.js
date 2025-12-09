/**
 * Nexus Social - Main JavaScript
 * Handles interactivity, animations, and filtering
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initMobileMenu();
    initCategoryFilter();
    initSearchFilter();
    initImpactCounter();
    initStickyNav();
    initSmoothScroll();
    initCardHoverEffects();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);

        // Toggle mobile menu visibility
        nav.classList.toggle('nav--mobile-open');
        menuToggle.classList.toggle('is-active');

        // Update hamburger icon
        const hamburger = menuToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.classList.toggle('is-active');
        }
    });
}

/**
 * Category Filter Functionality
 */
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const appCards = document.querySelectorAll('.app-card');

    // Category navigation buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('category-btn--active'));
            button.classList.add('category-btn--active');

            // Also sync filter buttons if they exist
            filterButtons.forEach(btn => {
                btn.classList.toggle('filter-btn--active', btn.dataset.category === category);
            });

            // Filter cards
            filterCards(category, appCards);
        });
    });

    // Hero filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
            button.classList.add('filter-btn--active');

            // Also sync category buttons if they exist
            categoryButtons.forEach(btn => {
                btn.classList.toggle('category-btn--active', btn.dataset.category === category);
            });

            // Filter cards
            filterCards(category, appCards);
        });
    });
}

/**
 * Filter cards by category with animation
 */
function filterCards(category, cards) {
    cards.forEach((card, index) => {
        const cardCategory = card.dataset.category;
        const shouldShow = category === 'all' || cardCategory === category;

        // Add stagger delay for animation
        card.style.transitionDelay = `${index * 50}ms`;

        if (shouldShow) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            // Trigger reflow
            card.offsetHeight;

            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    // Reset transition delays after animation
    setTimeout(() => {
        cards.forEach(card => {
            card.style.transitionDelay = '0ms';
        });
    }, cards.length * 50 + 300);
}

/**
 * Search Filter Functionality
 */
function initSearchFilter() {
    const searchInput = document.getElementById('search-input');
    const appCards = document.querySelectorAll('.app-card');

    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();

            appCards.forEach(card => {
                const title = card.querySelector('.app-card__title')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.app-card__description')?.textContent.toLowerCase() || '';
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');

                const matchesSearch = searchTerm === '' ||
                    title.includes(searchTerm) ||
                    description.includes(searchTerm) ||
                    tags.includes(searchTerm);

                if (matchesSearch) {
                    card.style.display = '';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        }, 200);
    });
}

/**
 * Animated Impact Counter
 */
function initImpactCounter() {
    const counters = document.querySelectorAll('.impact-stat__value');

    if (!counters.length) return;

    const animateCounter = (element) => {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            // Format number with locale
            element.textContent = current.toLocaleString('de-DE');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Sticky Navigation with scroll effects
 */
function initStickyNav() {
    const header = document.querySelector('.header');
    const categoryNav = document.querySelector('.category-nav');

    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNav = () => {
        const scrollY = window.scrollY;

        // Add shadow to header when scrolled
        if (scrollY > 10) {
            header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.06)';
        } else {
            header.style.boxShadow = 'none';
        }

        // Hide/show category nav on scroll direction
        if (categoryNav) {
            if (scrollY > lastScrollY && scrollY > 200) {
                // Scrolling down
                categoryNav.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                categoryNav.style.transform = 'translateY(0)';
            }
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

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const categoryNavHeight = document.querySelector('.category-nav')?.offsetHeight || 0;
                const offset = headerHeight + categoryNavHeight + 20;

                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });
}

/**
 * Card Hover Effects with enhanced interactions
 */
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.app-card');

    cards.forEach(card => {
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');

        // Mouse enter effect
        card.addEventListener('mouseenter', () => {
            // Show preview animation
            const preview = card.querySelector('.app-card__preview');
            if (preview) {
                preview.style.opacity = '0.3';
            }
        });

        // Mouse leave effect
        card.addEventListener('mouseleave', () => {
            const preview = card.querySelector('.app-card__preview');
            if (preview) {
                preview.style.opacity = '0.1';
            }
        });

        // Focus effect (keyboard navigation)
        card.addEventListener('focus', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
        });

        card.addEventListener('blur', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });

        // Click to expand (future feature)
        card.addEventListener('click', () => {
            // Could open a modal or navigate to app detail page
            console.log('Card clicked:', card.querySelector('.app-card__title')?.textContent);
        });

        // Keyboard activation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

/**
 * Live Ticker Animation
 */
function initTickerAnimation() {
    const ticker = document.querySelector('.impact-ticker');

    if (!ticker) return;

    const items = ticker.querySelectorAll('.ticker-item');
    let currentIndex = 0;

    // Hide all items initially except first
    items.forEach((item, index) => {
        item.style.opacity = index === 0 ? '1' : '0';
        item.style.position = index === 0 ? 'relative' : 'absolute';
    });

    // Rotate through items
    setInterval(() => {
        const current = items[currentIndex];
        const nextIndex = (currentIndex + 1) % items.length;
        const next = items[nextIndex];

        // Fade out current
        current.style.opacity = '0';
        current.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            current.style.position = 'absolute';
            next.style.position = 'relative';
            next.style.opacity = '1';
            next.style.transform = 'translateX(0)';
        }, 300);

        currentIndex = nextIndex;
    }, 4000);
}

// Initialize ticker on load
initTickerAnimation();

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
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
