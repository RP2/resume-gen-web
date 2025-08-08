import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./ui/collapsible";
import {
  Bot,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Download,
  Shuffle,
  Keyboard,
  HardDrive,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import Header from "./layout/Header";
import SettingsModal from "./modals/SettingsModal";
import ShortcutsHelp from "./modals/ShortcutsHelp";
import ResumePreview from "./preview/ResumePreview";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import ProjectsForm from "./forms/ProjectsForm";
import { ModalProvider } from "./modals/ModalProvider";
import type {
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
} from "../types/resume";
import { createOpenAIClient, auditResume } from "../lib/openai/api";
import { sampleResumeData } from "../data/sampleData";
import { exportToPDF } from "../utils/pdf-export";
import { saveResumeToFile, loadResumeFromFile } from "../utils/data-management";
import type { ShortcutAction } from "../utils/keyboard-shortcuts";

const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
};

const ResumeApp: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResumeData);
  const [apiKey, setApiKey] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(true); // Auto-open for new users
  const [isSampleDataLoaded, setIsSampleDataLoaded] = useState(true); // Start with sample data
  const [hasUserData, setHasUserData] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryData, setRecoveryData] = useState<ResumeData | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleDownloadResume();
            break;
          case "o":
            e.preventDefault();
            handleUploadResume();
            break;
          case "e":
            e.preventDefault();
            handleExportPDF();
            break;
          case "p":
            e.preventDefault();
            handleExportPDF();
            break;
          case ",":
            e.preventDefault();
            setIsSettingsOpen(true);
            break;
          case "r":
            e.preventDefault();
            loadSampleData();
            break;
          case "/":
            e.preventDefault();
            setIsShortcutsOpen(true);
            break;
        }

        if (e.shiftKey && e.key === "C") {
          e.preventDefault();
          clearAllData();
        }
      }

      if (e.key === "Escape") {
        setIsSettingsOpen(false);
        setIsShortcutsOpen(false);
        setShowClearConfirm(false);
        setShowSampleConfirm(false);
        setShowRecoveryDialog(false);
      }
    };

    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, []);

  // Check if user has entered any data
  const checkForUserData = useCallback((data: ResumeData) => {
    const hasPersonalInfo = Object.values(data.personalInfo).some(
      (value) => value.trim() !== "",
    );
    const hasWorkExp = data.workExperience.length > 0;
    const hasEducation = data.education.length > 0;
    const hasSkills = data.skills.length > 0;
    const hasProjects = data.projects.length > 0;

    const isCurrentlySample =
      JSON.stringify(data) === JSON.stringify(sampleResumeData);
    const isEmpty = JSON.stringify(data) === JSON.stringify(initialResumeData);

    const userHasData =
      !isCurrentlySample &&
      !isEmpty &&
      (hasPersonalInfo ||
        hasWorkExp ||
        hasEducation ||
        hasSkills ||
        hasProjects);

    setIsSampleDataLoaded(isCurrentlySample);
    setHasUserData(userHasData);

    // Auto-minimize data management when user starts entering data or clears to empty
    if (userHasData || isEmpty) {
      setIsDataManagementOpen(false);
    }
  }, []);

  // Update user data tracking and auto-save when resume data changes
  useEffect(() => {
    checkForUserData(resumeData);

    // Only auto-save if we have meaningful data changes
    const currentDataString = JSON.stringify(resumeData);
    const lastSavedString = localStorage.getItem("resumeData");

    // Skip saving if data hasn't actually changed
    if (currentDataString === lastSavedString) {
      return;
    }

    // Auto-save to localStorage (debounced)
    setIsAutoSaving(true);
    const saveToStorage = setTimeout(() => {
      try {
        localStorage.setItem("resumeData", currentDataString);
        localStorage.setItem("resumeDataTimestamp", Date.now().toString());
        setLastSaved(new Date());
        setIsAutoSaving(false);
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
        setIsAutoSaving(false);
      }
    }, 2000); // Increase debounce to 2 seconds to reduce frequency

    return () => {
      clearTimeout(saveToStorage);
      setIsAutoSaving(false);
    };
  }, [resumeData, checkForUserData]);

  // Load data from localStorage on initial mount ONLY
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("resumeData");
      const savedTimestamp = localStorage.getItem("resumeDataTimestamp");

      if (savedData && savedTimestamp) {
        const parsedData = JSON.parse(savedData);
        const timestamp = parseInt(savedTimestamp);
        const daysSinceLastSave =
          (Date.now() - timestamp) / (1000 * 60 * 60 * 24);

        // Only consider recovery if saved within the last 30 days
        if (daysSinceLastSave <= 30) {
          const isNotInitialData =
            JSON.stringify(parsedData) !== JSON.stringify(initialResumeData);
          const isNotSampleData =
            JSON.stringify(parsedData) !== JSON.stringify(sampleResumeData);
          const isDifferentFromCurrent =
            JSON.stringify(parsedData) !== JSON.stringify(resumeData);

          if (isNotInitialData && isNotSampleData && isDifferentFromCurrent) {
            // Show recovery dialog
            setRecoveryData(parsedData);
            setShowRecoveryDialog(true);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }, []); // Remove resumeData dependency to prevent repeated recovery dialogs

  const handleRecoverData = useCallback(() => {
    if (recoveryData) {
      setResumeData(recoveryData);
      setIsSampleDataLoaded(false);
      setHasUserData(true);
      setIsDataManagementOpen(false); // Auto-minimize when recovering data
      setShowRecoveryDialog(false);
      setRecoveryData(null);
    }
  }, [recoveryData]);

  const handleDiscardRecovery = useCallback(() => {
    setShowRecoveryDialog(false);
    setRecoveryData(null);
  }, []);

  const handlePersonalInfoChange = useCallback((personalInfo: PersonalInfo) => {
    setResumeData((prev) => ({ ...prev, personalInfo }));
  }, []);

  const handleWorkExperienceChange = useCallback(
    (workExperience: WorkExperience[]) => {
      setResumeData((prev) => ({ ...prev, workExperience }));
    },
    [],
  );

  const handleEducationChange = useCallback((education: Education[]) => {
    setResumeData((prev) => ({ ...prev, education }));
  }, []);

  const handleSkillsChange = useCallback((skills: Skill[]) => {
    setResumeData((prev) => ({ ...prev, skills }));
  }, []);

  const handleProjectsChange = useCallback((projects: Project[]) => {
    setResumeData((prev) => ({ ...prev, projects }));
  }, []);

  const loadSampleData = useCallback(() => {
    if (hasUserData) {
      setShowSampleConfirm(true);
    } else {
      setResumeData(sampleResumeData);
      setIsSampleDataLoaded(true);
    }
  }, [hasUserData]);

  const confirmLoadSampleData = useCallback(() => {
    setResumeData(sampleResumeData);
    setIsSampleDataLoaded(true);
    setShowSampleConfirm(false);

    // Save sample data to localStorage
    try {
      localStorage.setItem("resumeData", JSON.stringify(sampleResumeData));
      localStorage.setItem("resumeDataTimestamp", Date.now().toString());
    } catch (error) {
      console.error("Failed to save sample data to localStorage:", error);
    }
  }, []);

  const clearAllData = useCallback(() => {
    setShowClearConfirm(true);
  }, []);

  const confirmClearAllData = useCallback(() => {
    setResumeData(initialResumeData);
    setIsSampleDataLoaded(false);
    setHasUserData(false);
    setShowClearConfirm(false);

    // Also clear localStorage
    try {
      localStorage.removeItem("resumeData");
      localStorage.removeItem("resumeDataTimestamp");
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!resumeRef.current) return;

    setIsExporting(true);
    try {
      // Create a new window for printing with proper styles
      const printWindow = window.open("", "_blank", "width=800,height=1000");

      if (!printWindow) {
        throw new Error(
          "Unable to open print window. Please allow pop-ups and try again.",
        );
      }

      // Get the resume HTML content
      const resumeContent = resumeRef.current.innerHTML;

      // Create the print document with proper styling
      const printDocument = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resume - ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</title>
            <style>
              /* Reset and base styles */
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              body {
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.5;
                color: #111827;
                background-color: #ffffff;
                padding: 2rem;
                max-width: 210mm;
                margin: 0 auto;
              }
              
              /* Typography */
              h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: #111827; }
              h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #111827; }
              h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #111827; }
              p { margin-bottom: 0.5rem; line-height: 1.6; }
              
              /* Layout utilities */
              .flex { display: flex; }
              .items-center { align-items: center; }
              .justify-center { justify-content: center; }
              .justify-between { justify-content: space-between; }
              .flex-wrap { flex-wrap: wrap; }
              .gap-2 { gap: 0.5rem; }
              .gap-4 { gap: 1rem; }
              .text-center { text-align: center; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-6 { margin-bottom: 1.5rem; }
              .mb-8 { margin-bottom: 2rem; }
              
              /* Header styling */
              header {
                text-align: center;
                padding-bottom: 1.5rem;
                margin-bottom: 2rem;
                border-bottom: 2px solid #e2e8f0;
              }
              
              header h1 {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                color: #000000;
              }
              
              header .contact-info {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 1rem;
                margin-top: 1rem;
              }
              
              header .contact-info > div {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
              }
              
              /* Links */
              a {
                color: #2563eb;
                text-decoration: none;
              }
              
              a:hover {
                text-decoration: underline;
              }
              
              /* Icons (simulate with text if needed) */
              svg, .h-4.w-4 {
                display: inline-block;
                width: 16px;
                height: 16px;
                vertical-align: middle;
              }
              
              /* Sections */
              section {
                margin-bottom: 2rem;
              }
              
              section h2 {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #e2e8f0;
                color: #000000;
              }
              
              /* Skills and badges */
              .skill-badge, .tech-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.25rem 0.75rem;
                margin: 0.125rem;
                background-color: #f8fafc;
                color: #6b7280;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                font-weight: 500;
                border: 1px solid #e2e8f0;
              }
              
              /* Experience and education items */
              .experience-item, .education-item, .project-item {
                margin-bottom: 1.5rem;
                page-break-inside: avoid;
              }
              
              .item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.5rem;
              }
              
              .item-title {
                font-weight: 600;
                color: #111827;
              }
              
              .item-company, .item-school {
                color: #6b7280;
                font-weight: 500;
              }
              
              .item-date {
                color: #6b7280;
                font-size: 0.875rem;
                white-space: nowrap;
              }
              
              /* Print styles */
              @media print {
                body {
                  padding: 0;
                  margin: 0;
                }
                
                @page {
                  margin: 1cm;
                  size: A4;
                }
                
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                
                .no-print {
                  display: none !important;
                }
                
                a {
                  color: #2563eb !important;
                }
                
                section {
                  page-break-inside: avoid;
                }
                
                .experience-item, .education-item, .project-item {
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            ${resumeContent}
            
            <script>
              // Auto-print when loaded
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
              
              // Handle print dialog closure
              window.onafterprint = function() {
                window.close();
              };
            </script>
          </body>
        </html>
      `;

      // Write content to print window
      printWindow.document.open();
      printWindow.document.write(printDocument);
      printWindow.document.close();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        `Error generating PDF: ${error instanceof Error ? error.message : "Please try again."}`,
      );
    } finally {
      setIsExporting(false);
    }
  }, [resumeData.personalInfo.firstName, resumeData.personalInfo.lastName]);
  const handleDownloadResume = useCallback(() => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `resume_${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [resumeData]);

  const handleUploadResume = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            setResumeData(data);

            // Save uploaded data to localStorage
            try {
              localStorage.setItem("resumeData", JSON.stringify(data));
              localStorage.setItem(
                "resumeDataTimestamp",
                Date.now().toString(),
              );
            } catch (error) {
              console.error(
                "Failed to save uploaded data to localStorage:",
                error,
              );
            }
          } catch (error) {
            console.error("Error parsing resume file:", error);
            alert("Error loading resume file. Please check the file format.");
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  }, []);

  const handleOptimizeResume = useCallback(async () => {
    if (!apiKey) {
      alert("Please set your OpenAI API key in settings first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please provide a job description to optimize against.");
      return;
    }

    setIsOptimizing(true);
    setSuggestions("");

    try {
      const client = createOpenAIClient(apiKey);
      const resumeText = JSON.stringify(resumeData, null, 2);
      const result = await auditResume(client, resumeText, jobDescription);
      setSuggestions(result);
    } catch (error) {
      console.error("Error optimizing resume:", error);
      alert(
        "Error optimizing resume. Please check your API key and try again.",
      );
    } finally {
      setIsOptimizing(false);
    }
  }, [apiKey, jobDescription, resumeData]);

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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resume Builder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="personal">
                        <FileText className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="experience">
                        <Briefcase className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="education">
                        <GraduationCap className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="skills">
                        <Wrench className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="projects">
                        <FolderOpen className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="mt-6">
                      <PersonalInfoForm
                        data={resumeData.personalInfo}
                        onChange={handlePersonalInfoChange}
                      />
                    </TabsContent>

                    <TabsContent value="experience" className="mt-6">
                      <WorkExperienceForm
                        data={resumeData.workExperience}
                        onChange={handleWorkExperienceChange}
                      />
                    </TabsContent>

                    <TabsContent value="education" className="mt-6">
                      <EducationForm
                        data={resumeData.education}
                        onChange={handleEducationChange}
                      />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-6">
                      <SkillsForm
                        data={resumeData.skills}
                        onChange={handleSkillsChange}
                      />
                    </TabsContent>

                    <TabsContent value="projects" className="mt-6">
                      <ProjectsForm
                        data={resumeData.projects}
                        onChange={handleProjectsChange}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* AI Optimization Panel */}
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
                          Click the settings button to add your API key and
                          unlock AI-powered resume suggestions
                        </p>
                      </div>
                      <Button
                        onClick={() => setIsSettingsOpen(true)}
                        variant="outline"
                        size="sm"
                      >
                        Add API Key
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Job Description
                        </label>
                        <textarea
                          className="min-h-[100px] w-full resize-none rounded-md border p-3"
                          placeholder="Paste the job description here to get AI-powered suggestions for optimizing your resume..."
                          value={jobDescription}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>,
                          ) => setJobDescription(e.target.value)}
                        />
                      </div>

                      <Button
                        onClick={handleOptimizeResume}
                        disabled={isOptimizing || !jobDescription.trim()}
                        className="w-full"
                      >
                        {isOptimizing ? "Optimizing..." : "Get AI Suggestions"}
                      </Button>

                      {suggestions && (
                        <div className="bg-muted mt-4 rounded-md p-4">
                          <h4 className="mb-2 font-medium">AI Suggestions:</h4>
                          <p className="text-sm whitespace-pre-wrap">
                            {suggestions}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Collapsible Data Management Panel */}
              <Collapsible
                open={isDataManagementOpen}
                onOpenChange={setIsDataManagementOpen}
                className="bg-card text-card-foreground rounded-lg border shadow-sm"
              >
                <CollapsibleTrigger className="hover:bg-muted/50 focus-visible:ring-ring w-full rounded-t-lg p-6 text-left transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5" />
                      <h3 className="text-lg leading-none font-semibold tracking-tight">
                        Data Management
                      </h3>
                    </div>
                    {isDataManagementOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-6 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={isSampleDataLoaded ? "secondary" : "outline"}
                        onClick={loadSampleData}
                        className="w-full"
                        disabled={isSampleDataLoaded && !hasUserData}
                      >
                        <Shuffle className="mr-2 h-4 w-4" />
                        {isSampleDataLoaded
                          ? "Sample Loaded"
                          : "Load Sample Data"}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={clearAllData}
                        className="w-full"
                        disabled={!hasUserData && !isSampleDataLoaded}
                      >
                        Clear All Data
                      </Button>
                    </div>
                    <p className="text-muted-foreground mt-2 text-xs">
                      {isSampleDataLoaded
                        ? "Sample data is currently loaded. Load your own data to unlock more features."
                        : "Load sample data for preview, or permanently clear all your entered data."}
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
                          Auto-saved {lastSaved.toLocaleTimeString()}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Preview Panel */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Resume Preview</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        size="sm"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {isExporting ? "Opening..." : "Download Resume"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs">
                    Opens a new tab with PDF-optimized view. Links remain
                    clickable. Use Ctrl+P to save as PDF.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg border">
                    <div ref={resumeRef}>
                      <ResumePreview data={resumeData} />
                    </div>
                  </div>
                </CardContent>
              </Card>
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

        <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
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
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmClearAllData}>
                Clear All Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showSampleConfirm} onOpenChange={setShowSampleConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="text-warning h-5 w-5" />
                Load Sample Data?
              </DialogTitle>
              <DialogDescription>
                You have entered custom data that will be replaced with sample
                data. This action will overwrite your current resume
                information. You can always load your data back if you've saved
                it.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSampleConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={confirmLoadSampleData}>
                Load Sample Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="text-primary h-5 w-5" />
                Recover Your Resume?
              </DialogTitle>
              <DialogDescription>
                We found auto-saved resume data from your previous session.
                Would you like to recover this data? This will replace the
                current content.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleDiscardRecovery}>
                Discard
              </Button>
              <Button variant="default" onClick={handleRecoverData}>
                Recover Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ModalProvider>
  );
};

export default ResumeApp;
