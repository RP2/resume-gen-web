# Resume Builder Web App

A modern, ATS-optimized resume builder built with Astro, React, and TypeScript. Create professional resumes that pass both human recruiters and AI screening systems with intelligent job-matching suggestions.

## ✨ Current Features

### 🎨 **Modern Resume Builder**

- **Interactive Forms**: Clean, intuitive interface with granular control, including drag-and-drop reordering and inline editing
- **Resume Analytics** - Show metrics like word count, section completion, keyword density tabbed sections for all resume data
- **Real-time Preview**: See your resume update instantly as you type with highlight animations
- **Responsive Design**: Fully mobile-optimized interface that works perfectly on all devices
- **Dark/Light Mode**: Automatic system theme detection with manual toggle

### 🤖 **AI-Powered Resume Optimization** ⭐ ENHANCED

- **Intelligent Job Analysis**: Paste any job description for targeted optimization suggestions
- **Match Score Analytics**: 0-100% compatibility score with detailed breakdowns
- **Interactive Suggestion Metrics**: Clickable metrics with detailed tooltips showing strengths, gaps, and improvement areas
- **Smart Section Navigation**: "Go to Section" buttons that highlight the exact field to edit
- **Priority-Based Recommendations**: Organized by High/Medium/Low priority for focused improvements
- **One-Click Application**: Automatically apply compatible suggestions to your resume
- **Preview Mode**: See exactly what changes will look like before applying
- **Token Usage Tracking**: Real-time monitoring of OpenAI API usage and costs
- **Sample Job Templates**: Built-in job descriptions for Software Engineers, Data Scientists, and Product Managers
- **Iterative Analysis**: The AI learns from your changes for increasingly relevant suggestions
- **Gap Analysis**: Identifies missing keywords, skills, and experiences
- **ATS Enhancement**: Specific recommendations for Applicant Tracking System optimization

### 📄 **Professional PDF Export**

- **Browser-Native Generation**: No external dependencies or server processing required
- **ATS-Compliant Formatting**: Optimized for maximum parsing accuracy by recruitment systems
- **Professional Typography**: Sans-serif font, proper spacing, semantic HTML structure
- **Schema.org Microdata**: Structured data for enhanced AI and ATS parsing in the HTML resume preview
- **Print-Optimized Layout**: Perfect formatting for both digital and print applications
- **One-Click Export**: Simple PDF generation with proper page breaks and styling

### 💾 **Smart Data Management**

- **Auto-Save Functionality**: Automatic local storage with real-time save indicators
- **Data Recovery**: Restore unsaved work from previous sessions automatically
- **Sample Data Loading**: Pre-populated examples to get started quickly
- **Import/Export System**: Backup and restore resume data in JSON format
- **Collapsible Data Panel**: Auto-minimizes when you start working to save screen space
- **Smart State Management**: Tracks completed suggestions and maintains session state

### ♿ **Accessibility & UX Excellence**

- **Full Keyboard Navigation**: Complete keyboard shortcuts support (Ctrl+P for PDF, Ctrl+S for .json saving)
- **Screen Reader Optimized**: Proper ARIA labels, semantic HTML, and announcement regions
- **High Contrast Theme**: WCAG AA compliant color schemes for better visibility
- **Mobile-First Design**: Optimized touch interfaces with finger-friendly buttons
- **Smart Form Behavior**: Auto-expanding text areas, helpful placeholders, and validation
- **Contextual Tooltips**: Interactive help text throughout the interface

### 🎯 **Comprehensive Resume Sections**

- **Personal Information**: Contact details with auto-formatting and link validation
- **Professional Summary**: Keyword-optimized summary with character count guidance
- **Work Experience**: Detailed job history with achievement bullet points and descriptions
- **Education**: Degree information with GPA, honors, and relevant coursework
- **Skills**: Categorized technical and soft skills with proficiency levels
- **Projects**: Portfolio showcase with technology stacks, descriptions, and live links
- **Dynamic Visibility**: Show/hide sections and entries for tailored resumes

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** or **yarn**
- **OpenAI API Key** (for AI optimization features)

### Quick Setup

1. **Clone and Install**:

   ```bash
   git clone https://github.com/RP2/resume-gen-web.git
   cd resume-gen-web
   npm install
   ```

2. **Start Development Server**:

   ```bash
   npm run dev
   ```

3. **Open Application**:
   Navigate to `http://localhost:4321`

4. **Configure AI Features** (Optional):
   - Click the settings icon in the header
   - Add your OpenAI API key
   - Start using AI optimization features

### Production Build

```bash
npm run build
npm run preview
```

## 🤖 AI Optimization Guide

### Getting Started with AI Features

1. **Setup**: Add your OpenAI API key in Settings (stored locally, never sent to our servers)
2. **Load Job**: Paste a job description or select from sample templates
3. **Analyze**: Click "Get AI Optimization Suggestions" for tailored recommendations
4. **Navigate**: Use "Go to Section" to jump directly to relevant form fields
5. **Apply**: Use "Mark as Done" to track completed improvements
6. **Iterate**: Run analysis again after changes for refined suggestions

