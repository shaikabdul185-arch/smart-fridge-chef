# Smart Fridge Chef

Take a photo of your fridge and get **recipes you can cook with what's in it**. A multimodal Gemini model identifies the ingredients, suggests five recipes that fit your diet, lists what you're missing, and walks you through cooking hands-free.

## Features

- **Ingredient detection:** upload a fridge or pantry photo and Gemini lists what it sees
- **5 recipe suggestions:** each with difficulty, prep time, calories per serving and tags
- **Diet filters:** Vegetarian, Vegan, Gluten-Free, Keto, Dairy-Free and Paleo
- **Have vs. need:** every recipe splits ingredients into "in your fridge" and "missing"
- **Shopping list:** add missing ingredients with one click
- **Cooking mode:** full-screen step-by-step view that can **read each step aloud** using the browser's speech synthesis

## How it works

The image is sent to `gemini-3-pro-preview` together with your diet filters. A strict **JSON response schema** makes the model return the detected ingredients and fully structured recipes, which the UI renders directly.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · lucide-react · Google Gen AI SDK · Web Speech API

## Run locally

Requires Node.js 18+ and a Gemini API key (free at https://aistudio.google.com/apikey).

```bash
git clone https://github.com/shaikabdul185-arch/smart-fridge-chef.git
cd smart-fridge-chef
npm install
cp .env.example .env.local   # then add your key
npm run dev
```

Open http://localhost:3000. Production build: `npm run build`.

## Project structure

```
App.tsx                      Upload, filters, results, state
components/Sidebar.tsx       Photo upload and diet filters
components/RecipeCard.tsx    Recipe summary card
components/CookingMode.tsx   Step-by-step view with read-aloud
components/ShoppingList.tsx  Missing-ingredient list
services/geminiService.ts    Image analysis with JSON schema
types.ts                     Recipe, ingredient and filter types
```

## A note on API keys

The key is bundled into the browser code at build time. That's fine for local use, but don't deploy a public build with your personal key in it.
