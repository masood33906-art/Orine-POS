import React, { useState } from 'react';
import { Store, Save, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const StoreSettingsView: React.FC = () => {
  const { settings, updateSettings, setIsStoreSetupOpen } = usePOS();
  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [taxNumber, setTaxNumber] = useState(settings.taxNumber);
  const [taxRate, setTaxRate] = useState(settings.taxRate.toString());
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      tagline,
      phone,
      address,
      taxNumber,
      taxRate: parseFloat(taxRate) || 0,
      currencySymbol
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSave} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-red-600" /> Store Profile & Tax Configuration
        </h3>

        {saved && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Store settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-bold mb-1">Hardware Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Tagline / Subtitle</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Tax ID / GSTIN / VAT</label>
            <input
              type="text"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Currency Symbol</label>
            <input
              type="text"
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
            />
          </div>

          <div className="col-span-full">
            <label className="block text-slate-600 font-bold mb-1">Store Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </form>

      {/* Quick Setup Modal Section */}
      <div className="bg-gradient-to-r from-red-50 to-indigo-50 p-4 rounded-2xl border border-red-200/80 space-y-2 text-xs">
        <h3 className="font-extrabold text-red-900 text-sm flex items-center gap-1.5">
          <Store className="w-4 h-4 text-red-600" /> Quick Store Setup Assistant
        </h3>
        <p className="text-red-800 text-[11px]">
          Re-open the initial setup popup to quick-edit your business name, phone, address, currency symbol, and receipt footer note.
        </p>
        <button
          type="button"
          onClick={() => setIsStoreSetupOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Open Quick Setup Popup</span>
        </button>
      </div>
    </div>
  );
};