### Understanding AI Suggestions

#### **Metrics Dashboard**

- **Match Score**: Overall compatibility percentage with detailed explanation
- **Suggestions Count**: Total recommendations with priority breakdown (High/Medium/Low)
- **Strengths**: Identified matching qualifications with examples
- **Gaps**: Missing elements with specific improvement areas

#### **Suggestion Types**

- **🔴 High Priority**: Critical improvements that significantly impact ATS scores
- **🟡 Medium Priority**: Important optimizations for better job alignment
- **🔵 Low Priority**: Suggestions for professional presentation

#### **Navigation Features**

- **Smart Highlighting**: Automatically scrolls and highlights the exact field to edit
- **Form Field Focus**: Directly focuses relevant input areas for immediate editing
- **Section Switching**: Automatically changes to the correct resume section tab

### Sample Job Descriptions

Test the AI features with built-in examples:

- **Software Engineer**: Full-stack development with modern frameworks
- **Data Scientist**: Machine learning and analytics focus
- **Product Manager**: Consumer product strategy and growth

## 🚀 Deployment

### Cloudflare Pages (Recommended)

This app is optimized for deployment on Cloudflare Pages:

1. **Connect Repository**: Link your GitHub repo to Cloudflare Pages
2. **Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. **Automatic Deployment**: Cloudflare will build and deploy automatically
4. **Serverless Functions**: The `/functions` directory contains Cloudflare Pages Functions for OpenAI API integration

### Key Benefits

- **Free Hosting**: Cloudflare Pages free tier is generous for most use cases
- **Global CDN**: Lightning-fast loading worldwide
- **Automatic HTTPS**: SSL certificates automatically provisioned
- **Serverless Functions**: Handle OpenAI API calls without managing servers
- **No Backend Required**: Fully static site with serverless API integration

For detailed deployment instructions, see [Cloudflare Deployment Guide](docs/CLOUDFLARE_DEPLOYMENT.md)

### Alternative Hosting

The app can also be deployed to any static hosting provider:

- **Vercel**: Add serverless functions for OpenAI integration
- **Netlify**: Use Netlify Functions for API calls
- **GitHub Pages**: Static files only (OpenAI integration limited by CORS)

## 📋 Roadmap

### 🤖 Phase 1: Enhanced AI Features

#### **Smart Content Generation**

- **ATS Score Prediction**: Real-time scoring of how well your resume matches job requirements
- **Professional Summary Generator**: Create compelling summaries based on your experience
- **Achievement Quantifier**: Help users add metrics and numbers to their accomplishments
- **Action Verb Optimizer**: Replace weak verbs with strong, impactful alternatives

### 🎯 Phase 2: Multi-Format Support

#### **Template System**

- **Multiple Layouts**: Various professional resume templates and designs
- **Cover Letter Generator**: AI-powered cover letters tailored to specific jobs
- **Export Formats**: Word, HTML, plain text versions

#### **Career Intelligence**

- **Industry Insights**: Salary ranges, trending skills, job market analysis
- **Career Path Mapping**: AI suggestions for career progression
- **Interview Preparation**: Common questions and AI-generated practice answers

### 🌟 Phase 3: Career Intelligence

#### **Advanced Analytics**

- **Video Resume Analysis**: AI feedback on recorded video introductions
- **Portfolio Integration**: Automatic portfolio website generation
- **Real-time Market Matching**: Live job matching based on resume content
- **Bias Detection**: AI analysis to reduce unconscious bias in resume language

### 🔧 Technical Roadmap

#### **Backend Integration**

- **User Authentication**: Secure user accounts and cloud storage
- **API Development**: RESTful API for mobile app integration
- **Database Integration**: PostgreSQL for user data and analytics
- **Cloud PDF Processing**: Server-side PDF generation for advanced features

#### **Performance & Scale**

- **CDN Integration**: Global content delivery for faster loading
- **Progressive Web App**: Offline functionality and app-like experience
- **Analytics Dashboard**: User behavior insights and feature usage tracking
- **A/B Testing**: Continuous UX optimization

## 🎨 AI Integration & Privacy

Our AI integration prioritizes your privacy and security:

### 🔐 **Maximum Security Architecture**

- **React State Storage**: API key stored only in memory (React state) - most secure option
- **No Persistent Storage**: Unlike localStorage or cookies, keys never touch disk storage
- **Session-Only Memory**: Keys exist only while the browser tab is open, cleared on close
- **XSS Protection**: Memory-only storage prevents cross-site scripting access to keys
- **No Server Transmission**: We never store, log, or transmit your API key to our servers
- **Direct Browser-to-OpenAI**: All AI requests go directly from your browser to OpenAI
- **Zero Data Retention**: Your resume data and AI interactions stay completely private

**Why React State vs. localStorage/cookies?**

