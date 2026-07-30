import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, PackagePlus, UserPlus, Save, Image as ImageIcon, Upload, Edit2, Camera, ScanBarcode, Sparkles, RefreshCw } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { CameraCaptureModal } from '../common/CameraCaptureModal';
import { BarcodeCameraScanner } from '../common/BarcodeCameraScanner';

export const QuickActionModals: React.FC = () => {
  const {
    isQuickProductModalOpen, setIsQuickProductModalOpen,
    editingProduct, setEditingProduct, updateProduct,
    isQuickStockModalOpen, setIsQuickStockModalOpen,
    selectedStockProductId, setSelectedStockProductId,
    isQuickCustomerModalOpen, setIsQuickCustomerModalOpen,
    categories, addProduct, products, addStock, addCustomer, settings
  } = usePOS();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Quick Product Form State
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodCat, setProdCat] = useState('Power Tools');
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [currentStock, setCurrentStock] = useState('10');
  const [minStock, setMinStock] = useState('5');
  const [location, setLocation] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Camera & Barcode Modal States
  const [isCameraCaptureOpen, setIsCameraCaptureOpen] = useState(false);
  const [isSkuScanOpen, setIsSkuScanOpen] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !prodCat) {
      setProdCat(categories[0].name);
    }
  }, [categories, prodCat]);

  useEffect(() => {
    if (isQuickProductModalOpen) {
      if (editingProduct) {
        setProdName(editingProduct.name);
        setProdSku(editingProduct.sku);
        setProdCat(editingProduct.category);
        setSellingPrice(Math.round(editingProduct.sellingPrice).toString());
        setCostPrice(Math.round(editingProduct.costPrice).toString());
        setCurrentStock(editingProduct.currentStock.toString());
        setMinStock(editingProduct.minStockLevel.toString());
        setLocation(editingProduct.location || '');
        setProdImage(editingProduct.image || '');
      } else {
        setProdName('');
        setProdSku('');
        setSellingPrice('');
        setCostPrice('');
        setCurrentStock('10');
        setMinStock('5');
        setLocation('');
        setProdImage('');
      }
    }
  }, [isQuickProductModalOpen, editingProduct]);

  // Quick Stock Form State
  const [selectedProdId, setSelectedProdId] = useState('');
  const [stockAddQty, setStockAddQty] = useState('10');

  useEffect(() => {
    if (isQuickStockModalOpen && selectedStockProductId) {
      setSelectedProdId(selectedStockProductId);
    }
  }, [isQuickStockModalOpen, selectedStockProductId]);

  // Quick Customer Form State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custLimit, setCustLimit] = useState('500');
  const [custAddress, setCustAddress] = useState('');

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProdImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBarcode = () => {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
    const generated = `890${randomDigits}`;
    setProdSku(generated);
  };

  const handleCloseProductModal = () => {
    setIsQuickProductModalOpen(false);
    setEditingProduct(null);
  };

  // Handlers
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !sellingPrice) return;

    const sku = prodSku.trim() || `SKU-${Date.now().toString().slice(-6)}`;
    
    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: prodName.trim(),
        sku,
        category: prodCat,
        sellingPrice: parseFloat(sellingPrice) || 0,
        costPrice: parseFloat(costPrice) || (parseFloat(sellingPrice) * 0.65),
        currentStock: parseInt(currentStock) || 0,
        minStockLevel: parseInt(minStock) || 0,
        unit: 'pcs',
        location: location.trim(),
        image: prodImage.trim() || undefined
      });
    } else {
      addProduct({
        name: prodName.trim(),
        sku,
        category: prodCat,
        sellingPrice: parseFloat(sellingPrice) || 0,
        costPrice: parseFloat(costPrice) || (parseFloat(sellingPrice) * 0.65),
        currentStock: parseInt(currentStock) || 10,
        minStockLevel: parseInt(minStock) || 5,
        unit: 'pcs',
        location: location.trim() || 'Aisle 1',
        image: prodImage.trim() || undefined
      });
    }

    handleCloseProductModal();
  };

  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProdId) return;
    const qty = parseInt(stockAddQty) || 10;
    addStock(selectedProdId, qty);
    setIsQuickStockModalOpen(false);
    setSelectedProdId('');
    setSelectedStockProductId('');
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    addCustomer({
      name: custName.trim(),
      phone: custPhone.trim(),
      creditLimit: parseFloat(custLimit) || 500,
      address: custAddress.trim()
    });

    setIsQuickCustomerModalOpen(false);
    setCustName('');
    setCustPhone('');
    setCustAddress('');
  };

  return (
    <>
      {/* Quick Add / Edit Product Modal */}
      {isQuickProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-3.5 bg-red-600 text-white flex items-center justify-between font-bold text-xs">
              <span className="flex items-center gap-1.5">
                {editingProduct ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{editingProduct ? 'Edit Hardware Product' : 'Add New Hardware Product'}</span>
              </span>
              <button onClick={handleCloseProductModal} className="p-1 hover:bg-red-700 rounded-lg transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-4 space-y-3 text-xs max-h-[85vh] overflow-y-auto">
              {/* Product Picture Field */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-slate-700 font-extrabold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                    Product Picture
                  </span>
                  {prodImage && (
                    <button
                      type="button"
                      onClick={() => setProdImage('')}
                      className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                </label>

                <div className="flex items-center gap-3">
                  {/* Image Preview Box */}
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0 relative group shadow-xs">
                    {prodImage ? (
                      <img src={prodImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  {/* Picture Inputs */}
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={cameraInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                    />

                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Take Photo via Camera Modal */}
                      <button
                        type="button"
                        onClick={() => setIsCameraCaptureOpen(true)}
                        className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-[10.5px] flex items-center gap-1 transition-colors cursor-pointer justify-center shadow-xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Take Camera Photo</span>
                      </button>

                      {/* Upload File */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 text-[10.5px] flex items-center gap-1 transition-colors cursor-pointer justify-center"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Upload File</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste picture URL (https://...)"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-[10.5px] font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bosch Hammer Drill 18V"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
                  required
                />
              </div>

              {/* SKU / Barcode Field with Scan & Auto-Generate */}
              <div className="space-y-1">
                <label className="block text-slate-600 font-bold flex items-center justify-between">
                  <span>SKU / Barcode Number</span>
                  {prodSku && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {prodSku.length} digits
                    </span>
                  )}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Scan barcode or type SKU..."
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-semibold focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSkuScanOpen(true)}
                    className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-[10.5px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer shrink-0"
                    title="Scan Barcode using Camera"
                  >
                    <ScanBarcode className="w-3.5 h-3.5" />
                    <span>Scan</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateBarcode}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 text-[10.5px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title="Auto Generate Barcode"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Auto</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Category</label>
                  <select
                    value={prodCat}
                    onChange={(e) => setProdCat(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Selling Price ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="0"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-900 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Cost Price ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Initial Stock (Pcs)</label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Min Stock Alert</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Shelf Location (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Aisle 3 - Shelf B"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
                />
              </div>

              <div className="text-[10px] text-slate-500 bg-slate-100 p-2 rounded-xl italic">
                Note: All items in Orine POS are sold by piece (pcs) only.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl shadow-md transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingProduct ? 'Update Product Details' : 'Save Hardware Product'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Stock Modal */}
      {isQuickStockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-3.5 bg-amber-600 text-white flex items-center justify-between font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <PackagePlus className="w-4 h-4" /> Add Stock to Hardware Item
              </span>
              <button onClick={() => setIsQuickStockModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Select Product</label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
                  required
                >
                  <option value="">-- Choose Hardware Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {p.currentStock} pcs)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Quantity to Add (Pcs)</label>
                <input
                  type="number"
                  min="1"
                  value={stockAddQty}
                  onChange={(e) => setStockAddQty(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!selectedProdId}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-md transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PackagePlus className="w-4 h-4" />
                <span>Add Stock Now</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Customer Modal */}
      {isQuickCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-3.5 bg-purple-600 text-white flex items-center justify-between font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" /> Register New Customer / Client
              </span>
              <button onClick={() => setIsQuickCustomerModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Customer / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Construction or John Plumber"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 555-0199"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Credit Limit ({settings.currencySymbol})</label>
                <input
                  type="number"
                  value={custLimit}
                  onChange={(e) => setCustLimit(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Address / Site Location</label>
                <input
                  type="text"
                  placeholder="e.g. Sector 4 Industrial Area"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-md transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Register Customer</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Photo Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraCaptureOpen}
        onClose={() => setIsCameraCaptureOpen(false)}
        onCapture={(dataUrl) => {
          setProdImage(dataUrl);
          setIsCameraCaptureOpen(false);
        }}
        title="Take Hardware Product Photo"
      />

      {/* SKU Barcode Scanner Camera Modal */}
      {isSkuScanOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-3.5 bg-red-600 text-white flex items-center justify-between font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <ScanBarcode className="w-4 h-4" /> Scan Product Barcode
              </span>
              <button
                onClick={() => setIsSkuScanOpen(false)}
                className="p-1 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-600 font-medium text-center">
                Point your camera at the hardware product barcode to fill SKU:
              </p>

              <BarcodeCameraScanner
                active={isSkuScanOpen}
                continuous={false}
                onScan={(scannedCode) => {
                  setProdSku(scannedCode);
                  setIsSkuScanOpen(false);
                }}
                className="h-56"
              />

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsSkuScanOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
