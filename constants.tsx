
import React from 'react';
import { Ingredient } from './types';

export const COMMON_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Tomato', icon: '🍅', category: 'Vegetable' },
  { id: '2', name: 'Egg', icon: '🥚', category: 'Protein' },
  { id: '3', name: 'Milk', icon: '🥛', category: 'Dairy' },
  { id: '4', name: 'Chicken', icon: '🍗', category: 'Protein' },
  { id: '5', name: 'Spinach', icon: '🥬', category: 'Vegetable' },
  { id: '6', name: 'Onion', icon: '🧅', category: 'Vegetable' },
  { id: '7', name: 'Garlic', icon: '🧄', category: 'Vegetable' },
  { id: '8', name: 'Pasta', icon: '🍝', category: 'Grain' },
  { id: '9', name: 'Rice', icon: '🍚', category: 'Grain' },
  { id: '10', name: 'Potato', icon: '🥔', category: 'Vegetable' },
  { id: '11', name: 'Bell Pepper', icon: '🫑', category: 'Vegetable' },
  { id: '12', name: 'Cheese', icon: '🧀', category: 'Dairy' },
  { id: '13', name: 'Yogurt', icon: '🍦', category: 'Dairy' },
  { id: '14', name: 'Lemon', icon: '🍋', category: 'Fruit' },
  { id: '15', name: 'Bread', icon: '🍞', category: 'Grain' },
  { id: '16', name: 'Carrot', icon: '🥕', category: 'Vegetable' },
  { id: '17', name: 'Mushrooms', icon: '🍄', category: 'Vegetable' },
  { id: '18', name: 'Avocado', icon: '🥑', category: 'Fruit' },
  { id: '19', name: 'Butter', icon: '🧈', category: 'Pantry' },
  { id: '20', name: 'Tuna', icon: '🐟', category: 'Protein' },
  { id: '21', name: 'Broccoli', icon: '🥦', category: 'Vegetable' },
  { id: '22', name: 'Beef', icon: '🥩', category: 'Protein' },
  { id: '23', name: 'Corn', icon: '🌽', category: 'Vegetable' },
  { id: '24', name: 'Shrimp', icon: '🍤', category: 'Protein' },
  { id: '25', name: 'Tofu', icon: '🧊', category: 'Protein' },
  { id: '26', name: 'Cucumber', icon: '🥒', category: 'Vegetable' },
  { id: '27', name: 'Honey', icon: '🍯', category: 'Pantry' },
  { id: '28', name: 'Flour', icon: '🌾', category: 'Pantry' },
  { id: '29', name: 'Chili', icon: '🌶️', category: 'Vegetable' },
  { id: '30', name: 'Basil', icon: '🌿', category: 'Vegetable' },
  { id: '31', name: 'Apple', icon: '🍎', category: 'Fruit' },
  { id: '32', name: 'Banana', icon: '🍌', category: 'Fruit' },
  { id: '33', name: 'Bacon', icon: '🥓', category: 'Protein' },
  { id: '34', name: 'Oats', icon: '🥣', category: 'Grain' },
  { id: '35', name: 'Peanut Butter', icon: '🥜', category: 'Pantry' },
  { id: '36', name: 'Salmon', icon: '🍣', category: 'Protein' },
  { id: '37', name: 'Lettuce', icon: '🥬', category: 'Vegetable' },
  { id: '38', name: 'Cabbage', icon: '🥬', category: 'Vegetable' },
  { id: '39', name: 'Sausage', icon: '🌭', category: 'Protein' },
  { id: '40', name: 'Lime', icon: '🍋', category: 'Fruit' },
];

export const FARM_QUOTES = [
  "Don't count your chickens before they're fried... wait, baked!",
  "Lettuce celebrate this amazing meal! 🥬",
  "I'm feeling grape today, how about you? 🍇",
  "This kitchen is outstanding in its field! 🌾",
  "Rooting for you to make something delicious! 🥕",
  "Life is better on the farm (and with butter). 🧈",
  "Holy cow, this looks tasty! 🐄",
  "Oh my gourd, that recipe sounds amazing! 🎃",
  "Squeeze the day! 🍋",
  "Peas and love to all who cook here. 🫛"
];

export const FarmIcons = {
  Sun: () => (
    <svg className="w-12 h-12 text-yellow-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
    </svg>
  ),
  Leaf: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.13,20C11.33,20 14.39,18.5 16.5,16.14C17.65,14.85 18.5,13.36 19,11.75C19.5,10.14 19.8,8.4 20,6.6C20.2,4.8 20.3,3 20.4,1.2L18.6,1C18.5,2.8 18.4,4.6 18.2,6.4C18,8.2 17.7,9.94 17.2,11.55C16.7,13.16 16,14.65 15,15.94C13.2,18.15 10.7,19.5 8.13,19.5C7.7,19.5 7.28,19.45 6.86,19.34C8.75,14.6 10.64,9.86 17,8Z" />
    </svg>
  ),
};
