import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInvoiceItemDescription = async (prompt: string): Promise<GeneratedContent> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a professional assistant for a web developer creating invoices in Persian (Farsi). 
      The user will provide a rough idea of a task or service (e.g., "Landing page design").
      Your goal is to generate a professional title and a detailed technical description for an invoice line item in Persian.
      
      User Input: "${prompt}"
      
      Output JSON with 'title' (short professional service name) and 'description' (bullet points or detailed sentence explaining the features included, strictly in Persian).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A professional title for the service in Persian",
            },
            description: {
              type: Type.STRING,
              description: "A detailed description of features included in Persian",
            },
          },
          required: ["title", "description"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
