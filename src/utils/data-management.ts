/**
 * Data management utilities for local storage and file operations
 */

import type { ResumeData } from "../types/resume";

/**
 * Saves resume data to a JSON file
 */
export const saveResumeToFile = (
  resumeData: ResumeData,
  filename: string = "resume.json",
): void => {
  const dataStr = JSON.stringify(resumeData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Loads resume data from a JSON file
 */
export const loadResumeFromFile = (): Promise<ResumeData | null> => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const resumeData = JSON.parse(e.target?.result as string);
            resolve(resumeData);
          } catch (error) {
            console.error("Error parsing JSON file:", error);
            resolve(null);
          }
        };
        reader.readAsText(file);
      } else {
        resolve(null);
      }
    };

    input.click();
  });
};

/**
 * Saves resume data to local storage
 */
export const saveResumeToLocalStorage = (
  resumeData: ResumeData,
  key: string = "resumeData",
): void => {
  try {
    localStorage.setItem(key, JSON.stringify(resumeData));
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

/**
 * Loads resume data from local storage
 */
export const loadResumeFromLocalStorage = (
  key: string = "resumeData",
): ResumeData | null => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading from local storage:", error);
    return null;
  }
};

/**
 * Clears resume data from local storage
 */
export const clearResumeFromLocalStorage = (
  key: string = "resumeData",
): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
};
