import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ExternalLink,
  Check,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import type { ResumeAnalysis, ResumeSuggestion } from "../../lib/openai/api";

interface SuggestionsListProps {
  analysis: ResumeAnalysis;
  onGoToSection?: (suggestion: ResumeSuggestion) => void;
  onMarkAsDone?: (suggestion: ResumeSuggestion) => void;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
  analysis,
  onGoToSection,
  onMarkAsDone,
}) => {
  const [collapsedSuggestions, setCollapsedSuggestions] = useState<Set<string>>(
    new Set(),
  );

  if (!analysis) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-secondary/30 text-secondary-foreground border-secondary/50";
      case "low":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "highlight":
        return <TrendingUp className="h-4 w-4" />;
      case "modify":
        return <Edit className="h-4 w-4" />;
      case "add":
        return <Plus className="h-4 w-4" />;
      case "reorder":
        return <ArrowUp className="h-4 w-4" />;
      case "remove":
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSectionName = (section: string) => {
    switch (section) {
      case "personalInfo":
        return "Personal Info";
      case "workExperience":
        return "Work Experience";
      case "skills":
        return "Skills";
      case "projects":
        return "Projects";
      case "education":
        return "Education";
      default:
        return section;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-destructive";
  };

  const highPrioritySuggestions = analysis.suggestions.filter(
    (s) => s.priority === "high",
  );
  const mediumPrioritySuggestions = analysis.suggestions.filter(
    (s) => s.priority === "medium",
  );
  const lowPrioritySuggestions = analysis.suggestions.filter(
    (s) => s.priority === "low",
  );

  return (
    <div className="space-y-6">
      {/* Quick Summary Stats */}
      <Card>
        <CardContent className="p-3 pt-4 sm:p-4 sm:pt-6 md:p-6">
          <div className="grid grid-cols-2 gap-3 text-center sm:gap-4 md:grid-cols-4">
            <div
              className="cursor-help"
              title={`Overall compatibility score based on job requirements, skills match, and experience relevance`}
            >
              <div
                className={`text-2xl font-bold sm:text-3xl ${getScoreColor(analysis.overallScore)}`}
              >
                {analysis.overallScore}%
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                Match Score
              </div>
            </div>
            <div
              className="cursor-help"
              title={`${analysis.suggestions.length} total suggestions: ${highPrioritySuggestions.length} high, ${mediumPrioritySuggestions.length} medium, ${lowPrioritySuggestions.length} low priority`}
            >
              <div className="text-foreground text-2xl font-bold sm:text-3xl">
                {analysis.suggestions.length}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                Suggestions
              </div>
              {analysis.suggestions.length > 0 && (
                <div className="text-muted-foreground mt-1 text-xs">
                  {highPrioritySuggestions.length > 0 && (
                    <span className="text-destructive mr-2">
                      {highPrioritySuggestions.length} high
                    </span>
                  )}
                  {mediumPrioritySuggestions.length > 0 && (
                    <span className="mr-2 text-yellow-600">
                      {mediumPrioritySuggestions.length} med
                    </span>
                  )}
                  {lowPrioritySuggestions.length > 0 && (
                    <span className="text-primary">
                      {lowPrioritySuggestions.length} low
                    </span>
                  )}
                </div>
              )}
            </div>
            <div
              className="cursor-help"
              title={`${analysis.matchingStrengths.length} strengths found: ${analysis.matchingStrengths.slice(0, 3).join(", ")}${analysis.matchingStrengths.length > 3 ? "..." : ""}`}
            >
              <div className="text-foreground text-2xl font-bold sm:text-3xl">
                {analysis.matchingStrengths.length}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                Strengths
              </div>
            </div>
            <div
              className="cursor-help"
              title={`${analysis.gaps.length} gaps identified: ${analysis.gaps.slice(0, 3).join(", ")}${analysis.gaps.length > 3 ? "..." : ""}`}
            >
              <div className="text-foreground text-2xl font-bold sm:text-3xl">
                {analysis.gaps.length}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                Gaps
              </div>
            </div>
          </div>

          {/* Summary breakdown */}
          <div className="border-border mt-4 border-t pt-4">
            <div className="text-muted-foreground grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
              <div className="text-center sm:text-left">
                <span className="font-medium">Analysis:</span>{" "}
                {analysis.suggestions.length} suggestions found across{" "}
                {new Set(analysis.suggestions.map((s) => s.section)).size}{" "}
                resume sections
              </div>
              <div className="text-center">
                <span className="font-medium">Strengths:</span>{" "}
                {analysis.matchingStrengths.length} areas already aligned with
                job
              </div>
              <div className="text-center sm:text-right">
                <span className="font-medium">Priority:</span> Focus on{" "}
                {highPrioritySuggestions.length > 0
                  ? "high"
                  : mediumPrioritySuggestions.length > 0
                    ? "medium"
                    : "low"}{" "}
                priority items first
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resume Analysis</span>
            <div
              className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}
            >
              {analysis.overallScore}%
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-2 sm:space-y-3 sm:p-3 md:space-y-4 md:p-6">
          <p className="text-muted-foreground text-sm break-words">
            {analysis.summary}
          </p>

          {/* Key Requirements */}
          {analysis.keyRequirements.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">
                Key Job Requirements:
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.keyRequirements.map((req, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="max-w-full text-xs break-words whitespace-normal"
                    title={req}
                  >
                    <span className="break-all">{req}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Matching Strengths */}
          {analysis.matchingStrengths.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                Matching Strengths:
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matchingStrengths.map((strength, index) => (
                  <Badge
                    key={index}
                    className="max-w-full border-green-200 bg-green-100 text-xs break-words whitespace-normal text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-200"
                    title={strength}
                  >
                    <span className="break-all">{strength}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Gaps */}
          {analysis.gaps.length > 0 && (
            <div>
              <h4 className="text-destructive mb-2 flex items-center gap-1 text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                Areas to Address:
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.gaps.map((gap, index) => (
                  <Badge
                    key={index}
                    className="border-destructive/20 bg-destructive/10 text-destructive max-w-full text-xs break-words whitespace-normal"
                    title={gap}
                  >
                    <span className="break-all">{gap}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* High Priority Suggestions */}
      {highPrioritySuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              High Priority Suggestions ({highPrioritySuggestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 lg:space-y-4">
            {highPrioritySuggestions.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                suggestion={suggestion}
                onGoToSection={onGoToSection}
                onMarkAsDone={onMarkAsDone}
                isCollapsed={collapsedSuggestions.has(suggestion.title)}
                getPriorityColor={getPriorityColor}
                getTypeIcon={getTypeIcon}
                getSectionName={getSectionName}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Medium Priority Suggestions */}
      {mediumPrioritySuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <Info className="h-5 w-5" />
              Medium Priority Suggestions ({mediumPrioritySuggestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 lg:space-y-4">
            {mediumPrioritySuggestions.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                suggestion={suggestion}
                onGoToSection={onGoToSection}
                onMarkAsDone={onMarkAsDone}
                isCollapsed={collapsedSuggestions.has(suggestion.title)}
                getPriorityColor={getPriorityColor}
                getTypeIcon={getTypeIcon}
                getSectionName={getSectionName}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Low Priority Suggestions */}
      {lowPrioritySuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Enhancement Suggestions ({lowPrioritySuggestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 lg:space-y-4">
            {lowPrioritySuggestions.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                suggestion={suggestion}
                onGoToSection={onGoToSection}
                onMarkAsDone={onMarkAsDone}
                isCollapsed={collapsedSuggestions.has(suggestion.title)}
                getPriorityColor={getPriorityColor}
                getTypeIcon={getTypeIcon}
                getSectionName={getSectionName}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface SuggestionCardProps {
  suggestion: ResumeSuggestion;
  onGoToSection?: (suggestion: ResumeSuggestion) => void;
  onMarkAsDone?: (suggestion: ResumeSuggestion) => void;
  isCollapsed?: boolean;
  getPriorityColor: (priority: string) => string;
  getTypeIcon: (type: string) => React.ReactNode;
  getSectionName: (section: string) => string;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onGoToSection,
  onMarkAsDone,
  isCollapsed = false,
  getPriorityColor,
  getTypeIcon,
  getSectionName,
}) => {
  const handleGoToSection = () => {
    if (onGoToSection) {
      onGoToSection(suggestion);
    }
  };

  const handleMarkAsDone = () => {
    if (onMarkAsDone) {
      onMarkAsDone(suggestion);
    }
  };

  const handleCopyToClipboard = async () => {
    if (suggestion.suggestedContent) {
      try {
        await navigator.clipboard.writeText(suggestion.suggestedContent);
        toast.success("Copied to clipboard!", {
          description: "Suggestion text copied successfully",
          duration: 2000,
        });
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        toast.error("Copy failed", {
          description:
            "Could not copy to clipboard. Please try selecting the text manually.",
          duration: 3000,
        });
      }
    }
  };

  if (isCollapsed) {
    return (
      <div className="border-border space-y-2 rounded-lg border p-2 opacity-50 sm:p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Check className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm line-through">
              {suggestion.title}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAsDone}
            className="w-full text-xs sm:w-auto"
          >
            Undo
          </Button>
        </div>
        <p className="text-muted-foreground ml-6 text-xs">Completed</p>
      </div>
    );
  }

  return (
    <div className="border-border space-y-2 rounded-lg border p-2 sm:space-y-3 sm:p-3 md:p-4">
      {/* Header with title and badges - stack on mobile */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {getTypeIcon(suggestion.type)}
          <h5 className="min-w-0 text-sm font-medium break-words">
            {suggestion.title}
          </h5>
          <Badge
            className={`${getPriorityColor(suggestion.priority)} shrink-0 text-xs`}
          >
            {suggestion.priority}
          </Badge>
          <Badge variant="outline" className="shrink-0 text-xs">
            {getSectionName(suggestion.section)}
          </Badge>
          {suggestion.type === "add" && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary text-xs"
            >
              +Add Content
            </Badge>
          )}
        </div>

        {/* Buttons - stack vertically on mobile, horizontal on larger screens */}
        <div className="flex flex-col gap-2 sm:ml-2 sm:flex-row sm:items-center">
          {/* Go to Section Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleGoToSection}
            className="flex w-full items-center justify-center gap-1 sm:w-auto"
          >
            <ExternalLink className="h-3 w-3" />
            <span className="sm:inline">
              Go to {getSectionName(suggestion.section)}
            </span>
          </Button>

          {/* Mark as Done Button */}
          <Button
            size="sm"
            onClick={handleMarkAsDone}
            className="w-full sm:w-auto"
          >
            <Check className="mr-1 h-3 w-3" />
            Mark as Done
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground text-sm break-words">
        {suggestion.description}
      </p>

      {/* Show what will be added/changed */}
      {suggestion.type === "add" &&
        suggestion.suggestedContent &&
        !suggestion.currentContent && (
          <div className="border-primary/20 bg-primary/5 rounded border p-2 sm:p-3">
            <h6 className="text-primary mb-2 flex items-center text-xs font-medium">
              <Plus className="mr-1 h-3 w-3" />
              Will Add:
            </h6>
            <div
              className="bg-card text-foreground hover:bg-muted/50 group relative cursor-pointer rounded border p-2 font-mono text-xs leading-relaxed transition-colors sm:leading-normal"
              onClick={handleCopyToClipboard}
              title="Click to copy to clipboard"
            >
              <div className="pr-6 break-words">
                {suggestion.suggestedContent}
              </div>
              <Copy className="text-muted-foreground group-hover:text-foreground absolute top-2 right-2 h-3 w-3 transition-colors" />
            </div>
          </div>
        )}

      {suggestion.currentContent && (
        <div className="space-y-2">
          <div className="border-destructive/20 bg-destructive/5 rounded border p-2 sm:p-3">
            <h6 className="text-destructive mb-1 flex items-center text-xs font-medium">
              <Edit className="mr-1 h-3 w-3" />
              Current:
            </h6>
            <p className="bg-card text-foreground rounded border p-2 font-mono text-xs leading-relaxed break-words sm:leading-normal">
              {suggestion.currentContent}
            </p>
          </div>
          {suggestion.suggestedContent && (
            <div className="rounded border border-green-200 bg-green-50 p-2 sm:p-3 dark:border-green-800 dark:bg-green-900/20">
              <h6 className="mb-1 flex items-center text-xs font-medium text-green-800 dark:text-green-200">
                <ArrowUp className="mr-1 h-3 w-3" />
                Will Change To:
              </h6>
              <div
                className="bg-card text-foreground hover:bg-muted/50 group relative cursor-pointer rounded border p-2 font-mono text-xs leading-relaxed transition-colors sm:leading-normal"
                onClick={handleCopyToClipboard}
                title="Click to copy to clipboard"
              >
                <div className="pr-6 break-words">
                  {suggestion.suggestedContent}
                </div>
                <Copy className="text-muted-foreground group-hover:text-foreground absolute top-2 right-2 h-3 w-3 transition-colors" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestionsList;
