# FreeClipboard - Project Structure

## 📁 Directory Structure

```
free-clipboard/
├── _config.yml              # Jekyll configuration
├── index.html               # Homepage
├── about.html               # About page
├── robots.txt               # SEO robots file
├── Gemfile                  # Ruby dependencies
│
├── _layouts/                # Page layouts
│   ├── default.html         # Main layout wrapper
│   └── tool.html            # Tool page layout
│
├── _includes/               # Reusable components
│   ├── head.html            # HTML head with meta tags
│   ├── header.html          # Site header/navigation
│   ├── footer.html          # Site footer
│   ├── ads.html             # Ad placeholder
│   └── breadcrumb.html      # Breadcrumb navigation
│
├── _data/                   # Data files
│   ├── tools.yml            # List of all tools
│   └── navigation.yml       # Navigation menu items
│
├── assets/                  # Static assets
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   ├── main.js          # Global JavaScript
│   │   ├── free-clipboard.js
│   │   ├── word-counter.js
│   │   ├── base64.js
│   │   ├── json-formatter.js
│   │   ├── url-encoder.js
│   │   ├── html-encoder.js
│   │   ├── unit-converter.js
│   │   ├── code-snippet-generator.js
│   │   ├── qr-generator.js
│   │   ├── text-formatter.js
│   │   ├── color-picker.js
│   │   ├── regex-tester.js
│   │   ├── hash-generator.js
│   │   ├── uuid-generator.js
│   │   ├── password-generator.js
│   │   ├── character-counter.js
│   │   └── markdown-preview.js
│   └── images/              # Images and icons
│
└── tools/                   # Tool pages
    ├── free-clipboard/
    ├── word-counter/
    ├── character-counter/
    ├── base64-encoder/
    ├── json-formatter/
    ├── url-encoder/
    ├── html-encoder/
    ├── unit-converter/
    ├── code-snippet-generator/
    ├── qr-code-generator/
    ├── text-formatter/
    ├── color-picker/
    ├── regex-tester/
    ├── hash-generator/
    ├── uuid-generator/
    ├── password-generator/
    └── markdown-preview/
```

## 🎯 Key Features

### 1. Free Clipboard Manager (Featured Tool)
- Unlimited clipboard storage
- Smart categorization (Text, Code, URL, Email)
- Search functionality
- Favorites system
- Export/Import data
- Copy count tracking

### 2. Text Tools
- Word Counter
- Character Counter
- Text Formatter

### 3. Encoders/Decoders
- Base64 Encoder/Decoder
- URL Encoder/Decoder
- HTML Encoder/Decoder

### 4. Generators
- UUID Generator
- Password Generator
- QR Code Generator
- Hash Generator (MD5, SHA-1, SHA-256)

### 5. Developer Tools
- JSON Formatter
- Regex Tester
- Code Snippet Generator

### 6. Utilities
- Color Picker
- Unit Converter
- Markdown Preview

## 🚀 How to Run

### Development
```bash
bundle install
bundle exec jekyll serve
```

Visit: http://localhost:4000

### Production Build
```bash
bundle exec jekyll build
```

Output in `_site/` directory

## 📝 Adding a New Tool

1. Create tool directory: `tools/your-tool/`
2. Create `index.html` with layout: tool
3. Create JavaScript file: `assets/js/your-tool.js`
4. Add tool to `_data/tools.yml`
5. Add CSS styles to `assets/css/style.css` if needed

## 🎨 Design System

### Colors
- Primary: #2563EB (Blue)
- Secondary: #64748B (Slate Gray)
- Background: #F8FAFC
- Card Background: #FFFFFF
- Text: #1E293B
- Border: #E2E8F0

### Typography
- Font: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- Headings: 800 weight
- Body: 400 weight

### Components
- Tool cards with hover effects
- Responsive grid layouts
- Sticky header navigation
- Comprehensive footer
- Toast notifications

## 🔒 Privacy Features
- All processing happens client-side
- No data sent to servers
- No tracking or analytics
- LocalStorage for clipboard data
- Works offline after first load

## 📱 Responsive Design
- Mobile-first approach
- Breakpoint: 768px
- Flexible grid layouts
- Touch-friendly interfaces
