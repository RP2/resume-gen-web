import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import {
  HardDrive,
  ChevronUp,
  ChevronDown,
  Shuffle,
  Check,
} from "lucide-react";

interface DataManagementPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSampleDataLoaded: boolean;
  hasUserData: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;
  onLoadSampleData: () => void;
  onClearAllData: () => void;
}

const DataManagementPanel: React.FC<DataManagementPanelProps> = ({
  isOpen,
  onOpenChange,
  isSampleDataLoaded,
  hasUserData,
  isAutoSaving,
  lastSaved,
  onLoadSampleData,
  onClearAllData,
}) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="bg-card text-card-foreground rounded-lg border shadow-sm"
    >
      <CollapsibleTrigger className="hover:bg-muted/50 focus-visible:ring-ring w-full rounded-t-lg p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            <h3 className="text-lg leading-none font-semibold tracking-tight">
              Data Management
            </h3>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-3 pt-0 sm:p-4 lg:p-6 lg:pt-0">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Button
              variant={isSampleDataLoaded ? "secondary" : "outline"}
              onClick={onLoadSampleData}
              className="w-full"
              disabled={isSampleDataLoaded && !hasUserData}
            >
              <Shuffle className="mr-2 h-4 w-4" />
              {isSampleDataLoaded ? "Sample Loaded" : "Load Sample Data"}
            </Button>
            <Button
              variant="destructive"
              onClick={onClearAllData}
              className="w-full"
              disabled={!hasUserData && !isSampleDataLoaded}
            >
              Clear All Data
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            {isSampleDataLoaded
              ? "Sample data is currently loaded. Load your own data to unlock more features."
              : hasUserData
                ? "Load sample data for preview, or permanently clear all your entered data."
                : "Load sample data, or get started with your resume."}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {isAutoSaving ? (
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <div className="border-border border-t-primary h-3 w-3 animate-spin rounded-full border-2"></div>
                Auto-saving...
              </span>
            ) : lastSaved ? (
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Check className="h-3 w-3" />
                Auto-saved{" "}
                {lastSaved.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            ) : null}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DataManagementPanel;
