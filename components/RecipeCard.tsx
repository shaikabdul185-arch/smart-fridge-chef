import React from 'react';
import { Recipe } from '../types';
import { Clock, Flame, BarChart, ChevronRight, PlusCircle, CheckCircle2 } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onAddMissing: (ingredients: string[]) => void;
  missingIngredientsAdded: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect, onAddMissing, missingIngredientsAdded }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-900 leading-tight">{recipe.title}</h3>
          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
              recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-red-100 text-red-700'}
          `}>
            {recipe.difficulty}
          </span>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={16} />
            <span>{recipe.calories} kcal</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Have</p>
            <div className="flex flex-wrap gap-1">
              {recipe.ingredientsFound.slice(0, 5).map((ing, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md">
                  {ing}
                </span>
              ))}
              {recipe.ingredientsFound.length > 5 && (
                <span className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded-md">
                  +{recipe.ingredientsFound.length - 5}
                </span>
              )}
            </div>
          </div>
          
          {recipe.ingredientsMissing.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">Missing</p>
              <div className="flex flex-wrap gap-1">
                {recipe.ingredientsMissing.map((ing, i) => (
                  <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md border border-red-100">
                    {ing}
                  </span>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddMissing(recipe.ingredientsMissing);
                }}
                disabled={missingIngredientsAdded}
                className={`mt-2 flex items-center gap-1 text-xs font-medium transition-colors ${
                  missingIngredientsAdded 
                    ? 'text-green-600 cursor-default' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                {missingIngredientsAdded ? (
                  <>
                    <CheckCircle2 size={14} />
                    Added to list
                  </>
                ) : (
                  <>
                    <PlusCircle size={14} />
                    Add missing to list
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button
          onClick={() => onSelect(recipe)}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
        >
          Start Cooking
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
