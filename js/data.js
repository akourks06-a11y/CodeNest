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
            const defaultLanguages = [
                {
                    id: 'html',
                    name: 'HTML',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-3z"/><path d="M8 11h8M8 15h5"/></svg>',
                    description: 'Learn the structure of web pages with HTML',
                    courseCount: 5
                },
                {
                    id: 'css',
                    name: 'CSS',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l-8 3v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5l-8-3z"/><circle cx="12" cy="12" r="3"/></svg>',
                    description: 'Master styling and design with CSS',
                    courseCount: 6
                },
                {
                    id: 'javascript',
                    name: 'JavaScript',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M8 12h8M12 8v8"/></svg>',
                    description: 'Build interactive web applications',
                    courseCount: 8
                },
                {
                    id: 'python',
                    name: 'Python',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c-2.5 0-4.5 2-4.5 4.5v1c0 .8.7 1.5 1.5 1.5h6c.8 0 1.5.7 1.5 1.5v1c0 2.5-2 4.5-4.5 4.5s-4.5 2-4.5 4.5v1c0 .8.7 1.5 1.5 1.5h6c.8 0 1.5-.7 1.5-1.5v-1c0-2.5 2-4.5 4.5-4.5"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="18" r="1"/></svg>',
                    description: 'Learn versatile programming with Python',
                    courseCount: 10
                },
                {
                    id: 'react',
                    name: 'React',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><path d="M12 2C8 2 4 4 4 6c0 2 4 4 8 4s8-2 8-4c0-2-4-4-8-4z"/><path d="M12 14c-4 0-8 2-8 4s4 4 8 4 8-2 8-4-4-4-8-4z"/><path d="M17 5c2 3.5 3 7 1 10-2 3-6 3-9 1s-4-6-2-9c2-3.5 6-3.5 10-2z"/></svg>',
                    description: 'Create modern user interfaces with React',
                    courseCount: 7
                },
                {
                    id: 'nodejs',
                    name: 'Node.js',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/><path d="M12 12v5M8 9.5L12 12l4-2.5"/></svg>',
                    description: 'Build server-side applications with Node.js',
                    courseCount: 6
                }
            ];
            this.saveLanguages(defaultLanguages);
        }

        if (!localStorage.getItem('courses')) {
            const defaultCourses = [
                // HTML Courses
                {
                    id: 'html-basics',
                    languageId: 'html',
                    title: 'HTML Fundamentals',
                    description: 'Learn the basics of HTML including tags, elements, and structure',
                    level: 'Beginner',
                    rating: 4.8,
                    totalRatings: 245,
                    lessons: [
                        {
                            id: 'lesson-1',
                            title: 'Introduction to HTML',
                            content: `# Introduction to HTML

## What is HTML?

HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of web pages using markup.

## Basic Structure

Every HTML document follows this basic structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
</body>
</html>
\`\`\`

## Key Concepts

- **Elements**: Building blocks of HTML (e.g., <p>, <h1>, <div>)
- **Tags**: Used to create elements (opening and closing tags)
- **Attributes**: Provide additional information about elements

## Your First HTML Page

Let's create a simple HTML page:

1. Open a text editor
2. Create a new file called \`index.html\`
3. Copy the basic structure above
4. Save the file
5. Open it in a web browser

Congratulations! You've created your first HTML page.`
                        },
                        {
                            id: 'lesson-2',
                            title: 'HTML Elements and Tags',
                            content: `# HTML Elements and Tags

## Understanding Elements

HTML elements are the building blocks of HTML pages. An element usually consists of a start tag, content, and an end tag.

## Common HTML Elements

### Headings
\`\`\`html
<h1>Main Heading</h1>
<h2>Subheading</h2>
<h3>Section Heading</h3>
\`\`\`

### Paragraphs
\`\`\`html
<p>This is a paragraph of text.</p>
\`\`\`

### Links
\`\`\`html
<a href="https://example.com">Click here</a>
\`\`\`

### Images
\`\`\`html
<img src="image.jpg" alt="Description">
\`\`\`

## Practice Exercise

Create a simple webpage about yourself using these elements!`
                        }
                    ]
                },
                {
                    id: 'html-advanced',
                    languageId: 'html',
                    title: 'Advanced HTML5',
                    description: 'Explore semantic HTML, forms, and modern HTML5 features',
                    level: 'Advanced',
                    rating: 4.7,
                    totalRatings: 189,
                    lessons: [
                        {
                            id: 'lesson-1',
                            title: 'Semantic HTML',
                            content: `# Semantic HTML

## Why Semantics Matter

Semantic HTML uses meaningful tags that describe the content they contain, making your code more readable and accessible.

## Semantic Elements

### Structure Elements
\`\`\`html
<header>Site header</header>
<nav>Navigation</nav>
<main>Main content</main>
<article>Article content</article>
<section>Content section</section>
<aside>Sidebar content</aside>
<footer>Site footer</footer>
\`\`\`

## Benefits

- Better SEO
- Improved accessibility
- Easier maintenance
- Clearer code structure`
                        }
                    ]
                },
                // JavaScript Courses
                {
                    id: 'js-basics',
                    languageId: 'javascript',
                    title: 'JavaScript Fundamentals',
                    description: 'Master the basics of JavaScript programming',
                    level: 'Beginner',
                    rating: 4.9,
                    totalRatings: 567,
                    lessons: [
                        {
                            id: 'lesson-1',
                            title: 'Introduction to JavaScript',
                            content: `# Introduction to JavaScript

## What is JavaScript?

JavaScript is a programming language that enables interactive web pages. It's an essential part of web applications.

## Your First JavaScript Code

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

## Variables

\`\`\`javascript
let name = 'John';
const age = 25;
var city = 'New York';
\`\`\`

## Data Types

- String: \`'Hello'\`
- Number: \`42\`
- Boolean: \`true\` or \`false\`
- Array: \`[1, 2, 3]\`
- Object: \`{name: 'John', age: 25}\`

## Getting Started

Open your browser's developer console and try these examples!`
                        }
                    ]
                },
                {
                    id: 'js-intermediate',
                    languageId: 'javascript',
                    title: 'JavaScript Functions & Objects',
                    description: 'Deep dive into functions, objects, and advanced concepts',
                    level: 'Intermediate',
                    rating: 4.8,
                    totalRatings: 432,
                    lessons: [
                        {
                            id: 'lesson-1',
                            title: 'Functions in JavaScript',
                            content: `# Functions in JavaScript

## What are Functions?

Functions are reusable blocks of code that perform specific tasks.

## Function Declaration

\`\`\`javascript
function greet(name) {
    return 'Hello, ' + name + '!';
}

console.log(greet('Alice'));
\`\`\`

## Arrow Functions

\`\`\`javascript
const greet = (name) => {
    return 'Hello, ' + name + '!';
};

// Shorter version
const greetShort = name => 'Hello, ' + name + '!';
\`\`\`

## Practice

Create a function that calculates the area of a rectangle!`
                        }
                    ]
                },
                // Python Courses
                {
                    id: 'python-basics',
                    languageId: 'python',
                    title: 'Python for Beginners',
                    description: 'Start your Python journey from scratch',
                    level: 'Beginner',
                    rating: 4.9,
                    totalRatings: 789,
                    lessons: [
                        {
                            id: 'lesson-1',
                            title: 'Getting Started with Python',
                            content: `# Getting Started with Python

## What is Python?

Python is a high-level, interpreted programming language known for its simplicity and readability.

## Your First Python Program

\`\`\`python
print("Hello, World!")
\`\`\`

## Variables and Data Types

\`\`\`python
name = "Alice"
age = 25
height = 5.6
is_student = True
\`\`\`

## Basic Operations

\`\`\`python
# Math
result = 10 + 5
print(result)

# Strings
greeting = "Hello, " + "World!"
print(greeting)
\`\`\`

## Try It!

Install Python and run these examples on your computer!`
                        }
                    ]
                }
            ];
            this.saveCourses(defaultCourses);
        }

        if (!localStorage.getItem('comments')) {
            localStorage.setItem('comments', JSON.stringify([]));
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

    // Statistics
    getStats() {
        const languages = this.getLanguages();
        const courses = this.getCourses();
        const comments = this.getComments();

        return {
            totalLanguages: languages.length,
            totalCourses: courses.length,
            totalComments: comments.length,
            avgRating: this.calculateAverageRating()
        };
    }

    calculateAverageRating() {
        const courses = this.getCourses();
        if (courses.length === 0) return 0;

        const totalRating = courses.reduce((sum, course) => sum + course.rating, 0);
        return Math.round((totalRating / courses.length) * 10) / 10;
    }
}

// Export instance
const dataManager = new DataManager();
