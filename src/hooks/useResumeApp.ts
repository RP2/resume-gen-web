import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
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

// Helper function to get initial resume data
const getInitialResumeData = (): ResumeData => {
  // Only run on client-side
  if (typeof window === "undefined") {
    return sampleResumeData; // SSR fallback
  }

  try {
    const savedData = localStorage.getItem("resumeData");
    const savedTimestamp = localStorage.getItem("resumeDataTimestamp");

    if (savedData && savedTimestamp) {
      const parsedData = JSON.parse(savedData);
      const timestamp = parseInt(savedTimestamp);
      const daysSinceLastSave =
        (Date.now() - timestamp) / (1000 * 60 * 60 * 24);

      // Only load if saved within the last 30 days
      if (daysSinceLastSave <= 30) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
  }

  // No valid saved data, return sample data
  return sampleResumeData;
};

export const useResumeApp = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(
    getInitialResumeData(),
  );
  const [apiKey, setApiKey] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(true);
  const [isSampleDataLoaded, setIsSampleDataLoaded] = useState(false);
  const [hasUserData, setHasUserData] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [lastToastTime, setLastToastTime] = useState<Date | null>(null);

  // Check if user has entered any data
  const checkForUserData = useCallback((data: ResumeData) => {
    const isCurrentlySample =
      JSON.stringify(data) === JSON.stringify(sampleResumeData);
    const isEmpty = JSON.stringify(data) === JSON.stringify(initialResumeData);

    const hasPersonalInfo = Object.values(data.personalInfo).some(
      (value) => typeof value === "string" && value.trim() !== "",
    );
    const hasWorkExp = data.workExperience.length > 0;
    const hasEducation = data.education.length > 0;
    const hasSkills = data.skills.length > 0;
    const hasProjects = data.projects.length > 0;

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

  // Initialize component state based on loaded data
  useEffect(() => {
    checkForUserData(resumeData);
  }, []); // Run once on mount to set initial state

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
    const saveToStorage = setTimeout(() => {
      setIsAutoSaving(true);
      try {
        localStorage.setItem("resumeData", currentDataString);
        localStorage.setItem("resumeDataTimestamp", Date.now().toString());
        const saveTime = new Date();
        setLastSaved(saveTime);
        setIsAutoSaving(false);

        // Show toast notification every 2 minutes
        const shouldShowToast =
          !lastToastTime ||
          saveTime.getTime() - lastToastTime.getTime() >= 120000; // 2 minutes

        if (shouldShowToast) {
          toast.success("Resume auto-saved locally", {
            description: `Last saved at ${saveTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            duration: 3000,
          });
          setLastToastTime(saveTime);
        }
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
        setIsAutoSaving(false);
        toast.error("Failed to auto-save resume", {
          description: "Please check your browser storage permissions",
          duration: 4000,
        });
      }
    }, 2000); // Debounce to reduce frequency

    return () => {
      clearTimeout(saveToStorage);
      setIsAutoSaving(false);
    };
  }, [resumeData, checkForUserData, lastToastTime]);

  // Data change handlers
  const handlePersonalInfoChange = useCallback((personalInfo: PersonalInfo) => {
    setResumeData((prev: ResumeData) => ({ ...prev, personalInfo }));
  }, []);

  const handleWorkExperienceChange = useCallback(
    (workExperience: WorkExperience[]) => {
      setResumeData((prev: ResumeData) => ({ ...prev, workExperience }));
    },
    [],
  );

  const handleEducationChange = useCallback((education: Education[]) => {
    setResumeData((prev: ResumeData) => ({ ...prev, education }));
  }, []);

  const handleSkillsChange = useCallback((skills: Skill[]) => {
    setResumeData((prev: ResumeData) => ({ ...prev, skills }));
  }, []);

  const handleProjectsChange = useCallback((projects: Project[]) => {
    setResumeData((prev: ResumeData) => ({ ...prev, projects }));
  }, []);

  // Data management handlers
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
      toast.success("Sample data loaded", {
        description: "Sample resume data has been loaded successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to save sample data to localStorage:", error);
      toast.error("Failed to save sample data", {
        description: "Sample data loaded but couldn't be saved locally",
        duration: 4000,
      });
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
      toast.success("All data cleared", {
        description: "Resume data has been cleared successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      toast.error("Failed to clear local storage", {
        description: "Data cleared but local storage couldn't be updated",
        duration: 4000,
      });
    }
  }, []);

  // File operations
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

  // AI optimization
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

  return {
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
  };
};
