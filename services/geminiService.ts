import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateShotIdeas = async (
    eventType: string, 
    notes: string,
    eventStartDate: string,
    eventEndDate: string,
    needsVideography: boolean,
    videographyStartDate?: string,
    videographyEndDate?: string,
): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("API Key not configured. Please set the API_KEY environment variable.");
  }

  const startTime = eventStartDate ? new Date(eventStartDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Not set';
  const endTime = eventEndDate ? new Date(eventEndDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Not set';
  
  let videographyInfo = 'No videography needed.';
  if (needsVideography) {
      if (videographyStartDate && videographyEndDate) {
          const videoStartTime = new Date(videographyStartDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          const videoEndTime = new Date(videographyEndDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          videographyInfo = `Videography is required from ${videoStartTime} to ${videoEndTime}.`
      } else {
          videographyInfo = 'Videography is also required.'
      }
  }

  const prompt = `
    You are a creative assistant for a professional photographer.
    Based on the following event details, generate 5 creative and unique photo shot ideas.
    The ideas should be concise, inspiring, and actionable.

    Event Type: ${eventType}
    Event Time: ${startTime} to ${endTime}
    Videography: ${videographyInfo}
    Client Notes: "${notes}"

    Format the output as a numbered list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating shot ideas:", error);
    return "Could not generate ideas at this time. Please check the console for errors.";
  }
};