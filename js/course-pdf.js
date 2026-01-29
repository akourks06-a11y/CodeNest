// ========================================
// CODENEST - COURSE PDF VIEWER
// With Protection & Enhanced Features
// ========================================

let currentCourse = null;
let currentLesson = null;
let allLessons = [];
let filteredLessons = [];
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let currentScale = 1.5;
let rendering = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    if (courseId) {
        loadCourse(courseId);
        initializeEventListeners();
        applyPDFProtection();
    } else {
        window.location.href = 'courses.html';
    }
});

// Load Course Data
function loadCourse(courseId) {
    currentCourse = dataManager.getCourseById(courseId);

    if (!currentCourse) {
        alert('Course not found!');
        window.location.href = 'courses.html';
        return;
    }

    loadCourseInfo();
    allLessons = currentCourse.lessons || [];
    filteredLessons = [...allLessons];
    loadLessonsList();
    loadComments();
}

// Load Course Information
function loadCourseInfo() {
    const language = dataManager.getLanguageById(currentCourse.languageId);
    const courseInfoSection = document.getElementById('courseInfo');

    courseInfoSection.innerHTML = `
        <h1 class="course-title-main">${currentCourse.title}</h1>
        <div class="course-meta-info">
            <div class="meta-item">
                <span class="meta-icon">${language ? language.icon : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>'}</span>
                <span>${language ? language.name : 'Programming'}</span>
            </div>
            <div class="meta-item">
                <span class="course-level ${currentCourse.level.toLowerCase()}">${currentCourse.level}</span>
            </div>
            <div class="meta-item">
                <div class="stars">
                    ${createStars(currentCourse.rating)}
                </div>
                <span>${currentCourse.rating.toFixed(1)} (${currentCourse.totalRatings} ratings)</span>
            </div>
            <div class="meta-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>${currentCourse.lessons.length} lessons</span>
            </div>
        </div>
        <p class="course-description-full">${currentCourse.description}</p>
    `;

    document.getElementById('sidebarTitle').textContent = currentCourse.title;
}

