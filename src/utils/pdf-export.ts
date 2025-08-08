/**
 * ATS-Optimized PDF Export Utility
 *
 * This PDF export is specifically optimized for Applicant Tracking Systems (ATS)
 * and HR screening AI agents to maximize compatibility and parsing accuracy.
 *
 * ATS/AI Optimization Features:
 * - Uses Times New Roman font (most ATS-compatible font)
 * - Pure black text on white background (no colors or gradients)
 * - Standard section headings in ALL CAPS with keywords ATS systems recognize
 * - No icons, graphics, or visual elements that confuse parsers
 * - Simple linear layout with clear hierarchy
 * - Contact information in machine-readable format
 * - Skills and technologies in comma-separated lists (keyword-rich)
 * - Standard font sizes (10pt-18pt range preferred by ATS)
 * - Proper semantic HTML structure for screen readers and parsers
 * - No tables, columns, or complex layouts
 * - Clickable links and selectable text preserved
 * - Keywords positioned strategically for AI ranking algorithms
 * - Standard section names: PROFESSIONAL EXPERIENCE, EDUCATION, SKILLS, PROJECTS
 * - Job titles, company names, and dates in predictable format
 *
 * Uses browser's native print API for true PDF generation compatible with all ATS systems
 */

export interface PDFExportOptions {
  title?: string;
  filename?: string;
  showPageNumbers?: boolean;
}

