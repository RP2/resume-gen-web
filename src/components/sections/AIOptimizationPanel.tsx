import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Bot, Sparkles, FileText } from "lucide-react";
import SuggestionsList from "./SuggestionsList";
import type { ResumeAnalysis, ResumeSuggestion } from "../../lib/openai/api";
import { getSampleJobDescription } from "../../data/sampleJobDescriptions";

interface AIOptimizationPanelProps {
  apiKey: string;
  jobDescription: string;
  isOptimizing: boolean;
  suggestions: string;
  analysis: ResumeAnalysis | null;
  completedSuggestions: ResumeSuggestion[];
  onJobDescriptionChange: (value: string) => void;
  onOptimizeResume: () => void;
  onOpenSettings: () => void;
  onGoToSection?: (suggestion: ResumeSuggestion) => void;
  onMarkAsDone?: (suggestion: ResumeSuggestion) => void;
  onClearCompletedSuggestions?: () => void;
}

const AIOptimizationPanel: React.FC<AIOptimizationPanelProps> = ({
  apiKey,
  jobDescription,
  isOptimizing,
  suggestions,
  analysis,
  completedSuggestions,
  onJobDescriptionChange,
  onOptimizeResume,
  onOpenSettings,
  onGoToSection,
  onMarkAsDone,
  onClearCompletedSuggestions,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Resume Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {!apiKey ? (
            <div className="space-y-4 py-8 text-center">
              <div className="text-muted-foreground">
                <Bot className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p className="text-sm">
                  AI resume optimization requires an OpenAI API key
                </p>
                <p className="mt-2 text-xs">
                  Click the settings button to add your API key and unlock
                  AI-powered resume suggestions
                </p>
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  Note: The API key is temporary and will be cleared when you
                  refresh the page
                </p>
              </div>
              <Button onClick={onOpenSettings} variant="outline" size="sm">
                Add API Key
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Job Description</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Sample Jobs
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onJobDescriptionChange(
                            getSampleJobDescription("softwareEngineer"),
                          )
                        }
                      >
                        Software Engineer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onJobDescriptionChange(
                            getSampleJobDescription("dataScientist"),
                          )
                        }
                      >
                        Data Scientist
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onJobDescriptionChange(
                            getSampleJobDescription("productManager"),
                          )
                        }
                      >
                        Product Manager
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Textarea
                  className="resize-vertical min-h-[120px]"
                  placeholder="Paste the job description here to get AI-powered suggestions for optimizing your resume..."
                  value={jobDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    onJobDescriptionChange(e.target.value)
                  }
                />
                <p className="text-muted-foreground text-xs">
                  The AI will analyze your resume against this job description
                  and provide specific suggestions for improvements. Try using
                  one of the sample job descriptions above to test the feature.
                </p>
              </div>

              {/* Completed suggestions context indicator */}
              {completedSuggestions.length > 0 && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm dark:border-green-800 dark:bg-green-950/30">
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <div className="space-y-1">
                      <p className="font-medium text-green-800 dark:text-green-200">
                        ✓ {completedSuggestions.length} suggestion
                        {completedSuggestions.length !== 1 ? "s" : ""} completed
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Click "Get AI Optimization Suggestions" below to get new
                        recommendations based on your improvements.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={onOptimizeResume}
                disabled={isOptimizing || !jobDescription.trim()}
                className="w-full"
                size="lg"
              >
                {isOptimizing ? (
                  <>
                    <Bot className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get AI Optimization Suggestions
                  </>
                )}
              </Button>

              {/* Optional: Start fresh analysis */}
              {completedSuggestions.length > 0 &&
                onClearCompletedSuggestions && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearCompletedSuggestions}
                      className="text-muted-foreground hover:text-foreground text-xs"
                    >
                      Start Fresh Analysis (Clear History)
                    </Button>
                  </div>
                )}

              {/* Legacy suggestions display (fallback) */}
              {suggestions && !analysis && (
                <div className="bg-muted mt-4 rounded-md p-4">
                  <h4 className="mb-2 font-medium">AI Suggestions:</h4>
                  <p className="text-sm whitespace-pre-wrap">{suggestions}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Display structured analysis */}
      {analysis && (
        <div className="space-y-4">
          {analysis.usage && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Token Usage</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      {analysis.usage.totalTokens.toLocaleString()} tokens
                    </span>
                    <span className="font-medium">
                      ~$
                      {(
                        (analysis.usage.promptTokens * 0.005 +
                          analysis.usage.completionTokens * 0.015) /
                        1000
                      ).toFixed(3)}
                    </span>
                  </div>
                </div>
                <div className="text-muted-foreground mt-2 flex gap-4 text-xs">
                  <span>
                    Prompt: {analysis.usage.promptTokens.toLocaleString()}
                  </span>
                  <span>
                    Response: {analysis.usage.completionTokens.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
          <SuggestionsList
            analysis={analysis}
            onGoToSection={onGoToSection}
            onMarkAsDone={onMarkAsDone}
          />
        </div>
      )}
    </div>
  );
};

export default AIOptimizationPanel;
