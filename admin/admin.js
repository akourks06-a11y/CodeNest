// ========================================
// ADMIN DASHBOARD JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initAdminDashboard();
});

function initAdminDashboard() {
    // Initialize navigation
    initSidebarNavigation();

    // Load dashboard stats
    loadDashboardStats();

    // Load all sections
    loadLanguagesTable();
    loadCoursesTable();
    loadCommentsAdmin();
}

// Navigation
function initSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));

            // Add active to clicked link
            link.classList.add('active');

            // Hide all sections
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show target section
            const targetSection = link.getAttribute('data-section');
            document.getElementById(`${targetSection}-section`).classList.add('active');
        });
    });
}

// Dashboard Stats
function loadDashboardStats() {
    const stats = dataManager.getStats();
    const statsGrid = document.getElementById('statsGrid');

    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                </div>
            </div>
            <div class="stat-card-value">${stats.totalLanguages}</div>
            <div class="stat-card-label">Programming Languages</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                </div>
            </div>
            <div class="stat-card-value">${stats.totalCourses}</div>
            <div class="stat-card-label">Total Courses</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                </div>
            </div>
            <div class="stat-card-value">${stats.totalComments}</div>
            <div class="stat-card-label">User Comments</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>
            </div>
            <div class="stat-card-value">${stats.avgRating.toFixed(1)}</div>
            <div class="stat-card-label">Average Rating</div>
        </div>
    `;
}

// Languages Management
function loadLanguagesTable() {
    const languages = dataManager.getLanguages();
    const tbody = document.querySelector('#languagesTable tbody');

    if (languages.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                    No languages found. Add your first programming language!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = languages.map(lang => `
        <tr>
            <td><span class="table-icon">${lang.icon}</span></td>
            <td><strong>${lang.name}</strong></td>
            <td>${lang.description}</td>
            <td>${lang.courseCount}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-edit" onclick="editLanguage('${lang.id}')" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteLanguage('${lang.id}')" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddLanguageModal() {
    const modal = createModal('Add Programming Language', `
        <div class="form-group">
            <label class="form-label">Language Name</label>
            <input type="text" class="form-input" id="langName" placeholder="e.g., Python">
        </div>
        <div class="form-group">
            <label class="form-label">Icon (SVG Code)</label>
            <input type="text" class="form-input" id="langIcon" placeholder="Paste SVG code here">
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="langDescription" rows="3" placeholder="Brief description..."></textarea>
        </div>
    `, [
        { text: 'Cancel', class: 'btn-secondary', onClick: closeModal },
        { text: 'Add Language', class: 'btn-primary', onClick: saveNewLanguage }
    ]);

    showModal(modal);
}

function saveNewLanguage() {
    const name = document.getElementById('langName').value.trim();
    const icon = document.getElementById('langIcon').value.trim();
    const description = document.getElementById('langDescription').value.trim();

    if (!name || !icon || !description) {
        alert('Please fill in all fields');
        return;
    }

    dataManager.addLanguage({ name, icon, description });
    loadLanguagesTable();
    loadDashboardStats();
    closeModal();
    showNotification('Language added successfully!', 'success');
}

function editLanguage(id) {
    const language = dataManager.getLanguageById(id);

    const modal = createModal('Edit Programming Language', `
        <div class="form-group">
            <label class="form-label">Language Name</label>
            <input type="text" class="form-input" id="langName" value="${language.name}">
        </div>
        <div class="form-group">
            <label class="form-label">Icon (SVG Code)</label>
            <input type="text" class="form-input" id="langIcon" value="${language.icon}">
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="langDescription" rows="3">${language.description}</textarea>
        </div>
    `, [
        { text: 'Cancel', class: 'btn-secondary', onClick: closeModal },
        { text: 'Save Changes', class: 'btn-primary', onClick: () => updateLanguage(id) }
    ]);

    showModal(modal);
}

function updateLanguage(id) {
    const name = document.getElementById('langName').value.trim();
    const icon = document.getElementById('langIcon').value.trim();
    const description = document.getElementById('langDescription').value.trim();

    if (!name || !icon || !description) {
        alert('Please fill in all fields');
        return;
    }

    dataManager.updateLanguage(id, { name, icon, description });
    loadLanguagesTable();
    closeModal();
    showNotification('Language updated successfully!', 'success');
}

function deleteLanguage(id) {
    if (confirm('Are you sure you want to delete this language? All associated courses will also be deleted.')) {
        dataManager.deleteLanguage(id);
        loadLanguagesTable();
        loadCoursesTable();
        loadDashboardStats();
        showNotification('Language deleted successfully!', 'success');
    }
}

// Courses Management
function loadCoursesTable() {
    const courses = dataManager.getCourses();
    const tbody = document.querySelector('#coursesTable tbody');

    if (courses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                    No courses found. Add your first course!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = courses.map(course => {
        const language = dataManager.getLanguageById(course.languageId);
        const levelClass = course.level.toLowerCase();

        return `
            <tr>
                <td><strong>${course.title}</strong></td>
                <td>${language ? language.name : 'Unknown'}</td>
                <td><span class="table-badge badge-${levelClass}">${course.level}</span></td>
                <td>${course.rating.toFixed(1)} (${course.totalRatings})</td>
                <td>${course.lessons.length}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon btn-primary" onclick="manageLessons('${course.id}')" title="Manage Lessons">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon btn-edit" onclick="editCourse('${course.id}')" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteCourse('${course.id}')" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function showAddCourseModal() {
    const languages = dataManager.getLanguages();

    const modal = createModal('Add New Course', `
        <div class="form-group">
            <label class="form-label">Course Title</label>
            <input type="text" class="form-input" id="courseTitle" placeholder="e.g., JavaScript Fundamentals">
        </div>
        <div class="form-group">
            <label class="form-label">Programming Language</label>
            <select class="form-select" id="courseLanguage">
                <option value="">Select a language...</option>
                ${languages.map(lang => `<option value="${lang.id}">${lang.name}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Level</label>
            <select class="form-select" id="courseLevel">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="courseDescription" rows="3" placeholder="Course description..."></textarea>
        </div>
    `, [
        { text: 'Cancel', class: 'btn-secondary', onClick: closeModal },
        { text: 'Add Course', class: 'btn-primary', onClick: saveNewCourse }
    ]);

    showModal(modal);
}

function saveNewCourse() {
    const title = document.getElementById('courseTitle').value.trim();
    const languageId = document.getElementById('courseLanguage').value;
    const level = document.getElementById('courseLevel').value;
    const description = document.getElementById('courseDescription').value.trim();

    if (!title || !languageId || !level || !description) {
        alert('Please fill in all fields');
        return;
    }

    const course = {
        title,
        languageId,
        level,
        description,
        lessons: []
    };

    dataManager.addCourse(course);
    loadCoursesTable();
    loadLanguagesTable();
    loadDashboardStats();
    closeModal();
    showNotification('Course added successfully!', 'success');
}

function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        dataManager.deleteCourse(id);
        loadCoursesTable();
        loadLanguagesTable();
        loadDashboardStats();
        showNotification('Course deleted successfully!', 'success');
    }
}

function editCourse(id) {
    // Similar to add, but with edit functionality
    alert('Edit course functionality - allows editing title, description, level, and managing lessons');
}

// Comments Management
function loadCommentsAdmin() {
    const comments = dataManager.getComments();
    const container = document.getElementById('commentsAdminList');

    if (comments.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem;">
                <p style="color: var(--color-text-secondary);">No comments yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = comments.map(comment => {
        const course = dataManager.getCourseById(comment.courseId);

        return `
            <div class="comment-admin-card">
                <div class="comment-admin-header">
                    <div class="comment-admin-info">
                        <h4>${comment.author}</h4>
                        <div class="comment-admin-meta">
                            ${course ? course.title : 'Unknown Course'} • ${formatDate(comment.timestamp)}
                        </div>
                    </div>
                </div>
                <p class="comment-admin-text">${comment.text}</p>
                ${comment.replies && comment.replies.length > 0 ? `
                    <div class="comment-replies">
                        ${comment.replies.map(reply => `
                            <div class="comment-admin-reply">
                                <strong>Admin Reply:</strong> ${reply.text}
                                <div class="comment-admin-meta">${formatDate(reply.timestamp)}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="reply-form">
                    <textarea class="form-textarea" id="reply-${comment.id}" placeholder="Write a reply..." rows="2"></textarea>
                    <button class="btn btn-primary" onclick="submitReply('${comment.id}')">Reply</button>
                </div>
            </div>
        `;
    }).join('');
}

function submitReply(commentId) {
    const replyText = document.getElementById(`reply-${commentId}`).value.trim();

    if (!replyText) {
        alert('Please enter a reply');
        return;
    }

    dataManager.addReply(commentId, {
        author: 'Admin',
        text: replyText
    });

    loadCommentsAdmin();
    loadDashboardStats();
    showNotification('Reply posted successfully!', 'success');
}

// Modal System
function createModal(title, bodyHTML, buttons) {
    return `
        <div class="modal-overlay" id="modalOverlay" onclick="closeModalOnOverlay(event)">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                    <button class="modal-close" onclick="closeModal()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    ${bodyHTML}
                </div>
                <div class="modal-footer">
                    ${buttons.map((btn, i) => `
                        <button class="btn ${btn.class}" onclick="modalButtonClick(${i})">${btn.text}</button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

let currentModalButtons = [];

function showModal(modalHTML) {
    const container = document.getElementById('modalContainer');
    container.innerHTML = modalHTML;
}

function closeModal() {
    document.getElementById('modalContainer').innerHTML = '';
    currentModalButtons = [];
}

function closeModalOnOverlay(event) {
    if (event.target.id === 'modalOverlay') {
        closeModal();
    }
}

// Utilities
function showNotification(message, type) {
    // Uses the global showNotification from main.js
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    }
}