export const exportToPDF = async (
  element: HTMLElement,
  options: PDFExportOptions = {},
): Promise<void> => {
  const {
    title = "Resume",
    filename = "resume.pdf",
    showPageNumbers = true,
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // Create a new window with PDF-optimized view
      const pdfWindow = window.open("", "_blank", "width=800,height=1000");

      if (!pdfWindow) {
        throw new Error(
          "Unable to open PDF window. Please allow pop-ups and try again.",
        );
      }

      // Get the resume HTML content
      const resumeContent = element.innerHTML;

      // Create the PDF document with comprehensive styling
      const pdfDocument = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
              /* Reset and base styles */
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Simplified browser pagination support */
              @media print {
                @page {
                  margin: 1.5cm;
                  size: A4 portrait;
                }
                
                /* Ensure proper page breaks */
                section {
                  page-break-inside: avoid;
                  break-inside: avoid;
                }
                
                .experience-item, .education-item, .project-item {
                  page-break-inside: avoid;
                  break-inside: avoid;
                }
                
                /* Hide any default browser print elements */
                body::before,
                body::after {
                  display: none !important;
                }
              }
              
              body {
                font-family: 'Times New Roman', 'Liberation Serif', serif;
                line-height: 1.5;
                color: #000000;
                background-color: #ffffff;
                padding: 0;
                margin: 0;
                max-width: 210mm;
                font-size: 12pt;
              }
              
              /* ATS/AI-Optimized Typography for maximum parsing accuracy */
              h1 { 
                font-size: 18pt !important; 
                font-weight: bold !important; 
                margin-bottom: 8pt !important; 
                color: #000000 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5pt !important;
                text-align: center !important;
              }
              h2 { 
                font-size: 14pt !important; 
                font-weight: bold !important; 
                margin-bottom: 8pt !important; 
                margin-top: 16pt !important;
                color: #000000 !important;
                text-transform: uppercase !important;
                border-bottom: 1pt solid #000000 !important;
                padding-bottom: 2pt !important;
              }
              h3 { 
                font-size: 12pt !important; 
                font-weight: bold !important; 
                margin-bottom: 2pt !important; 
                color: #000000 !important;
              }
              p { 
                margin-bottom: 4pt !important; 
                line-height: 1.3 !important;
                font-size: 11pt !important;
                color: #000000 !important;
              }
              
              /* Layout utilities */
              .flex { display: flex; }
              .items-center { align-items: center; }
              .justify-center { justify-content: center; }
              .justify-between { justify-content: space-between; }
              .flex-wrap { flex-wrap: wrap; }
              .gap-2 { gap: 0.5rem; }
              .gap-4 { gap: 1rem; }
              .text-center { text-align: center; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-6 { margin-bottom: 1.5rem; }
              .mb-8 { margin-bottom: 2rem; }
              
              /* ATS-Optimized Header styling */
              header {
                text-align: center;
                padding-bottom: 12pt;
                margin-bottom: 16pt;
                border-bottom: 1pt solid #000000;
              }
              
              header h1 {
                font-size: 20pt;
                font-weight: 700;
                margin-bottom: 8pt;
                color: #000000;
                text-transform: uppercase;
                letter-spacing: 1pt;
              }
              
              /* ATS-Optimized Contact Information - Machine Readable Format */
              header .contact-info {
                display: block !important;
                text-align: center !important;
                margin-top: 8pt !important;
                line-height: 1.4 !important;
                font-size: 11pt !important;
              }
              
              header .contact-info > div {
                display: inline !important;
                margin: 0 12pt !important;
                color: #000000 !important;
              }
              
              /* Remove ALL visual elements that confuse ATS systems */
              svg, .h-4, .w-4, .h-5, .w-5, 
              .lucide, .lucide-icon, .icon,
              [class*="icon"], [class*="svg"] {
                display: none !important;
              }
              
              /* ATS-Compatible Links - Preserve functionality but remove styling */
              a {
                color: #000000 !important;
                text-decoration: none !important;
                font-weight: normal !important;
              }
              
              a:hover, a:visited, a:active {
                color: #000000 !important;
                text-decoration: none !important;
              }
              
              /* ATS/AI-Optimized Sections with Keyword Recognition */
              section {
                margin-bottom: 14pt !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              
              /* Standard ATS Section Headers */
              section h2 {
                font-size: 14pt !important;
                font-weight: bold !important;
                margin-bottom: 8pt !important;
                margin-top: 16pt !important;
                padding-bottom: 3pt !important;
                border-bottom: 1pt solid #000000 !important;
                color: #000000 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5pt !important;
              }
              
              /* Job/Education/Project Entries - ATS-Friendly Structure */
              .experience-item, .education-item, .project-item {
                margin-bottom: 12pt !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              
              /* Job Title/Position - Critical for ATS keyword matching */
              .experience-item h3, .project-item h3 {
                font-size: 12pt !important;
                font-weight: bold !important;
                color: #000000 !important;
                margin-bottom: 2pt !important;
              }
              
              /* Company/Institution Names - Important for ATS */
              .experience-item p:first-of-type,
              .education-item p:first-of-type {
                font-weight: 600 !important;
                color: #000000 !important;
                font-size: 11pt !important;
              }
              
              /* Skills Section - Keyword Optimization */
              .skills-section h3 {
                font-weight: bold !important;
                color: #000000 !important;
                margin-bottom: 3pt !important;
                font-size: 12pt !important;
              }
              
              /* Comma-separated skills for maximum ATS parsing */
              .skills-list, .technologies-list {
                color: #000000 !important;
                line-height: 1.4 !important;
                font-size: 11pt !important;
              }
              
              /* Force consistent spacing - Override all Tailwind spacing */
              .space-y-0\.5 > * + *, .space-y-1 > * + *, .space-y-2 > * + *,
              .space-y-3 > * + *, .space-y-4 > * + *, .space-y-5 > * + * {
                margin-top: 4pt !important;
              }
              
              /* Tighter spacing within job/project entries */
              .experience-item > *, .education-item > *, .project-item > * {
                margin-bottom: 2pt !important;
              }
              
              .experience-item ul, .education-item ul, .project-item ul {
                margin-top: 3pt !important;
                margin-bottom: 6pt !important;
                padding-left: 18pt !important;
              }
              
              .experience-item li, .education-item li, .project-item li {
                margin-bottom: 1pt !important;
                line-height: 1.3 !important;
                font-size: 11pt !important;
              }
              
              /* Date alignment - Standard ATS format */
              .flex.items-start.justify-between {
                margin-bottom: 3pt !important;
              }
              
              /* Consistent margins */
              .mb-1 { margin-bottom: 2pt !important; }
              .mb-2 { margin-bottom: 4pt !important; }
              .mb-3 { margin-bottom: 6pt !important; }
              .mb-4 { margin-bottom: 8pt !important; }
              .mb-6 { margin-bottom: 12pt !important; }
              
              .mt-1 { margin-top: 2pt !important; }
              .mt-2 { margin-top: 4pt !important; }
              
              /* ATS-friendly Skills formatting */
              .skill-list, .tech-list {
                color: #000000;
                line-height: 1.4;
                font-size: 11pt;
              }
              
              .skill-list strong, .tech-list strong {
                color: #000000;
                font-weight: 600;
              }
              
              /* Better spacing between entries */
              .experience-item, .education-item, .project-item {
                margin-bottom: 14pt;
                page-break-inside: avoid;
              }
              
              .item-header {
                margin-bottom: 2pt;
              }
              
              .item-title {
                font-weight: 600;
                color: #000000;
                font-size: 12pt;
                margin-bottom: 1pt;
              }
              
              .item-company, .item-school {
                color: #000000;
                font-weight: 500;
                font-size: 11pt;
                margin-bottom: 2pt;
              }
              
              .item-date {
                color: #000000;
                font-size: 11pt;
                font-weight: normal;
              }
              
              /* Tighter bullet points */
              ul {
                margin: 3pt 0;
                padding-left: 20pt;
              }
              
              li {
                margin-bottom: 1pt;
                font-size: 11pt;
                line-height: 1.3;
              }
              
              /* Tailwind spacing classes for PDF - more specific targeting */
              .space-y-0\.5 > * + * { margin-top: 2pt !important; }
              .space-y-1 > * + * { margin-top: 4pt !important; }
              .space-y-4 > * + * { margin-top: 12pt !important; }
              .space-y-5 > * + * { margin-top: 14pt !important; }
              
              .mb-3 { margin-bottom: 4pt !important; }
              .mb-6 { margin-bottom: 16pt !important; }
              
              /* Direct targeting of resume structure */
              section > div.space-y-5 > div + div {
                margin-top: 14pt !important;
              }
              
              section > div.space-y-4 > div + div {
                margin-top: 12pt !important;
              }
              
              /* Force section heading spacing */
              section h2.text-xl.font-bold {
                margin-bottom: 4pt !important;
                margin-top: 14pt !important;
              }
              
              /* Override any conflicting margins */
              .space-y-1 > * {
                margin-bottom: 0 !important;
              }
              
              .space-y-1 > * + * {
                margin-top: 4pt !important;
              }
              
              /* Comprehensive spacing override for resume sections */
              
              /* Section headers - reduce gap to content */
              h2.text-xl.font-bold.mb-3 {
                margin-bottom: 4pt !important;
              }
              
              /* Work Experience and Projects - increase space between entries */
              .space-y-5 > div + div {
                margin-top: 16pt !important;
              }
              
              /* Education - moderate space between entries */  
              .space-y-4 > div + div {
                margin-top: 12pt !important;
              }
              
              /* Within each entry - keep tight spacing */
              .space-y-1 > * + * {
                margin-top: 3pt !important;
              }
              
              .space-y-0\.5 > * + * {
                margin-top: 2pt !important;
              }
              
              /* Override any default margins */
              section > div > div {
                margin-bottom: 0 !important;
              }
              
              /* Ensure proper paragraph spacing within entries */
              .space-y-1 p + p {
                margin-top: 3pt !important;
              }
              
              .space-y-1 p + ul {
                margin-top: 3pt !important;
              }
              
              /* Text size classes */
              .text-sm { font-size: 11pt !important; }
              .text-xl { font-size: 14pt !important; }
              
              /* Ensure consistent line heights */
              .text-sm, p.text-sm { line-height: 1.3 !important; }
              
              /* Tighter paragraph spacing */
              p {
                margin-bottom: 2pt;
                line-height: 1.4;
                font-size: 11pt;
              }
              
              /* Force ATS-friendly styling */
              .text-foreground, .text-card-foreground, 
              .text-primary, .text-muted-foreground { 
                color: #000000 !important; 
              }
              .bg-card, .bg-background, .bg-muted { 
                background-color: #ffffff !important; 
              }
              .border, .border-b, .border-border { 
                border-color: #000000 !important; 
              }
              
              /* ATS Print-specific optimizations */
              @media print {
                /* Remove all flexbox for ATS compatibility */
                .flex, .items-center, .justify-center, .justify-between, .flex-wrap {
                  display: block !important;
                }
                
                /* Ensure no page breaks within important elements */
                .experience-item, .education-item, .project-item,
                section h2, .item-header {
                  page-break-inside: avoid;
                }
                
                /* Ensure proper spacing */
                section {
                  margin-bottom: 16pt;
                }
                
                /* Force black text for all elements */
                * {
                  color: #000000 !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                
                /* Remove all background colors */
                * {
                  background-color: transparent !important;
                }
                
                /* Hide decorative elements */
                .shadow-lg, .shadow, .border-2 {
                  box-shadow: none !important;
                  border: none !important;
                }
                
                /* ATS-friendly contact info layout */
                header .contact-info {
                  display: block !important;
                  text-align: center !important;
                }
                
                header .contact-info > div {
                  display: inline !important;
                  margin: 0 8pt !important;
                }
                
                /* Hide any non-print elements */
                .no-print {
                  display: none !important;
                }
                
                /* Optimize page usage */
                body {
                  margin: 0;
                  padding: 1cm;
                }
              }
            </style>
          </head>
          <body>
            ${resumeContent}
            
            <script>
              // Add print instructions overlay and page numbers
              window.onload = function() {
                const overlay = document.createElement('div');
                overlay.innerHTML = \`
                  <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #3b82f6;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    cursor: pointer;
                  " onclick="this.parentElement.remove()">
                    💡 Press Ctrl+P (Cmd+P on Mac) to save as PDF
                    <br><small style="opacity: 0.9;">Click to dismiss</small>
                  </div>
                \`;
                document.body.appendChild(overlay);
                
                // Simple page numbering approach - tell user about browser options
                document.body.innerHTML += \`
                  <div style="
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: #f3f4f6;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 16px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    font-size: 12px;
                    max-width: 300px;
                    z-index: 999;
                    line-height: 1.4;
                  ">
                    <strong>📄 Page Numbers:</strong><br>
                    To show page numbers in your PDF:<br>
                    1. Press Ctrl+P (Cmd+P on Mac)<br>
                    2. Click "More settings"<br>
                    3. Check "Headers and footers"<br>
                    <br>
                    <small style="color: #6b7280;">
                    This will add page numbers but also includes the date and URL.
                    Most ATS systems ignore header/footer content.
                    </small>
                    <button onclick="this.parentElement.remove()" style="
                      position: absolute;
                      top: 8px;
                      right: 8px;
                      background: none;
                      border: none;
                      font-size: 16px;
                      cursor: pointer;
                      color: #6b7280;
                    ">×</button>
                  </div>
                \`;
                
                // Auto-hide after 12 seconds
                setTimeout(() => {
                  if (overlay.parentElement) {
                    overlay.remove();
                  }
                }, 8000);
              };
            </script>
          </body>
        </html>
      `;

      // Write content to PDF window
      pdfWindow.document.open();
      pdfWindow.document.write(pdfDocument);
      pdfWindow.document.close();

      // Focus the new window so user can easily save as PDF
      pdfWindow.focus();

      // Resolve immediately since we're not auto-printing
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// Additional utility to remove unnecessary packages check
export const checkUnnecessaryPackages = () => {
  const unnecessaryPackages = ["html2canvas", "jspdf"];

  console.warn(
    "The following packages are no longer needed and can be removed:",
    unnecessaryPackages,
  );

  return unnecessaryPackages;
};
