import { useRef, useEffect, useState } from "react";
import { ResumeAppSkeleton } from "@/components/ResumeAppSkeleton";
import Header from "./layout/Header";
import SettingsModal from "./modals/SettingsModal";
import ShortcutsHelp from "./modals/ShortcutsHelp";
import FormPanel from "./sections/FormPanel";
import AIOptimizationPanel from "./sections/AIOptimizationPanel";
import DataManagementPanel from "./sections/DataManagementPanel";
import CompletedSuggestions from "./sections/CompletedSuggestions";
import ConfirmationDialogs from "./sections/ConfirmationDialogs";
import { ModalProvider } from "./modals/ModalProvider";
import { Toaster } from "./ui/sonner";
import { useResumeApp } from "../hooks/useResumeApp";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { usePDFExport } from "../hooks/usePDFExport";
import ResumePreview from "./preview/ResumePreview";

const ResumeApp: React.FC = () => {
  const resumeRef = useRef<HTMLDivElement | null>(null);
  // hydrated state: only render after client mount
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

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
    analysis,
    isAutoSaving,
    lastSaved,
    activeTab,
    completedSuggestions,

    // State setters
    setApiKey,
    setIsSettingsOpen,
    setIsShortcutsOpen,
    setShowClearConfirm,
    setShowSampleConfirm,
    setIsDataManagementOpen,
    setJobDescription,
    setIsExporting,
    setActiveTab,

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
    handleGoToSection,
    handleMarkAsDone,
    clearCompletedSuggestions,
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

  if (!hydrated) {
    return <ResumeAppSkeleton />;
  }

  return (
    <ModalProvider>
      <div className="bg-background min-h-screen">
        <Header
          onSettingsClick={() => setIsSettingsOpen(true)}
          onShortcutsClick={() => setIsShortcutsOpen(true)}
          onDownloadResume={handleDownloadResume}
          onUploadResume={handleUploadResume}
          onExportPDF={handleExportPDFWithState}
        />

        <main className="container mx-auto px-4 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            {/* Left Column - Form and AI Panel */}
            <div className="space-y-4 sm:space-y-6">
              <div data-form-panel>
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
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>

              <AIOptimizationPanel
                apiKey={apiKey}
                jobDescription={jobDescription}
                isOptimizing={isOptimizing}
                suggestions={suggestions}
                analysis={analysis}
                completedSuggestions={completedSuggestions}
                onJobDescriptionChange={setJobDescription}
                onOptimizeResume={handleOptimizeResume}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onGoToSection={handleGoToSection}
                onMarkAsDone={handleMarkAsDone}
                onClearCompletedSuggestions={clearCompletedSuggestions}
              />

              {/* Data Management - Desktop only */}
              <div className="hidden lg:block">
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
            </div>

            {/* Right Column - Preview and Mobile Data Management */}
            <div className="space-y-4">
              {/*
                this resume preview is for demonstration only and provides a visual representation of an example resume until the user creates their own.
              */}
              <div ref={resumeRef} className="overflow-hidden">
                <ResumePreview data={resumeData} />
              </div>

              {/* Completed Suggestions */}
              <CompletedSuggestions
                completedSuggestions={completedSuggestions}
              />

              {/* Data Management - Mobile only */}
              <div className="lg:hidden">
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
            </div>
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
