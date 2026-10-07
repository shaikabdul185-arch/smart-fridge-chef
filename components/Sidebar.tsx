import React from 'react';
import { DietaryRestriction } from '../types';
import { ChefHat, ShoppingCart, Settings, Camera, Flame, Leaf, Wheat, Milk, Beef, Ban, X } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  selectedFilters: DietaryRestriction[];
  toggleFilter: (filter: DietaryRestriction) => void;
  shoppingListCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const filters: { label: DietaryRestriction; icon: React.ReactNode }[] = [
  { label: 'Vegetarian', icon: <Leaf size={16} /> },
  { label: 'Vegan', icon: <Leaf size={16} className="text-green-600" /> },
  { label: 'Keto', icon: <Beef size={16} /> },
  { label: 'Gluten-Free', icon: <Wheat size={16} /> },
  { label: 'Dairy-Free', icon: <Milk size={16} /> },
  { label: 'Paleo', icon: <Flame size={16} /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  selectedFilters,
  toggleFilter,
  shoppingListCount,
  isOpen,
  setIsOpen
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col h-full
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
            <ChefHat size={28} />
            <span>FridgeChef</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Menu</h3>
            
            <button
              onClick={() => { setActiveView('home'); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'home' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Camera size={20} />
              <span className="font-medium">Scan Fridge</span>
            </button>

            <button
              onClick={() => { setActiveView('shopping'); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'shopping' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="relative">
                <ShoppingCart size={20} />
                {shoppingListCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {shoppingListCount}
                  </span>
                )}
              </div>
              <span className="font-medium">Shopping List</span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Dietary Preferences</h3>
            <div className="space-y-2">
              {filters.map((f) => (
                <label 
                  key={f.label} 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className={`
                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                    ${selectedFilters.includes(f.label) 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-300 bg-white'}
                  `}>
                    {selectedFilters.includes(f.label) && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedFilters.includes(f.label)}
                    onChange={() => toggleFilter(f.label)}
                  />
                  <div className="flex items-center gap-2 text-slate-600">
                    {f.icon}
                    <span className="text-sm font-medium">{f.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 text-center">
              Powered by <br/>
              <span className="font-bold text-slate-700">Gemini 3 Pro</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
