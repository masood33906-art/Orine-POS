import React, { useState } from 'react';
import { Truck, Plus, CheckCircle, FileText } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { PurchaseOrder } from '../../types/pos';

export const PurchasesView: React.FC = () => {
  const { suppliers, products, addStock, settings } = usePOS();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'po-101',
      purchaseNumber: 'PO-2026-001',
      supplierId: 'sup-1',
      supplierName: 'BuildTech Tools & Fasteners Ltd',
      date: '2026-07-24',
      items: [
        { productId: 'prod-103', productName: 'Stainless Steel Wood Screws (100pk)', quantity: 20, unitCost: 4.10, totalCost: 82.00 }
      ],
      totalAmount: 82.00,
      paymentStatus: 'paid'
    }
  ]);

  const [selectedSupId, setSelectedSupId] = useState('');
  const [selectedProdId, setSelectedProdId] = useState('');
  const [purchaseQty, setPurchaseQty] = useState('10');
  const [unitCostInput, setUnitCostInput] = useState('');

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === selectedSupId);
    const prod = products.find(p => p.id === selectedProdId);
    if (!sup || !prod) return;

    const qty = parseInt(purchaseQty) || 10;
    const cost = parseFloat(unitCostInput) || prod.costPrice;
    const totalCost = qty * cost;

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      purchaseNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: sup.id,
      supplierName: sup.name,
      date: new Date().toISOString().split('T')[0],
      items: [
        { productId: prod.id, productName: prod.name, quantity: qty, unitCost: cost, totalCost }
      ],
      totalAmount: totalCost,
      paymentStatus: 'paid'
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    // Instantly add stock to inventory
    addStock(prod.id, qty);
    setPurchaseQty('10');
    setUnitCostInput('');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Create Purchase Order Form */}
      <form onSubmit={handleCreatePO} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-red-600" /> Create Hardware Purchase Order (Restock)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div>
            <label className="block text-slate-600 font-bold mb-1">Wholesale Supplier</label>
            <select
              value={selectedSupId}
              onChange={(e) => setSelectedSupId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
              required
            >
              <option value="">-- Choose Supplier --</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Product to Order</label>
            <select
              value={selectedProdId}
              onChange={(e) => {
                setSelectedProdId(e.target.value);
                const p = products.find(x => x.id === e.target.value);
                if (p) setUnitCostInput(Math.round(p.costPrice).toString());
              }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Qty (Pieces)</label>
            <input
              type="number"
              min="1"
              value={purchaseQty}
              onChange={(e) => setPurchaseQty(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Unit Cost ({settings.currencySymbol})</label>
            <input
              type="number"
              step="1"
              value={unitCostInput}
              onChange={(e) => setUnitCostInput(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedSupId || !selectedProdId}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Place Purchase Order & Receive Stock</span>
        </button>
      </form>

      {/* PO History */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
          Purchase Orders History
        </h3>

        <div className="space-y-2">
          {purchaseOrders.map(po => (
            <div key={po.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{po.purchaseNumber} — {po.supplierName}</div>
                <div className="text-[10px] text-slate-500">{po.date} • {po.items.map(i => `${i.productName} (${i.quantity} pcs)`).join(', ')}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-900">{settings.currencySymbol} {Math.round(po.totalAmount)}</div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase rounded-md">
                  Received & Stocked
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
