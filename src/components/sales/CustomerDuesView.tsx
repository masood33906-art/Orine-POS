import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle2, User, Phone, Receipt } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Customer } from '../../types/pos';

export const CustomerDuesView: React.FC = () => {
  const { customers, recordCustomerPayment, customerPayments, settings } = usePOS();
  const [selectedCustId, setSelectedCustId] = useState<string>('');
  const [payAmount, setPayAmount] = useState<string>('');
  const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [payNote, setPayNote] = useState('');
  const [lastPaymentReceipt, setLastPaymentReceipt] = useState<string | null>(null);

  const dueCustomers = customers.filter(c => c.totalDue > 0);
  const targetCust = customers.find(c => c.id === selectedCustId);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCust) return;
    const amountVal = parseFloat(payAmount) || 0;
    if (amountVal <= 0) return;

    recordCustomerPayment(targetCust.id, amountVal, payMethod, payNote);
    setLastPaymentReceipt(`Recorded payment of ${settings.currencySymbol} ${Math.round(amountVal)} for ${targetCust.name}. Balance updated.`);
    setPayAmount('');
    setPayNote('');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-red-900 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider">Credit Accounts</span>
          <h2 className="text-base font-extrabold mt-0.5">Customer Due Settlements</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Collect pending balances from contractors and regular clients
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-medium">Total Outstanding</div>
          <div className="text-lg font-black text-rose-400">
            {settings.currencySymbol} {Math.round(customers.reduce((sum, c) => sum + c.totalDue, 0))}
          </div>
        </div>
      </div>

      {lastPaymentReceipt && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{lastPaymentReceipt}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Form: Record Settlement */}
        <form onSubmit={handlePaymentSubmit} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Record Payment Settlement
          </h3>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Select Customer with Due</label>
            <select
              value={selectedCustId}
              onChange={(e) => {
                setSelectedCustId(e.target.value);
                const match = customers.find(c => c.id === e.target.value);
                if (match) setPayAmount(Math.round(match.totalDue).toString());
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
              required
            >
              <option value="">-- Choose Customer --</option>
              {dueCustomers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — Outstanding: {settings.currencySymbol} {Math.round(c.totalDue)}
                </option>
              ))}
            </select>
          </div>

          {targetCust && (
            <div className="bg-red-50/70 p-3 rounded-xl border border-red-200 space-y-1">
              <div className="font-bold text-red-900 flex justify-between">
                <span>{targetCust.name}</span>
                <span className="text-rose-600">Due: {settings.currencySymbol} {Math.round(targetCust.totalDue)}</span>
              </div>
              <div className="text-[10px] text-slate-600">Phone: {targetCust.phone}</div>
            </div>
          )}

          <div>
            <label className="block text-slate-600 font-bold mb-1">Amount Paid ({settings.currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(['cash', 'upi', 'card'] as const).map(m => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPayMethod(m)}
                  className={`py-2 text-center rounded-xl font-bold uppercase text-[11px] border transition-all ${
                    payMethod === m
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Note / Reference #</label>
            <input
              type="text"
              placeholder="e.g. Bank transfer ref / Cheque #"
              value={payNote}
              onChange={(e) => setPayNote(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={!targetCust || !payAmount}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            <span>Record Settlement Payment</span>
          </button>
        </form>

        {/* History of Recent Payments */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-red-600" /> Recent Settlement Receipts
          </h3>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {customerPayments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No due settlements recorded yet.
              </div>
            ) : (
              customerPayments.map(p => (
                <div key={p.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{p.customerName}</div>
                    <div className="text-[10px] text-slate-500">{p.date} • {p.paymentMethod.toUpperCase()} • Ref: {p.receiptNumber}</div>
                  </div>
                  <div className="font-extrabold text-emerald-600 text-sm">
                    +{settings.currencySymbol} {Math.round(p.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
