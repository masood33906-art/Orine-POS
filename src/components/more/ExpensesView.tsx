import React, { useState } from 'react';
import { DollarSign, Plus, Receipt, Calendar } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, settings } = usePOS();
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('Electricity & Utilities');
  const [amount, setAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'upi'>('cash');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount) || 0;
    if (!desc || val <= 0) return;

    addExpense({
      description: desc,
      category: cat,
      amount: val,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: payMethod
    });

    setDesc('');
    setAmount('');
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Add Expense Form */}
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
          <span>Record Hardware Store Expense</span>
          <span className="text-rose-600 font-extrabold text-xs">Total Spent: {settings.currencySymbol} {Math.round(totalExpense)}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-bold mb-1">Expense Description</label>
            <input
              type="text"
              placeholder="e.g. Shop Rent / Electricity / Tempo Freight"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Category</label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
            >
              <option value="Electricity & Utilities">Electricity & Utilities</option>
              <option value="Freight & Transport">Freight & Transport</option>
              <option value="Shop Rent">Shop Rent</option>
              <option value="Staff Salaries">Staff Salaries</option>
              <option value="Maintenance & Repair">Maintenance & Repair</option>
              <option value="Misc Hardware Expense">Misc Hardware Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Amount ({settings.currencySymbol})</label>
            <input
              type="number"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Paid From</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['cash', 'upi', 'card'] as const).map(m => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPayMethod(m)}
                  className={`py-2 text-center rounded-xl font-bold uppercase text-[10px] border transition-all ${
                    payMethod === m ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </form>

      {/* Expense History List */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
          Expense Log
        </h3>

        <div className="space-y-2">
          {expenses.map(e => (
            <div key={e.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{e.description}</div>
                <div className="text-[10px] text-slate-500">{e.date} • {e.category} • {e.paymentMethod.toUpperCase()}</div>
              </div>
              <div className="font-black text-rose-600 text-sm">
                -{settings.currencySymbol} {Math.round(e.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
