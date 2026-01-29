# Lessons Folder - PDF Files

## Purpose
This folder contains all PDF lesson files for the CodeNest platform.

## Organization
PDFs should be organized by language and course. Use the following naming convention:

```
{language-id}_{course-id}_{lesson-number}.pdf
```

Example:
- `javascript_fundamentals_01.pdf` - JavaScript Fundamentals, Lesson 1
- `python_beginners_01.pdf` - Python for Beginners, Lesson 1
- `html_basics_01.pdf` - HTML Fundamentals, Lesson 1

## How to Add PDF Lessons

1. Create your lesson content as a PDF
2. Name it following the convention above
3. Place it in this folder
4. Update the course data in `js/data.js` to reference the PDF:

```javascript
lessons: [
    {
        id: '1',
        title: 'Introduction to JavaScript',
        pdfFile: 'javascript_fundamentals_01.pdf'  // Reference the PDF file
    }
]
```

## Notes

- PDFs will be displayed in a protected viewer that prevents easy downloading
- Users can still read and learn from the content
- Maximum recommended file size: 10MB per PDF
- Ensure PDFs are optimized for web viewing

## Sample PDF Content

For testing purposes, you can create simple PDFs using:
- Google Docs → File → Download → PDF
- Microsoft Word → Save As → PDF
- Online PDF creators
- Programming course content from authorized sources

## Security

The platform implements several protections:
- Disabled right-click on PDF viewer
- Disabled text selection and copying
- Hidden direct download button
- PDF loaded dynamically without exposing direct path

Remember: Complete protection is not possible, but these measures deter casual users from downloading content.