// Load Lessons List
function loadLessonsList() {
    const container = document.getElementById('lessonsList');

    if (filteredLessons.length === 0) {
        container.innerHTML = `
            <div class="no-lessons">
                <p>No lessons found</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredLessons.map((lesson, index) => `
        <div class="lesson-item ${currentLesson && currentLesson.id === lesson.id ? 'active' : ''}" 
             onclick="selectLesson('${lesson.id}')">
            <div class="lesson-number">${index + 1}</div>
            <div class="lesson-info">
                <h4 class="lesson-title">${lesson.title}</h4>
                ${lesson.pdfFile ? '<span class="lesson-type-badge">PDF</span>' : '<span class="lesson-type-badge markdown">Text</span>'}
            </div>
        </div>
    `).join('');
}

// Select Lesson
function selectLesson(lessonId) {
    currentLesson = allLessons.find(l => l.id === lessonId);

    if (!currentLesson) return;

    // Update active state
    loadLessonsList();

    // Check if it's a PDF or Markdown
    if (currentLesson.pdfFile) {
        showPDFViewer();
        loadPDF(currentLesson.pdfFile);
    } else {
        showMarkdownContent();
        loadMarkdownLesson();
    }

    // Close mobile sidebar
    closeMobileSidebar();
}

// Show PDF Viewer
function showPDFViewer() {
    document.getElementById('pdfViewerContainer').classList.remove('hidden');
    document.getElementById('lessonContent').classList.add('hidden');
    document.getElementById('pdfPlaceholder').style.display = 'none';
}

// Show Markdown Content
function showMarkdownContent() {
    document.getElementById('pdfViewerContainer').classList.add('hidden');
    document.getElementById('lessonContent').classList.remove('hidden');
}

// Load PDF with Protection
async function loadPDF(pdfFileName) {
    const pdfPath = `lessons/${pdfFileName}`;

    try {
        // Load PDF
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;

        document.getElementById('totalPages').textContent = totalPages;
        currentPage = 1;

        // Render first page
        renderPage(currentPage);

    } catch (error) {
        console.error('Error loading PDF:', error);
        showPDFError();
    }
}

// Render PDF Page
async function renderPage(pageNum) {
    if (rendering) return;
    rendering = true;

    const page = await pdfDoc.getPage(pageNum);
    const canvas = document.getElementById('pdfCanvas');
    const context = canvas.getContext('2d');

    const viewport = page.getViewport({ scale: currentScale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };

    await page.render(renderContext).promise;
    rendering = false;

    // Update page number
    document.getElementById('currentPage').textContent = pageNum;
}

// PDF Navigation
document.getElementById('prevPage')?.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
});

document.getElementById('nextPage')?.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
    }
});

// PDF Zoom
document.getElementById('zoomIn')?.addEventListener('click', () => {
    currentScale += 0.25;
    document.getElementById('zoomLevel').textContent = Math.round(currentScale * 100) + '%';
    renderPage(currentPage);
});

document.getElementById('zoomOut')?.addEventListener('click', () => {
    if (currentScale > 0.5) {
        currentScale -= 0.25;
        document.getElementById('zoomLevel').textContent = Math.round(currentScale * 100) + '%';
        renderPage(currentPage);
    }
});

document.getElementById('fitWidth')?.addEventListener('click', () => {
    const container = document.getElementById('pdfCanvasWrapper');
    const canvas = document.getElementById('pdfCanvas');
    currentScale = (container.offsetWidth - 40) / canvas.width * currentScale;
    document.getElementById('zoomLevel').textContent = Math.round(currentScale * 100) + '%';
    renderPage(currentPage);
});

// PDF Protection
function applyPDFProtection() {
    const pdfContainer = document.getElementById('pdfViewerContainer');
    const canvas = document.getElementById('pdfCanvas');
    const protectionOverlay = document.querySelector('.pdf-protection-overlay');

    // Disable right-click
    pdfContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // Disable text selection
    pdfContainer.style.userSelect = 'none';
    pdfContainer.style.webkitUserSelect = 'none';
    pdfContainer.style.mozUserSelect = 'none';
    pdfContainer.style.msUserSelect = 'none';

    // Disable dragging
    canvas.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });

    // Disable keyboard shortcuts (Ctrl+S, Ctrl+P, etc.)
    document.addEventListener('keydown', (e) => {
        // Prevent Ctrl+S (Save)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
        // Prevent Ctrl+P (Print)
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            return false;
        }
        // Prevent Ctrl+C (Copy) when in PDF viewer
        if (e.ctrlKey && e.key === 'c' && document.activeElement.closest('#pdfViewerContainer')) {
            e.preventDefault();
            return false;
        }
    });

    // Add watermark effect (optional)
    protectionOverlay.addEventListener('click', () => {
        console.log('PDF is protected from download');
    });
}

// Show PDF Error
function showPDFError() {
    const wrapper = document.getElementById('pdfCanvasWrapper');
    wrapper.innerHTML = `
        <div class="pdf-error">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Unable to Load PDF</h3>
            <p>The PDF file could not be found or loaded.</p>
        </div>
    `;
}

// Load Markdown Lesson
function loadMarkdownLesson() {
    const content = currentLesson.content || '';
    const container = document.getElementById('lessonContent');
    container.innerHTML = marked.parse(content);
}

// Search Lessons
const searchInput = document.getElementById('lessonSearch');
searchInput?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    filteredLessons = allLessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm)
    );

    loadLessonsList();
});

// Filter by Level
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const level = btn.getAttribute('data-level');

        if (level === 'all') {
            filteredLessons = [...allLessons];
        } else {
            filteredLessons = allLessons.filter(lesson =>
                lesson.level && lesson.level.toLowerCase() === level
            );
        }

        loadLessonsList();
    });
});

// Mobile Sidebar Toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

function closeMobileSidebar() {
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
}

// Initialize all event listeners
function initializeEventListeners() {
    // Rating system
    const stars = document.querySelectorAll('.rating-stars .star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            submitRating(rating);
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            highlightStars(rating);
        });
    });

    document.querySelector('.rating-stars').addEventListener('mouseleave', () => {
        highlightStars(0);
    });
}

// Rating Functions
function submitRating(rating) {
    dataManager.addRating(currentCourse.id, rating);
    currentCourse = dataManager.getCourseById(currentCourse.id);

    document.getElementById('ratingMessage').textContent = `Thank you! You rated this course ${rating} stars.`;
    loadCourseInfo();

    setTimeout(() => {
        document.getElementById('ratingMessage').textContent = '';
    }, 3000);
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.rating-stars .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
        } else {
            star.textContent = '☆';
        }
    });
}

function createStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star-display ${i <= rating ? 'filled' : ''}">★</span>`;
    }
    return stars;
}

// Comments Functions
function loadComments() {
    const comments = dataManager.getCommentsByCourse(currentCourse.id);
    const container = document.getElementById('commentsList');

    if (comments.length === 0) {
        container.innerHTML = '<p class="no-comments">No comments yet. Be the first to share your thoughts!</p>';
        return;
    }

    container.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <strong class="comment-author">${comment.author}</strong>
                <span class="comment-date">${formatDate(comment.timestamp)}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
            ${comment.replies && comment.replies.length > 0 ? `
                <div class="comment-replies">
                    ${comment.replies.map(reply => `
                        <div class="comment-reply">
                            <div class="comment-header">
                                <strong class="comment-author">
                                    ${reply.author} 
                                    ${reply.isAdmin ? '<span class="admin-badge">ADMIN</span>' : ''}
                                </strong>
                                <span class="comment-date">${formatDate(reply.timestamp)}</span>
                            </div>
                            <p class="comment-text">${reply.text}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function submitComment() {
    const author = document.getElementById('commentAuthor').value.trim();
    const text = document.getElementById('commentText').value.trim();

    if (!author || !text) {
        alert('Please enter your name and comment');
        return;
    }

    const comment = {
        courseId: currentCourse.id,
        author: author,
        text: text
    };

    dataManager.addComment(comment);

    // Clear form
    document.getElementById('commentAuthor').value = '';
    document.getElementById('commentText').value = '';

    // Reload comments
    loadComments();
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString();
}

// Menu Toggle (from main.js)
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
