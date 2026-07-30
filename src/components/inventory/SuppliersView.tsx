import React, { useState } from 'react';
import { Truck, Phone, Mail, MapPin, Plus, Trash2, Search, X, UserPlus, Save } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { sounds } from '../../utils/sound';

export const SuppliersView: React.FC = () => {
  const { suppliers, addSupplier, deleteSupplier, settings } = usePOS();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Supplier Form State
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addSupplier({
      name: name.trim(),
      contactPerson: contactPerson.trim() || 'Manager',
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      balanceDue: parseFloat(initialBalance) || 0
    });

    sounds.playSuccess();
    // Reset form
    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setAddress('');
    setInitialBalance('');
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, supplierName: string) => {
    deleteSupplier(id);
    sounds.playAlert();
  };

  return (
    <div className="p-4 space-y-3">
      {/* Search & Add Supplier Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search supplier name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer min-h-[36px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-10 text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No suppliers found. Click "Add Supplier" to register a distributor.
          </div>
        ) : (
          filtered.map(s => (
            <div key={s.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative group">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{s.name}</h4>
                  <div className="text-[11px] text-slate-500 font-medium">Contact: {s.contactPerson}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Balance Payable</span>
                    <span className="font-black text-slate-900 text-xs">
                      {settings.currencySymbol} {Math.round(s.balanceDue)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id, s.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Supplier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-red-600" /> {s.phone}
                </div>
                {s.email && (
                  <div className="flex items-center gap-1 text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {s.email}
                  </div>
                )}
                {s.address && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {s.address}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-3.5 bg-red-600 text-white flex items-center justify-between font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Add New Hardware Supplier
              </span>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Company / Supplier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Pipe Traders"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Asif Manager"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0321-7654321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. info@masterpipes.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Initial Balance Payable ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white text-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Address / Warehouse Location</label>
                <input
                  type="text"
                  placeholder="e.g. Brandreth Road Market, Lahore"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Supplier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
