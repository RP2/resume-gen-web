import OpenAI from "openai";
import type { ResumeData } from "../../types/resume";

// Check if we're in production (Cloudflare Pages) or local development
const isProduction =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

export const createOpenAIClient = (apiKey: string) => {
  if (isProduction) {
    // In production, use our Cloudflare Pages Function
    return {
      chat: {
        completions: {
          create: async (params: {
            model: string;
            messages: Array<{ role: string; content: string }>;
            temperature?: number;
          }) => {
            const response = await fetch("/api/openai", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                apiKey,
                messages: params.messages,
                model: params.model,
                temperature: params.temperature,
              }),
            });

            if (!response.ok) {
              const errorData = await response
                .json()
                .catch(() => ({ error: "Network error" }));
              throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            return response.json();
          },
        },
      },
    };
  } else {
    // In development, use the OpenAI SDK directly
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
};

export interface ResumeSuggestion {
  section:
    | "personalInfo"
    | "workExperience"
    | "skills"
    | "projects"
    | "education";
  type: "highlight" | "modify" | "add" | "reorder" | "remove";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  currentContent?: string;
  suggestedContent?: string;
  itemId?: string; // for specific work experience, education, etc.
}

export interface ResumeAnalysis {
  overallScore: number;
  keyRequirements: string[];
  matchingStrengths: string[];
  gaps: string[];
  suggestions: ResumeSuggestion[];
  summary: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export const analyzeResumeForJob = async (
  client: OpenAI | any, // Can be either OpenAI instance or our custom client
  resumeData: ResumeData,
  jobDescription: string,
  completedSuggestions?: ResumeSuggestion[],
): Promise<ResumeAnalysis> => {
  const systemPrompt = `You are an expert resume optimization AI that helps candidates tailor their resumes for specific job applications. 

Your task is to analyze a resume against a job description and provide specific, actionable suggestions for improvement.

You must respond with a valid JSON object that matches this exact structure:
{
  "overallScore": number (0-100),
  "keyRequirements": string[],
  "matchingStrengths": string[],
  "gaps": string[],
  "suggestions": [
    {
      "section": "personalInfo" | "workExperience" | "skills" | "projects" | "education",
      "type": "highlight" | "modify" | "add" | "reorder" | "remove",
      "priority": "high" | "medium" | "low",
      "title": "Brief title of the suggestion",
      "description": "Detailed explanation of what to change and why",
      "currentContent": "Current text (if modifying existing content)",
      "suggestedContent": "Suggested replacement text (if applicable)",
      "itemId": "ID of specific item to modify (if applicable)"
    }
  ],
  "summary": "Brief summary of overall recommendations"
}

SCORING METHODOLOGY:
Calculate the overallScore (0-100) based on these weighted criteria:
- Required Skills Match (30%): How many required skills/technologies from the job are present in the resume
- Experience Relevance (25%): How well work experience aligns with job requirements and seniority level
- Industry/Domain Match (15%): Relevant industry experience and domain knowledge
- Education Requirements (10%): Educational background alignment (if specified in job)
- Keyword Density (10%): Presence of important keywords from job description
- Role Responsibilities (10%): How well current/past roles match the target role's responsibilities

SCORING GUIDELINES:
- 90-100%: Exceptional match, minimal gaps, highly qualified candidate
- 80-89%: Strong match with minor gaps, well-qualified candidate  
- 70-79%: Good match with some notable gaps, qualified with room for improvement
- 60-69%: Fair match with significant gaps, may need substantial improvements
- 50-59%: Weak match with major gaps, considerable work needed
- Below 50%: Poor match, fundamental misalignment

Focus on:
1. Matching keywords and skills from the job description
2. Highlighting relevant experience that aligns with job requirements
3. Suggesting specific improvements to descriptions and bullet points
4. Recommending what to emphasize more or less
5. Identifying missing skills or experiences that could be added
6. Optimizing for ATS (Applicant Tracking Systems)`;

  const userPrompt = `Please analyze this resume against the job description and provide optimization suggestions.

JOB DESCRIPTION:
${jobDescription}

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

${
  completedSuggestions && completedSuggestions.length > 0
    ? `
PREVIOUSLY COMPLETED SUGGESTIONS:
The user has already implemented these suggestions in previous optimization rounds:
${completedSuggestions
  .map(
    (suggestion, index) =>
      `${index + 1}. [${suggestion.type.toUpperCase()}] ${suggestion.title}
   Section: ${suggestion.section}
   Description: ${suggestion.description}
   ${suggestion.currentContent ? `Previous content: "${suggestion.currentContent}"` : ""}
   ${suggestion.suggestedContent ? `Changed to: "${suggestion.suggestedContent}"` : ""}
`,
  )
  .join("\n")}

Please consider these completed changes when providing new suggestions. Avoid repeating similar suggestions and focus on the next level of improvements that build upon these completed changes.
`
    : ""
}

ANALYSIS INSTRUCTIONS:
1. First identify the key requirements, must-have skills, and preferred qualifications from the job description
2. Evaluate how well the resume matches each requirement category
3. Calculate the overall compatibility score using the weighted methodology provided
4. Be honest and realistic in your scoring - a perfect 100% should only be given to truly exceptional matches
5. Provide actionable suggestions that address the largest scoring gaps first

SKILLS HANDLING:
For skills suggestions, be very specific:
- Use type "add" when suggesting to add a new skill to an existing category (only provide suggestedContent with the single skill name)
- Use type "remove" when suggesting to remove a skill from a category (only provide currentContent with the single skill to remove)
- Use type "modify" when suggesting to change how a skill is named/presented (provide both currentContent and suggestedContent with single skill names)
- For adding new skill categories, use type "add" with section "skills" and specify the category name in suggestedContent
- Never bundle multiple skills in one suggestion - each skill should be its own suggestion
- Use itemId to specify which skill category the suggestion applies to (use the category's id)

SUGGESTION EXAMPLES:
- Add skill: {"section": "skills", "type": "add", "suggestedContent": "React", "itemId": "frontend-category-id", "title": "Add React to Frontend Skills"}
- Remove skill: {"section": "skills", "type": "remove", "currentContent": "jQuery", "itemId": "frontend-category-id", "title": "Remove jQuery from Frontend Skills"}  
- Modify skill: {"section": "skills", "type": "modify", "currentContent": "Javascript", "suggestedContent": "JavaScript", "itemId": "frontend-category-id", "title": "Correct JavaScript spelling"}

Provide specific, actionable suggestions that will help this resume better match the job requirements.`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3, // Lower temperature for more consistent structured output
  });

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  try {
    // Clean the response to extract JSON if wrapped in markdown
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;

    const analysisResult = JSON.parse(jsonString) as ResumeAnalysis;

    // Add usage information if available
    if (response.usage) {
      analysisResult.usage = {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      };
    }

    return analysisResult;
  } catch (error) {
    console.error("Failed to parse OpenAI response as JSON:", content);
    throw new Error("Invalid JSON response from OpenAI");
  }
};

export const auditResume = async (
  client: OpenAI | any, // Can be either OpenAI instance or our custom client
  resumeContent: string,
  jobDescription: string,
) => {
  const prompt = `Audit the following resume for the given job description:\n\nResume:\n${resumeContent}\n\nJob Description:\n${jobDescription}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant, resume expert, and career advisor. You are able to provide feedback on resumes and suggest improvements and optimizations. You can also help users tailor their resumes for specific job applications.",
      },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0]?.message?.content?.trim() || "";
};
