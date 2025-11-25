import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBookDescription = async (title: string, author: string, keywords: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `Write a compelling, short synopsis (approx 100 words) for a book titled "${title}" by "${author}". The book involves: ${keywords}. Make it sound exciting and professional.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Description generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate description at this time.";
  }
};
