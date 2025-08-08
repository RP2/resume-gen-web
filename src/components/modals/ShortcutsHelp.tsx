import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Keyboard } from "lucide-react";
import {
  defaultShortcuts,
  formatShortcutKey,
} from "../../utils/keyboard-shortcuts";

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose }) => {
  const shortcuts = defaultShortcuts;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="focus:outline-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                {shortcut.action}
              </span>
              <Badge variant="outline" className="font-mono text-xs">
                {formatShortcutKey(shortcut.key)}
              </Badge>
            </div>
          ))}
        </div>
        <Button onClick={onClose} className="mt-6 w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsHelp;
