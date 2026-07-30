import React from 'react';
import { usePOS } from '../../context/POSContext';
import { MoreSubTab } from '../../types/pos';
import { ReportsView } from './ReportsView';
import { ExpensesView } from './ExpensesView';
import { StoreSettingsView } from './StoreSettingsView';
import { ReceiptSettingsView } from './ReceiptSettingsView';
import { BackupRestoreView } from './BackupRestoreView';
import { NotificationsView } from './NotificationsView';

export const MoreView: React.FC = () => {
  const { activeMoreSubTab, setActiveMoreSubTab } = usePOS();

  const subTabs: { id: MoreSubTab; label: string }[] = [
    { id: 'reports', label: 'Reports' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'store_settings', label: 'Store Settings' },
    { id: 'receipt_settings', label: 'Receipt Settings' },
    { id: 'backup', label: 'Backup & Restore' },
    { id: 'notifications', label: 'Notifications' }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-navigation bar */}
      <div className="bg-white border-b border-slate-200 px-2.5 sm:px-3 py-2 flex gap-1.5 overflow-x-auto shrink-0 no-scrollbar shadow-2xs">
        {subTabs.map(tab => {
          const isActive = activeMoreSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMoreSubTab(tab.id)}
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
        {activeMoreSubTab === 'reports' && <ReportsView />}
        {activeMoreSubTab === 'expenses' && <ExpensesView />}
        {activeMoreSubTab === 'store_settings' && <StoreSettingsView />}
        {activeMoreSubTab === 'receipt_settings' && <ReceiptSettingsView />}
        {activeMoreSubTab === 'backup' && <BackupRestoreView />}
        {activeMoreSubTab === 'notifications' && <NotificationsView />}
      </div>
    </div>
  );
};
