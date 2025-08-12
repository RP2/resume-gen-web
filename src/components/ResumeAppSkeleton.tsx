import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "./ui/card";

export function ResumeAppSkeleton() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header skeleton: logo/title and actions */}
      <header className="bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 md:w-28" />
            <Skeleton className="h-8 w-8 md:w-28" />
            <Skeleton className="h-8 w-8 md:w-36" />
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-8 w-10" />
            <Skeleton className="hidden h-8 w-8 md:block" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {/* Left Column - Form and AI Panel skeletons */}
          <div className="space-y-4 sm:space-y-6">
            {/* Personal Info skeleton */}
            <Card className="p-6">
              <Skeleton className="mb-2 h-6 w-1/4" />
              <Skeleton className="mb-2 h-10 w-full" />
              <Skeleton className="h-6 w-1/4" />
              <div className="grid-cols-2 gap-x-4 md:grid">
                <div>
                  <Skeleton className="mb-1 h-4 w-1/4" />
                  <Skeleton className="mb-3 h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="mb-1 h-4 w-1/4" />
                  <Skeleton className="mb-3 h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="mb-1 h-4 w-1/4" />
                  <Skeleton className="mb-3 h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="mb-1 h-4 w-1/4" />
                  <Skeleton className="mb-3 h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="mb-1 h-4 w-1/4" />
                  <Skeleton className="mb-3 h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="mb-1 h-4 w-1/4" />
                  <Skeleton className="mb-3 h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="mb-1 h-4 w-1/4" />
                  <Skeleton className="mb-3 h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="mb-1 h-4 w-1/4" />
                  <Skeleton className="mb-3 h-10 w-full" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="mb-1 h-4 w-1/4" />
                  <Skeleton className="h-26 w-full" />
                </div>
              </div>
            </Card>
            {/* AI Optimization Panel skeleton */}
            <Card className="p-6">
              <Skeleton className="mb-2 h-6 w-1/3" />
              <div className="flex justify-center">
                <Skeleton className="h-56 w-2/3" />
              </div>
            </Card>
            {/* Data Management Panel skeleton */}
            <Card className="p-4">
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>

          {/* Right Column - Preview and Mobile Data Management skeletons */}
          <div className="space-y-4">
            {/* Resume preview skeleton */}
            <div className="overflow-hidden">
              <Card className="p-4">
                <Skeleton className="mx-auto mb-2 h-10 w-2/3" />
                <div className="mb-2 flex flex-wrap items-center justify-center gap-4 px-10">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
                {/* Experience entries */}
                <Skeleton className="mb-2 h-6 w-1/3" />
                <Skeleton className="mb-2 h-80 w-full" />
                <Skeleton className="mb-2 h-6 w-1/3" />
                <Skeleton className="mb-2 h-80 w-full" />
                {/* Education, skills, projects, etc. */}
                <Skeleton className="mb-2 h-6 w-1/3" />
                <Skeleton className="mb-2 h-80 w-full" />
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
