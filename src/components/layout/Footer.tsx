import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Project Info */}
          <div className="space-y-3">
            <h3 className="text-foreground font-semibold">Resume Builder</h3>
            <p className="text-muted-foreground text-sm">
              A modern, ATS-optimized resume builder with AI-powered
              optimization features.
            </p>
            <p className="text-destructive text-xs font-semibold">
              Disclaimer: This project is a work in progress. Features and
              results may change.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-foreground font-semibold">Resources</h3>
            <nav className="flex flex-col space-y-2">
              <span className="inline-flex">
                <a
                  href="/"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Home
                </a>
              </span>
              <span className="inline-flex">
                <a
                  href="/about/"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  About
                </a>
              </span>
              <span className="inline-flex">
                <a
                  href="/privacy/"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Privacy Policy
                </a>
              </span>
              <span className="inline-flex">
                <a
                  href="https://github.com/RP2/resume-gen-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  GitHub
                </a>
              </span>
            </nav>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h3 className="text-foreground font-semibold">Built With</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs">
                Astro
              </span>
              <span className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs">
                React
              </span>
              <span className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs">
                TypeScript
              </span>
              <span className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs">
                Tailwind CSS
              </span>
              <span className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs">
                shadcn/ui
              </span>
              <span className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs">
                OpenAI API
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-muted-foreground flex flex-col justify-between text-sm sm:items-center lg:flex-row">
          <p>Created by Riley, licensed under MIT.</p>
          <p>An open source project for creating professional resumes.</p>
        </div>
      </div>
    </footer>
  );
}
