# 📋 FreeClipboard - Free Online Tools

A modern, responsive collection of free online tools for developers, writers, and professionals. Built with Jekyll and designed with privacy in mind.

## ✨ Features

- **17 Professional Tools** - Clipboard manager, text tools, encoders, generators, and more
- **100% Privacy-Focused** - All processing happens client-side, no data sent to servers
- **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- **Modern Design** - Clean, intuitive interface with smooth animations
- **Fast & Lightweight** - Optimized performance with minimal dependencies
- **No Signup Required** - Start using tools immediately

## 🚀 Quick Start

### Prerequisites
- Ruby 3.0+
- Bundler
- Jekyll

### Installation

```bash
# Install dependencies
bundle install

# Start development server
bundle exec jekyll serve --livereload

# Open in browser
http://localhost:4000
```

## 🛠️ Available Tools

### Featured
- **Free Clipboard Manager** - Store unlimited clipboard items with smart organization

### Text Tools
- Word Counter
- Character Counter  
- Text Formatter

### Encoders/Decoders
- Base64 Encoder/Decoder
- URL Encoder/Decoder
- HTML Encoder/Decoder

### Generators
- UUID Generator
- Password Generator
- QR Code Generator
- Hash Generator (MD5, SHA-1, SHA-256)

### Developer Tools
- JSON Formatter
- Regex Tester
- Code Snippet Generator

### Utilities
- Color Picker
- Unit Converter
- Markdown Preview

## 📁 Project Structure

```
free-clipboard/
├── _layouts/          # Page layouts
├── _includes/         # Reusable components
├── _data/            # Data files (tools, navigation)
├── assets/
│   ├── css/          # Stylesheets
│   └── js/           # JavaScript files
├── tools/            # Individual tool pages
├── index.html        # Homepage
└── about.html        # About page
```

## 🎨 Design System

### Colors
- Primary: #3B82F6 (Blue)
- Secondary: #8B5CF6 (Purple)
- Success: #10B981 (Green)
- Danger: #EF4444 (Red)
- Dark: #1F2937
- Gray: #6B7280

### Typography
- Font: System fonts stack
- Headings: 700-900 weight
- Body: 400 weight

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🔧 Customization

### Adding a New Tool

1. Create tool directory:
```bash
mkdir tools/my-tool
```

2. Create `tools/my-tool/index.html`:
```html
---
layout: tool
title: My Tool
description: Tool description
---
<div class="tool-interface">
  <!-- Your tool HTML -->
</div>
<script src="{{ '/assets/js/my-tool.js' | relative_url }}"></script>
```

3. Create `assets/js/my-tool.js` with your tool logic

4. Add to `_data/tools.yml`:
```yaml
- name: My Tool
  url: /tools/my-tool/
  description: Tool description
```

### Modifying Colors

Edit CSS variables in `assets/css/style.css`:
```css
:root {
  --primary: #YOUR_COLOR;
  --secondary: #YOUR_COLOR;
}
```

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Select main branch as source
4. Site will be live at `username.github.io/repo-name`

### Netlify
1. Connect GitHub repository
2. Build command: `jekyll build`
3. Publish directory: `_site`
4. Deploy!

### Custom Domain
1. Add CNAME file with your domain
2. Configure DNS settings
3. Update `url` in `_config.yml`

## 🔒 Privacy & Security

- ✅ All tools run entirely in browser
- ✅ No data sent to external servers
- ✅ No tracking or analytics
- ✅ No cookies (except localStorage for clipboard)
- ✅ Works offline after first load

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Have suggestions or found a bug? Open an issue on GitHub!

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

Made with ❤️ for the developer community
