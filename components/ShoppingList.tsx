import React from 'react';
import { ShoppingItem } from '../types';
import { Trash2, Plus, Check } from 'lucide-react';

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (name: string) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onToggle, onRemove, onAdd }) => {
  const [newItemName, setNewItemName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAdd(newItemName.trim());
      setNewItemName('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Shopping List</h2>
        <p className="text-slate-500">Don't forget the essentials for your next meal.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 relative">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add an item..."
          className="w-full pl-5 pr-12 py-4 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p>Your list is empty</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`
                group flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                ${item.checked 
                  ? 'bg-slate-50 border-slate-100' 
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}
              `}
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => onToggle(item.id)}
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${item.checked 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-300 hover:border-emerald-500'}
                  `}
                >
                  {item.checked && <Check size={14} />}
                </button>
                <span className={`text-lg transition-all ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {item.name}
                </span>
              </div>
              
              <button
                onClick={() => onRemove(item.id)}
                className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
