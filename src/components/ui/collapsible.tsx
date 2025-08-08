"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CollapsibleProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const CollapsibleContext = React.createContext<{
  open: boolean;
  toggle: () => void;
}>({
  open: false,
  toggle: () => {},
});

const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  open: controlledOpen,
  onOpenChange,
  className,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const toggle = React.useCallback(() => {
    const newOpen = !open;
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  }, [open, onOpenChange]);

  return (
    <CollapsibleContext.Provider value={{ open, toggle }}>
      <div className={cn(className)}>{children}</div>
    </CollapsibleContext.Provider>
  );
};

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  children,
  className,
}) => {
  const { toggle } = React.useContext(CollapsibleContext);

  return (
    <button onClick={toggle} className={cn(className)}>
      {children}
    </button>
  );
};

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  children,
  className,
}) => {
  const { open } = React.useContext(CollapsibleContext);

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        className,
      )}
    >
      {open && <div className="pt-2">{children}</div>}
    </div>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
