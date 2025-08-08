import OpenAI from "openai";

export const createOpenAIClient = (apiKey: string) => {
  return new OpenAI({ apiKey });
};

export const auditResume = async (
  client: OpenAI,
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
