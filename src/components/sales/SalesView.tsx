import React from 'react';
import { usePOS } from '../../context/POSContext';
import { SalesSubTab } from '../../types/pos';
import { POSBilling } from './POSBilling';
import { SalesHistoryView } from './SalesHistoryView';
import { SalesReturnView } from './SalesReturnView';
import { CustomersView } from './CustomersView';
import { CustomerDuesView } from './CustomerDuesView';
import { InvoiceReprintView } from './InvoiceReprintView';

export const SalesView: React.FC = () => {
  const { activeSalesSubTab, setActiveSalesSubTab } = usePOS();

  const subTabs: { id: SalesSubTab; label: string }[] = [
    { id: 'billing', label: 'POS Billing' },
    { id: 'history', label: 'Sales History' },
    { id: 'returns', label: 'Returns' },
    { id: 'customers', label: 'Customers' },
    { id: 'dues', label: 'Customer Dues' },
    { id: 'reprint', label: 'Reprint Invoice' }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-navigation bar */}
      <div className="bg-white border-b border-slate-200 px-2.5 sm:px-3 py-2 flex gap-1.5 overflow-x-auto shrink-0 no-scrollbar shadow-2xs">
        {subTabs.map(tab => {
          const isActive = activeSalesSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSalesSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer min-h-[38px] flex items-center shrink-0 ${
                isActive
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub-tab view body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeSalesSubTab === 'billing' && <POSBilling />}
        {activeSalesSubTab === 'history' && <SalesHistoryView />}
        {activeSalesSubTab === 'returns' && <SalesReturnView />}
        {activeSalesSubTab === 'customers' && <CustomersView />}
        {activeSalesSubTab === 'dues' && <CustomerDuesView />}
        {activeSalesSubTab === 'reprint' && <InvoiceReprintView />}
      </div>
    </div>
  );
};
