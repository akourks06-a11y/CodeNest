// ========================================
// CODENEST - DATA MANAGEMENT
// ========================================

class DataManager {
    constructor() {
        this.initializeData();
    }

    // Initialize default data if not exists
    initializeData() {
        if (!localStorage.getItem('languages')) {
            this.saveLanguages([]);
        }

        if (!localStorage.getItem('courses')) {
            this.saveCourses([]);
        }

        if (!localStorage.getItem('comments')) {
            localStorage.setItem('comments', JSON.stringify([]));
        }

        if (!localStorage.getItem('socialLinks')) {
            const defaultSocial = [
                {
                    id: 'twitter',
                    name: 'Twitter',
                    url: '#',
                    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>'
                },
                {
                    id: 'github',
                    name: 'GitHub',
                    url: '#',
                    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>'
                }
            ];
            this.saveSocialLinks(defaultSocial);
        }

        if (!localStorage.getItem('siteStats')) {
            this.saveSiteStats({ totalVisits: 0, pageViews: {} });
        }

        if (!localStorage.getItem('siteSettings')) {
            const defaultSettings = {
                identity: {
                    siteName: 'CodeNest',
                    logotext: 'CodeNest'
                },
                theme: {
                    primaryColor: '#2563eb', // HSL 221
                    secondaryColor: '#3b82f6', // HSL 217
                    fontFamily: 'Inter'
                },
                features: {
                    darkMode: true,
                    animations: true
                },
                ads: {
                    headerAd: { enabled: false, imageUrl: '', linkUrl: '' },
                    sidebarAd: { enabled: false, imageUrl: '', linkUrl: '' }
                }
            };
            this.saveSiteSettings(defaultSettings);
        }
    }

    // Languages
    getLanguages() {
        return JSON.parse(localStorage.getItem('languages')) || [];
    }

    saveLanguages(languages) {
        localStorage.setItem('languages', JSON.stringify(languages));
    }

    getLanguageById(id) {
        const languages = this.getLanguages();
        return languages.find(lang => lang.id === id);
    }

    addLanguage(language) {
        const languages = this.getLanguages();
        language.id = this.generateId('lang');
        language.courseCount = 0;
        languages.push(language);
        this.saveLanguages(languages);
        return language;
    }

    updateLanguage(id, updatedData) {
        const languages = this.getLanguages();
        const index = languages.findIndex(lang => lang.id === id);
        if (index !== -1) {
            languages[index] = { ...languages[index], ...updatedData };
            this.saveLanguages(languages);
            return languages[index];
        }
        return null;
    }

    deleteLanguage(id) {
        const languages = this.getLanguages();
        const filtered = languages.filter(lang => lang.id !== id);
        this.saveLanguages(filtered);
        // Also delete associated courses
        const courses = this.getCourses();
        const filteredCourses = courses.filter(course => course.languageId !== id);
        this.saveCourses(filteredCourses);
    }

    // Courses
    getCourses() {
        return JSON.parse(localStorage.getItem('courses')) || [];
    }

    saveCourses(courses) {
        localStorage.setItem('courses', JSON.stringify(courses));
    }

    getCourseById(id) {
        const courses = this.getCourses();
        return courses.find(course => course.id === id);
    }

    getCoursesByLanguage(languageId) {
        const courses = this.getCourses();
        return courses.filter(course => course.languageId === languageId);
    }

    addCourse(course) {
        const courses = this.getCourses();
        course.id = this.generateId('course');
        course.rating = 0;
        course.totalRatings = 0;
        course.lessons = course.lessons || [];
        courses.push(course);
        this.saveCourses(courses);
        this.updateLanguageCourseCount(course.languageId);
        return course;
    }

    updateCourse(id, updatedData) {
        const courses = this.getCourses();
        const index = courses.findIndex(course => course.id === id);
        if (index !== -1) {
            courses[index] = { ...courses[index], ...updatedData };
            this.saveCourses(courses);
            return courses[index];
        }
        return null;
    }

    deleteCourse(id) {
        const courses = this.getCourses();
        const course = this.getCourseById(id);
        const filtered = courses.filter(c => c.id !== id);
        this.saveCourses(filtered);
        if (course) {
            this.updateLanguageCourseCount(course.languageId);
        }
    }

    getLessonById(courseId, lessonId) {
        const course = this.getCourseById(courseId);
        if (course && course.lessons) {
            return course.lessons.find(l => l.id === lessonId);
        }
        return null;
    }

    updateLanguageCourseCount(languageId) {
        const courses = this.getCoursesByLanguage(languageId);
        const language = this.getLanguageById(languageId);
        if (language) {
            language.courseCount = courses.length;
            this.updateLanguage(languageId, language);
        }
    }

    // Comments
    getComments() {
        return JSON.parse(localStorage.getItem('comments')) || [];
    }

    saveComments(comments) {
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    getCommentsByCourse(courseId) {
        const comments = this.getComments();
        return comments.filter(comment => comment.courseId === courseId);
    }

    addComment(comment) {
        const comments = this.getComments();
        comment.id = this.generateId('comment');
        comment.timestamp = new Date().toISOString();
        comment.replies = comment.replies || [];
        comments.push(comment);
        this.saveComments(comments);
        return comment;
    }

    addReply(commentId, reply) {
        const comments = this.getComments();
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
            reply.id = this.generateId('reply');
            reply.timestamp = new Date().toISOString();
            reply.isAdmin = true;
            comment.replies.push(reply);
            this.saveComments(comments);
            return reply;
        }
        return null;
    }

