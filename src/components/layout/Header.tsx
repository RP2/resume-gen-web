import { Settings, Download, Upload, Keyboard, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../ModeToggle";

interface HeaderProps {
  onSettingsClick: () => void;
  onShortcutsClick?: () => void;
  onDownloadResume?: () => void;
  onUploadResume?: () => void;
  onExportPDF?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSettingsClick,
  onShortcutsClick,
  onDownloadResume,
  onUploadResume,
  onExportPDF,
}) => {
  return (
    <header className="bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <h1 className="text-sm font-semibold lg:text-lg">AI Resume Builder</h1>

        <div className="flex items-center space-x-2">
          {onUploadResume && (
            <Button
              variant="outline"
              size="sm"
              onClick={onUploadResume}
              title="Load resume (Ctrl+O)"
            >
              <Upload className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Load Data</span>
            </Button>
          )}

          {onDownloadResume && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadResume}
              title="Save resume data (Ctrl+S)"
            >
              <Download className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Save Data</span>
            </Button>
          )}

          {onExportPDF && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              title="Export PDF"
            >
              <FileText className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Download PDF</span>
            </Button>
          )}

          {onShortcutsClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShortcutsClick}
              className="hidden lg:flex"
              title="Keyboard shortcuts (Ctrl+/)"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onSettingsClick}
            title="Settings (Ctrl+,)"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* light and dark heme toggle */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
