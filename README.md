# AI Intersections

Website about the intersection of AI and other fields - a production-ready platform for publishing AI-related articles and news.

## Fixed Issues

The original workflow had several critical problems that have been resolved:

### Previous Issues:
- **Complex workflow**: Upload CSV → Download HTML → Move files → Download index.json → Move files → Redeploy
- **LocalStorage dependency**: Used temporary browser storage (not production-ready)
- **Manual file management**: Required error-prone manual file operations
- **Duplicate entries**: Multiple duplicate articles in index.json
- **Security issues**: Hardcoded passwords in plain text
- **No server integration**: Purely client-side with no backend validation

### New Simplified Solution:

## Two Deployment Options

### Option 1: Static Site (Client-Side)
Perfect for GitHub Pages, Netlify, or other static hosting:

1. Access admin at: `your-site.com/admin-panel.html`
2. Use password: `AI2025admin`
3. Fill out the simple form
4. Download the generated HTML file and index.json
5. Upload files to your hosting provider

### Option 2: Server-Powered (Recommended for Production)
Full automation with no manual file handling:

1. Install dependencies: `npm install`
2. Start server: `npm start`
3. Access admin at: `http://localhost:3000/admin-panel.html`
4. Use password: `AI2025admin`
5. Create articles - they appear immediately!

## Features

✅ **Simple Form Interface**: Clean, intuitive article creation form  
✅ **Live Preview**: See exactly how your article will look  
✅ **Auto-formatting**: Converts plain text to HTML paragraphs  
✅ **Server Detection**: Automatically uses server mode when available  
✅ **Production Ready**: No temporary storage, proper file management  
✅ **Mobile Responsive**: Works on all devices  
✅ **SEO Optimized**: Proper meta tags and semantic HTML  

## File Structure

```
/
├── index.html              # Homepage
├── tech-news.html          # Article listing page
├── admin-panel.html        # New simplified admin interface
├── server.js               # Optional Node.js backend
├── package.json            # Server dependencies
├── styles.css              # All styling
└── articles/
    ├── index.json          # Article metadata
    ├── article-1.html      # Sample articles
    ├── article-2.html
    └── ...
```

## Creating Articles

### Fields Required:
- **Title**: Article headline
- **Date**: Publication date
- **Category**: Technology, Research, Industry, Policy, or Business
- **Excerpt**: Brief description (2-3 sentences)
- **Content**: Full article (HTML or plain text)

### Content Tips:
- Use HTML tags like `<h3>`, `<p>`, `<strong>` for formatting
- Or write plain text - the system auto-formats paragraphs
- Preview before publishing
- Content is automatically escaped for security

## Deployment

### Static Hosting (Netlify, GitHub Pages, etc.):
1. Upload all files to your hosting provider
2. Access `/admin-panel.html` to create articles
3. Download generated files and upload to `/articles/` folder

### Server Hosting (VPS, Heroku, etc.):
1. Install Node.js 14+
2. Run `npm install`
3. Run `npm start`
4. Articles are automatically saved and appear immediately

## Security

- Admin password should be changed from default `AI2025admin`
- In production, implement proper authentication
- All user input is escaped to prevent XSS
- Server validates all fields before saving

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers fully supported
- Graceful degradation for older browsers

---

This new system eliminates the tedious multi-step workflow and provides a production-ready solution for managing articles efficiently.
