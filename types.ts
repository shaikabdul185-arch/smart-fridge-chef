export interface Ingredient {
  name: string;
  category?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: number;
  ingredientsFound: string[];
  ingredientsMissing: string[];
  steps: string[];
  tags: string[];
}

export interface AnalysisResult {
  detectedIngredients: string[];
  recipes: Recipe[];
}

export type DietaryRestriction = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Keto' | 'Dairy-Free' | 'Paleo';

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
}
