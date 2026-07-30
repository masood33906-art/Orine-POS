import React, { useState } from 'react';
import { Search, UserPlus, Phone, Mail, MapPin, AlertCircle, CreditCard, DollarSign, Download } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Customer } from '../../types/pos';
import { downloadCSV } from '../../utils/csvExport';

export const CustomersView: React.FC = () => {
  const { customers, setIsQuickCustomerModalOpen, navigateAndOpen, settings } = usePOS();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExportCustomersCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Address', 'Total Purchases', 'Total Balance Due'];
    const rows = filtered.map(c => [
      c.id, c.name, c.phone, c.email || '', c.address || '', Math.round(c.totalPurchases), Math.round(c.totalDue)
    ]);
    downloadCSV(`Customers_Directory_${new Date().toISOString().split('T')[0]}.csv`, rows, headers);
  };

  return (
    <div className="p-4 space-y-3">
      {/* Search & Add Customer Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button
          onClick={() => setIsQuickCustomerModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer min-h-[36px]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Customer List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-400 text-xs">
            No customers found.
          </div>
        ) : (
          filtered.map(cust => {
            const hasDue = cust.totalDue > 0;
            return (
              <div
                key={cust.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-red-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{cust.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-red-600" /> {cust.phone}
                      </span>
                    </div>
                    {cust.address && (
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {cust.address}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Credit Due
                    </span>
                    <span className={`text-sm font-black ${hasDue ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {settings.currencySymbol} {Math.round(cust.totalDue)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[10px] text-slate-500">
                    Limit: <span className="font-bold text-slate-700">{settings.currencySymbol} {Math.round(cust.creditLimit)}</span>
                  </div>

                  {hasDue && (
                    <button
                      onClick={() => navigateAndOpen('sales', 'dues')}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                    >
                      Settle Due
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
