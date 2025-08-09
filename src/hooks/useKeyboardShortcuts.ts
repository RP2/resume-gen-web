import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  onDownloadResume: () => void;
  onUploadResume: () => void;
  onExportPDF: () => void;
  onOpenSettings: () => void;
  onLoadSampleData: () => void;
  onOpenShortcuts: () => void;
  onClearAllData: () => void;
  onCloseModals: () => void;
}

export const useKeyboardShortcuts = ({
  onDownloadResume,
  onUploadResume,
  onExportPDF,
  onOpenSettings,
  onLoadSampleData,
  onOpenShortcuts,
  onClearAllData,
  onCloseModals,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            onDownloadResume();
            break;
          case "o":
            e.preventDefault();
            onUploadResume();
            break;
          case "e":
            e.preventDefault();
            onExportPDF();
            break;
          case "p":
            e.preventDefault();
            onExportPDF();
            break;
          case ",":
            e.preventDefault();
            onOpenSettings();
            break;
          case "r":
            e.preventDefault();
            onLoadSampleData();
            break;
          case "/":
            e.preventDefault();
            onOpenShortcuts();
            break;
        }

        if (e.shiftKey && e.key === "C") {
          e.preventDefault();
          onClearAllData();
        }
      }

      if (e.key === "Escape") {
        onCloseModals();
      }
    };

    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [
    onDownloadResume,
    onUploadResume,
    onExportPDF,
    onOpenSettings,
    onLoadSampleData,
    onOpenShortcuts,
    onClearAllData,
    onCloseModals,
  ]);
};
