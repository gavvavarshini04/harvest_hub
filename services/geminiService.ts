import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ChatMessage, LanguageCode } from '../types';

const deobfuscateKey = (obfuscated: string) => {
  if (!obfuscated) return '';
  try {
    const reversed = obfuscated.split('').reverse().join('');
    return atob(reversed);
  } catch (e) {
    return obfuscated; // fallback in case it was not obfuscated
  }
};

const apiKey = deobfuscateKey(process.env.API_KEY || '');

// Provide a dummy key if missing to prevent fatal crash on load, so React can mount and show errors gracefully later.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-to-prevent-crash' });

const cropAnalysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    isHealthy: {
      type: Type.BOOLEAN,
      description: "Whether the plant is healthy or not."
    },
    disease: {
      type: Type.STRING,
      description: "The name of the disease or deficiency detected. If healthy, this should be 'None'."
    },
    confidence: {
      type: Type.STRING,
      description: "Confidence level of the detection (e.g., High, Medium, Low)."
    },
    description: {
      type: Type.STRING,
      description: "A brief description of the detected issue."
    },
    remedy: {
      type: Type.STRING,
      description: "A detailed, actionable treatment plan or remedy for the detected issue. If healthy, provide general care tips."
    }
  },
  required: ["isHealthy", "disease", "confidence", "description", "remedy"]
};


export const analyzeCropHealth = async (base64Image: string, mimeType: string): Promise<any> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this image of a plant leaf. Identify any diseases or nutrient deficiencies. Provide a detailed analysis and a step-by-step treatment plan.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: cropAnalysisResponseSchema,
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error analyzing crop health:", error);
    throw new Error("Failed to analyze crop health. The model may be unable to process this image.");
  }
};


export const getChatResponse = async (history: ChatMessage[], newMessage: string, language: LanguageCode): Promise<string> => {
  try {
    const languageName = {
      [LanguageCode.ENGLISH]: 'English',
      [LanguageCode.HINDI]: 'Hindi',
      [LanguageCode.TELUGU]: 'Telugu',
      [LanguageCode.MALAYALAM]: 'Malayalam'
    }[language] || 'English';

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are HarvestHub, a friendly and knowledgeable farming assistant. Your goal is to provide clear, concise, and helpful advice to farmers. Answer questions related to crop management, pest control, soil health, and farming techniques. Keep your answers practical and easy to understand. Please respond in ${languageName}, which is the user's selected language.`,
      },
      history: history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
    return response.text;

  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error("Failed to get a response from the assistant.");
  }
};

export const generateProductDescription = async (productName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, appealing, and marketable description for a farm product. The product is: ${productName}. The description should be suitable for an online marketplace targeting consumers. Focus on freshness and quality. Keep it under 200 characters.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Failed to generate description.";
  }
};