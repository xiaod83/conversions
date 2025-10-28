# Conversions Studio

A modern static website featuring student-written STEM articles and guides. Built with clean HTML, CSS, and JavaScript, optimized for Vercel deployment.

## 🎨 Design Features

### Visual Design
- **Clean, editorial design** with warm cream background and monospace typography
- **Responsive navigation** that hides on scroll for better reading experience
- **Modern card layouts** for articles and series
- **Custom styling** using Consolas/Courier New monospace fonts
- **Professional color palette** with orange accents and warm tones

## 🚀 Getting Started

### Local Development
Run a local server to preview the site:

```bash
# Using Python (Mac/Linux)
npm run dev

# Using Python (Windows)
npm run dev:win

# Or use any static file server
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## 📝 Content Management with Decap CMS

The site includes Decap CMS (formerly Netlify CMS) for content management:

1. Access the admin panel at `/admin/` when deployed
2. Configure GitHub OAuth for authentication (see Decap CMS docs)
3. Edit the `admin/config.yml` file to customize collections and fields

**Note:** Decap CMS requires proper authentication setup to commit changes. See the [Decap CMS documentation](https://decapcms.org/docs/authentication-backends/) for setup instructions.

## 🚀 Deploying to Vercel

This site is optimized for Vercel deployment:

### Quick Deploy Steps

1. **Push to GitHub**: Ensure your code is in a GitHub repository
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will automatically detect it as a static site

3. **Deploy**: Click "Deploy" - no build configuration needed!

### Automatic Deployments
- Every push to `main` branch triggers a new deployment
- Pull requests create preview deployments
- No build step required (pure static site)

### Custom Domain (Optional)
1. In Vercel dashboard, go to your project settings
2. Click "Domains"
3. Add your custom domain and follow DNS setup instructions

## 📁 Project Structure

```
conversions/
├── index.html              # Homepage
├── about.html              # About page
├── styles.css              # Global styles
├── series/                 # Article series
│   ├── index.html          # Series overview
│   ├── boot-sequence/      # PC hardware series
│   ├── orthopedics/        # Medical series
│   └── sat/                # SAT prep series
├── admin/                  # Decap CMS admin panel
│   ├── index.html
│   └── config.yml
├── logos/                  # Site logos and images
├── vercel.json             # Vercel configuration
└── package.json            # Project metadata
```

## 🎯 Content Structure

### Series
The site organizes content into series:
- **Boot Sequence**: PC hardware, building, and maintenance
- **Orthopedics**: Practical musculoskeletal health primers
- **SAT**: Test prep tips and strategies

Each series has its own directory with an index page listing all articles.

## 🛠 Technical Details

- **Pure Static Site**: No build process, no server-side code
- **Vanilla JavaScript**: No frameworks, lightweight and fast
- **Responsive Design**: Works on all device sizes
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Fast Loading**: Optimized assets and minimal dependencies

## 📝 Adding Content

### Manual Method
1. Create a new HTML file in the appropriate series directory
2. Follow the existing article template structure
3. Update the series index.html to link to your new article
4. Commit and push to deploy

### Using Decap CMS (Recommended)
1. Set up GitHub OAuth authentication
2. Access `/admin/` on your deployed site
3. Use the visual editor to create and manage content

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT License - see repository for details.

## 👤 Author

xiaod83

## 🔗 Repository

https://github.com/xiaod83/conversions

## 🚀 Getting Started

### Quick Start (Static)
1. Download/clone the repository
2. Run `start-dev.bat` (Windows) or `start-dev.sh` (Mac/Linux)
3. Open http://localhost:8000 in your browser

### Production Server
1. Install dependencies: `npm install`
2. Start server: `npm start`
3. Access admin at: http://localhost:3000/admin-panel.html

## 📝 Content Management

### Creating Articles
1. Go to `/admin-panel.html`
2. Enter password: `AI2025admin`
3. Fill out the intuitive form
4. Preview your article
5. Publish instantly (server mode) or download files (static mode)

### Features
✅ **Modern Admin Interface** - Dark theme with intuitive forms  
✅ **Live Preview** - See exactly how articles will look  
✅ **Auto-formatting** - Converts plain text to HTML  
✅ **Server Detection** - Automatically chooses best mode  
✅ **Mobile Responsive** - Works perfectly on all devices  

## 🎯 Design Philosophy

This design deliberately avoids the typical "AI website" look by:

- **Using dark themes** instead of bright, sterile whites
- **Implementing unique animations** rather than generic fade-ins
- **Custom color palettes** instead of default blues and grays
- **Interesting layouts** with asymmetrical elements
- **Personality** through custom fonts and interactive details
- **Technical aesthetics** that reflect the subject matter

## 📁 File Structure

```
/
├── index.html              # Homepage with feature cards
├── tech-news.html          # Article grid with modern cards
├── admin-panel.html        # Dark-themed admin interface
├── styles.css              # Complete redesign with dark theme
├── server.js               # Optional Node.js backend
├── start-dev.bat/.sh       # Development server launchers
└── articles/
    ├── index.json          # Article metadata
    └── *.html              # Individual articles
```

## 🎨 Color Palette

```css
--primary: #6366f1        /* Primary purple */
--secondary: #ec4899      /* Pink accent */
--accent: #06b6d4         /* Cyan highlights */
--background: #0f0f23     /* Deep dark background */
--surface: #1a1a2e        /* Card backgrounds */
--text-primary: #e2e8f0   /* Main text */
--text-accent: #fbbf24    /* Highlight text */
```

## 🌐 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Experience

The design is fully responsive with:
- Collapsible navigation for mobile
- Touch-friendly interactions
- Optimized typography scaling
- Simplified layouts for small screens
- Maintained visual hierarchy

---

**Previous Issues Fixed:**
- ❌ Plain, generic styling → ✅ Unique, modern dark design
- ❌ Complex upload workflow → ✅ Simple one-form process  
- ❌ LocalStorage dependency → ✅ Proper file management
- ❌ Manual file handling → ✅ Automated system

This new design provides a distinctive, modern experience that reflects the cutting-edge nature of AI technology while maintaining excellent usability and performance.

## Vercel deployment

This repository is a static site and is configured to deploy cleanly on Vercel.

- A `vercel.json` is included and forces Vercel to treat the project as a static deployment (`@vercel/static`).
- A `.vercelignore` file is included to avoid uploading local/dev artifacts.

Quick steps to deploy:

1. Push this repository to GitHub (or another supported Git provider).
2. In the Vercel dashboard, "Import Project" → select this repository.
3. Accept the defaults. The `vercel.json` will ensure Vercel serves the repository as a static site.
4. For a custom domain: add it in the Vercel dashboard. The `CNAME` file in this repo is only informational — configure the domain in Vercel instead of relying on the file.

Notes:
- There is no build step required — the site is plain HTML/CSS/JS in the repo root.
- If you add a build process later (Svelte/Next/etc.), update `vercel.json` and the `build` script in `package.json` accordingly.

