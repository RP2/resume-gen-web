import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Download } from "lucide-react";
import ResumePreview from "../preview/ResumePreview";
import type { ResumeData } from "../../types/resume";

interface PreviewPanelProps {
  resumeData: ResumeData;
  resumeRef: React.RefObject<HTMLDivElement | null>;
  isExporting: boolean;
  onExportPDF: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  resumeData,
  resumeRef,
  isExporting,
  onExportPDF,
}) => {
  return (
    <div className="lg:sticky lg:top-6 lg:self-start">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resume Preview</CardTitle>
            <div className="flex gap-2">
              <Button onClick={onExportPDF} disabled={isExporting} size="sm">
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Opening..." : "Download Resume"}
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Opens a new tab with PDF-optimized view. Links remain clickable. Use
            Ctrl+P to save as PDF.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <div ref={resumeRef}>
              <ResumePreview data={resumeData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewPanel;
