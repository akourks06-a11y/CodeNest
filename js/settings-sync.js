// ========================================
// CODENEST - SETTINGS SYNC
// Real-time Site Settings Synchronization
// ========================================

(function () {
    'use strict';

    // Load and apply site settings on page load
    function loadAndApplySettings() {
        const settings = getSiteSettings();
        applySettings(settings);
    }

    function getSiteSettings() {
        const stored = localStorage.getItem('siteSettings');
        if (stored) {
            return JSON.parse(stored);
        }

        // Default settings
        return {
            identity: {
                siteName: 'CodeNest',
                logotext: 'CodeNest'
            },
            theme: {
                primaryColor: '#2563eb',
                secondaryColor: '#3b82f6',
                fontFamily: 'Inter'
            },
            features: {
                darkMode: true,
                animations: true
            }
        };
    }

    function applySettings(settings) {
        // Apply site name
        if (settings.identity?.siteName) {
            document.title = `${settings.identity.siteName} - Learn Programming Through Reading`;

            // Update all logo text elements
            const logoTexts = document.querySelectorAll('.logo-text');
            logoTexts.forEach(el => {
                el.textContent = settings.identity.logotext || settings.identity.siteName;
            });
        }

        // Apply theme colors
        if (settings.theme) {
            const root = document.documentElement;

            if (settings.theme.primaryColor) {
                root.style.setProperty('--color-primary', settings.theme.primaryColor);
            }

            if (settings.theme.secondaryColor) {
                root.style.setProperty('--color-secondary', settings.theme.secondaryColor);
            }

            if (settings.theme.fontFamily) {
                root.style.setProperty('--font-family', settings.theme.fontFamily);
                document.body.style.fontFamily = settings.theme.fontFamily;
            }
        }

        // Apply features
        if (settings.features) {
            if (settings.features.animations === false) {
                document.body.classList.add('no-animations');
            }
        }
    }

    // Listen for storage changes (real-time sync)
    window.addEventListener('storage', function (e) {
        if (e.key === 'siteSettings') {
            loadAndApplySettings();
        }
    });

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAndApplySettings);
    } else {
        loadAndApplySettings();
    }

    // Export for use in other scripts
    window.CodeNestSettings = {
        get: getSiteSettings,
        apply: applySettings,
        reload: loadAndApplySettings
    };
})();
