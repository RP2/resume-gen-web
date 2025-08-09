import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bot } from "lucide-react";

interface AIOptimizationPanelProps {
  apiKey: string;
  jobDescription: string;
  isOptimizing: boolean;
  suggestions: string;
  onJobDescriptionChange: (value: string) => void;
  onOptimizeResume: () => void;
  onOpenSettings: () => void;
}

const AIOptimizationPanel: React.FC<AIOptimizationPanelProps> = ({
  apiKey,
  jobDescription,
  isOptimizing,
  suggestions,
  onJobDescriptionChange,
  onOptimizeResume,
  onOpenSettings,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Resume Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            </div>
            <Button onClick={onOpenSettings} variant="outline" size="sm">
              Add API Key
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description</label>
              <textarea
                className="min-h-[100px] w-full resize-none rounded-md border p-3"
                placeholder="Paste the job description here to get AI-powered suggestions for optimizing your resume..."
                value={jobDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onJobDescriptionChange(e.target.value)
                }
              />
            </div>

            <Button
              onClick={onOptimizeResume}
              disabled={isOptimizing || !jobDescription.trim()}
              className="w-full"
            >
              {isOptimizing ? "Optimizing..." : "Get AI Suggestions"}
            </Button>

            {suggestions && (
              <div className="bg-muted mt-4 rounded-md p-4">
                <h4 className="mb-2 font-medium">AI Suggestions:</h4>
                <p className="text-sm whitespace-pre-wrap">{suggestions}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AIOptimizationPanel;
