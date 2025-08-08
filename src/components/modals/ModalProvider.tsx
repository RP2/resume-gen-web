import React from "react";
import type { ReactNode } from "react";

interface ModalProviderProps {
  children: ReactNode;
}

// Simple provider that just wraps children - modals are controlled by parent state
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  return <>{children}</>;
};
