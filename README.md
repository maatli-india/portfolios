# Portfolios Repository

> Multi-site portfolio repository for hosting various websites (company sites, brands, products, and business portfolios) with organized folder structure and Netlify deployment.

---

## 📁 Repository Structure

This repository contains multiple independent websites, each in its own folder:

```
portfolios/
│
├── README.md                          ← You are here
│
├── acme-corp/                         ← Company website example
│   ├── README.md                      ← Site-specific documentation
│   ├── index.html
│   ├── assets/
│   └── ...
│
├── brand-x/                           ← Brand website
│   ├── README.md
│   ├── index.html
│   └── ...
│
├── product-y/                         ← Product landing page
│   ├── README.md
│   ├── index.html
│   └── ...
│
└── business-z/                        ← Business portfolio
    ├── README.md
    ├── index.html
    └── ...
```

---

## 🎯 Purpose

**Why one repository for multiple sites?**

✅ **Centralized Management:** All websites in one place  
✅ **Consistent Structure:** Same folder organization across sites  
✅ **Easy Deployment:** Each folder deploys separately to Netlify  
✅ **Shared Resources:** Reusable templates, scripts, components  
✅ **Version Control:** Track all sites in one Git history  
✅ **Team Collaboration:** Developers work in one repository  

---

## 🏗️ Standard Folder Structure

Each website folder follows this structure:

```
site-name/
│
├── README.md                          ← Site-specific documentation
├── index.html                         ← Homepage
├── about.html                         ← About page (if needed)
├── contact.html                       ← Contact page (if needed)
├── 404.html                           ← Custom error page
│
├── assets/                            ← All static assets
│   ├── css/                           ← Stylesheets
│   │   ├── main.css                  ← Global styles
│   │   ├── home.css                  ← Page-specific styles
│   │   └── responsive.css            ← Mobile/tablet styles
│   │
│   ├── js/                            ← JavaScript files
│   │   ├── main.js                   ← Common functions
│   │   └── contact-form.js           ← Form handling
│   │
│   ├── images/                        ← Images organized by type
│   │   ├── logo.png
│   │   ├── favicon.ico
│   │   ├── hero/
│   │   ├── team/
│   │   └── icons/
│   │
│   └── fonts/                         ← Custom fonts (optional)
│
├── docs/                              ← Downloadable documents (PDFs)
│
├── .gitignore                         ← Git ignore (optional per site)
├── _redirects                         ← Netlify redirects
├── robots.txt                         ← SEO configuration
└── sitemap.xml                        ← SEO sitemap
```

---

## 🚀 Adding a New Website

### Step 1: Create New Folder

```bash
# Navigate to repository root
cd portfolios/

# Create new site folder with standard structure
mkdir -p new-site/{assets/{css,js,images/{hero,team,icons},fonts},docs}

# Navigate to new site
cd new-site/
```

### Step 2: Create Essential Files

```bash
# Create HTML files
touch index.html about.html contact.html 404.html

# Create CSS files
touch assets/css/main.css assets/css/responsive.css

# Create JS files
touch assets/js/main.js

# Create config files
touch _redirects robots.txt sitemap.xml

# Create README from template
cp ../TEMPLATE-README.md ./README.md
# Edit README.md with site-specific information
```

### Step 3: Add Site-Specific Content

1. Edit `README.md` with site details
2. Add HTML content to pages
3. Style with CSS
4. Add images to `assets/images/`
5. Configure `_redirects` and `robots.txt`

### Step 4: Commit to Repository

```bash
# Stage files
git add .

# Commit with descriptive message
git commit -m "Add new site: [site-name]"

# Push to GitHub
git push origin main
```

---

## 🌐 Netlify Deployment

Each website folder deploys **separately** to Netlify with its own custom domain.

### Deployment Configuration

When deploying a site on Netlify:

1. **Go to Netlify Dashboard**
2. Click **"Add new site"** → **"Import from Git"**
3. Select this repository: `portfolios`
4. **Important:** Set **Base directory** to the site folder:
   ```
   Base directory: acme-corp/
   ```
5. Leave build settings empty (static HTML/CSS):
   ```
   Build command: [empty]
   Publish directory: [empty or "."]
   ```
6. Click **"Deploy"**
7. Configure custom domain in Netlify settings

### Example Deployments

