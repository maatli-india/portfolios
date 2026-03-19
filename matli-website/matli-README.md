# Matli - Company Website

> Professional company website with static pages showcasing services, team, and contact information

---

## 📋 Site Information

| Property | Value |
|----------|-------|
| **Site Name** | Matli |
| **Domain** | www.matli.in |
| **Purpose** | Company website for Mobile App |
| **Status** | 🚧 In Development |
| **Deployed On** | Netlify |
| **Repository** | NA |
| **Created** | 2026-03-18 |
| **Developer** | @dibyaranjan-pradhan |
| **Client** | Mritunjay Gour |

---

## 🎯 Project Overview

### Purpose
This is the official company website for Matli, designed to establish online presence and provide information about the company's services, team, and contact details to potential clients and partners.

### Target Audience
- Potential clients looking for [services/products]
- Job seekers interested in career opportunities
- Partners and stakeholders
- General public seeking company information

### Pages Included
- ✅ **Home** (`index.html`) - Homepage with hero section, services overview, CTA
- ✅ **About Us** (`about.html`) - Company history, mission, vision, team
- ✅ **Terms & Conditions** (`terms.html`) - Legal terms and conditions
- ✅ **Careers** (`careers.html`) - Job openings, application process
- ✅ **Contact Us** (`contact.html`) - Contact form (popup modal), office locations

### Key Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Contact form popup modal (calls backend API)
- ✅ Professional clean design
- ✅ Fast loading times
- ✅ SEO optimized
- ✅ HTTPS enabled
- [ ] Google Analytics (to be added)
- [ ] Newsletter signup (planned)

---

## 🏗️ Folder Structure

```
matli-website/
│
├── matli-README.md                    ← This file
├── index.html                         ← Homepage
├── about.html                         ← About Us page
├── tnc.html                           ← Terms & Conditions
<!-- ├── careers.html                       ← Careers page -->
<!-- ├── contact.html                       ← Contact page (with form modal) -->
├── 404.html                           ← Custom error page
│
├── assets/
│   ├── css/
│   │   ├── main.css                  ← Global styles (header, footer, typography)
<!-- │   │   ├── home.css                  ← Homepage specific styles
│   │   ├── about.css                 ← About page styles
│   │   ├── careers.css               ← Careers page styles
│   │   ├── contact.css               ← Contact page + modal styles
│   │   ├── modal.css                 ← Contact form modal styles -->
│   │   └── responsive.css            ← Mobile/tablet breakpoints
│   │
│   ├── js/
│   │   ├── main.js                   ← Navigation, common functions
<!-- │   │   ├── modal.js                  ← Contact form modal functionality -->
│   │   └── contact-form.js           ← Form validation + API call
│   │
│   ├── images/
│   │   ├── logo.png                  ← Company logo (main)
│   │   ├── logo-white.png            ← White logo (footer)
│   │   ├── favicon.ico               ← Browser icon
│   │   │
│   │   ├── hero/
│   │   │   ├── home-hero.jpg         ← Homepage hero image
│   │   │   ├── about-hero.jpg        ← About page hero
│   │   │   └── careers-hero.jpg      ← Careers page hero
│   │   │
│   │   ├── team/                     ← Team member photos
│   │   │   ├── ceo.jpg               ← [To be added]
│   │   │   ├── cto.jpg               ← [To be added]
│   │   │   └── team-placeholder.jpg  ← Placeholder for missing photos
│   │   │
│   │   ├── services/                 ← Service/product images
│   │   │   └── [to be added]
│   │   │
│   │   └── icons/                    ← SVG icons
│   │       ├── email.svg
│   │       ├── phone.svg
│   │       ├── location.svg
│   │       ├── linkedin.svg
│   │       └── twitter.svg
│   │
│   └── fonts/                         ← Custom fonts (if needed)
│
├── docs/                              ← Downloadable documents
│   ├── company-brochure.pdf          ← [To be added by client]
│   └── terms-and-conditions.pdf      ← [Optional: PDF version of T&C]
│
├── _redirects                         ← Netlify redirects config
├── robots.txt                         ← SEO configuration
└── sitemap.xml                        ← SEO sitemap
```

