import React, { useState } from 'react';
import { PackagePlus, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const StockManagement: React.FC = () => {
  const { products, addStock, setIsQuickStockModalOpen } = usePOS();
  const [selectedProdId, setSelectedProdId] = useState('');
  const [stockAddAmount, setStockAddAmount] = useState('');
  const [msg, setMsg] = useState('');

  const lowStockList = products.filter(p => p.currentStock <= p.minStockLevel);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProdId) return;
    const qty = parseInt(stockAddAmount) || 0;
    if (qty <= 0) return;

    addStock(selectedProdId, qty);
    const prod = products.find(p => p.id === selectedProdId);
    setMsg(`Added ${qty} pcs to ${prod?.name}. New stock: ${(prod?.currentStock || 0) + qty} pcs.`);
    setStockAddAmount('');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Quick Add Stock Form */}
      <form onSubmit={handleManualAdd} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <PackagePlus className="w-4 h-4 text-amber-600" /> Quick Stock Addition / Restock
        </h3>

        {msg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-bold mb-1">Select Hardware Product</label>
            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.currentStock} pcs)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Quantity to Add (Pieces)</label>
            <input
              type="number"
              min="1"
              value={stockAddAmount}
              onChange={(e) => setStockAddAmount(e.target.value)}
              placeholder="e.g. 10"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedProdId || !stockAddAmount}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Add Stock Now
        </button>
      </form>

      {/* Low Stock Alert Table */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5 text-rose-700">
          <AlertTriangle className="w-4 h-4" /> Low Stock Inventory Items ({lowStockList.length})
        </h3>

        {lowStockList.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            All inventory items are currently above minimum stock levels.
          </div>
        ) : (
          <div className="space-y-2">
            {lowStockList.map(prod => (
              <div key={prod.id} className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{prod.name}</div>
                  <div className="text-[10px] text-slate-500">SKU: {prod.sku} • {prod.category}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-rose-500 text-white font-black text-xs rounded-lg">
                    {prod.currentStock} {prod.unit}
                  </span>
                  <button
                    onClick={() => addStock(prod.id, 10)}
                    className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-800 font-extrabold text-[11px] rounded-lg border border-rose-300 transition-colors"
                  >
                    + Restock 10
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
