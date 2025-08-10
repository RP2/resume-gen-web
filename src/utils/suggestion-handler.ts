import type {
  ResumeData,
  WorkExperience,
  Education,
  Skill,
  Project,
  PersonalInfo,
} from "../types/resume";
import type { ResumeSuggestion } from "../lib/openai/api";

// Type for form handlers
export interface FormHandlers {
  handlePersonalInfoChange: (personalInfo: PersonalInfo) => void;
  handleWorkExperienceChange: (workExperience: WorkExperience[]) => void;
  handleEducationChange: (education: Education[]) => void;
  handleSkillsChange: (skills: Skill[]) => void;
  handleProjectsChange: (projects: Project[]) => void;
}

// Function to apply suggestions using form handlers (the correct way)
export const applySuggestionUsingHandlers = (
  suggestion: ResumeSuggestion,
  handlers: FormHandlers,
  currentData: ResumeData,
): void => {
  switch (suggestion.section) {
    case "personalInfo":
      if (suggestion.type === "modify" && suggestion.suggestedContent) {
        const newPersonalInfo = { ...currentData.personalInfo };

        // For personal info modifications, focus on summary field
        if (
          suggestion.title.toLowerCase().includes("summary") ||
          suggestion.title.toLowerCase().includes("objective")
        ) {
          newPersonalInfo.summary = suggestion.suggestedContent;
        }

        handlers.handlePersonalInfoChange(newPersonalInfo);
      }
      break;

    case "workExperience":
      if (suggestion.itemId) {
        const newWorkExperience = [...currentData.workExperience];
        const expIndex = newWorkExperience.findIndex(
          (exp) => exp.id === suggestion.itemId,
        );

        if (expIndex !== -1) {
          const experience = { ...newWorkExperience[expIndex] };

          if (suggestion.type === "modify" && suggestion.suggestedContent) {
            if (suggestion.title.toLowerCase().includes("description")) {
              experience.description = suggestion.suggestedContent;
            } else if (
              suggestion.title.toLowerCase().includes("highlight") ||
              suggestion.title.toLowerCase().includes("bullet")
            ) {
              // Parse highlights from suggested content
              const highlights = suggestion.suggestedContent
                .split("\n")
                .filter((line) => line.trim())
                .map((line) => line.replace(/^[-•*]\s*/, "").trim());
              experience.highlights = highlights;
            }
          }

          newWorkExperience[expIndex] = experience;
          handlers.handleWorkExperienceChange(newWorkExperience);
        }
      }
      break;

    case "skills":
      if (suggestion.type === "add" && suggestion.suggestedContent) {
        const newSkills = [...currentData.skills];

        // Find the best matching category or create one
        let categoryIndex = -1;

        // First, try to find an existing category that makes sense
        if (
          suggestion.title.toLowerCase().includes("technical") ||
          suggestion.title.toLowerCase().includes("programming") ||
          suggestion.suggestedContent.toLowerCase().includes("javascript") ||
          suggestion.suggestedContent.toLowerCase().includes("python") ||
          suggestion.suggestedContent.toLowerCase().includes("react")
        ) {
          // Look for technical/programming category
          categoryIndex = newSkills.findIndex(
            (skillGroup) =>
              skillGroup.category.toLowerCase().includes("technical") ||
              skillGroup.category.toLowerCase().includes("programming") ||
              skillGroup.category.toLowerCase().includes("development"),
          );
        } else if (
          suggestion.title.toLowerCase().includes("soft") ||
          suggestion.title.toLowerCase().includes("communication") ||
          suggestion.title.toLowerCase().includes("leadership")
        ) {
          // Look for soft skills category
          categoryIndex = newSkills.findIndex(
            (skillGroup) =>
              skillGroup.category.toLowerCase().includes("soft") ||
              skillGroup.category.toLowerCase().includes("interpersonal") ||
              skillGroup.category.toLowerCase().includes("communication"),
          );
        } else {
          // Default to first available category or technical
          categoryIndex = newSkills.findIndex(
            (skillGroup) =>
              skillGroup.category.toLowerCase().includes("technical") ||
              skillGroup.category.toLowerCase().includes("programming"),
          );
        }

        // If no matching category found, create one
        if (categoryIndex === -1) {
          const newCategoryName = suggestion.title
            .toLowerCase()
            .includes("soft")
            ? "Soft Skills"
            : "Technical Skills";

          newSkills.push({
            id: `skill_${Date.now()}`,
            category: newCategoryName,
            skills: [],
            visible: true,
          });
          categoryIndex = newSkills.length - 1;
        }

        // Parse and add new skills - handle various formats
        let skillsToAdd: string[] = [];

        if (suggestion.suggestedContent.includes(",")) {
          // Comma-separated list
          skillsToAdd = suggestion.suggestedContent
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0);
        } else if (suggestion.suggestedContent.includes("\n")) {
          // Line-separated list
          skillsToAdd = suggestion.suggestedContent
            .split("\n")
            .map((skill) => skill.trim().replace(/^[-•]\s*/, "")) // Remove bullet points
            .filter((skill) => skill.length > 0);
        } else {
          // Single skill
          skillsToAdd = [suggestion.suggestedContent.trim()];
        }

        // Filter out duplicates
        skillsToAdd = skillsToAdd.filter(
          (skill) =>
            skill &&
            !newSkills[categoryIndex].skills.some(
              (existingSkill) =>
                existingSkill.toLowerCase() === skill.toLowerCase(),
            ),
        );

        if (skillsToAdd.length > 0) {
          newSkills[categoryIndex].skills = [
            ...newSkills[categoryIndex].skills,
            ...skillsToAdd,
          ];

          handlers.handleSkillsChange(newSkills);
        }
      }
      break;

    case "projects":
      if (suggestion.type === "add" && suggestion.suggestedContent) {
        const newProjects = [...currentData.projects];

        // Create new project from suggested content
        const newProject: Project = {
          id: `project_${Date.now()}`,
          name: suggestion.title || "New Project",
          description: suggestion.suggestedContent,
          technologies: [],
          startDate: new Date().getFullYear().toString(),
          url: "",
        };

        newProjects.push(newProject);
        handlers.handleProjectsChange(newProjects);
      }
      break;

    default:
      console.log(`Unsupported section: ${suggestion.section}`);
  }
};

