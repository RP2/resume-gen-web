import React from "react";
import { Settings, Download, Upload, Keyboard } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../ModeToggle";

interface HeaderProps {
  onSettingsClick: () => void;
  onShortcutsClick?: () => void;
  onDownloadResume?: () => void;
  onUploadResume?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSettingsClick,
  onShortcutsClick,
  onDownloadResume,
  onUploadResume,
}) => {
  return (
    <header className="bg-background/95 sticky top-0 z-50 flex w-full justify-around border-b backdrop-blur">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold">AI Resume Generator</h1>
      </div>

      <div className="my-2 flex items-center space-x-2">
        {onUploadResume && (
          <Button
            variant="outline"
            size="sm"
            onClick={onUploadResume}
            className="hidden sm:flex"
            title="Load resume (Ctrl+O)"
          >
            <Upload className="mr-2 h-4 w-4" />
            Load Resume
          </Button>
        )}

        {onDownloadResume && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadResume}
            className="hidden sm:flex"
            title="Save resume (Ctrl+S)"
          >
            <Download className="mr-2 h-4 w-4" />
            Save Resume
          </Button>
        )}

        {onShortcutsClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShortcutsClick}
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

        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
