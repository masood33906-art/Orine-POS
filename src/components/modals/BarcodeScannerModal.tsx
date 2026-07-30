import React, { useState } from 'react';
import { ScanBarcode, X, Check, AlertCircle, Plus, Sparkles, PackagePlus } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { BarcodeCameraScanner } from '../common/BarcodeCameraScanner';
import { sounds } from '../../utils/sound';

export const BarcodeScannerModal: React.FC = () => {
  const {
    isBarcodeModalOpen, setIsBarcodeModalOpen, products, addToCart,
    setIsQuickStockModalOpen, setSelectedStockProductId,
    setIsQuickProductModalOpen, setEditingProduct
  } = usePOS();

  const [manualInput, setManualInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    type: 'success' | 'out_of_stock' | 'not_found';
    message: string;
    productName?: string;
    code?: string;
  } | null>(null);

  if (!isBarcodeModalOpen) return null;

  const handleProcessBarcode = (codeToScan: string) => {
    const trimmed = codeToScan.trim();
    if (!trimmed) return;

    // Search product by barcode/SKU or ID
    const matched = products.find(
      p => p.sku.toLowerCase() === trimmed.toLowerCase() || p.id === trimmed
    );

    if (matched) {
      if (matched.currentStock <= 0) {
        sounds.playAlert();
        setScanResult({
          type: 'out_of_stock',
          message: `"${matched.name}" is out of stock (0 pcs).`,
          productName: matched.name,
          code: matched.sku
        });
      } else {
        addToCart(matched, 1);
        sounds.playBeep();
        setScanResult({
          type: 'success',
          message: `Added to cart: ${matched.name}`,
          productName: matched.name,
          code: matched.sku
        });
        setManualInput('');
        setTimeout(() => {
          setScanResult(prev => (prev?.type === 'success' ? null : prev));
        }, 3000);
      }
    } else {
      sounds.playAlert();
      setScanResult({
        type: 'not_found',
        message: `No product found matching barcode: "${trimmed}"`,
        code: trimmed
      });
    }
  };

  const handleCreateProductWithBarcode = (code: string) => {
    setIsBarcodeModalOpen(false);
    setEditingProduct(null);
    setIsQuickProductModalOpen(true);
    // Timeout allows QuickActionModals to open before setting state if needed
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 bg-red-600 text-white flex items-center justify-between font-bold text-xs shrink-0">
          <span className="flex items-center gap-1.5">
            <ScanBarcode className="w-4 h-4" /> POS Barcode Scanner
          </span>
          <button
            onClick={() => setIsBarcodeModalOpen(false)}
            className="p-1 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs overflow-y-auto">
          {/* Live Camera Barcode Scanner View */}
          <div className="relative">
            <BarcodeCameraScanner
              active={isBarcodeModalOpen}
              continuous={true}
              onScan={(code) => handleProcessBarcode(code)}
              className="h-52 shadow-inner"
            />

            {/* Floating Scan Result Notification Banner */}
            {scanResult && (
              <div className="mt-2">
                {scanResult.type === 'success' && (
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl font-extrabold text-[11px] flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
                    <span className="flex items-center gap-1.5 truncate">
                      <Check className="w-4 h-4 text-emerald-200 shrink-0" />
                      <span className="truncate">{scanResult.message}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded font-mono shrink-0 ml-1">
                      {scanResult.code}
                    </span>
                  </div>
                )}

                {scanResult.type === 'out_of_stock' && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl font-bold text-[11px] space-y-1.5 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-rose-700 font-extrabold">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{scanResult.message}</span>
                    </div>
                    {scanResult.code && (
                      <button
                        type="button"
                        onClick={() => {
                          const p = products.find(prod => prod.sku.toLowerCase() === scanResult.code?.toLowerCase());
                          if (p) {
                            setIsBarcodeModalOpen(false);
                            setSelectedStockProductId(p.id);
                            setIsQuickStockModalOpen(true);
                          }
                        }}
                        className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <PackagePlus className="w-3.5 h-3.5" />
                        <span>Quick Add Stock for this Item</span>
                      </button>
                    )}
                  </div>
                )}

                {scanResult.type === 'not_found' && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-bold text-[11px] space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{scanResult.message}</span>
                    </div>
                    {scanResult.code && (
                      <button
                        type="button"
                        onClick={() => handleCreateProductWithBarcode(scanResult.code!)}
                        className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10.5px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Register Product with Barcode: {scanResult.code}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Manual Barcode Text Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessBarcode(manualInput);
            }}
            className="space-y-1.5 pt-1"
          >
            <label className="block text-slate-600 font-bold text-[11px]">
              Or Enter / Scan Barcode Number Manually:
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Type barcode or USB scanner input..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Scan & Add
              </button>
            </div>
          </form>

          {/* Sample Hardware Product Barcodes list */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <span className="block text-[10px] text-slate-400 font-extrabold uppercase">
              Quick Barcode Test Buttons:
            </span>
            <div className="flex flex-wrap gap-1">
              {products.slice(0, 5).map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProcessBarcode(p.sku)}
                  className="px-2 py-1 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-900 rounded-lg text-[10px] font-mono font-bold border border-slate-200 transition-colors cursor-pointer"
                >
                  {p.sku}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