- ✅ **React State**: Stored in memory only, cleared on tab close, immune to XSS attacks on persistent storage
- ❌ **localStorage**: Persists on disk, accessible by any script, potential XSS vulnerability
- ❌ **Cookies**: Sent with every request, potential security risks, persistent storage

### 🎯 **Current AI Features**

The AI will help you:

- **Analyze Job Descriptions**: Extract key requirements and skills from job postings
- **Identify Skill Gaps**: Find missing qualifications and suggest improvements
- **Optimize Keywords**: Automatically adjust content for ATS systems
- **Enhance Content**: Get suggestions for better phrasing and impact

## 📊 Current Status

- ✅ **Core Resume Builder**: Complete with all major sections
- ✅ **ATS-Optimized PDF Export**: Professional, parse-able output
- ✅ **AI Resume Optimization**: Live job description analysis and optimization
- ✅ **Privacy-First AI**: Client-side API key storage with direct OpenAI integration
- ✅ **Local Data Management**: Auto-save, recovery, sample data
- ✅ **Responsive Design**: Works on all devices
- ✅ **Accessibility**: WCAG compliant with keyboard navigation
- 🟡 **Template System**: Planned for Phase 2

## 🤝 Contributing

I welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test them
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow the Astro + React + TypeScript conventions outlined in the codebase
- Use mobile-first responsive design with Tailwind CSS
- Write clean, documented code with TypeScript interfaces
- Test AI features thoroughly (requires valid OpenAI API key)

## 🚀 Alternate Deployment

The application is designed for static hosting and can be deployed to:

- **Vercel** (recommended): Connect your GitHub repo for automatic deployments
- **Netlify**: Static hosting with edge functions support
- **GitHub Pages**: Free hosting for public repositories
- **Any static hosting service**: Build output is standard HTML/CSS/JS

### Build Process

```bash
npm run build
npm run preview  # Test production build locally
```

## 🔒 Privacy & Security

- **Local-first**: All resume data stays in your browser's localStorage
- **API Security**: OpenAI API key is stored securely in environment variables
- **No Data Collection**: We don't track or store personal information
- **Open Source**: Full transparency in how your data is handled

### Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key_here  # Required for AI features
PUBLIC_NODE_ENV=production               # Optional: controls debug logging
```

## 📊 Development Status

### Current Version: v1.0

- ✅ Core resume building functionality
- ✅ AI-powered optimization suggestions
- ✅ Mobile-responsive design
- ✅ Enhanced "Go to Section" navigation
- ✅ Simplified suggestion interface

## 📋 TODO List

### 🎯 High Priority

- [x] **Drag & Drop Reordering** - Allow users to reorder resume sections (work experience entries, education, projects, skills) via drag and drop
- [x] **About Page** - Create `/about` page explaining the project, features, and development story
- [x] **Privacy Page** - Create `/privacy` page detailing data handling, localStorage usage, and AI processing
- [x] **PDF Export** - Re-implement PDF generation with better formatting and styling options
- [x] **Data Import/Export** - Allow users to backup/restore their resume data as JSON files

### 🎨 UI/UX Improvements

- [ ] **Multiple Resume Templates** - Add different visual styles and layouts for resumes
- [ ] **Theme Customization** - Allow users to customize colors, fonts, and spacing
- [ ] **Font Selection** - Offer multiple font choices in the app and PDF export
- [x] **Print Optimization** - Ensure resume looks great when printed directly from browser
- [x] **Better Mobile Experience** - Further optimize mobile form editing and navigation
- [x] **Keyboard Navigation** - Improve accessibility with comprehensive keyboard shortcuts

### ✨ Feature Enhancements

- [ ] **Resume Analytics** - Show metrics like word count, section completion, keyword density
- [ ] **Version History** - Track and allow rollback to previous resume versions
- [x] **Smart Suggestions** - AI-powered suggestions based on job descriptions

### 🔧 Technical Improvements

- [ ] **Error Boundaries** - Better error handling and recovery throughout the app
- [ ] **Performance Optimization** - Lazy loading, code splitting, bundle size reduction
- [ ] **Testing Suite** - Comprehensive unit and integration tests
- [ ] **CI/CD Pipeline** - Automated testing and deployment workflows

### 🌟 Advanced Features

- [ ] **Collaboration** - Share and get feedback on resumes from others
- [x] **ATS Optimization** - Specific suggestions for Applicant Tracking Systems
- [ ] **Cover Letter Generator** - AI-powered cover letter creation
- [ ] **Interview Prep** - Generate interview questions based on resume content
- [ ] **Career Path Suggestions** - AI recommendations for career development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original inspiration from [RP2/resume-gen](https://github.com/RP2/resume-gen)
- Built with [Astro](https://astro.build/), [React](https://reactjs.org/), and [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- AI optimization powered by [OpenAI](https://openai.com/)
- [dnd-kit](https://dndkit.com/)  
  Drag-and-drop library powering interactive lists

---

**Ready to build your career?** [Get started locally](#-getting-started) or [contribute to the project](https://github.com/RP2/resume-gen-web)!
