import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check, Undo2, Clock } from "lucide-react";
import type { ResumeSuggestion } from "../../lib/openai/api";

interface CompletedSuggestionsProps {
  completedSuggestions: (ResumeSuggestion & { completedAt?: string })[];
  onRestoreSuggestion?: (suggestion: ResumeSuggestion) => void;
}

const CompletedSuggestions: React.FC<CompletedSuggestionsProps> = ({
  completedSuggestions,
  onRestoreSuggestion,
}) => {
  if (completedSuggestions.length === 0) {
    return null;
  }

  const formatCompletedTime = (completedAt?: string) => {
    if (!completedAt) return "";
    const date = new Date(completedAt);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" />
          Completed Suggestions ({completedSuggestions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {completedSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="border-border bg-muted/30 space-y-2 rounded-lg border p-3 opacity-75"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground text-sm font-medium line-through">
                    {suggestion.title}
                  </span>
                  <Badge
                    className={`${getPriorityColor(suggestion.priority)} text-xs`}
                  >
                    {suggestion.priority}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs line-through">
                  {suggestion.description}
                </p>
                {suggestion.completedAt && (
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    Completed {formatCompletedTime(suggestion.completedAt)}
                  </div>
                )}
              </div>
              {onRestoreSuggestion && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestoreSuggestion(suggestion)}
                  className="flex items-center gap-1 text-xs"
                  title="Restore this suggestion"
                >
                  <Undo2 className="h-3 w-3" />
                  Restore
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CompletedSuggestions;
