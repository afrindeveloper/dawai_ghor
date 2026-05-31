import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
// Note: In production, API calls should ideally go through a backend to protect the API key.
// Here we are using it on the frontend for demonstration purposes.
const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are Dr. DawaiAI, the intelligent health assistant for DawaiGhor (an online pharmacy in Bangladesh).
Your role is to help users identify symptoms, recommend medicines available at DawaiGhor, and advise when to see a real doctor.
- Auto-detect the user's language. If they speak in Bengali (Bangla), you MUST respond in Bengali.
- Always be empathetic, concise, and professional.
- Recommend OTC medicines for common ailments (fever, cough, headache, acidity, allergies, vitamins).
- ALWAYS include a disclaimer that you are an AI and they should consult a real doctor for serious issues.
- Do NOT prescribe antibiotics or restricted drugs; only suggest them if the user already has a prescription.
`;

export interface ChatMessageData {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function getDoctorChatResponse(
  history: ChatMessageData[],
  prompt: string
): Promise<string> {
  if (!apiKey) {
    console.error("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
    return "Error: Gemini API key is missing. Please configure VITE_GEMINI_API_KEY.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history,
        { role: "user", parts: [{ text: prompt }] },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm experiencing some technical difficulties. Please try again later.";
  }
}

export interface ExtractedMedicine {
  name: string;
  dosage: string;
  duration?: string;
  notes?: string;
}

export async function analyzePrescription(
  base64Image: string,
  mimeType: string
): Promise<ExtractedMedicine[]> {
  if (!apiKey) {
    console.error("Gemini API key is missing.");
    throw new Error("Gemini API key is missing.");
  }

  // Remove the data URI prefix if present (e.g., "data:image/jpeg;base64,")
  const base64Data = base64Image.split(",")[1] || base64Image;

  const prompt = `
    You are an expert pharmacist and OCR system. 
    Analyze this prescription image and extract the list of medicines.
    
    Return ONLY a valid JSON array of objects, where each object represents a medicine.
    Do not use markdown blocks like \`\`\`json, just return the raw JSON array.
    
    Format for each object:
    {
      "name": "Medicine name (e.g., Napa, Amoxicillin, etc.)",
      "dosage": "Dosage instructions (e.g., 500mg, 1 tablet 3 times a day)",
      "duration": "Duration if specified (e.g., 5 days)",
      "notes": "Any other notes (e.g., after meal)"
    }
    
    If no medicines are found, return an empty array [].
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
      config: {
        temperature: 0.2, // Low temperature for more deterministic extraction
      },
    });

    const text = response.text || "[]";
    // Clean up potential markdown formatting if the model still includes it
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanText) as ExtractedMedicine[];
  } catch (error) {
    console.error("Error analyzing prescription:", error);
    throw new Error("Failed to analyze prescription image.");
  }
}
