// ========================================
// CODENEST - MAIN JAVASCRIPT
// ========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHomePage();
    loadSocialLinks();
    trackVisit();
});

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// Home Page
function initHomePage() {
    // Animate stats
    animateStats();

    // Load languages
    loadLanguagesGrid();
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + (end >= 1000 ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (end >= 1000 ? '+' : '');
        }
    }, 16);
}

function loadLanguagesGrid() {
    const grid = document.getElementById('languagesGrid');
    if (!grid) return;

    const languages = dataManager.getLanguages();

    if (languages.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>No languages available yet.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = languages.map(lang => `
        <div class="language-card" onclick="navigateToLanguage('${lang.id}')">
            <div class="language-icon">${lang.icon}</div>
            <h3 class="language-name">${lang.name}</h3>
            <p class="language-description">${lang.description}</p>
            <div class="language-stats">
                <span class="language-stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    ${lang.courseCount} courses
                </span>
            </div>
        </div>
    `).join('');
}

function navigateToLanguage(languageId) {
    window.location.href = `courses.html?language=${languageId}`;
}

// Utilities
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        }
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

function createStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star star-full">★</span>';
    }

    if (hasHalfStar) {
        stars += '<span class="star star-half">★</span>';
    }

    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star star-empty">☆</span>';
    }

    return stars;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scroll to element
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Social Links and Tracking
function loadSocialLinks() {
    const container = document.getElementById('socialLinksContainer');
    if (!container) return;

    try {
        const links = dataManager.getSocialLinks();
        if (links.length > 0) {
            container.innerHTML = links.map(link => `
                <a href="${link.url}" class="social-link" aria-label="${link.name}" target="_blank" rel="noopener noreferrer">
                    ${link.icon}
                </a>
            `).join('');
        }
    } catch (e) {
        console.error('Error loading social links:', e);
    }
}

function trackVisit() {
    try {
        // Simple session check to avoid counting every refresh in short succession (optional)
        if (!sessionStorage.getItem('visitTracked')) {
            dataManager.incrementVisit();
            sessionStorage.setItem('visitTracked', 'true');
        }
    } catch (e) {
        console.error('Error tracking visit:', e);
    }
}
