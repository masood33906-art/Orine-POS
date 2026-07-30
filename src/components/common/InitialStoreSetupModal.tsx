import React, { useState } from 'react';
import { Store, Sparkles, CheckCircle2, Building, Phone, MapPin, Receipt, DollarSign } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

interface InitialStoreSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InitialStoreSetupModal: React.FC<InitialStoreSetupModalProps> = ({
  isOpen,
  onClose
}) => {
  const { settings, updateSettings } = usePOS();

  // Initial Store Setup Fields State
  const [storeName, setStoreName] = useState(settings.storeName || 'Raza Hardware & Tools');
  const [tagline, setTagline] = useState(settings.tagline || 'Quality Tools & Building Supplies');
  const [phone, setPhone] = useState(settings.phone || '03295626026');
  const [address, setAddress] = useState(settings.address || 'Shop #12, Commercial Hardware Market');
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol || 'Rs.');
  const [receiptFooter, setReceiptFooter] = useState(
    settings.receiptFooter || 'Thank you for shopping with us! Please come again.'
  );

  if (!isOpen) return null;

  const handleSaveStoreSetup = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      tagline,
      address,
      phone,
      currencySymbol,
      receiptFooter
    });
    localStorage.setItem('bizmate_store_setup_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-900/80 px-2 py-0.5 rounded border border-red-700/50">
                First Time Setup
              </span>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                Set Up Store Details
              </h2>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveStoreSetup} className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3 text-xs">
          <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
            Welcome to Orine POS! Please enter your store profile details. These will appear on your sales invoices, receipts, and reports.
          </p>

          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-red-600" /> Store / Business Name
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Al-Madina Hardware & Tools"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-red-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tagline / Subtitle
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Quality Tools & Paints"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-red-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03295626026"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-red-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-indigo-600" /> Currency Symbol
              </label>
              <input
                type="text"
                required
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                placeholder="Rs."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-red-500 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-600" /> Store Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Main Wholesale Market, Shop #12"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-red-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-purple-600" /> Receipt Footer Note
            </label>
            <input
              type="text"
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              placeholder="Thank you for shopping with us!"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-red-500 text-slate-900"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-extrabold rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Save & Get Started</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
