
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const detectDisease = async (imageFile: File, language: string): Promise<GenerateContentResponse> => {
  const imagePart = await fileToGenerativePart(imageFile);
  const langMap: { [key: string]: string } = {
    'en': 'English',
    'hi': 'Hindi',
    'mr': 'Marathi'
  };
  const prompt = `Analyze this image of a plant leaf. Identify the disease, if any. Provide the disease name and a recommended solution to treat it. Respond in ${langMap[language] || 'English'}.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                diseaseName: {
                    type: Type.STRING,
                    description: "The common name of the plant disease identified."
                },
                solution: {
                    type: Type.STRING,
                    description: "A detailed, actionable solution or treatment plan for the identified disease."
                }
            }
        }
    }
  });
  
  return response;
};

export const getChatbotResponse = async (message: string, history: {role: string, parts: {text: string}[]}[], language: string): Promise<string> => {
  const langMap: { [key: string]: string } = {
    'en': 'English',
    'hi': 'Hindi',
    'mr': 'Marathi'
  };

  const model = 'gemini-2.5-flash';
  
  const chat = ai.chats.create({
    model: model,
    config: {
        systemInstruction: `You are AgriBot, an AI assistant for farmers. Your goal is to provide helpful, concise advice on treating crop diseases. Your response must be in ${langMap[language] || 'English'}. The user is asking for help about a crop disease. Previous context might be available in the chat history.`,
    },
    history: history,
  });

  const response = await chat.sendMessage({ message: message });
  return response.text;
};
