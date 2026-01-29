// ========================================
// COURSES PAGE JAVASCRIPT
// ========================================

let currentLanguage = 'all';
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    initCoursesPage();
});

function initCoursesPage() {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const languageParam = urlParams.get('language');

    if (languageParam) {
        currentLanguage = languageParam;
    }

    // Load language tabs
    loadLanguageTabs();

    // Load courses
    loadCourses();

    // Initialize filters
    initFilters();
}

function loadLanguageTabs() {
    const tabsContainer = document.getElementById('languageTabs');
    if (!tabsContainer) return;

    const languages = dataManager.getLanguages();

    // Add "All" tab
    let tabsHTML = `
        <div class="language-tab ${currentLanguage === 'all' ? 'active' : ''}" onclick="selectLanguage('all')">
            <span class="language-tab-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
            </span>
            <span>All Languages</span>
        </div>
    `;

    // Add language tabs
    tabsHTML += languages.map(lang => `
        <div class="language-tab ${currentLanguage === lang.id ? 'active' : ''}" onclick="selectLanguage('${lang.id}')">
            <span class="language-tab-icon">${lang.icon}</span>
            <span>${lang.name}</span>
            <span class="language-tab-count">(${lang.courseCount})</span>
        </div>
    `).join('');

    tabsContainer.innerHTML = tabsHTML;
}

function selectLanguage(languageId) {
    currentLanguage = languageId;

    // Update URL
    const url = new URL(window.location);
    if (languageId === 'all') {
        url.searchParams.delete('language');
    } else {
        url.searchParams.set('language', languageId);
    }
    window.history.pushState({}, '', url);

    // Update UI
    loadLanguageTabs();
    loadCourses();
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));

            // Add active to clicked button
            btn.classList.add('active');

            // Update filter
            currentFilter = btn.getAttribute('data-filter');

            // Reload courses
            loadCourses();
        });
    });
}

function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;

    // Get all courses
    let courses = dataManager.getCourses();

    // Filter by language
    if (currentLanguage !== 'all') {
        courses = courses.filter(course => course.languageId === currentLanguage);
    }

    // Filter by level
    if (currentFilter !== 'all') {
        courses = courses.filter(course => course.level === currentFilter);
    }

    // Show empty state if no courses
    if (courses.length === 0) {
        coursesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <p class="empty-text">No courses found</p>
                <p class="empty-subtext">Try adjusting your filters or check back later</p>
            </div>
        `;
        return;
    }

    // Render courses
    coursesGrid.innerHTML = courses.map(course => {
        const language = dataManager.getLanguageById(course.languageId);
        const levelClass = course.level.toLowerCase();

        return `
            <div class="course-card" onclick="navigateToCourse('${course.id}')">
                <div class="course-header">
                    <div class="course-level ${levelClass}">${course.level}</div>
                </div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <div class="course-rating">
                        <div class="stars">
                            ${createStars(course.rating)}
                        </div>
                        <span class="rating-number">${course.rating.toFixed(1)}</span>
                        <span class="rating-count">(${course.totalRatings})</span>
                    </div>
                    <div class="course-lessons">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        ${course.lessons.length} lessons
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function navigateToCourse(courseId) {
    window.location.href = `course.html?id=${courseId}`;
}
