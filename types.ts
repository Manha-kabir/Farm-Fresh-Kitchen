
export interface Ingredient {
  id: string;
  name: string;
  icon: string;
  category: 'Vegetable' | 'Protein' | 'Dairy' | 'Grain' | 'Fruit' | 'Pantry';
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  tools: string[];
  instructions: string[];
  chefTip: string;
}

export type AppState = 'home' | 'fridge' | 'loading' | 'recipes' | 'saved';
