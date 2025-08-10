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
import {
  createOpenAIClient,
  auditResume,
  analyzeResumeForJob,
  type ResumeAnalysis,
  type ResumeSuggestion,
} from "../lib/openai/api";
import { sampleResumeData } from "../data/sampleData";
import {
  applySuggestionToResume,
  canApplySuggestion,
  applySuggestionUsingHandlers,
  type FormHandlers,
} from "../utils/suggestion-handler";

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

// Helper function to load completed suggestions from localStorage
const getInitialCompletedSuggestions = (): ResumeSuggestion[] => {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem("completedSuggestions");
    const savedTimestamp = localStorage.getItem(
      "completedSuggestionsTimestamp",
    );

    if (saved && savedTimestamp) {
      const timestamp = parseInt(savedTimestamp);
      const daysSinceLastSave =
        (Date.now() - timestamp) / (1000 * 60 * 60 * 24);

      // Only load if saved within the last 7 days (suggestions older than a week may not be relevant)
      if (daysSinceLastSave <= 7) {
        return JSON.parse(saved);
      }
    }
  } catch (error) {
    console.error(
      "Failed to load completed suggestions from localStorage:",
      error,
    );
  }

  return [];
};

// Helper function to load initial resume data
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
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [lastToastTime, setLastToastTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [completedSuggestions, setCompletedSuggestions] = useState<
    ResumeSuggestion[]
  >(getInitialCompletedSuggestions());
  const [previewingChanges, setPreviewingChanges] = useState<{
    [key: string]: boolean;
  }>({});
  const [originalData, setOriginalData] = useState<ResumeData | null>(null);

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

  // Load timestamp from localStorage after component mounts (client-side only)
  useEffect(() => {
    try {
      const savedTimestamp = localStorage.getItem("resumeDataTimestamp");
      if (savedTimestamp) {
        const timestamp = parseInt(savedTimestamp);
        if (!isNaN(timestamp)) {
          setLastSaved(new Date(timestamp));
        }
      }
    } catch (error) {
      // Silently fail - just means no timestamp will be shown initially
      console.warn("Could not load last saved timestamp:", error);
    }
  }, []); // Run once on mount

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
    setCompletedSuggestions([]); // Clear completed suggestions too

    // Also clear localStorage
    try {
      localStorage.removeItem("resumeData");
      localStorage.removeItem("resumeDataTimestamp");
      localStorage.removeItem("completedSuggestions");
      localStorage.removeItem("completedSuggestionsTimestamp");
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
      toast.error("API key required", {
        description: "Please set your OpenAI API key in settings first.",
        duration: 4000,
        action: {
          label: "Open Settings",
          onClick: () => setIsSettingsOpen(true),
        },
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Job description required", {
        description: "Please provide a job description to optimize against.",
        duration: 4000,
      });
      return;
    }

    setIsOptimizing(true);
    setSuggestions("");
    setAnalysis(null);

    try {
      const client = createOpenAIClient(apiKey);

      // Use the new structured analysis
      const result = await analyzeResumeForJob(
        client,
        resumeData,
        jobDescription,
        completedSuggestions,
      );
      setAnalysis(result);

      toast.success("Resume analysis complete", {
        description: `Found ${result.suggestions.length} suggestions for improvement`,
        duration: 4000,
      });
    } catch (error) {
      console.error("Error optimizing resume:", error);

      // Fallback to basic audit if structured analysis fails
      try {
        const client = createOpenAIClient(apiKey);
        const resumeText = JSON.stringify(resumeData, null, 2);
        const fallbackResult = await auditResume(
          client,
          resumeText,
          jobDescription,
        );
        setSuggestions(fallbackResult);

        toast.warning("Using basic analysis", {
          description:
            "Advanced analysis failed, showing basic suggestions instead.",
          duration: 4000,
        });
      } catch (fallbackError) {
        console.error("Fallback analysis also failed:", fallbackError);
        toast.error("Analysis failed", {
          description:
            "Error analyzing resume. Please check your API key and try again.",
          duration: 4000,
          action: {
            label: "Open Settings",
            onClick: () => setIsSettingsOpen(true),
          },
        });
      }
    } finally {
      setIsOptimizing(false);
    }
  }, [apiKey, jobDescription, resumeData]);

  // Handler for previewing suggestions
  const handlePreviewSuggestion = useCallback(
    (suggestion: ResumeSuggestion, isActive: boolean) => {
      const suggestionId = `${suggestion.section}-${suggestion.type}-${suggestion.title}`;

      if (isActive) {
        // Save original data if this is the first preview
        if (Object.keys(previewingChanges).length === 0) {
          setOriginalData({ ...resumeData });
        }

        // Mark this suggestion as being previewed
        setPreviewingChanges((prev) => ({ ...prev, [suggestionId]: true }));

        // Apply the suggestion using form handlers
        if (canApplySuggestion(suggestion)) {
          try {
            const handlers: FormHandlers = {
              handlePersonalInfoChange,
              handleWorkExperienceChange,
              handleEducationChange,
              handleSkillsChange,
              handleProjectsChange,
            };

            applySuggestionUsingHandlers(suggestion, handlers, resumeData);

            toast.info("Preview active", {
              description: `Previewing: ${suggestion.title}`,
              duration: 2000,
            });
          } catch (error) {
            console.error("Error applying preview suggestion:", error);
          }
        }
      } else {
        // Remove from previewing
        setPreviewingChanges((prev) => {
          const newPreviewing = { ...prev };
          delete newPreviewing[suggestionId];
          return newPreviewing;
        });

        // If no more previews, restore original data using form handlers
        const remainingPreviews = Object.keys(previewingChanges).filter(
          (key) => key !== suggestionId,
        );
        if (remainingPreviews.length === 0 && originalData) {
          handlePersonalInfoChange(originalData.personalInfo);
          handleWorkExperienceChange(originalData.workExperience);
          handleEducationChange(originalData.education);
          handleSkillsChange(originalData.skills);
          handleProjectsChange(originalData.projects);
          setOriginalData(null);

          toast.info("Preview cleared", {
            description: "Showing original resume",
            duration: 2000,
          });
        }
      }
    },
    [
      resumeData,
      previewingChanges,
      originalData,
      handlePersonalInfoChange,
      handleWorkExperienceChange,
      handleEducationChange,
      handleSkillsChange,
      handleProjectsChange,
    ],
  );

  // Handler for going to section
  const handleGoToSection = useCallback((suggestion: ResumeSuggestion) => {
    const tabMap: { [key: string]: string } = {
      personalInfo: "personal",
      workExperience: "experience",
      education: "education",
      skills: "skills",
      projects: "projects",
    };

    const section = suggestion.section;
    if (tabMap[section]) {
      setActiveTab(tabMap[section]);

      // Show immediate feedback
      toast.info("Navigating to section", {
        description: `Switching to ${section} section...`,
        duration: 2000,
      });

      // Scroll to the form panel and then try to find specific content
      setTimeout(() => {
        const formElement = document.querySelector("[data-form-panel]");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Additional delay to let tab switching complete, then highlight specific content
        setTimeout(() => {
          const highlighted = highlightTargetContent(suggestion);

          if (!highlighted) {
            // If we couldn't find the specific element, provide helpful guidance
            toast.warning("Section opened", {
              description: `Couldn't find specific ${suggestion.type === "add" ? "add button" : "content"} - look for the relevant ${suggestion.section} area.`,
              duration: 4000,
            });
          } else {
            toast.success("Found target!", {
              description:
                "Element highlighted - this is where you should make the change.",
              duration: 3000,
            });
          }
        }, 400);
      }, 150);
    }
  }, []);

  // Helper function to highlight and focus target content
  const highlightTargetContent = useCallback((suggestion: ResumeSuggestion) => {
    const debugLog = (message: string, ...args: any[]) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[Highlighting] ${message}`, ...args);
      }
    };

    debugLog("Highlighting target content for:", suggestion);
    let targetElement: HTMLElement | null = null;
    let searchStrategy = "none";

    // Strategy 1: For skills section with better content matching
    if (suggestion.section === "skills" && suggestion.currentContent) {
      // Clean the content to extract just the skills (remove parenthetical context)
      const cleanContent = suggestion.currentContent
        .replace(/\s*\([^)]*\)\s*/g, "")
        .trim();
      console.log("Cleaned skills content for matching:", cleanContent);

      // Skills-specific targeting for individual skills
      if (suggestion.itemId) {
        const skillCategory = document.querySelector(
          `[data-skill-category-id="${suggestion.itemId}"]`,
        );
        console.log(
          "Looking for skill category:",
          suggestion.itemId,
          skillCategory,
        );

        if (skillCategory) {
          const skillBadges = skillCategory.querySelectorAll(
            "[data-content='skill-list'] .text-sm",
          );
          console.log("Found skill badges:", skillBadges.length);

          for (const badge of skillBadges) {
            const badgeText = badge.textContent?.trim() || "";
            // Check if any part of the cleaned content appears in the badge
            const skills = cleanContent.split(",").map((s) => s.trim());
            if (
              skills.some(
                (skill) =>
                  badgeText.includes(skill) || skill.includes(badgeText),
              )
            ) {
              targetElement = badge as HTMLElement;
              searchStrategy = "content_container";
              console.log("Found matching skill badge:", badgeText);
              break;
            }
          }
        }
      }

      // Fallback: search all skill badges if no itemId or not found
      if (!targetElement) {
        const allSkillBadges = document.querySelectorAll(
          '[data-content="skill-list"] .text-sm',
        );
        console.log(
          "Fallback search in all skill badges:",
          allSkillBadges.length,
        );

        for (const badge of allSkillBadges) {
          const badgeText = badge.textContent?.trim() || "";
          const skills = cleanContent.split(",").map((s) => s.trim());
          if (
            skills.some(
              (skill) => badgeText.includes(skill) || skill.includes(badgeText),
            )
          ) {
            targetElement = badge as HTMLElement;
            searchStrategy = "content_container";
            console.log("Found matching skill badge (fallback):", badgeText);
            break;
          }
        }
      }
    }

    // Strategy 2: For modify/remove suggestions in other sections
    if (
      !targetElement &&
      (suggestion.type === "modify" || suggestion.type === "remove") &&
      suggestion.currentContent &&
      suggestion.section !== "skills"
    ) {
      // Generic form field search with improved matching
      const formElements = document.querySelectorAll(
        "textarea, input[type='text'], input[type='email']",
      );
      for (const element of formElements) {
        const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
        const fieldValue = inputElement.value;

        // Try multiple matching strategies
        const exactMatch = fieldValue.includes(suggestion.currentContent);
        const normalizedMatch = fieldValue
          .replace(/\s+/g, " ")
          .trim()
          .includes(suggestion.currentContent.replace(/\s+/g, " ").trim());

        // For longer content, try partial matching with significant words
        const significantWords = suggestion.currentContent
          .split(" ")
          .filter((word) => word.length > 3)
          .slice(0, 3);
        const partialMatch =
          significantWords.length > 0 &&
          significantWords.every((word) =>
            fieldValue.toLowerCase().includes(word.toLowerCase()),
          );

        if (exactMatch || normalizedMatch || partialMatch) {
          targetElement = inputElement;
          searchStrategy = "form_field";
          console.log(
            "Found in form field:",
            inputElement.placeholder || inputElement.name,
            exactMatch ? "exact" : normalizedMatch ? "normalized" : "partial",
            "match",
          );
          break;
        }
      }

      // If not found in form fields, search in content containers (like work experience descriptions)
      if (!targetElement) {
        console.log(
          "Searching content containers for:",
          suggestion.currentContent,
        );

        const contentSelectors = [
          // Achievement lists, descriptions, content areas
          "[data-content]",
          ".achievement",
          ".highlight",
          ".description",
          ".content",
          // Generic containers with text
          "div:not(button):not(input):not(textarea)",
          "span:not(button)",
          "p:not(button)",
          "li:not(button)",
        ];

        for (const selector of contentSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            const textContent = element.textContent || "";

            // Try multiple matching strategies for content containers too
            const exactMatch = textContent.includes(suggestion.currentContent);
            const normalizedMatch = textContent
              .replace(/\s+/g, " ")
              .trim()
              .includes(suggestion.currentContent.replace(/\s+/g, " ").trim());

            // For longer content, try partial matching with significant words
            const significantWords = suggestion.currentContent
              .split(" ")
              .filter((word) => word.length > 3)
              .slice(0, 3);
            const partialMatch =
              significantWords.length > 0 &&
              significantWords.every((word) =>
                textContent.toLowerCase().includes(word.toLowerCase()),
              );

            if (exactMatch || normalizedMatch || partialMatch) {
              targetElement = element as HTMLElement;
              searchStrategy = "content_container";
              console.log(
                "Found in content container:",
                selector,
                textContent.substring(0, 50) + "...",
                exactMatch
                  ? "exact"
                  : normalizedMatch
                    ? "normalized"
                    : "partial",
                "match",
              );
              break;
            }
          }
          if (targetElement) break;
        }
      }
    }

    // Strategy 3: For add suggestions, find relevant add buttons using data attributes
    if (suggestion.type === "add" && !targetElement) {
      console.log(
        "Looking for add buttons for:",
        suggestion.section,
        suggestion.itemId,
      );

      // Work experience specific - look for add achievement buttons
      if (suggestion.section === "workExperience") {
        const addAchievementBtns = document.querySelectorAll(
          '[data-action="add-achievement"]',
        );
        console.log(
          "Found add achievement buttons:",
          addAchievementBtns.length,
        );

        if (addAchievementBtns.length > 0) {
          // Use the first one or try to match by itemId if available
          targetElement = addAchievementBtns[0] as HTMLElement;
          searchStrategy = "add_button";
          console.log("Using first add achievement button");
        } else {
          // Fallback to main add experience button
          const addExpBtn = document.querySelector(
            '[data-action="add-experience"]',
          );
          if (addExpBtn) {
            targetElement = addExpBtn as HTMLElement;
            searchStrategy = "add_button";
            console.log("Using add experience button");
          }
        }
      }

      // Skills specific
      else if (suggestion.section === "skills") {
        if (suggestion.itemId) {
          const skillCategory = document.querySelector(
            `[data-skill-category-id="${suggestion.itemId}"]`,
          );
          if (skillCategory) {
            const addSkillBtn = skillCategory.querySelector(
              "[data-action='add-skill']",
            );
            if (addSkillBtn) {
              targetElement = addSkillBtn as HTMLElement;
              searchStrategy = "add_button";
              console.log("Found add skill button for category");
            }
          }
        } else {
          // No itemId, look for general "Add Category" button
          const addCategoryBtn = document.querySelector(
            "[data-action='add-category']",
          );
          if (addCategoryBtn) {
            targetElement = addCategoryBtn as HTMLElement;
            searchStrategy = "add_button";
            console.log("Found add category button");
          }
        }
      }

      // Generic data attribute search for other sections
      else {
        const dataAttributeMap: { [key: string]: string[] } = {
          projects: ["add-project"],
          education: ["add-education"],
        };

        const attributes = dataAttributeMap[suggestion.section] || [];
        for (const attr of attributes) {
          const element = document.querySelector(`[data-action="${attr}"]`);
          if (element) {
            targetElement = element as HTMLElement;
            searchStrategy = "add_button";
            console.log("Found button by data attribute:", attr);
            break;
          }
        }
      }

      // Final fallback to section containers
      if (!targetElement) {
        const sectionContainers = document.querySelectorAll(
          `[data-section="${suggestion.section}"]`,
        );
        if (sectionContainers.length > 0) {
          targetElement = sectionContainers[0] as HTMLElement;
          searchStrategy = "section_container";
          console.log("Using section container fallback");
        }
      }
    }

    // Strategy 4: Final content search fallback for any remaining cases
    if (!targetElement && suggestion.currentContent) {
      console.log(
        "Final fallback content search for:",
        suggestion.currentContent,
      );

      // Look for any element containing the text, prioritizing interactive elements
      const allElements = document.querySelectorAll("*:not(script):not(style)");
      for (const element of allElements) {
        const textContent = element.textContent || "";
        const hasText = textContent.includes(suggestion.currentContent);
        const isInteractive =
          element.tagName.toLowerCase() in
          { button: 1, input: 1, textarea: 1, a: 1 };

        if (hasText && (isInteractive || !targetElement)) {
          targetElement = element as HTMLElement;
          searchStrategy = isInteractive
            ? "interactive_element"
            : "text_container";
          console.log(
            "Found in final fallback:",
            element.tagName,
            textContent.substring(0, 50) + "...",
          );
          if (isInteractive) break; // Prefer interactive elements
        }
      }
    }

    // Apply highlighting if we found a target
    if (targetElement) {
      console.log(
        "Highlighting element with strategy:",
        searchStrategy,
        targetElement,
      );

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      // Store original styles
      const originalOutline = targetElement.style.outline;
      const originalOutlineOffset = targetElement.style.outlineOffset;
      const originalBoxShadow = targetElement.style.boxShadow;
      const originalBackground = targetElement.style.backgroundColor;

      // Apply different highlighting based on element type and strategy
      if (searchStrategy === "form_field") {
        // Form fields get blue outline + focus
        targetElement.style.outline = "3px solid #3b82f6";
        targetElement.style.outlineOffset = "2px";
        targetElement.style.boxShadow = "0 0 0 6px rgba(59, 130, 246, 0.2)";

        if (
          targetElement instanceof HTMLInputElement ||
          targetElement instanceof HTMLTextAreaElement
        ) {
          targetElement.focus();
          if (suggestion.currentContent) {
            const content = targetElement.value;
            let startIndex = -1;
            let endIndex = -1;

            // Strategy 1: Try exact match first
            startIndex = content.indexOf(suggestion.currentContent);
            if (startIndex !== -1) {
              endIndex = startIndex + suggestion.currentContent.length;
              console.log("Found exact match at position:", startIndex);
            }

            // Strategy 2: Case insensitive exact match
            if (startIndex === -1) {
              const lowerContent = content.toLowerCase();
              const lowerTarget = suggestion.currentContent.toLowerCase();
              startIndex = lowerContent.indexOf(lowerTarget);
              if (startIndex !== -1) {
                endIndex = startIndex + suggestion.currentContent.length;
                console.log(
                  "Found case-insensitive match at position:",
                  startIndex,
                );
              }
            }

            // Strategy 3: Try normalized whitespace matching
            if (startIndex === -1) {
              const normalizedContent = content.replace(/\s+/g, " ").trim();
              const normalizedTarget = suggestion.currentContent
                .replace(/\s+/g, " ")
                .trim();
              const normalizedIndex = normalizedContent
                .toLowerCase()
                .indexOf(normalizedTarget.toLowerCase());

              if (normalizedIndex !== -1) {
                // Map normalized position back to original content
                let charCount = 0;
                let originalIndex = 0;

                for (
                  let i = 0;
                  i < content.length && charCount < normalizedIndex;
                  i++
                ) {
                  if (content[i].match(/\s/)) {
                    // Skip extra whitespace in original
                    while (i < content.length && content[i].match(/\s/)) {
                      i++;
                    }
                    charCount++;
                    originalIndex = i;
                  } else {
                    charCount++;
                    originalIndex = i + 1;
                  }
                }

                startIndex = originalIndex;
                endIndex = startIndex + normalizedTarget.length;
                console.log("Found normalized match at position:", startIndex);
              }
            }

            // Strategy 4: Try finding the sentence containing the target text
            if (startIndex === -1) {
              const sentences = content
                .split(/[.!?]+/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
              const targetWords = suggestion.currentContent
                .toLowerCase()
                .split(/\s+/)
                .filter((w) => w.length > 2);

              for (let i = 0; i < sentences.length; i++) {
                const sentence = sentences[i];
                const sentenceLower = sentence.toLowerCase();

                // Check if this sentence contains significant words from target
                const matchingWords = targetWords.filter((word) =>
                  sentenceLower.includes(word),
                );
                if (matchingWords.length >= Math.min(2, targetWords.length)) {
                  // Find this sentence in the original content
                  const sentenceIndex = content
                    .toLowerCase()
                    .indexOf(sentenceLower);
                  if (sentenceIndex !== -1) {
                    startIndex = sentenceIndex;
                    endIndex = sentenceIndex + sentence.length;
                    console.log(
                      `Found containing sentence: "${sentence.substring(0, 50)}..."`,
                      startIndex,
                    );
                    break;
                  }
                }
              }
            }

            // Strategy 5: Try finding significant words in sequence with flexible matching
            if (startIndex === -1) {
              const significantWords = suggestion.currentContent
                .split(/\s+/)
                .filter((word) => word.length > 3 && word.match(/[a-zA-Z]/))
                .slice(0, 4); // Increase to 4 words for better context

              if (significantWords.length > 0) {
                console.log("Looking for significant words:", significantWords);

                // Try to find a sequence of these words
                for (let i = 0; i < significantWords.length - 1; i++) {
                  const firstWord = significantWords[i];
                  const secondWord = significantWords[i + 1];

                  const firstWordIndex = content
                    .toLowerCase()
                    .indexOf(firstWord.toLowerCase());
                  if (firstWordIndex !== -1) {
                    // Look for the second word within a reasonable distance
                    const searchStart = firstWordIndex;
                    const searchEnd = Math.min(
                      searchStart + 200,
                      content.length,
                    );
                    const remainingContent = content.substring(
                      searchStart,
                      searchEnd,
                    );
                    const secondWordIndex = remainingContent
                      .toLowerCase()
                      .indexOf(secondWord.toLowerCase());

                    if (secondWordIndex !== -1) {
                      startIndex = firstWordIndex;
                      // Try to find a natural end point (sentence end, period, etc.)
                      const fromStart = content.substring(startIndex);
                      const sentenceEnd = fromStart.search(/[.!?]\s/);
                      if (sentenceEnd !== -1) {
                        endIndex = startIndex + sentenceEnd + 1;
                      } else {
                        endIndex = Math.min(
                          startIndex + suggestion.currentContent.length * 1.2,
                          content.length,
                        );
                      }
                      console.log(
                        `Found word sequence: "${firstWord}" + "${secondWord}" at ${startIndex}, selecting to ${endIndex}`,
                      );
                      break;
                    }
                  }
                }

                // Fallback: just find first significant word and select reasonable chunk
                if (startIndex === -1) {
                  const firstWord = significantWords[0];
                  const firstWordIndex = content
                    .toLowerCase()
                    .indexOf(firstWord.toLowerCase());

                  if (firstWordIndex !== -1) {
                    startIndex = firstWordIndex;
                    // Select until end of sentence or reasonable length
                    const fromStart = content.substring(startIndex);
                    const sentenceEnd = fromStart.search(/[.!?]\s/);
                    if (sentenceEnd !== -1 && sentenceEnd < 150) {
                      endIndex = startIndex + sentenceEnd + 1;
                    } else {
                      endIndex = Math.min(
                        startIndex + 100, // Select ~100 chars as reasonable chunk
                        content.length,
                      );
                    }
                    console.log(
                      `Found first word "${firstWord}" at ${startIndex}, selecting chunk to ${endIndex}`,
                    );
                  }
                }
              }
            }

            // Apply the selection
            if (startIndex !== -1 && endIndex !== -1) {
              // Ensure we don't go beyond the content length
              endIndex = Math.min(endIndex, content.length);
              const selectedText = content.substring(startIndex, endIndex);
              console.log(
                `Selecting text from ${startIndex} to ${endIndex}: "${selectedText}"`,
              );
              targetElement.setSelectionRange(startIndex, endIndex);
            } else {
              // Last resort: select all content so user knows which field to edit
              console.log(
                "Could not find specific text, selecting all content for user awareness",
              );
              targetElement.select();
            }
          }
        }
      } else if (searchStrategy === "add_button") {
        // Add buttons get prominent highlighting + pulse
        targetElement.style.outline = "3px solid #10b981";
        targetElement.style.outlineOffset = "2px";
        targetElement.style.boxShadow = "0 0 0 6px rgba(16, 185, 129, 0.2)";
        targetElement.style.animation = "pulse 2s infinite";
        targetElement.focus();
      } else {
        // Content containers get subtle background highlight
        targetElement.style.outline = "2px solid #f59e0b";
        targetElement.style.outlineOffset = "2px";
        targetElement.style.backgroundColor = "rgba(245, 158, 11, 0.1)";
        targetElement.style.boxShadow = "0 0 0 4px rgba(245, 158, 11, 0.1)";

        // Make container focusable temporarily for keyboard navigation
        const originalTabIndex = targetElement.tabIndex;
        targetElement.tabIndex = 0;
        targetElement.focus();

        // Restore tab index after highlight
        setTimeout(() => {
          targetElement.tabIndex = originalTabIndex;
        }, 4000);
      }

      // Remove highlight after 5 seconds (longer for content containers)
      const highlightDuration =
        searchStrategy === "content_container" ? 6000 : 4000;
      setTimeout(() => {
        targetElement.style.outline = originalOutline;
        targetElement.style.outlineOffset = originalOutlineOffset;
        targetElement.style.boxShadow = originalBoxShadow;
        targetElement.style.backgroundColor = originalBackground;
        targetElement.style.animation = "";
      }, highlightDuration);

      return true; // Successfully found and highlighted
    } else {
      console.log("No target element found for suggestion:", suggestion);
    }

    return false; // Could not find target element
  }, []);

  // Handler for marking suggestions as done
  const handleMarkAsDone = useCallback(
    (suggestion: ResumeSuggestion) => {
      if (analysis) {
        // Remove from active suggestions
        const updatedSuggestions = analysis.suggestions.filter(
          (s) => s !== suggestion,
        );
        setAnalysis({
          ...analysis,
          suggestions: updatedSuggestions,
        });

        // Add to completed suggestions with timestamp
        const completedSuggestion = {
          ...suggestion,
          completedAt: new Date().toISOString(),
        };
        setCompletedSuggestions((prev) => {
          const updated = [...prev, completedSuggestion];
          // Save to localStorage
          try {
            localStorage.setItem(
              "completedSuggestions",
              JSON.stringify(updated),
            );
            localStorage.setItem(
              "completedSuggestionsTimestamp",
              Date.now().toString(),
            );
          } catch (error) {
            console.error("Failed to save completed suggestions:", error);
          }
          return updated;
        });

        toast.success("Suggestion marked as completed", {
          description: `Completed: ${suggestion.title}`,
          duration: 2000,
        });
      }
    },
    [analysis],
  );

  // Clear completed suggestions (useful for starting fresh optimization)
  const clearCompletedSuggestions = useCallback(() => {
    setCompletedSuggestions([]);
    try {
      localStorage.removeItem("completedSuggestions");
      localStorage.removeItem("completedSuggestionsTimestamp");
      toast.success("Cleared completed suggestions", {
        description: "Previous optimization history cleared",
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to clear completed suggestions:", error);
    }
  }, []);

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
    analysis,
    isExporting,
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
  };
};
