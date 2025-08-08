/**
 * Keyboard shortcuts management utilities
 */

export interface ShortcutAction {
  key: string;
  description: string;
  action: () => void;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export interface ShortcutDisplay {
  key: string;
  action: string;
}

/**
 * Default keyboard shortcuts for the resume builder
 */
export const defaultShortcuts: ShortcutDisplay[] = [
  { key: "Ctrl + S", action: "Save resume as JSON" },
  { key: "Ctrl + O", action: "Open/Load resume file" },
  { key: "Ctrl + P", action: "Export as PDF (Print)" },
  { key: "Ctrl + E", action: "Export as PDF (Alternative)" },
  { key: "Ctrl + ,", action: "Open settings" },
  { key: "Ctrl + /", action: "Show keyboard shortcuts" },
  { key: "Ctrl + R", action: "Load sample data" },
  { key: "Ctrl + Shift + C", action: "Clear all data (with confirmation)" },
  { key: "Tab / Shift + Tab", action: "Navigate between sections" },
  { key: "Enter", action: "Add item in forms" },
  { key: "Esc", action: "Close modals" },
];

/**
 * Creates a keyboard event handler for shortcuts
 */
export const createShortcutHandler = (shortcuts: ShortcutAction[]) => {
  return (event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find((shortcut) => {
      const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatches = !shortcut.ctrlKey || event.ctrlKey;
      const metaMatches = !shortcut.metaKey || event.metaKey;
      const shiftMatches = !shortcut.shiftKey || event.shiftKey;
      const altMatches = !shortcut.altKey || event.altKey;

      return (
        keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  };
};

/**
 * Formats keyboard shortcut display text
 */
export const formatShortcutKey = (key: string): string => {
  return key
    .replace(/Ctrl/g, navigator.platform.includes("Mac") ? "⌘" : "Ctrl")
    .replace(/Alt/g, navigator.platform.includes("Mac") ? "⌥" : "Alt")
    .replace(/Shift/g, navigator.platform.includes("Mac") ? "⇧" : "Shift");
};