export const applySuggestionToResume = (
  resumeData: ResumeData,
  suggestion: ResumeSuggestion,
): ResumeData => {
  const newResumeData = { ...resumeData };

  switch (suggestion.section) {
    case "personalInfo":
      if (suggestion.type === "modify" && suggestion.suggestedContent) {
        // For personal info modifications, we'll need more specific handling
        // For now, we'll focus on the summary field as it's most commonly suggested
        if (
          suggestion.title.toLowerCase().includes("summary") ||
          suggestion.title.toLowerCase().includes("objective")
        ) {
          newResumeData.personalInfo = {
            ...newResumeData.personalInfo,
            summary: suggestion.suggestedContent,
          };
        }
      }
      break;

    case "workExperience":
      if (suggestion.itemId) {
        const expIndex = newResumeData.workExperience.findIndex(
          (exp) => exp.id === suggestion.itemId,
        );
        if (expIndex !== -1) {
          const experience = { ...newResumeData.workExperience[expIndex] };

          if (suggestion.type === "modify" && suggestion.suggestedContent) {
            // Determine what field to modify based on suggestion content
            if (suggestion.title.toLowerCase().includes("description")) {
              experience.description = suggestion.suggestedContent;
            } else if (
              suggestion.title.toLowerCase().includes("highlight") ||
              suggestion.title.toLowerCase().includes("bullet")
            ) {
              // Try to parse highlights from suggested content
              const highlights = suggestion.suggestedContent
                .split("\n")
                .filter(
                  (line) =>
                    line.trim().startsWith("•") || line.trim().startsWith("-"),
                )
                .map((line) => line.replace(/^[•\-]\s*/, "").trim())
                .filter((line) => line.length > 0);

              if (highlights.length > 0) {
                experience.highlights = highlights;
              }
            }
          } else if (suggestion.type === "highlight") {
            // Mark this experience as more visible/important
            experience.visible = true;
          }

          newResumeData.workExperience[expIndex] = experience;
        }
      } else if (suggestion.type === "reorder") {
        // For reordering, we'd need more specific logic
        // This is a placeholder for more complex reordering logic
        console.log(
          "Reordering work experience based on suggestion:",
          suggestion,
        );
      }
      break;

    case "skills":
      if (suggestion.type === "add" && suggestion.suggestedContent) {
        // Parse suggested skills and add them
        const skillsToAdd = suggestion.suggestedContent
          .split(/[,\n]/)
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0);

        if (skillsToAdd.length > 0) {
          // Find or create a relevant skill category
          let targetCategory = newResumeData.skills.find(
            (s) =>
              s.category.toLowerCase().includes("technical") ||
              s.category.toLowerCase().includes("programming") ||
              s.category.toLowerCase() === "other",
          );

          if (!targetCategory) {
            // Create a new category
            targetCategory = {
              id: Date.now().toString(),
              category: "Additional Skills",
              skills: [],
              visible: true,
            };
            newResumeData.skills.push(targetCategory);
          } else {
            // Update existing category
            const categoryIndex = newResumeData.skills.findIndex(
              (s) => s.id === targetCategory!.id,
            );
            newResumeData.skills[categoryIndex] = {
              ...targetCategory,
              skills: [...new Set([...targetCategory.skills, ...skillsToAdd])], // Avoid duplicates
            };
          }
        }
      } else if (suggestion.itemId) {
        const skillIndex = newResumeData.skills.findIndex(
          (skill) => skill.id === suggestion.itemId,
        );
        if (skillIndex !== -1 && suggestion.type === "highlight") {
          newResumeData.skills[skillIndex] = {
            ...newResumeData.skills[skillIndex],
            visible: true,
          };
        }
      }
      break;

    case "projects":
      if (suggestion.itemId) {
        const projectIndex = newResumeData.projects.findIndex(
          (proj) => proj.id === suggestion.itemId,
        );
        if (projectIndex !== -1) {
          const project = { ...newResumeData.projects[projectIndex] };

          if (suggestion.type === "modify" && suggestion.suggestedContent) {
            if (suggestion.title.toLowerCase().includes("description")) {
              project.description = suggestion.suggestedContent;
            }
          } else if (suggestion.type === "highlight") {
            project.visible = true;
          }

          newResumeData.projects[projectIndex] = project;
        }
      }
      break;

    case "education":
      if (suggestion.itemId) {
        const eduIndex = newResumeData.education.findIndex(
          (edu) => edu.id === suggestion.itemId,
        );
        if (eduIndex !== -1 && suggestion.type === "highlight") {
          newResumeData.education[eduIndex] = {
            ...newResumeData.education[eduIndex],
            visible: true,
          };
        }
      }
      break;

    default:
      console.log("Unhandled suggestion type:", suggestion);
  }

  return newResumeData;
};

export const canApplySuggestion = (suggestion: ResumeSuggestion): boolean => {
  // Check if we can automatically apply this type of suggestion
  const supportedTypes = ["modify", "highlight", "add"];
  const supportedSections = [
    "personalInfo",
    "workExperience",
    "skills",
    "projects",
    "education",
  ];

  return (
    supportedTypes.includes(suggestion.type) &&
    supportedSections.includes(suggestion.section) &&
    (Boolean(suggestion.suggestedContent) || suggestion.type === "highlight")
  );
};
