import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const NotificationsView: React.FC = () => {
  const { notifications, navigateAndOpen } = usePOS();

  return (
    <div className="p-4 space-y-3">
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-red-600" /> Notifications & Alerts ({notifications.length})
        </h3>
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No active notifications.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border shadow-xs flex items-start justify-between gap-3 ${
                n.type === 'warning' ? 'bg-amber-50/80 border-amber-200' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  n.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  {n.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">{n.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                </div>
              </div>

              {n.linkTab && (
                <button
                  onClick={() => navigateAndOpen(n.linkTab!)}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-[11px] rounded-lg border border-slate-200 shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
