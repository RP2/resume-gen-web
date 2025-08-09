import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmationDialogsProps {
  showClearConfirm: boolean;
  showSampleConfirm: boolean;
  onCloseClearConfirm: () => void;
  onCloseSampleConfirm: () => void;
  onConfirmClearData: () => void;
  onConfirmLoadSample: () => void;
}

const ConfirmationDialogs: React.FC<ConfirmationDialogsProps> = ({
  showClearConfirm,
  showSampleConfirm,
  onCloseClearConfirm,
  onCloseSampleConfirm,
  onConfirmClearData,
  onConfirmLoadSample,
}) => {
  return (
    <>
      <Dialog open={showClearConfirm} onOpenChange={onCloseClearConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive h-5 w-5" />
              Clear All Data?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all your resume data including
              personal information, work experience, education, skills, and
              projects. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseClearConfirm}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmClearData}>
              Clear All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSampleConfirm} onOpenChange={onCloseSampleConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-warning h-5 w-5" />
              Load Sample Data?
            </DialogTitle>
            <DialogDescription>
              You have entered custom data that will be replaced with sample
              data. This action will overwrite your current resume information.
              You can always load your data back if you've saved it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseSampleConfirm}>
              Cancel
            </Button>
            <Button variant="default" onClick={onConfirmLoadSample}>
              Load Sample Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmationDialogs;
