# JS Blog - Modern JavaScript Framework Blog

A modern, performant blog built with Next.js 14, TypeScript, and Tailwind CSS, designed for sharing insights about JavaScript frameworks and web development.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Markdown Support**: Write blog posts in Markdown with frontmatter
- **SEO Optimized**: Built-in SEO with Open Graph and Twitter Card support
- **Responsive Design**: Mobile-first design that works on all devices
- **Fast Performance**: Static site generation for optimal loading speeds
- **Type Safety**: Full TypeScript support for better development experience
- **Netlify Ready**: Optimized for deployment on Netlify

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: Markdown with gray-matter and remark
- **Deployment**: Netlify
- **Icons**: Heroicons (SVG)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd js-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
js-blog/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── blog/           # Blog routes
│   │   ├── about/          # About page
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable components
│   ├── content/            # Blog content (Markdown files)
│   │   └── blog/          # Blog posts
│   └── lib/               # Utility functions
├── public/                 # Static assets
├── netlify.toml           # Netlify configuration
└── package.json           # Dependencies and scripts
```

## ✍️ Writing Blog Posts

Blog posts are written in Markdown and stored in `src/content/blog/`. Each post should include frontmatter with:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
description: "A brief description of your post"
tags: ["Tag1", "Tag2", "Tag3"]
author: "Your Name"
---

# Your content here...
```

## 🎨 Customization

### Site Configuration

Edit `src/lib/config.ts` to customize:
- Site name and description
- Author information
- Social media links
- Site URL and metadata

### Styling

The blog uses Tailwind CSS v4. Customize styles by:
- Modifying `src/app/globals.css`
- Adding custom CSS variables
- Extending Tailwind's theme

### Components

All components are located in `src/components/` and can be customized to match your design preferences.

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect your repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Environment variables** (if needed)
4. **Deploy!**

The `netlify.toml` file is already configured for optimal deployment.

### Other Platforms

This blog can be deployed to any platform that supports Next.js:
- Vercel
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📱 Responsive Design

The blog is built with a mobile-first approach and includes:
- Responsive navigation
- Mobile-optimized layouts
- Touch-friendly interactions
- Optimized typography for all screen sizes

## 🔍 SEO Features

- Automatic meta tag generation
- Open Graph support
- Twitter Card support
- Structured data ready
- Sitemap generation (can be added)
- RSS feed (can be added)

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- ESLint configuration included
- TypeScript strict mode enabled
- Prettier formatting (can be added)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Netlify](https://netlify.com/) for hosting and deployment
- The open source community for inspiration and tools

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Check the documentation
- Reach out to the community

---

**Happy blogging! 🎉**
