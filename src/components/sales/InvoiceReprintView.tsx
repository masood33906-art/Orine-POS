import React, { useState } from 'react';
import { Search, Printer, Eye, Share2, FileText } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const InvoiceReprintView: React.FC = () => {
  const { sales, openReceiptModal, settings } = usePOS();
  const [query, setQuery] = useState('');

  const matches = sales.filter(s =>
    s.receiptNumber.toLowerCase().includes(query.toLowerCase()) ||
    (s.customerName && s.customerName.toLowerCase().includes(query.toLowerCase())) ||
    (s.customerPhone && s.customerPhone.includes(query))
  );

  return (
    <div className="p-4 space-y-3">
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Printer className="w-4 h-4 text-red-600" /> Fast Invoice Reprint & Share
        </h2>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type receipt # (e.g. INV-20260726-001) or customer phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        {matches.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No matching invoice found for "{query}".
          </div>
        ) : (
          matches.map(order => (
            <div
              key={order.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-red-300 transition-all"
            >
              <div>
                <div className="font-extrabold text-slate-900 text-xs">{order.receiptNumber}</div>
                <div className="text-[10px] text-slate-500">
                  {order.date} • {order.customerName || 'Walk-in'} • {order.items.length} items
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Total: {settings.currencySymbol} {Math.round(order.grandTotal)} ({order.paymentMethod.toUpperCase()})
                </div>
              </div>

              <button
                onClick={() => openReceiptModal(order)}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Reprint Receipt</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
