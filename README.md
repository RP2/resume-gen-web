# Resume Builder Web

A modern, ATS-optimized resume builder built with Astro, React, and TypeScript. Create professional resumes that get past both human recruiters and AI screening systems.

## ✨ Current Features

### 🎨 **Modern Resume Builder**

- **Interactive Forms**: Clean, intuitive interface for entering resume data
- **Real-time Preview**: See your resume update as you type
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Supports system theme preferences

### 🤖 **AI-Powered Resume Optimization**

- **Job Description Analysis**: Upload job postings to automatically extract key requirements
- **Skills Gap Analysis**: AI identifies missing skills and suggests additions
- **Keyword Optimization**: Automatically optimize resume content for specific job postings
- **Privacy-First AI**: Your OpenAI API key stays in your browser - never sent to our servers
- **Client-Side Processing**: All AI interactions happen directly from your browser to OpenAI

### 📄 **ATS-Optimized PDF Export**

- **Browser-native PDF generation**: No external dependencies or server-side processing
- **ATS-compliant formatting**: Optimized for Applicant Tracking Systems and AI parsers
- **Schema.org microdata**: Structured data for maximum parsing accuracy
- **Professional typography**: Times New Roman font, proper spacing, semantic structure
- **Keyword optimization**: Strategic placement for HR screening algorithms

### 💾 **Smart Data Management**

- **Auto-save functionality**: Your work is automatically saved to local storage
- **Data recovery**: Recover unsaved changes from previous sessions
- **Sample data**: Pre-loaded examples to get started quickly
- **Import/Export**: Backup and restore your resume data
- **Smart collapsible UI**: Data management section auto-minimizes when you start working

### ♿ **Accessibility & UX**

- **Keyboard navigation**: Full keyboard support with shortcuts (Ctrl+P for PDF export)
- **Screen reader compatible**: Proper ARIA labels and semantic HTML
- **High contrast**: Meets WCAG accessibility standards
- **Intuitive workflow**: Auto-expanding sections, smart defaults, helpful placeholders

### 🎯 **Professional Sections**

- **Personal Information**: Contact details with clickable links
- **Professional Summary**: Keyword-rich summary section
- **Work Experience**: Detailed job history with highlights and descriptions
- **Education**: Degree information with GPA and honors
- **Skills**: Categorized technical and soft skills
- **Projects**: Portfolio items with technology stacks and links

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RP2/resume-gen-web.git
   cd resume-gen-web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:4321`

### Building for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: Astro + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **PDF Generation**: Browser native print API
- **Data Storage**: localStorage (client-side only)
- **AI Integration**: OpenAI API (key stored in React state - never stored insecurely or sent anywhere)
- **Deployment**: Static site generation (SSG)

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
- ✅ **ATS-Optimized PDF Export**: Professional, parseable output
- ✅ **AI Resume Optimization**: Live job description analysis and optimization
- ✅ **Privacy-First AI**: Client-side API key storage with direct OpenAI integration
- ✅ **Local Data Management**: Auto-save, recovery, sample data
- ✅ **Responsive Design**: Works on all devices
- ✅ **Accessibility**: WCAG compliant with keyboard navigation
- 🟡 **Template System**: Planned for Phase 2

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test them
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original inspiration from [RP2/resume-gen](https://github.com/RP2/resume-gen)
- Built with [Astro](https://astro.build/), [React](https://reactjs.org/), and [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Ready to build your career?** [Get started locally](#-getting-started) or [contribute to the project](https://github.com/RP2/resume-gen-web)!