| Folder | Netlify Base Directory | Domain | Status |
|--------|------------------------|--------|--------|
| `acme-corp/` | `acme-corp/` | acmecorp.com | ✅ Live |
| `brand-x/` | `brand-x/` | brandx.com | ✅ Live |
| `product-y/` | `product-y/` | producty.io | 🚧 Staging |
| `business-z/` | `business-z/` | businessz.net | ⏳ Pending |

**Key Point:** Netlify remembers the base directory, so future pushes auto-deploy!

---

## 👥 Team Workflow

### For Developers Working on a Site

```bash
# Clone repository (first time)
git clone https://github.com/yourusername/portfolios.git
cd portfolios/

# Navigate to your assigned site
cd acme-corp/

# Make changes
# Edit HTML/CSS/JS files

# Test locally
# Open index.html in browser
# Or use: python -m http.server 8000

# Commit and push
git add .
git commit -m "Update homepage hero section"
git push origin main

# Netlify auto-deploys in 1-2 minutes
```

### Working on Multiple Sites

```bash
# Switch between sites easily
cd ../brand-x/          # Switch to different site
# Make changes
git add .
git commit -m "Add new product page"
git push origin main
```

### Branch Strategy (Optional)

```bash
# Create feature branch for major changes
git checkout -b feature/acme-corp-redesign

# Make changes in acme-corp/ folder
# Commit changes
git add acme-corp/
git commit -m "Redesign homepage layout"

# Push branch
git push origin feature/acme-corp-redesign

# Create Pull Request on GitHub
# After review, merge to main
```

---

## 📋 Current Sites

### Active Websites

#### 1. Acme Corp
- **Folder:** `acme-corp/`
- **Domain:** acmecorp.com
- **Purpose:** Company website
- **Status:** ✅ Live
- **Last Updated:** 2026-03-18
- **Developer:** @johndoe

#### 2. Brand X
- **Folder:** `brand-x/`
- **Domain:** brandx.com
- **Purpose:** Brand showcase
- **Status:** ✅ Live
- **Last Updated:** 2026-03-15
- **Developer:** @janesmith

### Upcoming Sites

#### 3. Product Y
- **Folder:** `product-y/`
- **Domain:** producty.io
- **Purpose:** Product landing page
- **Status:** 🚧 In Development
- **Launch Date:** TBD
- **Developer:** @alexchen

---

## 🛠️ Development Guidelines

### File Naming Conventions

```
✅ Good:
home-hero.jpg
contact-form.js
main-navigation.css
about-us-section.html

❌ Bad:
IMG_1234.jpg
file1.js
styles_final_v2.css
page.html
```

**Rules:**
- Use lowercase
- Use hyphens (not underscores or spaces)
- Be descriptive
- Include context

### CSS Organization

Each site should have:
- `main.css` - Global styles (header, footer, typography)
- `[page].css` - Page-specific styles (e.g., `home.css`, `contact.css`)
- `responsive.css` - Mobile/tablet breakpoints

### JavaScript Organization

- `main.js` - Common functions (navigation, smooth scroll)
- `[feature].js` - Feature-specific (e.g., `contact-form.js`, `gallery.js`)

### Image Optimization

**Before adding images:**
- Compress JPG/PNG (use TinyPNG.com, Squoosh.app)
- Use WebP format when possible
- Target sizes:
  - Hero images: < 200KB
  - Content images: < 100KB
  - Icons: < 20KB (or use SVG)

### Commit Messages

```
✅ Good:
"Add contact form to homepage"
"Update hero image on about page"
"Fix navigation mobile menu bug"
"Optimize images for faster loading"

❌ Bad:
"update"
"fixes"
"changes"
"asdf"
```

**Format:**
```
[Action] [What] [Where]

Examples:
Add privacy policy page
Update hero section on homepage
Fix mobile menu overflow bug
Optimize logo and favicon images
```

---

## 🔧 Common Tasks

### Adding a New Page to Existing Site

```bash
# Navigate to site folder
cd acme-corp/

# Create new HTML page
touch services.html

# Create page-specific CSS
touch assets/css/services.css

# Edit index.html to add navigation link
# Edit services.html with content
# Add styles to assets/css/services.css

# Commit
git add .
git commit -m "Add services page to acme-corp"
git push origin main
```

### Updating Site Content

```bash
# Navigate to site
cd acme-corp/

# Edit HTML/CSS/JS files
# Test changes locally

# Commit with descriptive message
git add .
git commit -m "Update team photos and bios"
git push origin main

# Netlify auto-deploys
```

### Adding Images

