import { useCallback } from "react";
import type { ResumeData } from "../types/resume";

export const usePDFExport = (resumeData: ResumeData) => {
  const handleExportPDF = useCallback(
    async (resumeRef: React.RefObject<HTMLDivElement | null>) => {
      if (!resumeRef.current) return;

      try {
        // Create a new window for printing with proper styles
        const printWindow = window.open("", "_blank", "width=800,height=1000");

        if (!printWindow) {
          throw new Error(
            "Unable to open print window. Please allow pop-ups and try again.",
          );
        }

        // Get the resume HTML content
        const resumeContent = resumeRef.current.innerHTML;

        // Create the print document with proper styling
        const printDocument = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resume - ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</title>
            <style>
              /* Reset and base styles */
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              body {
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.5;
                color: #111827;
                background-color: #ffffff;
                padding: 2rem;
                max-width: 210mm;
                margin: 0 auto;
              }
              
              /* Typography */
              h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: #111827; }
              h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #111827; }
              h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #111827; }
              p { margin-bottom: 0.5rem; line-height: 1.6; }
              
              /* Text colors */
              .text-foreground { color: #111827; }
              .text-muted-foreground { color: #6b7280; }
              
              /* Spacing utilities */
              .space-y-5 > * + * { margin-top: 1.25rem; }
              
              /* Layout utilities */
              .flex { display: flex; }
              .flex-col { flex-direction: column; }
              .flex-row { flex-direction: row; }
              .items-start { align-items: flex-start; }
              .items-center { align-items: center; }
              .justify-start { justify-content: flex-start; }
              .justify-center { justify-content: center; }
              .justify-between { justify-content: space-between; }
              .flex-wrap { flex-wrap: wrap; }
              .flex-1 { flex: 1 1 0%; }
              .min-w-0 { min-width: 0px; }
              .shrink-0 { flex-shrink: 0; }
              .gap-1 { gap: 0.25rem; }
              .gap-2 { gap: 0.5rem; }
              .gap-4 { gap: 1rem; }
              .text-center { text-align: center; }
              .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
              .font-semibold { font-weight: 600; }
              .break-words { overflow-wrap: break-word; }
              .mb-2 { margin-bottom: 0.5rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-6 { margin-bottom: 1.5rem; }
              .mb-8 { margin-bottom: 2rem; }
              .mt-2 { margin-top: 0.5rem; }
              
              /* Responsive utilities for larger screens */
              @media (min-width: 640px) {
                .sm\\:flex-row { flex-direction: row; }
                .sm\\:items-start { align-items: flex-start; }
                .sm\\:justify-between { justify-content: space-between; }
                .sm\\:ml-4 { margin-left: 1rem; }
              }
              
              /* Header styling */
              header {
                text-align: center;
                padding-bottom: 1.5rem;
                margin-bottom: 2rem;
                border-bottom: 2px solid #e2e8f0;
              }
              
              header h1 {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                color: #000000;
              }
              
              header .contact-info {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 1rem;
                margin-top: 1rem;
              }
              
              header .contact-info > div {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
              }
              
              /* Links */
              a {
                color: #2563eb;
                text-decoration: none;
              }
              
              a:hover {
                text-decoration: underline;
              }
              
              /* Icons (simulate with text if needed) */
              svg, .h-4.w-4 {
                display: inline-block;
                width: 16px;
                height: 16px;
                vertical-align: middle;
              }
              
              /* Sections */
              section {
                margin-bottom: 2rem;
              }
              
              section h2 {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #e2e8f0;
                color: #000000;
              }
              
              /* Skills and badges */
              .skill-badge, .tech-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.25rem 0.75rem;
                margin: 0.125rem;
                background-color: #f8fafc;
                color: #6b7280;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                font-weight: 500;
                border: 1px solid #e2e8f0;
              }
              
              /* Experience and education items */
              .experience-item, .education-item, .project-item {
                margin-bottom: 1.5rem;
                page-break-inside: avoid;
              }
              
              .item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.5rem;
              }
              
              .item-title {
                font-weight: 600;
                color: #111827;
              }
              
              .item-company, .item-school {
                color: #6b7280;
                font-weight: 500;
              }
              
              .item-date {
                color: #6b7280;
                font-size: 0.875rem;
                white-space: nowrap;
              }
              
              /* Print styles */
              @media print {
                body {
                  padding: 0;
                  margin: 0;
                }
                
                @page {
                  margin: 1cm;
                  size: A4;
                }
                
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                
                .no-print {
                  display: none !important;
                }
                
                a {
                  color: #2563eb !important;
                }
                
                section {
                  page-break-inside: avoid;
                }
                
                .experience-item, .education-item, .project-item {
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            ${resumeContent}
            
            <script>
              // Auto-print when loaded
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
              
              // Handle print dialog closure
              window.onafterprint = function() {
                window.close();
              };
            </script>
          </body>
        </html>
      `;

        // Write content to print window
        printWindow.document.open();
        printWindow.document.write(printDocument);
        printWindow.document.close();
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert(
          `Error generating PDF: ${error instanceof Error ? error.message : "Please try again."}`,
        );
      }
    },
    [resumeData.personalInfo.firstName, resumeData.personalInfo.lastName],
  );

  return { handleExportPDF };
};
