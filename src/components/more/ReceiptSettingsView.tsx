import React, { useState } from 'react';
import { Receipt, Save, CheckCircle } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const ReceiptSettingsView: React.FC = () => {
  const { settings, updateSettings } = usePOS();
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);
  const [showLogo, setShowLogo] = useState(settings.showLogoOnReceipt);
  const [showTax, setShowTax] = useState(settings.showTaxOnReceipt);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      receiptFooter,
      showLogoOnReceipt: showLogo,
      showTaxOnReceipt: showTax
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSave} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Receipt className="w-4 h-4 text-red-600" /> Thermal Receipt & Invoice Layout
        </h3>

        {saved && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Receipt layout updated!</span>
          </div>
        )}

        <div>
          <label className="block text-slate-600 font-bold mb-1">Receipt Footer Return Policy / Message</label>
          <textarea
            value={receiptFooter}
            onChange={(e) => setReceiptFooter(e.target.value)}
            rows={3}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs"
          />
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLogo}
              onChange={(e) => setShowLogo(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded-md border-slate-300"
            />
            <span className="font-bold text-slate-800">Show Orine Store Header Logo</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showTax}
              onChange={(e) => setShowTax(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded-md border-slate-300"
            />
            <span className="font-bold text-slate-800">Include Tax & Tax ID Breakdown</span>
          </label>
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Receipt Layout</span>
        </button>
      </form>
    </div>
  );
};
