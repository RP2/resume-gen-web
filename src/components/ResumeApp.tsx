import React, { useRef } from "react";
import Header from "./layout/Header";
import SettingsModal from "./modals/SettingsModal";
import ShortcutsHelp from "./modals/ShortcutsHelp";
import FormPanel from "./sections/FormPanel";
import AIOptimizationPanel from "./sections/AIOptimizationPanel";
import DataManagementPanel from "./sections/DataManagementPanel";
import PreviewPanel from "./sections/PreviewPanel";
import ConfirmationDialogs from "./sections/ConfirmationDialogs";
import { ModalProvider } from "./modals/ModalProvider";
import { Toaster } from "./ui/sonner";
import { useResumeApp } from "../hooks/useResumeApp";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { usePDFExport } from "../hooks/usePDFExport";

const ResumeApp: React.FC = () => {
  const resumeRef = useRef<HTMLDivElement | null>(null);

  const {
    // State
    resumeData,
    apiKey,
    isSettingsOpen,
    isShortcutsOpen,
    showClearConfirm,
    showSampleConfirm,
    isDataManagementOpen,
    isSampleDataLoaded,
    hasUserData,
    jobDescription,
    isOptimizing,
    suggestions,
    isExporting,
    isAutoSaving,
    lastSaved,

    // State setters
    setApiKey,
    setIsSettingsOpen,
    setIsShortcutsOpen,
    setShowClearConfirm,
    setShowSampleConfirm,
    setIsDataManagementOpen,
    setJobDescription,
    setIsExporting,

    // Handlers
    handlePersonalInfoChange,
    handleWorkExperienceChange,
    handleEducationChange,
    handleSkillsChange,
    handleProjectsChange,
    loadSampleData,
    confirmLoadSampleData,
    clearAllData,
    confirmClearAllData,
    handleDownloadResume,
    handleUploadResume,
    handleOptimizeResume,
  } = useResumeApp();

  const { handleExportPDF } = usePDFExport(resumeData);

  const handleExportPDFWithState = async () => {
    setIsExporting(true);
    try {
      await handleExportPDF(resumeRef);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCloseModals = () => {
    setIsSettingsOpen(false);
    setIsShortcutsOpen(false);
    setShowClearConfirm(false);
    setShowSampleConfirm(false);
  };

  useKeyboardShortcuts({
    onDownloadResume: handleDownloadResume,
    onUploadResume: handleUploadResume,
    onExportPDF: handleExportPDFWithState,
    onOpenSettings: () => setIsSettingsOpen(true),
    onLoadSampleData: loadSampleData,
    onOpenShortcuts: () => setIsShortcutsOpen(true),
    onClearAllData: clearAllData,
    onCloseModals: handleCloseModals,
  });

  return (
    <ModalProvider>
      <div className="bg-background min-h-screen">
        <Header
          onSettingsClick={() => setIsSettingsOpen(true)}
          onShortcutsClick={() => setIsShortcutsOpen(true)}
          onDownloadResume={handleDownloadResume}
          onUploadResume={handleUploadResume}
        />

        <main className="container mx-auto py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Form Panel */}
            <div className="space-y-6">
              <FormPanel
                personalInfo={resumeData.personalInfo}
                workExperience={resumeData.workExperience}
                education={resumeData.education}
                skills={resumeData.skills}
                projects={resumeData.projects}
                onPersonalInfoChange={handlePersonalInfoChange}
                onWorkExperienceChange={handleWorkExperienceChange}
                onEducationChange={handleEducationChange}
                onSkillsChange={handleSkillsChange}
                onProjectsChange={handleProjectsChange}
              />

              <AIOptimizationPanel
                apiKey={apiKey}
                jobDescription={jobDescription}
                isOptimizing={isOptimizing}
                suggestions={suggestions}
                onJobDescriptionChange={setJobDescription}
                onOptimizeResume={handleOptimizeResume}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />

              <DataManagementPanel
                isOpen={isDataManagementOpen}
                onOpenChange={setIsDataManagementOpen}
                isSampleDataLoaded={isSampleDataLoaded}
                hasUserData={hasUserData}
                isAutoSaving={isAutoSaving}
                lastSaved={lastSaved}
                onLoadSampleData={loadSampleData}
                onClearAllData={clearAllData}
              />
            </div>

            {/* Preview Panel */}
            <PreviewPanel
              resumeData={resumeData}
              resumeRef={resumeRef}
              isExporting={isExporting}
              onExportPDF={handleExportPDFWithState}
            />
          </div>
        </main>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
        />

        <ShortcutsHelp
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />

        <ConfirmationDialogs
          showClearConfirm={showClearConfirm}
          showSampleConfirm={showSampleConfirm}
          onCloseClearConfirm={() => setShowClearConfirm(false)}
          onCloseSampleConfirm={() => setShowSampleConfirm(false)}
          onConfirmClearData={confirmClearAllData}
          onConfirmLoadSample={confirmLoadSampleData}
        />

        <Toaster />
      </div>
    </ModalProvider>
  );
};

export default ResumeApp;