```bash
# Navigate to site
cd acme-corp/

# Add image to appropriate folder
cp ~/Downloads/new-hero.jpg assets/images/hero/

# Optimize image first!
# Use: https://tinypng.com or https://squoosh.app

# Reference in HTML
# <img src="assets/images/hero/new-hero.jpg" alt="Description">

# Commit
git add assets/images/hero/new-hero.jpg
git commit -m "Add new hero image for homepage"
git push origin main
```

---

## 🐛 Troubleshooting

### Site Not Deploying on Netlify

**Check:**
1. Base directory is set correctly in Netlify (e.g., `acme-corp/`)
2. Files are committed and pushed to GitHub
3. Check Netlify deploy logs for errors

**Solution:**
```bash
# Verify files are committed
git status

# Push if needed
git push origin main

# Check Netlify dashboard → Deploys → View logs
```

### Images Not Loading

**Check:**
1. Image paths are correct (case-sensitive!)
   ```html
   ✅ <img src="assets/images/logo.png">
   ❌ <img src="Assets/Images/Logo.png">
   ```
2. Images are committed to Git
   ```bash
   git status
   # If "Untracked files" shows images, add them:
   git add assets/images/
   git commit -m "Add missing images"
   git push origin main
   ```

### CSS/JS Not Loading

**Check:**
1. File paths are correct
   ```html
   ✅ <link rel="stylesheet" href="assets/css/main.css">
   ❌ <link rel="stylesheet" href="css/main.css">
   ```
2. Files exist in repository
3. No typos in filenames

---

## 📚 Resources

### Templates & Guides

- **Site Template:** See `TEMPLATE-README.md` for site-specific README
- **Folder Structure:** See "Standard Folder Structure" section above
- **Netlify Deployment:** See "Netlify Deployment" section above

### Useful Tools

- **Image Compression:** 
  - https://tinypng.com
  - https://squoosh.app
- **Favicon Generator:** https://favicon.io
- **CSS Minifier:** https://cssminifier.com
- **JS Minifier:** https://javascript-minifier.com
- **Local Server:** 
  ```bash
  python -m http.server 8000
  # Or
  npx http-server
  ```

### Learning Resources

- **HTML/CSS:** https://developer.mozilla.org/en-US/docs/Web/HTML
- **JavaScript:** https://javascript.info
- **Git:** https://git-scm.com/book/en/v2
- **Netlify:** https://docs.netlify.com

---

## 🔐 Access & Permissions

### GitHub Repository
- **Repository:** https://github.com/yourusername/portfolios
- **Visibility:** Private
- **Team Access:** [List team members with access]

### Netlify Dashboard
- **Account:** team@yourcompany.com
- **Team Members:** [List team members]
- **Access Level:** [Admin/Developer/Viewer]

### Domain Registrar
- **Registrar:** GoDaddy
- **Account:** domains@yourcompany.com
- **DNS Management:** [List who has access]

---

## 📞 Support & Questions

### Who to Contact

**For Repository/Git Issues:**
- Contact: @yourname (DevOps/Lead)
- Email: dev@yourcompany.com

**For Design/Content Questions:**
- Contact: @designer
- Email: design@yourcompany.com

**For Deployment/Netlify Issues:**
- Contact: @yourname (DevOps)
- Netlify Support: https://answers.netlify.com

---

## 📝 Change Log

### 2026-03-18
- ✅ Created repository structure
- ✅ Added acme-corp site
- ✅ Set up Netlify deployment
- ✅ Documented folder structure

### 2026-03-15
- ✅ Added brand-x site
- ✅ Updated README with deployment guide

### 2026-03-10
- ✅ Initial repository creation
- ✅ Added README and templates

---

## 📄 License

Copyright © 2026 Your Company. All rights reserved.

Each website folder may have its own license - see individual site README files.

---

## ✅ Quick Reference

### Create New Site
```bash
mkdir -p new-site/{assets/{css,js,images/{hero,team,icons}},docs}
cd new-site/
touch index.html README.md
```

### Deploy to Netlify
1. Netlify → Add site → Import from Git
2. Select repository: `portfolios`
3. Base directory: `site-folder/`
4. Deploy!

### Update Site
```bash
cd site-folder/
# Edit files
git add .
git commit -m "Description of changes"
git push origin main
```

---

**Last Updated:** 2026-03-18  
**Maintained By:** @yourname  
**Repository:** https://github.com/yourusername/portfolios