    deleteComment(id) {
        const comments = this.getComments();
        const filtered = comments.filter(comment => comment.id !== id);
        this.saveComments(filtered);
    }

    // Ratings
    addRating(courseId, rating) {
        const course = this.getCourseById(courseId);
        if (course) {
            const currentTotal = course.rating * course.totalRatings;
            course.totalRatings += 1;
            course.rating = (currentTotal + rating) / course.totalRatings;
            course.rating = Math.round(course.rating * 10) / 10;
            this.updateCourse(courseId, course);
            return course;
        }
        return null;
    }

    // Utilities
    generateId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // User Features (Progress, Favorites)
    getUserProgress() {
        return JSON.parse(localStorage.getItem('userProgress')) || { completedLessons: [], completedCourses: [] };
    }

    saveUserProgress(progress) {
        localStorage.setItem('userProgress', JSON.stringify(progress));
    }

    markLessonComplete(lessonId, courseId) {
        const progress = this.getUserProgress();
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            this.saveUserProgress(progress);
        }

        // Check if course is complete
        const course = this.getCourseById(courseId);
        if (course) {
            const allLessonsComplete = course.lessons.every(l => progress.completedLessons.includes(l.id));
            if (allLessonsComplete && !progress.completedCourses.includes(courseId)) {
                progress.completedCourses.push(courseId);
                this.saveUserProgress(progress);
                return true; // Course just completed
            }
        }
        return false;
    }

    isLessonComplete(lessonId) {
        return this.getUserProgress().completedLessons.includes(lessonId);
    }

    getFavorites() {
        return JSON.parse(localStorage.getItem('userFavorites')) || [];
    }

    toggleFavorite(courseId) {
        let favorites = this.getFavorites();
        if (favorites.includes(courseId)) {
            favorites = favorites.filter(id => id !== courseId);
        } else {
            favorites.push(courseId);
        }
        localStorage.setItem('userFavorites', JSON.stringify(favorites));
        return favorites.includes(courseId);
    }

    isFavorite(courseId) {
        return this.getFavorites().includes(courseId);
    }

    // Ratings
    hasUserRated(courseId) {
        const ratedCourses = JSON.parse(localStorage.getItem('userRatedCourses')) || [];
        return ratedCourses.includes(courseId);
    }

    rateCourse(courseId, rating) {
        if (this.hasUserRated(courseId)) return null;

        const course = this.addRating(courseId, rating); // Existing method
        if (course) {
            const ratedCourses = JSON.parse(localStorage.getItem('userRatedCourses')) || [];
            ratedCourses.push(courseId);
            localStorage.setItem('userRatedCourses', JSON.stringify(ratedCourses));
        }
        return course;
    }

    // Statistics
    getStats() {
        const languages = this.getLanguages();
        const comments = this.getComments();
        const siteStats = this.getSiteStats();
        // Calculate total real courses
        const courses = this.getCourses();

        // Calculate total lessons across all courses
        const totalLessons = courses.reduce((sum, course) => {
            return sum + (course.lessons ? course.lessons.length : 0);
        }, 0);

        return {
            totalLanguages: languages.length,
            totalCourses: courses.length,
            totalLessons: totalLessons,
            totalComments: comments.length,
            avgRating: this.calculateAverageRating(),
            totalVisits: siteStats.totalVisits || 0
        };
    }

    calculateAverageRating() {
        const courses = this.getCourses();
        if (courses.length === 0) return 0;

        const totalRating = courses.reduce((sum, course) => sum + course.rating, 0);
        return Math.round((totalRating / courses.length) * 10) / 10;
    }

    // Social Media
    getSocialLinks() {
        return JSON.parse(localStorage.getItem('socialLinks')) || [];
    }

    saveSocialLinks(links) {
        localStorage.setItem('socialLinks', JSON.stringify(links));
    }

    addSocialLink(link) {
        const links = this.getSocialLinks();
        link.id = this.generateId('social');
        links.push(link);
        this.saveSocialLinks(links);
        return link;
    }

    updateSocialLink(id, updatedData) {
        const links = this.getSocialLinks();
        const index = links.findIndex(link => link.id === id);
        if (index !== -1) {
            links[index] = { ...links[index], ...updatedData };
            this.saveSocialLinks(links);
            return links[index];
        }
        return null;
    }

    deleteSocialLink(id) {
        const links = this.getSocialLinks();
        const filtered = links.filter(link => link.id !== id);
        this.saveSocialLinks(filtered);
    }

    // Site Stats
    getSiteStats() {
        return JSON.parse(localStorage.getItem('siteStats')) || { totalVisits: 0, pageViews: {} };
    }

    saveSiteStats(stats) {
        localStorage.setItem('siteStats', JSON.stringify(stats));
    }

    // Site Settings
    getSiteSettings() {
        return JSON.parse(localStorage.getItem('siteSettings')) || {
            identity: { siteName: 'CodeNest', logotext: 'CodeNest' },
            theme: { primaryColor: '#2563eb', secondaryColor: '#3b82f6', fontFamily: 'Inter' },
            features: { darkMode: true, animations: true },
            ads: {
                headerAd: { enabled: false, imageUrl: '', linkUrl: '' },
                sidebarAd: { enabled: false, imageUrl: '', linkUrl: '' }
            }
        };
    }

    saveSiteSettings(settings) {
        localStorage.setItem('siteSettings', JSON.stringify(settings));
    }

    incrementVisit() {
        const stats = this.getSiteStats();
        stats.totalVisits = (stats.totalVisits || 0) + 1;
        this.saveSiteStats(stats);
        return stats.totalVisits;
    }
}

// Export instance
const dataManager = new DataManager();
