import React, { useState } from 'react';
import { Download, Upload, RefreshCw, CheckCircle, AlertTriangle, FileSpreadsheet, HardDrive, Database, Trash2 } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { downloadCSV } from '../../utils/csvExport';

export const BackupRestoreView: React.FC = () => {
  const { products, sales, customers, expenses, suppliers, exportData, importData, resetToSampleData, clearAllData } = usePOS();
  const [importJson, setImportJson] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExportJSON = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Orine_POS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ text: 'Full JSON Backup downloaded successfully!', type: 'success' });
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;
    const ok = importData(importJson);
    if (ok) {
      setMsg({ text: 'POS Database restored successfully!', type: 'success' });
      setImportJson('');
    } else {
      setMsg({ text: 'Invalid JSON backup format.', type: 'error' });
    }
  };

  // CSV Export Handlers
  const exportProductsCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Current Stock', 'Min Stock Level', 'Unit', 'Cost Price', 'Selling Price', 'Total Valuation'];
    const rows = products.map(p => [
      p.sku, p.name, p.category, p.currentStock, p.minStockLevel, p.unit, p.costPrice, p.sellingPrice, Math.round(p.currentStock * p.sellingPrice)
    ]);
    downloadCSV(`Inventory_Products_${new Date().toISOString().split('T')[0]}.csv`, rows, headers);
    setMsg({ text: 'Products CSV downloaded successfully!', type: 'success' });
  };

  const exportSalesCSV = () => {
    const headers = ['Order ID', 'Invoice Number', 'Timestamp', 'Customer Name', 'Items Count', 'Payment Method', 'Payment Status', 'Subtotal', 'Discount', 'Tax', 'Grand Total'];
    const rows = sales.map(s => [
      s.id,
      s.invoiceNumber,
      s.timestamp,
      s.customerName || 'Walk-in Customer',
      s.items.reduce((sum, item) => sum + item.quantity, 0),
      s.paymentMethod.toUpperCase(),
      s.paymentStatus.toUpperCase(),
      Math.round(s.subtotal),
      Math.round(s.discount),
      Math.round(s.tax),
      Math.round(s.grandTotal)
    ]);
    downloadCSV(`Sales_Orders_${new Date().toISOString().split('T')[0]}.csv`, rows, headers);
    setMsg({ text: 'Sales Orders CSV downloaded successfully!', type: 'success' });
  };

  const exportCustomersCSV = () => {
    const headers = ['Customer ID', 'Name', 'Phone', 'Address', 'Total Purchases', 'Outstanding Balance Due'];
    const rows = customers.map(c => [
      c.id, c.name, c.phone, c.address || 'N/A', Math.round(c.totalPurchases), Math.round(c.totalDue)
    ]);
    downloadCSV(`Customers_Dues_${new Date().toISOString().split('T')[0]}.csv`, rows, headers);
    setMsg({ text: 'Customers & Dues CSV downloaded successfully!', type: 'success' });
  };

  const exportExpensesCSV = () => {
    const headers = ['Expense ID', 'Title', 'Category', 'Amount', 'Date', 'Notes'];
    const rows = expenses.map(e => [
      e.id, e.title, e.category, Math.round(e.amount), e.date, e.notes || ''
    ]);
    downloadCSV(`Expenses_${new Date().toISOString().split('T')[0]}.csv`, rows, headers);
    setMsg({ text: 'Expenses CSV downloaded successfully!', type: 'success' });
  };

  const exportSuppliersCSV = () => {
    const headers = ['Supplier ID', 'Name', 'Contact Person', 'Phone', 'Email', 'Address'];
    const rows = suppliers.map(s => [
      s.id, s.name, s.contactPerson || '', s.phone, s.email || '', s.address || ''
    ]);
    downloadCSV(`Suppliers_${new Date().toISOString().split('T')[0]}.csv`, rows, headers);
    setMsg({ text: 'Suppliers CSV downloaded successfully!', type: 'success' });
  };

  return (
    <div className="p-4 space-y-4">
      {msg && (
        <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
          msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Local Storage Phone Storage Card */}
      <div className="bg-gradient-to-r from-red-900 to-indigo-900 text-white p-4.5 rounded-3xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-red-300">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Device Local Storage Enabled</h3>
              <p className="text-[11px] text-red-200">
                All data is saved locally on your phone / browser storage
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black rounded-full border border-emerald-400/30">
            Active Sync
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-2 rounded-xl">
            <span className="text-[10px] text-red-300 block font-medium">Products Stored</span>
            <span className="font-black text-sm">{products.length} items</span>
          </div>
          <div className="bg-white/5 p-2 rounded-xl">
            <span className="text-[10px] text-red-300 block font-medium">Sales Records</span>
            <span className="font-black text-sm">{sales.length} orders</span>
          </div>
          <div className="bg-white/5 p-2 rounded-xl">
            <span className="text-[10px] text-red-300 block font-medium">Customers</span>
            <span className="font-black text-sm">{customers.length} records</span>
          </div>
          <div className="bg-white/5 p-2 rounded-xl">
            <span className="text-[10px] text-red-300 block font-medium">Expenses</span>
            <span className="font-black text-sm">{expenses.length} entries</span>
          </div>
        </div>
      </div>

      {/* CSV Export Center */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Export Data to CSV Files</h3>
            <p className="text-[11px] text-slate-500">Download formatted CSV spreadsheets for Excel or Google Sheets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={exportProductsCSV}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 text-xs flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Products & Inventory CSV</span>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </button>

          <button
            onClick={exportSalesCSV}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 text-xs flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-red-600" />
              <span>Sales Orders & Invoices CSV</span>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
          </button>

          <button
            onClick={exportCustomersCSV}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 text-xs flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-purple-600" />
              <span>Customers & Dues CSV</span>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </button>

          <button
            onClick={exportExpensesCSV}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 text-xs flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-rose-600" />
              <span>Store Expenses CSV</span>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
          </button>

          <button
            onClick={exportSuppliersCSV}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 text-xs flex items-center justify-between group transition-colors cursor-pointer sm:col-span-2"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              <span>Suppliers Contact Directory CSV</span>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* JSON Full System Export Section */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
          <Database className="w-4 h-4 text-red-600" /> Full System Backup (JSON)
        </h3>
        <p className="text-slate-500 text-[11px]">
          Download a complete raw JSON file containing all database collections and configuration settings for device migration.
        </p>
        <button
          onClick={handleExportJSON}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Full JSON Backup</span>
        </button>
      </div>

      {/* Import Section */}
      <form onSubmit={handleImport} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
          <Upload className="w-4 h-4 text-red-600" /> Restore POS Data from JSON
        </h3>
        <p className="text-slate-500 text-[11px]">
          Paste previously exported JSON backup code below to restore database state.
        </p>
        <textarea
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          placeholder="Paste JSON content here..."
          rows={4}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px]"
        />
        <button
          type="submit"
          disabled={!importJson.trim()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Restore Backup</span>
        </button>
      </form>

      {/* Reset Sample Data */}
      <div className="bg-amber-50/80 p-4 rounded-3xl border border-amber-200 space-y-2 text-xs">
        <h3 className="font-extrabold text-amber-900 text-sm flex items-center gap-1.5">
          <RefreshCw className="w-4 h-4 text-amber-700" /> Reset to Sample Hardware Store Data
        </h3>
        <p className="text-amber-800 text-[11px]">
          Resets all inventory, sales, and customer dues back to pre-populated hardware store demo records.
        </p>

        {!showSampleConfirm ? (
          <button
            type="button"
            onClick={() => setShowSampleConfirm(true)}
            className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-xl border border-amber-300 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Sample Data</span>
          </button>
        ) : (
          <div className="p-3 bg-amber-100/90 rounded-2xl border border-amber-300 space-y-2 animate-in fade-in duration-200">
            <p className="font-bold text-amber-950 text-xs">
              ⚠️ Restore demo products, sales, and customer records?
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetToSampleData();
                  setShowSampleConfirm(false);
                  setMsg({ text: 'Reset to sample hardware store data successfully!', type: 'success' });
                }}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-xs transition-all"
              >
                Yes, Reset Sample Data
              </button>
              <button
                type="button"
                onClick={() => setShowSampleConfirm(false)}
                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 font-bold rounded-xl text-xs cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Initial Reset - Clear Sample Data */}
      <div className="bg-rose-50/80 p-4 rounded-3xl border border-rose-200 space-y-2 text-xs">
        <h3 className="font-extrabold text-rose-900 text-sm flex items-center gap-1.5">
          <Trash2 className="w-4 h-4 text-rose-700" /> Initial Reset (Clear All Sample Data)
        </h3>
        <p className="text-rose-800 text-[11px]">
          Completely clears out all pre-populated sample products, sales records, customers, and expenses to start completely fresh with an empty store.
        </p>

        {!showClearConfirm ? (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Sample Data & Start Fresh</span>
          </button>
        ) : (
          <div className="p-3 bg-rose-100 rounded-2xl border border-rose-300 space-y-2 animate-in fade-in duration-200">
            <p className="font-bold text-rose-950 text-xs">
              ⚠️ Are you sure? This will delete all demo items, sales, and customers completely.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAllData();
                  setShowClearConfirm(false);
                  setMsg({ text: 'All sample data cleared successfully! Your store is now empty and ready.', type: 'success' });
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-xs transition-all"
              >
                Yes, Delete & Clear All Data
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 font-bold rounded-xl text-xs cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
