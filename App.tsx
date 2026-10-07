import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { RecipeCard } from './components/RecipeCard';
import { CookingMode } from './components/CookingMode';
import { ShoppingList } from './components/ShoppingList';
import { Recipe, Ingredient, DietaryRestriction, ShoppingItem } from './types';
import { analyzeFridgeImage } from './services/geminiService';
import { Camera, Upload, Menu, Loader2, SearchX, ChefHat } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<DietaryRestriction[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [addedMissingMap, setAddedMissingMap] = useState<Record<string, boolean>>({});

  const toggleFilter = (filter: DietaryRestriction) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous results
    setRecipes([]);
    setDetectedIngredients([]);
    setImage(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1]; // Remove data URL prefix
      setImage(base64String);
      
      setIsAnalyzing(true);
      try {
        const result = await analyzeFridgeImage(base64Data, selectedFilters);
        setRecipes(result.recipes);
        setDetectedIngredients(result.detectedIngredients);
        setActiveView('results');
      } catch (error) {
        console.error("Analysis failed", error);
        alert("Failed to analyze image. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const addToShoppingList = (name: string) => {
    setShoppingList(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      name,
      checked: false
    }]);
  };

  const addMissingIngredients = (recipeId: string, ingredients: string[]) => {
    ingredients.forEach(ing => addToShoppingList(ing));
    setAddedMissingMap(prev => ({ ...prev, [recipeId]: true }));
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        selectedFilters={selectedFilters}
        toggleFilter={toggleFilter}
        shoppingListCount={shoppingList.filter(i => !i.checked).length}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-slate-100 flex items-center justify-between px-4 bg-white z-10">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
            <ChefHat size={24} />
            <span>FridgeChef</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          {activeView === 'home' && (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-md w-full space-y-8">
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    What's in your <span className="text-emerald-600">Fridge?</span>
                  </h1>
                  <p className="text-lg text-slate-500 leading-relaxed">
                    Snap a photo of your ingredients and let AI suggest the perfect recipe for tonight.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                  <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl bg-white cursor-pointer hover:bg-slate-50 hover:border-emerald-400 transition-all group-hover:scale-[1.01]">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-emerald-600" size={48} />
                        <p className="font-medium text-slate-600">Analyzing your ingredients...</p>
                        <p className="text-sm text-slate-400">This might take a moment</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                          <Camera size={32} />
                        </div>
                        <span className="font-bold text-lg text-slate-700">Take a Photo</span>
                        <span className="text-sm text-slate-400 mt-2">or upload an image</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment"
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </>
                    )}
                  </label>
                </div>
                
                {selectedFilters.length > 0 && (
                   <div className="flex flex-wrap justify-center gap-2">
                     {selectedFilters.map(f => (
                       <span key={f} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                         {f}
                       </span>
                     ))}
                   </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'results' && (
            <div className="p-6 max-w-7xl mx-auto">
              {detectedIngredients.length > 0 && (
                <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Detected Ingredients</h2>
                  <div className="flex flex-wrap gap-2">
                    {detectedIngredients.map((ing, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.length > 0 ? (
                   recipes.map(recipe => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      onSelect={(r) => setSelectedRecipe(r)}
                      onAddMissing={(missing) => addMissingIngredients(recipe.id, missing)}
                      missingIngredientsAdded={!!addedMissingMap[recipe.id]}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                    <SearchX size={48} className="mb-4 opacity-50" />
                    <p className="text-lg">No recipes found based on the image.</p>
                    <button 
                      onClick={() => setActiveView('home')}
                      className="mt-4 text-emerald-600 font-medium hover:underline"
                    >
                      Try another photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'shopping' && (
            <ShoppingList 
              items={shoppingList}
              onToggle={toggleShoppingItem}
              onRemove={removeShoppingItem}
              onAdd={addToShoppingList}
            />
          )}
        </div>

        {/* Cooking Mode Overlay */}
        {selectedRecipe && (
          <CookingMode 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)} 
          />
        )}
      </main>
    </div>
  );
}
