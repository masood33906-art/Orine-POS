import React from 'react';
import { X, Printer, Download, Share2, CheckCircle2, Store } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, setIsReceiptModalOpen, currentReceiptOrder, settings } = usePOS();

  if (!isReceiptModalOpen || !currentReceiptOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-3.5 bg-red-600 text-white flex items-center justify-between font-bold text-xs shrink-0">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Sale Receipt
          </span>
          <button onClick={() => setIsReceiptModalOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Thermal Paper Receipt Body */}
        <div className="p-4 overflow-y-auto font-mono text-[11px] text-slate-800 space-y-3 bg-slate-50 border-b border-slate-200">
          <div className="text-center space-y-0.5">
            <div className="font-extrabold text-sm uppercase tracking-wide text-slate-900">
              {settings.storeName}
            </div>
            <p className="text-[10px] text-slate-500">{settings.tagline}</p>
            <p className="text-[10px] text-slate-500">{settings.address}</p>
            <p className="text-[10px] text-slate-500">Ph: {settings.phone}</p>
            {settings.taxNumber && (
              <p className="text-[10px] font-bold text-slate-700">{settings.taxNumber}</p>
            )}
          </div>

          <div className="border-t border-b border-dashed border-slate-300 py-1.5 space-y-0.5 text-[10px]">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span className="font-bold">{currentReceiptOrder.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date/Time:</span>
              <span>{currentReceiptOrder.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold">{currentReceiptOrder.customerName || 'Walk-in'}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold border-b border-slate-300 pb-1 text-[10px]">
              <span>ITEM</span>
              <span>QTY x PRICE</span>
              <span>TOTAL</span>
            </div>

            {currentReceiptOrder.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="font-bold text-slate-900 text-[11px]">{item.productName}</div>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>{item.quantity} pcs @ {settings.currencySymbol} {Math.round(item.unitPrice)}</span>
                  <span className="font-bold text-slate-900">{settings.currencySymbol} {Math.round(item.total)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-right text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{settings.currencySymbol} {Math.round(currentReceiptOrder.subtotal)}</span>
            </div>
            {currentReceiptOrder.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount:</span>
                <span>-{settings.currencySymbol} {Math.round(currentReceiptOrder.discountTotal)}</span>
              </div>
            )}
            {currentReceiptOrder.taxTotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Tax:</span>
                <span>+{settings.currencySymbol} {Math.round(currentReceiptOrder.taxTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-300">
              <span>GRAND TOTAL:</span>
              <span>{settings.currencySymbol} {Math.round(currentReceiptOrder.grandTotal)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 pt-1">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase">{currentReceiptOrder.paymentMethod}</span>
            </div>
            {currentReceiptOrder.amountPaid > 0 && (
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>Amount Paid:</span>
                <span>{settings.currencySymbol} {Math.round(currentReceiptOrder.amountPaid)}</span>
              </div>
            )}
            {currentReceiptOrder.dueAmount > 0 && (
              <div className="flex justify-between text-[10px] text-rose-600 font-extrabold">
                <span>Due Balance:</span>
                <span>{settings.currencySymbol} {Math.round(currentReceiptOrder.dueAmount)}</span>
              </div>
            )}
          </div>

          {/* Receipt Footer Message */}
          <div className="text-center pt-2 border-t border-slate-300 text-[9px] text-slate-500">
            <p>{settings.receiptFooter}</p>
            <p className="font-bold mt-1">*** Thank You! ***</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 bg-white flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={() => setIsReceiptModalOpen(false)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
