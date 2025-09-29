import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateImageDescription = async (imageData: string, mimeType: string): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: imageData,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "Analyze this image and generate a descriptive prompt for an image generation model. Describe the main subject, elements, composition, and overall style. Important: If any people are present, refer to them generically as 'person' or 'figure' without specifying gender. The prompt should be a single, cohesive paragraph.",
  };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating image description:", error);
    throw new Error("Failed to generate description from image.");
  }
};

export const applyStyleToPrompt = async (basePrompt: string, stylePrompt: string): Promise<string> => {
  const prompt = `You are a creative prompt engineer. Your task is to masterfully merge a content description with an artistic style to create a new, cohesive image prompt.

CONTENT DESCRIPTION: "${basePrompt}"

ARTISTIC STYLE: "${stylePrompt}"

Combine these two to generate a single, detailed, and powerful prompt that embodies the content within the specified artistic style. The final output should be only the new prompt, without any extra text or labels.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error applying style to prompt:", error);
    throw new Error("Failed to apply style to prompt.");
  }
};
