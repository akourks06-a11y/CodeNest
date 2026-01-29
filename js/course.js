// ========================================
// COURSE PAGE JAVASCRIPT
// ========================================

let currentCourse = null;
let currentLessonIndex = 0;
let selectedRating = 0;

document.addEventListener('DOMContentLoaded', () => {
    initCoursePage();
});

function initCoursePage() {
    // Get course ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    if (!courseId) {
        window.location.href = 'courses.html';
        return;
    }

    // Load course
    currentCourse = dataManager.getCourseById(courseId);

    if (!currentCourse) {
        window.location.href = 'courses.html';
        return;
    }

    // Initialize page
    loadCourseInfo();
    loadLessonsList();
    loadLesson(0);
    loadComments();
    initRatingStars();
    initSidebar();

    // Initialize comment form
    document.getElementById('submitComment').addEventListener('click', submitComment);
}

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

    // Update sidebar title
    document.getElementById('sidebarTitle').textContent = currentCourse.title;
}

function loadLessonsList() {
    const lessonsList = document.getElementById('lessonsList');

    lessonsList.innerHTML = currentCourse.lessons.map((lesson, index) => `
        <div class="lesson-item ${index === currentLessonIndex ? 'active' : ''}" onclick="loadLesson(${index})">
            <div class="lesson-number">Lesson ${index + 1}</div>
            <div class="lesson-title">${lesson.title}</div>
        </div>
    `).join('');
}

function loadLesson(index) {
    currentLessonIndex = index;
    const lesson = currentCourse.lessons[index];

    if (!lesson) return;

    // Render markdown content
    const lessonContentDiv = document.getElementById('lessonContent');
    lessonContentDiv.innerHTML = marked.parse(lesson.content);

    // Update active lesson in sidebar
    loadLessonsList();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close sidebar on mobile
    closeSidebar();
}

function initRatingStars() {
    const stars = document.querySelectorAll('.rating-star');
    const submitBtn = document.getElementById('submitRating');

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;

            // Update star display
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('active');
                    s.textContent = '★';
                } else {
                    s.classList.remove('active');
                    s.textContent = '☆';
                }
            });

            // Show submit button
            submitBtn.style.display = 'inline-block';
        });

        // Hover effect
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.textContent = '★';
                } else {
                    s.textContent = '☆';
                }
            });
        });
    });

    // Reset on mouse leave
    document.getElementById('ratingInput').addEventListener('mouseleave', () => {
        stars.forEach((s, i) => {
            if (i < selectedRating) {
                s.textContent = '★';
            } else {
                s.textContent = '☆';
            }
        });
    });

    // Submit rating
    submitBtn.addEventListener('click', () => {
        if (selectedRating > 0) {
            dataManager.addRating(currentCourse.id, selectedRating);
            currentCourse = dataManager.getCourseById(currentCourse.id);
            loadCourseInfo();
            showNotification('Thank you for rating this course!', 'success');
            submitBtn.style.display = 'none';
        }
    });
}

function submitComment() {
    const nameInput = document.getElementById('commentName');
    const textInput = document.getElementById('commentText');

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const comment = {
        courseId: currentCourse.id,
        author: name,
        text: text
    };

    dataManager.addComment(comment);

    // Clear form
    nameInput.value = '';
    textInput.value = '';

    // Reload comments
    loadComments();

    showNotification('Comment posted successfully!', 'success');
}

function loadComments() {
    const commentsList = document.getElementById('commentsList');
    const comments = dataManager.getCommentsByCourse(currentCourse.id);

    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="empty-state">
                <p class="empty-text">No comments yet</p>
                <p class="empty-subtext">Be the first to share your thoughts!</p>
            </div>
        `;
        return;
    }

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-time">${formatDate(comment.timestamp)}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
            ${comment.replies && comment.replies.length > 0 ? `
                <div class="comment-replies">
                    ${comment.replies.map(reply => `
                        <div class="comment-reply">
                            <div class="comment-header">
                                <span class="comment-author">
                                    ${reply.author}
                                    <span class="reply-badge">ADMIN</span>
                                </span>
                                <span class="comment-time">${formatDate(reply.timestamp)}</span>
                            </div>
                            <p class="comment-text">${reply.text}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function initSidebar() {
    const sidebar = document.getElementById('courseSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOpenBtn = document.getElementById('sidebarOpenBtn');

    sidebarToggle.addEventListener('click', closeSidebar);
    sidebarOpenBtn.addEventListener('click', openSidebar);
}

function openSidebar() {
    document.getElementById('courseSidebar').classList.add('open');
}

function closeSidebar() {
    document.getElementById('courseSidebar').classList.remove('open');
}
