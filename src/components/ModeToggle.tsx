import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  // Initialize from document state (safe, since layout sets it)
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const [theme, setTheme] = useState<"light" | "dark">(
    isDark ? "dark" : "light",
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList[next === "dark" ? "add" : "remove"](
      "dark",
    );
    localStorage.setItem("theme", next);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 cursor-pointer p-0"
      aria-label="Toggle theme"
    >
      <Sun
        className={`h-4 w-4 transition-all ${
          theme === "dark" ? "scale-0 -rotate-90" : "scale-100 rotate-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all ${
          theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
