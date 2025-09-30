#!/usr/bin/env node

/**
 * Simple Node.js server for AI Intersections article management
 * 
 * This script provides a production-ready backend for:
 * 1. Creating new articles
 * 2. Managing the articles index
 * 3. Serving the website
 * 
 * Usage:
 * 1. Install dependencies: npm install express multer fs-extra
 * 2. Run: node server.js
 * 3. Access admin at: http://localhost:3000/simple-admin.html
 */

const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./')); // Serve static files from current directory

// API endpoint to create a new article
app.post('/api/articles', async (req, res) => {
    try {
        const { title, date, category, excerpt, content } = req.body;
        
        // Validate required fields
        if (!title || !date || !category || !excerpt || !content) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Generate unique article ID
        const timestamp = Date.now();
        const articleId = `article-${timestamp}`;
        
        // Format the content
        const formattedContent = formatContent(content);
        const formattedDate = formatDate(date);
        
        // Generate HTML content
        const htmlContent = generateArticleHTML({
            title,
            date: formattedDate,
            category,
            content: formattedContent
        });
        
        // Write HTML file
        const htmlFilePath = path.join(__dirname, 'articles', `${articleId}.html`);
        await fs.writeFile(htmlFilePath, htmlContent);
        
        // Update index.json
        const indexPath = path.join(__dirname, 'articles', 'index.json');
        let articles = [];
        
        try {
            const indexContent = await fs.readFile(indexPath, 'utf8');
            articles = JSON.parse(indexContent);
        } catch (error) {
            // File doesn't exist or is invalid, start with empty array
            articles = [];
        }
        
        // Add new article to the beginning
        const newArticle = {
            id: articleId,
            title,
            date,
            category,
            excerpt,
            fileName: `articles/${articleId}.html`,
            timestamp
        };
        
        articles.unshift(newArticle);
        
        // Write updated index
        await fs.writeFile(indexPath, JSON.stringify(articles, null, 2));
        
        res.json({ 
            success: true, 
            message: 'Article created successfully',
            articleId,
            fileName: `${articleId}.html`
        });
        
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Failed to create article' });
    }
});

// API endpoint to get all articles
app.get('/api/articles', async (req, res) => {
    try {
        const indexPath = path.join(__dirname, 'articles', 'index.json');
        const indexContent = await fs.readFile(indexPath, 'utf8');
        const articles = JSON.parse(indexContent);
        res.json(articles);
    } catch (error) {
        res.json([]); // Return empty array if file doesn't exist
    }
});

// Helper functions
function formatContent(content) {
    // If content doesn't contain HTML tags, auto-format as paragraphs
    if (!/<[^>]+>/.test(content)) {
        return content.split('\n\n')
            .map(p => p.trim())
            .filter(p => p)
            .map(p => `<p>${escapeHtml(p)}</p>`)
            .join('\n');
    }
    return content;
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function generateArticleHTML(data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(data.title)} - AI Intersections</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body class="article-page">
    <nav>
        <div class="nav-container">
            <a href="../index.html" class="nav-logo">AI Intersections</a>
            <ul class="nav-menu">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../updates.html">Updates</a></li>
                <li><a href="../guides.html">Guides</a></li>
                <li><a href="../tech-news.html">Tech News</a></li>
            </ul>
        </div>
    </nav>

    <div class="container">
        <main class="main-content">
            <div class="back-nav">
                <a href="../tech-news.html" class="back-link">← Back to Tech News</a>
            </div>

            <div class="article-header">
                <div class="article-meta">
                    <span class="article-date">${data.date}</span>
                    <span class="article-category">${escapeHtml(data.category)}</span>
                </div>
                <h1>${escapeHtml(data.title)}</h1>
            </div>

            <div class="article-body">
                ${data.content}
            </div>
        </main>
    </div>

    <script>
        let lastScrollTop = 0;
        const nav = document.querySelector('nav');
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    </script>
</body>
</html>`;
}

// Ensure articles directory exists
fs.ensureDirSync(path.join(__dirname, 'articles'));

// Start server
app.listen(PORT, () => {
    console.log(`AI Intersections server running at http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/simple-admin.html`);
});

module.exports = app;