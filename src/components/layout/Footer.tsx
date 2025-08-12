import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        {/* Project Info at top */}
        <div className="mb-8 max-w-[75ch] space-y-3">
          <h3 className="text-foreground font-semibold">Resume Builder</h3>
          <p className="text-muted-foreground text-sm">
            A modern, ATS-optimized resume builder with AI-powered optimization
            features. By providing an OpenAI API key, you can leverage advanced
            AI capabilities such as content suggestions, formatting assistance,
            and more when providing a job description.
          </p>
          <p className="text-destructive text-xs font-semibold">
            Disclaimer: This project is a work in progress. Features and results
            may change.
          </p>
        </div>

        <Separator className="my-6" />

        {/* Links and credits, with better mobile separation */}
        <div className="flex flex-col gap-0 md:flex-row md:items-center md:justify-between md:gap-6">
          <nav className="flex flex-row flex-wrap justify-center gap-4 md:flex-row md:gap-6">
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Home
            </a>
            <a
              href="/about/"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              About
            </a>
            <a
              href="/privacy/"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://github.com/RP2/resume-gen-web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              GitHub
            </a>
          </nav>
          <div className="text-muted-foreground mt-6 text-center text-sm md:mt-0 md:ml-8 md:text-right">
            <p>Created with ❤️ by Riley, licensed under MIT.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
