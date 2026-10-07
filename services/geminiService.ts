import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, DietaryRestriction } from "../types";

// Schema definition for the structured output
const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    detectedIngredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of ingredients identified in the image.",
    },
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique identifier for the recipe (e.g., kebab-case name)" },
          title: { type: Type.STRING },
          description: { type: Type.STRING, description: "A short, appetizing description." },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          prepTime: { type: Type.STRING, description: "e.g., '30 mins'" },
          calories: { type: Type.NUMBER, description: "Estimated calories per serving" },
          ingredientsFound: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Ingredients from the image used in this recipe" },
          ingredientsMissing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Essential ingredients NOT in the image but required" },
          steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step cooking instructions" },
          tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Dietary tags e.g., Vegetarian, Keto" },
        },
        required: ["id", "title", "description", "difficulty", "prepTime", "calories", "ingredientsFound", "ingredientsMissing", "steps", "tags"],
      },
    },
  },
  required: ["detectedIngredients", "recipes"],
};

export const analyzeFridgeImage = async (
  base64Image: string,
  dietaryRestrictions: DietaryRestriction[]
): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });

    // Using gemini-3-pro-preview as requested for complex multimodal tasks
    const modelId = "gemini-3-pro-preview";

    const promptText = `
      Analyze this image of a fridge (or food ingredients).
      1. Identify all visible ingredients.
      2. Suggest 5 distinct, delicious recipes that can be made primarily with these ingredients.
      3. If specific dietary restrictions are provided, ONLY suggest recipes that comply with: ${dietaryRestrictions.join(", ")}.
      4. For each recipe, list what ingredients are available from the image and what essential ingredients are missing.
      5. Provide clear, step-by-step cooking instructions.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.4, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response text received from Gemini");

    const result = JSON.parse(jsonText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
