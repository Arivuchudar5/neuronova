
import { GoogleGenAI } from "@google/genai";
import { Assessment, PatientProfile } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Use process.env.API_KEY directly as per guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeAssessment(
  assessment: Assessment, 
  profile: PatientProfile, 
  history: Assessment[] = []
): Promise<string> {
  const ai = getAI();
  
  const historyContext = history.length > 0 
    ? `Previous assessments: ${JSON.stringify(history.map(h => ({ date: h.date, risk: h.riskPercentage })))}`
    : "No previous history.";

  const prompt = `
    Assessment Data for child ${profile.childName} (Age: ${profile.age}, Gender: ${profile.gender}):
    - Date: ${assessment.date}
    - Total Score: ${assessment.totalScore} / 75
    - Risk Percentage: ${assessment.riskPercentage}%
    - Category: ${assessment.riskCategory}
    - Domain Scores: ${JSON.stringify(assessment.scores)}
    
    ${historyContext}

    Please provide a comprehensive analysis including:
    1. A warm summary.
    2. Detailed domain-wise explanation.
    3. Predictive insights (progression modeling and behavioral trends).
    4. Actionable next steps.
    5. Information on when to seek a specialist.
    6. Include specialists search if location is available: ${profile.location}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "The AI analysis is currently unavailable. Please review your scores and consult a professional.";
  }
}

export async function findSpecialists(location: string): Promise<any[]> {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find top developmental pediatricians and clinical psychologists specializing in autism near ${location}.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    
    return response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  } catch (error) {
    console.error("Map search error:", error);
    return [];
  }
}
