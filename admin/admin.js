// ========================================
// ADMIN DASHBOARD JAVASCRIPT
// ========================================

// Check authentication
if (!sessionStorage.getItem('adminLoggedIn')) {
    window.location.href = 'login.html';
}

function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

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
    loadSocialMediaTable();
    loadSiteSettings(); // Added this line
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
    const statsGrid = document.getElementById('dashboard-stats-grid');
    if (!statsGrid) return;

    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon" style="background: rgba(37, 99, 235, 0.1); color: var(--color-primary);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                </div>
            </div>
            <div class="stat-card-value">${stats.totalCourses}</div>
            <div class="stat-card-label">Total Courses</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--color-success);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                </div>
            </div>
            <div class="stat-card-value">${stats.totalLessons}</div>
            <div class="stat-card-label">Total Lessons</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--color-warning);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-13.5 8.38 8.38 0 0 1 3.8.9L21 11.5z"></path>
                    </svg>
                </div>
            </div>
            <div class="stat-card-value">${stats.totalComments}</div>
            <div class="stat-card-label">Total Comments</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
            </div>
            <div class="stat-card-value">${stats.totalVisits}</div>
            <div class="stat-card-label">Total Site Visits</div>
        </div>
    `;
}

// Social Media Management
function loadSocialMediaTable() {
    const links = dataManager.getSocialLinks();
    const tbody = document.querySelector('#socialTable tbody');

    if (links.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                    No social media links found. Add your first link!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = links.map(link => `
        <tr>
            <td><span class="table-icon" style="color: black;">${link.icon}</span></td>
            <td><strong>${link.name}</strong></td>
            <td><a href="${link.url}" target="_blank" style="color: var(--color-primary);">${link.url}</a></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-edit" onclick="editSocialLink('${link.id}')" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteSocialLink('${link.id}')" title="Delete">
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

function showAddSocialLinkModal() {
    const modal = createModal('Add Social Media Link', `
        <div class="form-group">
            <label class="form-label">Platform Name</label>
            <input type="text" class="form-input" id="socialName" placeholder="e.g., Instagram">
        </div>
        <div class="form-group">
            <label class="form-label">URL</label>
            <input type="url" class="form-input" id="socialUrl" placeholder="https://...">
        </div>
        <div class="form-group">
            <label class="form-label">Icon (SVG Code)</label>
            <textarea class="form-textarea" id="socialIcon" rows="3" placeholder="Paste SVG code here..."></textarea>
        </div>
    `, [
        { text: 'Cancel', class: 'btn-secondary', onClick: closeModal },
        { text: 'Add Link', class: 'btn-primary', onClick: saveNewSocialLink }
    ]);

    showModal(modal);
}

function saveNewSocialLink() {
    const name = document.getElementById('socialName').value.trim();
    const url = document.getElementById('socialUrl').value.trim();
    const icon = document.getElementById('socialIcon').value.trim();

    if (!name || !url || !icon) {
        alert('Please fill in all fields');
        return;
    }

    dataManager.addSocialLink({ name, url, icon });
    loadSocialMediaTable();
    closeModal();
    showNotification('Social link added successfully!', 'success');
}

function editSocialLink(id) {
    const links = dataManager.getSocialLinks();
    const link = links.find(l => l.id === id);

    if (!link) return;

    const modal = createModal('Edit Social Media Link', `
        <div class="form-group">
            <label class="form-label">Platform Name</label>
            <input type="text" class="form-input" id="socialName" value="${link.name}">
        </div>
        <div class="form-group">
            <label class="form-label">URL</label>
            <input type="url" class="form-input" id="socialUrl" value="${link.url}">
        </div>
        <div class="form-group">
            <label class="form-label">Icon (SVG Code)</label>
            <textarea class="form-textarea" id="socialIcon" rows="3">${link.icon}</textarea>
        </div>
    `, [
        { text: 'Cancel', class: 'btn-secondary', onClick: closeModal },
        { text: 'Save Changes', class: 'btn-primary', onClick: () => updateSocialLink(id) }
    ]);

    showModal(modal);
}

function updateSocialLink(id) {
    const name = document.getElementById('socialName').value.trim();
    const url = document.getElementById('socialUrl').value.trim();
    const icon = document.getElementById('socialIcon').value.trim();

    if (!name || !url || !icon) {
        alert('Please fill in all fields');
        return;
    }

    dataManager.updateSocialLink(id, { name, url, icon });
    loadSocialMediaTable();
    closeModal();
    showNotification('Social link updated successfully!', 'success');
}

function deleteSocialLink(id) {
    if (confirm('Are you sure you want to delete this social link?')) {
        dataManager.deleteSocialLink(id);
        loadSocialMediaTable();
        showNotification('Social link deleted successfully!', 'success');
    }
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
