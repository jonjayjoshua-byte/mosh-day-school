# MOSH DAY SCHOOL - Vercel Deployment Guide

This repository contains the complete MOSH DAY SCHOOL website built with React, Vite, and Tailwind CSS.

## Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm package manager (`npm install -g pnpm`)

### Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```
   The site will be available at `http://localhost:3000`

3. **Build for production:**
   ```bash
   pnpm build
   ```

## Deploying to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts** to connect your GitHub account and deploy

### Option 2: Using GitHub Integration

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/mosh-day-school.git
   git branch -M main
   git push -u origin main
   ```

2. **Go to Vercel Dashboard:**
   - Visit https://vercel.com
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Deploy"

## Project Structure

```
mosh-day-school/
├── client/
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable UI components
│   │   ├── App.tsx       # Main app component
│   │   └── index.css     # Global styles
│   ├── public/           # Static files (robots.txt, sitemap.xml)
│   └── index.html        # HTML entry point
├── server/               # Express server (for full-stack features)
├── package.json          # Dependencies
└── vite.config.ts        # Vite configuration
```

## Features

✅ Modern, responsive design
✅ SEO optimized (meta tags, structured data, sitemap)
✅ Mobile-friendly
✅ Smooth animations
✅ Local business schema for Google
✅ Open Graph & Twitter Card support

## SEO Optimization

The website includes comprehensive SEO improvements:
- Meta tags and descriptions
- JSON-LD structured data
- robots.txt and sitemap.xml
- Semantic HTML with ARIA labels
- Local business information

See `SEO_OPTIMIZATION.md` for detailed information.

## Environment Variables

No environment variables are required for the static site. If you add backend features later, you may need to configure:
- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`

## Support

For issues or questions, refer to:
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vercel Documentation](https://vercel.com/docs)

## License

This project is proprietary to MOSH DAY SCHOOL.
