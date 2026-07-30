import React, { useState } from 'react';
import { Plus, Tag, Layers, Trash2 } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const CategoriesManager: React.FC = () => {
  const { categories, addCategory, products } = usePOS();
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim(),
      color: 'bg-red-500'
    });
    setNewCatName('');
    setNewCatDesc('');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Form: Add Category */}
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
          Add Hardware Category
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-bold mb-1">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Plumbing Fittings"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Description (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Valves, connectors, sealant"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Save Category</span>
        </button>
      </form>

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map(cat => {
          const itemCount = products.filter(p => p.category === cat.name).length;
          return (
            <div key={cat.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <h4 className="font-extrabold text-slate-900 text-sm">{cat.name}</h4>
                </div>
                {cat.description && (
                  <p className="text-[11px] text-slate-500 mt-1">{cat.description}</p>
                )}
              </div>
              <span className="px-2.5 py-1 bg-red-50 text-red-700 font-extrabold text-xs rounded-xl border border-red-100 shrink-0">
                {itemCount} items
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
