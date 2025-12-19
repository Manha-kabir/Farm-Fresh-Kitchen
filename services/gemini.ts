
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

export const generateRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are a friendly, farm-to-table chef. Based strictly on the following ingredients found in a fridge: ${ingredients.join(', ')}. 
  
  Please provide 3 quick, healthy, and aesthetic recipe ideas. 
  Rules:
  1. Use ONLY the provided ingredients plus basic kitchen staples (salt, pepper, water, oil).
  2. If a dish usually requires something not listed, find a creative substitute from the list.
  3. Ensure the instructions are easy to follow and divided into clear steps.
  4. Include a list of "Tools" required (e.g., frying pan, mixing bowl, spatula).
  5. Provide prep time, cook time, and serving size.
  6. Each recipe should include a "Chef's Tip".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique short ID for the recipe" },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              prepTime: { type: Type.STRING },
              cookTime: { type: Type.STRING },
              servings: { type: Type.NUMBER },
              difficulty: { type: Type.STRING },
              ingredients: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              tools: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of kitchen equipment needed"
              },
              instructions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              chefTip: { type: Type.STRING }
            },
            required: ["id", "title", "description", "prepTime", "cookTime", "servings", "difficulty", "ingredients", "tools", "instructions", "chefTip"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw error;
  }
};