---

## 🚀 Local Development

### Setup

1. **Navigate to this folder:**
   ```bash
   cd portfolios/matli-website/
   ```

2. **Start local server:**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # OR using Node.js
   npx http-server
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

### Making Changes

**To update text content:**
1. Open the relevant HTML file (e.g., `index.html`)
2. Find the section you want to edit
3. Update the text
4. Save and refresh browser to see changes

**To update images:**
1. Optimize image first (use https://tinypng.com)
2. Add to appropriate folder in `assets/images/`
3. Update `src` attribute in HTML
4. Commit and push

**To test contact form:**
1. Fill out the form
2. Check browser console (F12) for any errors
3. Verify API call is being made to correct endpoint

---

## 🌐 Deployment

### Netlify Configuration

```
Site Name: Matli
Base Directory: matli-website/
Build Command: [leave empty]
Publish Directory: [leave empty or "."]
Custom Domain: www.matli.in
```

### Deployment Process

**Automatic (on git push):**
```bash
# Make changes
# Test locally

# Commit
git add .
git commit -m "Update homepage hero section"
git push origin main

# Netlify auto-deploys in 1-2 minutes
# Visit site to verify changes
```

### Live URLs

| Environment | URL | Status |
|-------------|-----|--------|
| **Production** | https://www.matli.in | 🚧 Pending DNS setup |
| **Netlify Preview** | https://matli.netlify.app | ✅ Active |

---

## 🎨 Design & Branding

### Color Palette

```css
/* Update these after discussing with client */
Primary Color:   #[TBD]     /* Main brand color */
Secondary Color: #[TBD]     /* Accent color */
Text Color:      #333333    /* Dark gray for text */
Background:      #ffffff    /* White background */
Footer BG:       #1a1a1a    /* Dark footer */
```

### Typography

```css
Font Family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
OR
[Client's preferred font - TBD]

Font Sizes:
- h1: 3rem (48px)      /* Page titles */
- h2: 2.5rem (40px)    /* Section headings */
- h3: 2rem (32px)      /* Sub-sections */
- h4: 1.5rem (24px)    /* Card headings */
- p: 1rem (16px)       /* Body text */
```

### Logo

**Files needed from client:**
- [ ] Logo PNG (transparent background) - for light backgrounds
- [ ] Logo white version - for dark backgrounds (footer)
- [ ] Favicon (16x16, 32x32, 48x48px)
- [ ] High-res version for print materials

**Placeholder:** Currently using generic logo - replace when client provides assets

---

## 📝 Page Details

### 1. Homepage (`index.html`)

**Sections:**
- Hero section with CTA button
- Services/Products overview (3-4 cards)
- Why choose us / Company highlights
- Client testimonials (optional)
- Call-to-action section
- Footer

**CTA Buttons:**
- "Contact Us" → Opens contact modal
- "Learn More" → Links to About page

---

### 2. About Us (`about.html`)

**Sections:**
- Company story / History
- Mission & Vision statements
- Core values
- Team members (with photos and bios)
- Company milestones / Achievements
- Footer

**Content needed from client:**
- [ ] Company history text
- [ ] Mission statement
- [ ] Vision statement
- [ ] Team member photos (400x400px, headshots)
- [ ] Team member bios (name, title, short description)

---

### 3. Terms & Conditions (`terms.html`)

**Sections:**
- Introduction
- Definitions
- User obligations
- Intellectual property
- Limitation of liability
- Privacy policy link
- Governing law
- Contact information
- Footer

**Status:**
- [ ] Legal review pending
- [ ] Client to provide/approve final text

**Note:** This is a legal document - must be reviewed by client's legal team before going live.

---

### 4. Careers (`careers.html`)

**Sections:**
- Why work with us / Company culture
- Current job openings
- Application process
- Benefits & perks
- Footer

**Job Posting Structure:**
```html
<div class="job-card">
    <h3>Job Title</h3>
    <p class="location">Location</p>
    <p class="job-type">Full-time / Part-time / Contract</p>
    <p class="description">Brief job description...</p>
    <a href="mailto:careers@matli.in" class="apply-button">Apply Now</a>
</div>
```

**Content needed:**
- [ ] Current job openings (from client)
- [ ] Benefits list
- [ ] Application process details

---

### 5. Contact Us (`contact.html`)

**Sections:**
- Contact information (address, phone, email)
- Office location map (optional - Google Maps embed)
- Contact form (popup modal)
- Footer

**Contact Form Fields:**
- Name (required)
- Email (required)
- Phone (optional)
- Subject (optional)
- Message (required)
- Submit button

**Form Behavior:**
1. User clicks "Contact Us" button
2. Modal popup appears
3. User fills form
4. Form validates client-side
5. On submit, calls backend API
6. Shows success/error message
7. Closes modal on success

**API Integration:**
```javascript
// Endpoint (update with actual backend URL)
const API_ENDPOINT = 'https://api.matli.in/contact';

// Payload
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 12345 67890",
    "subject": "General Inquiry",
    "message": "Hello, I have a question..."
}

// Response
{
    "status": "success",
    "message": "Thank you for contacting us. We'll get back to you soon."
}
```

---

## 🔧 Technical Details

### Backend API Integration

**Endpoint:** [To be provided - update when ready]  
**Method:** POST  
**Headers:** Content-Type: application/json  

**CORS Configuration (Backend):**
```go
// Add to your Go backend
w.Header().Set("Access-Control-Allow-Origin", "https://matli.in")
w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
```

**Testing:**
1. Use staging backend during development
2. Update to production URL before launch

---

### Browser Support

✅ Chrome (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Edge (latest)  
✅ Mobile Safari (iOS)  
✅ Chrome Mobile (Android)  

---

### Performance Targets

- Page Load: < 3 seconds
- First Contentful Paint: < 1.5 seconds
- Lighthouse Score: 90+ (aim for 95+)

**Optimization Steps:**
- [x] Compress all images (< 200KB each)
- [ ] Minify CSS (before launch)
- [ ] Minify JavaScript (before launch)
- [ ] Enable Netlify compression
- [ ] Lazy load images (if needed)

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 480px) {
    /* Single column layout */
}

/* Tablet */
@media (min-width: 481px) and (max-width: 768px) {
    /* Two column layout */
}

/* Desktop */
@media (min-width: 769px) {
    /* Full multi-column layout */
}
```

### Testing Devices

Test on:
- [ ] iPhone (375px width)
- [ ] iPad (768px width)
- [ ] Laptop (1366px width)
- [ ] Desktop (1920px width)

---

## ✅ Pre-Launch Checklist

### Content Review
- [ ] All placeholder text replaced with real content
- [ ] Client provided and approved all text
- [ ] Team photos uploaded (optimized)
- [ ] Company logo added (all versions)
- [ ] Terms & Conditions approved by legal team
- [ ] Job postings are current

### Technical Review
- [ ] All links work (internal and external)
- [ ] Contact form submits successfully
- [ ] Backend API is live and configured
- [ ] CORS is configured correctly
- [ ] All images load correctly
- [ ] No console errors
- [ ] Mobile responsive on all pages
- [ ] 404 page works

### SEO & Analytics
- [ ] Meta descriptions added to all pages
- [ ] Page titles are descriptive
- [ ] Alt text on all images
- [ ] Sitemap.xml is updated
- [ ] Robots.txt is configured
- [ ] Google Analytics added (if requested)
- [ ] Google Search Console verified

### Performance
- [ ] All images optimized (< 200KB)
- [ ] CSS minified
- [ ] JS minified
- [ ] Lighthouse score > 90

### Domain & Deployment
- [ ] Domain purchased and transferred to client
- [ ] DNS configured (GoDaddy → Netlify)
- [ ] SSL certificate active (HTTPS working)
- [ ] www redirects to non-www (or vice versa)
- [ ] Test site from different locations/devices

### Legal & Compliance
- [ ] Privacy policy linked (if collecting data)
- [ ] Terms & Conditions page live
- [ ] Cookie consent (if using cookies/analytics)
- [ ] GDPR compliance (if applicable)

---

## 🐛 Known Issues

### Current Issues
- [ ] None yet

### Planned Improvements (Post-Launch)
- [ ] Add blog section
- [ ] Add newsletter signup
- [ ] Integrate Google Maps on contact page
- [ ] Add client testimonials section
- [ ] Add portfolio/case studies page

---

## 📋 Content Needed from Client

### Urgent (For Launch)

**Text Content:**
- [ ] Company description (About page)
- [ ] Mission statement
- [ ] Vision statement
- [ ] Services/products descriptions
- [ ] Team member bios (name, title, 2-3 sentences)
- [ ] Terms & Conditions text

**Images:**
- [ ] Company logo (PNG, transparent background)
- [ ] Logo white version (for dark backgrounds)
- [ ] Favicon (16x16, 32x32px)
- [ ] Hero images (1920x1080px, < 200KB each)
- [ ] Team photos (400x400px headshots)
- [ ] Service/product images (if any)

**Contact Information:**
- [ ] Office address
- [ ] Phone number(s)
- [ ] Email address(es)
- [ ] Social media links (LinkedIn, Twitter, etc.)

**Legal:**
- [ ] Terms & Conditions (legal team approval)
- [ ] Privacy policy (if needed)

### Optional (Can Add Later)
- [ ] Client testimonials
- [ ] Company achievements/awards
- [ ] Case studies
- [ ] Company brochure (PDF)

---

## 👥 Team & Contacts

### Project Team

**Developer:**
- Name: @yourname
- Email: dev@yourcompany.com
- Responsible for: Code, deployment, API integration

**Client Contact:**
- Name: Mritunjay Gour
- Email: mritunjaygour03@gmail.com
- Company: Matli
- Responsible for: Content, approvals, final decisions

### Communication

**Primary Channel:** [WhatsApp / Email / Slack]  
**Response Time:** Within 24 hours on weekdays  
**Meeting Schedule:** [As needed / Weekly check-in]  

---

## 📅 Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Project Started | 2026-03-18 | ✅ Complete |
| Folder Structure Created | 2026-03-18 | ✅ Complete |
| Homepage Design | [YYYY-MM-DD] | 🚧 In Progress |
| All Pages Drafted | [YYYY-MM-DD] | ⏳ Pending |
| Client Content Received | [YYYY-MM-DD] | ⏳ Pending |
| Backend API Ready | [YYYY-MM-DD] | ⏳ Pending |
| Testing Complete | [YYYY-MM-DD] | ⏳ Pending |
| Domain Configured | [YYYY-MM-DD] | ⏳ Pending |
| **Launch** | [YYYY-MM-DD] | ⏳ Pending |

---

## 💡 Notes

### Design Decisions
- Kept design clean and professional
- Used modal for contact form (better UX than separate page)
- Responsive-first approach (mobile, then desktop)

### Development Notes
- Using vanilla JavaScript (no frameworks) for simplicity
- CSS custom properties for easy theme changes
- All images optimized before commit

### Client Preferences
- [Add any specific requests from client]
- [Preferences for colors, layout, features]

---

## 🆘 Support

### For Client

**Need to update content?**
- Contact: @yourname at dev@yourcompany.com
- Or submit content via [method]

**Found a bug?**
- Email with screenshot: dev@yourcompany.com
- Or WhatsApp: [number]

**Want to add new features?**
- Let's discuss requirements first
- Can provide quote for additional work

### For Developer

**Deployment issues:**
- Check Netlify deploy logs
- Verify DNS settings in GoDaddy

**API not working:**
- Check CORS configuration
- Verify endpoint URL is correct
- Check browser console for errors

---

## 📄 License

Copyright © 2026 Matli. All rights reserved.

This website and all its content are proprietary to Matli. Unauthorized copying, distribution, or use is prohibited.

---

## ✅ Quick Commands

```bash
# Navigate to site folder
cd portfolios/matli-website/

# Start local server
python -m http.server 8000

# Deploy to Netlify
git add .
git commit -m "Update about page content"
git push origin main

# Optimize images before commit
# Use: https://tinypng.com
```

---

**Last Updated:** 2026-03-18  
**Developer:** @yourname  
**Client:** [Friend's Name]  
**Status:** 🚧 In Development  
**Launch Target:** [YYYY-MM-DD]