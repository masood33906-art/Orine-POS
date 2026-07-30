import React, { useState } from 'react';
import { Search, Calendar, Eye, RefreshCw, Printer, FileText, Download } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { SaleOrder } from '../../types/pos';
import { downloadCSV } from '../../utils/csvExport';

export const SalesHistoryView: React.FC = () => {
  const { sales, openReceiptModal, settings } = usePOS();
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredSales = sales.filter(s => {
    const matchesSearch =
      s.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      (s.customerName && s.customerName.toLowerCase().includes(search.toLowerCase())) ||
      s.paymentMethod.toLowerCase().includes(search.toLowerCase());
    const matchesPayment = paymentFilter === 'all' || s.paymentMethod === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const handleExportSalesCSV = () => {
    const headers = ['Receipt #', 'Invoice #', 'Date & Time', 'Customer', 'Items Count', 'Payment Method', 'Payment Status', 'Grand Total'];
    const rows = filteredSales.map(s => [
      s.receiptNumber,
      s.invoiceNumber,
      s.timestamp,
      s.customerName || 'Walk-in Customer',
      s.items.reduce((sum, item) => sum + item.quantity, 0),
      s.paymentMethod.toUpperCase(),
      s.paymentStatus.toUpperCase(),
      Math.round(s.grandTotal)
    ]);
    downloadCSV(`Sales_History_${new Date().toISOString().split('T')[0]}.csv`, rows, headers);
  };

  return (
    <div className="p-4 space-y-3">
      {/* Search & Filter Header */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice # or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'cash', 'upi', 'card', 'due'].map(method => (
            <button
              key={method}
              onClick={() => setPaymentFilter(method)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer ${
                paymentFilter === method
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-2.5">
        {filteredSales.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No sales records found.
          </div>
        ) : (
          filteredSales.map(order => (
            <div
              key={order.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-red-300 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">{order.receiptNumber}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                    order.paymentMethod === 'due'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {order.paymentMethod}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                    {order.date}
                  </span>
                </div>

                <div className="text-xs text-slate-600 mt-1">
                  Customer: <span className="font-bold text-slate-800">{order.customerName || 'Walk-in'}</span> • {order.items.length} items
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Cashier: {order.cashierName}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <div className="font-black text-slate-900 text-base">
                    {settings.currencySymbol} {Math.round(order.grandTotal)}
                  </div>
                  {order.dueAmount > 0 && (
                    <div className="text-[10px] font-bold text-rose-600">
                      Due: {settings.currencySymbol} {Math.round(order.dueAmount)}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => openReceiptModal(order)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
