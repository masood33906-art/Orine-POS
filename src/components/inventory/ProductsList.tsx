import React, { useState } from 'react';
import {
  Search, Plus, Package, Edit2, Trash2, AlertTriangle,
  PlusCircle, ArrowUpRight, Filter, Download
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types/pos';
import { downloadCSV } from '../../utils/csvExport';

export const ProductsList: React.FC = () => {
  const {
    products, categories, deleteProduct, addStock,
    setIsQuickProductModalOpen, setEditingProduct, setIsQuickStockModalOpen, settings
  } = usePOS();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const filtered = products.filter(p => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Current Stock', 'Min Stock Level', 'Unit', 'Cost Price', 'Selling Price', 'Total Valuation'];
    const rows = filtered.map(p => [
      p.sku,
      p.name,
      p.category,
      p.currentStock,
      p.minStockLevel,
      p.unit,
      p.costPrice,
      p.sellingPrice,
      Math.round(p.currentStock * p.sellingPrice)
    ]);
    downloadCSV(`Products_Inventory_${new Date().toISOString().split('T')[0]}.csv`, rows, headers);
  };

  return (
    <div className="p-3.5 sm:p-4 space-y-3">
      {/* Search & Actions Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[38px]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setIsQuickStockModalOpen(true)}
            className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1 min-h-[38px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Stock</span>
          </button>

          <button
            onClick={() => setIsQuickProductModalOpen(true)}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1 min-h-[38px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Hardware</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCat('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedCat === 'All'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Categories ({products.length})
        </button>
        {categories.map(c => {
          const count = products.filter(p => p.category === c.name).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCat === c.name
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No hardware products found matching filter.
          </div>
        ) : (
          filtered.map(product => {
            const isLowStock = product.currentStock <= product.minStockLevel;

            return (
              <div
                key={product.id}
                className={`relative bg-white p-2.5 rounded-2xl border transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
                  isLowStock ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top Right 1/4 Image Holding Box */}
                {/* Top Right Image Holding Box (4:3 ratio) */}
                <div className="absolute top-2 right-2 w-[36%] aspect-[4/3] rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50 shrink-0 shadow-2xs">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-1 text-center">
                      <Package className="w-5 h-5 opacity-50" />
                      <span className="text-[8px] font-bold mt-0.5 opacity-60">No Image</span>
                    </div>
                  )}

                  {/* Stock Badge Overlay */}
                  {isLowStock && (
                    <span className="absolute top-1 right-1 px-1 py-0.2 bg-rose-600 text-white text-[8px] font-extrabold rounded-md shadow-xs">
                      Low
                    </span>
                  )}
                </div>

                {/* Left Side Content - Space for top right image */}
                <div className="pr-[40%]">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-md inline-block max-w-full truncate">
                    {product.category}
                  </span>

                  <h3 className="font-extrabold text-slate-900 text-xs mt-1 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>

                  <div className="text-[10px] text-slate-500 mt-1">
                    SKU: <span className="font-mono text-slate-800 font-bold">{product.sku}</span>
                  </div>

                  {product.location && (
                    <div className="text-[9.5px] text-red-600 font-semibold mt-0.5 truncate">
                      {product.location}
                    </div>
                  )}
                </div>

                {/* Bottom Stats Row Across Full Width */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black text-red-700">
                      {settings.currencySymbol} {Math.round(product.sellingPrice)}
                    </div>
                    <div className="text-[9.5px] text-slate-400">
                      Cost: {settings.currencySymbol} {Math.round(product.costPrice)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-black ${isLowStock ? 'text-rose-600' : 'text-slate-800'}`}>
                      {product.currentStock} {product.unit}
                    </div>
                    <div className="text-[9.5px] text-slate-400">
                      Min: {product.minStockLevel} {product.unit}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="mt-2 pt-1.5 border-t border-slate-100/70 flex items-center justify-between text-xs">
                  <button
                    onClick={() => addStock(product.id, 5)}
                    className="text-[10px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    + Quick Add 5
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setIsQuickProductModalOpen(true);
                      }}
                      className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Hardware Product & Picture"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        deleteProduct(product.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
