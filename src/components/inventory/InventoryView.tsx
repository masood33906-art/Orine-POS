import React from 'react';
import { usePOS } from '../../context/POSContext';
import { InventorySubTab } from '../../types/pos';
import { ProductsList } from './ProductsList';
import { CategoriesManager } from './CategoriesManager';
import { StockManagement } from './StockManagement';
import { PurchasesView } from './PurchasesView';
import { SuppliersView } from './SuppliersView';

export const InventoryView: React.FC = () => {
  const { activeInventorySubTab, setActiveInventorySubTab } = usePOS();

  const subTabs: { id: InventorySubTab; label: string }[] = [
    { id: 'products', label: 'Products' },
    { id: 'categories', label: 'Categories' },
    { id: 'stock', label: 'Stock Management' },
    { id: 'purchases', label: 'Purchases' },
    { id: 'suppliers', label: 'Suppliers' }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-navigation bar */}
      <div className="bg-white border-b border-slate-200 px-2.5 sm:px-3 py-2 flex gap-1.5 overflow-x-auto shrink-0 no-scrollbar shadow-2xs">
        {subTabs.map(tab => {
          const isActive = activeInventorySubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveInventorySubTab(tab.id)}
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
        {activeInventorySubTab === 'products' && <ProductsList />}
        {activeInventorySubTab === 'categories' && <CategoriesManager />}
        {activeInventorySubTab === 'stock' && <StockManagement />}
        {activeInventorySubTab === 'purchases' && <PurchasesView />}
        {activeInventorySubTab === 'suppliers' && <SuppliersView />}
      </div>
    </div>
  );
};
