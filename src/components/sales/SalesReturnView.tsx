import React, { useState } from 'react';
import { Search, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { SaleOrder } from '../../types/pos';

export const SalesReturnView: React.FC = () => {
  const { sales, processReturn, settings } = usePOS();
  const [searchInvoice, setSearchInvoice] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SaleOrder | null>(null);
  const [returnQtys, setReturnQtys] = useState<Record<string, number>>({});
  const [returnReason, setReturnReason] = useState('Damaged or Defective Hardware');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSelectOrder = (order: SaleOrder) => {
    setSelectedOrder(order);
    const initial: Record<string, number> = {};
    order.items.forEach(item => {
      initial[item.productId] = 0;
    });
    setReturnQtys(initial);
    setSuccessMsg('');
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const itemsToReturn = Object.entries(returnQtys)
      .filter(([_, qty]) => (qty as number) > 0)
      .map(([productId, quantity]) => ({ productId, quantity: quantity as number }));

    if (itemsToReturn.length === 0) {
      alert('Please select at least 1 item quantity to return.');
      return;
    }

    processReturn(selectedOrder.id, itemsToReturn);
    setSuccessMsg(`Return processed successfully for ${selectedOrder.receiptNumber}. Inventory updated.`);
    setSelectedOrder(null);
  };

  const filteredOrders = sales.filter(s =>
    s.status !== 'refunded' &&
    (s.receiptNumber.toLowerCase().includes(searchInvoice.toLowerCase()) ||
     (s.customerName && s.customerName.toLowerCase().includes(searchInvoice.toLowerCase())))
  );

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
        <RotateCcw className="w-5 h-5 text-red-600" />
        <div>
          <h2 className="text-sm font-bold text-slate-800">Process Hardware Sales Returns</h2>
          <p className="text-[11px] text-slate-500">Return damaged/defective items and restore store inventory</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {!selectedOrder ? (
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter receipt # or customer name to process return..."
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 shadow-xs"
            />
          </div>

          <div className="space-y-2">
            {filteredOrders.slice(0, 10).map(order => (
              <div
                key={order.id}
                onClick={() => handleSelectOrder(order)}
                className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-red-400 shadow-xs cursor-pointer flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-slate-800 text-xs">{order.receiptNumber}</div>
                  <div className="text-[10px] text-slate-500">{order.date} • {order.customerName || 'Walk-in'}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-red-700 text-xs">{settings.currencySymbol} {Math.round(order.grandTotal)}</div>
                  <div className="text-[10px] text-slate-400">{order.items.length} item(s)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Return Processing Form */
        <form onSubmit={handleReturnSubmit} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-4 shadow-xs text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Processing Return for</span>
              <h3 className="text-sm font-extrabold text-slate-900">{selectedOrder.receiptNumber}</h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="text-xs text-slate-500 font-bold hover:underline"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-slate-600 font-bold">Select Return Quantities:</label>
            {selectedOrder.items.map(item => (
              <div key={item.productId} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{item.productName}</div>
                  <div className="text-[10px] text-slate-500">
                    Purchased: {item.quantity} pcs @ {settings.currencySymbol} {Math.round(item.unitPrice)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Return:</span>
                  <select
                    value={returnQtys[item.productId] || 0}
                    onChange={(e) => setReturnQtys({ ...returnQtys, [item.productId]: parseInt(e.target.value) })}
                    className="p-1 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                  >
                    {Array.from({ length: item.quantity + 1 }).map((_, i) => (
                      <option key={i} value={i}>{i} pcs</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Return Reason</label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="Damaged or Defective Hardware">Damaged or Defective Hardware</option>
              <option value="Wrong Specification / Size">Wrong Specification / Size</option>
              <option value="Customer Changed Mind">Customer Changed Mind</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Confirm Return & Restock Inventory</span>
          </button>
        </form>
      )}
    </div>
  );
};
