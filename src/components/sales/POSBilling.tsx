import React, { useState, useMemo } from 'react';
import {
  Search, ScanBarcode, Plus, Minus, Trash2, User, UserCheck,
  Tag, Percent, DollarSign, ArrowRight, PauseCircle, PlayCircle,
  X, Check, AlertCircle, ShoppingCart, CheckCircle, Smartphone,
  AlertTriangle, PackagePlus, Package
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Product, PaymentMethod } from '../../types/pos';
import { sounds } from '../../utils/sound';

export const POSBilling: React.FC = () => {
  const {
    products, categories, cart, addToCart, updateCartQuantity,
    updateCartItemDiscount, removeFromCart, clearCart,
    selectedCustomer, setSelectedCustomer, customers,
    holdSale, heldSales, resumeSale, deleteHeldSale,
    processCheckout, settings, setIsBarcodeModalOpen,
    setIsQuickStockModalOpen, setSelectedStockProductId, navigateAndOpen
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [outOfStockProduct, setOutOfStockProduct] = useState<Product | null>(null);

  // Out of stock add-to-cart handler
  const handleProductAddToCart = (prod: Product) => {
    const inCartItem = cart.find(c => c.product.id === prod.id);
    const currentInCartQty = inCartItem ? inCartItem.quantity : 0;

    if (prod.currentStock <= 0 || currentInCartQty >= prod.currentStock) {
      setOutOfStockProduct(prod);
    } else {
      addToCart(prod, 1);
    }
  };

  const handleIncrementCartQty = (item: { product: Product; quantity: number }) => {
    if (item.quantity + 1 > item.product.currentStock) {
      setOutOfStockProduct(item.product);
    } else {
      updateCartQuantity(item.product.id, item.quantity + 1);
    }
  };

  // Checkout Form state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaidInput, setAmountPaidInput] = useState<string>('');
  const [checkoutNote, setCheckoutNote] = useState('');

  // Filter products by search & category
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = searchQuery.trim();
      if (!trimmed) return;

      const exactMatch = products.find(p => p.sku.toLowerCase() === trimmed.toLowerCase());
      if (exactMatch) {
        handleProductAddToCart(exactMatch);
        sounds.playBeep();
        setSearchQuery('');
        return;
      }

      if (filteredProducts.length === 1) {
        handleProductAddToCart(filteredProducts[0]);
        sounds.playBeep();
        setSearchQuery('');
      }
    }
  };

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalDiscount = cart.reduce((sum, item) => {
    const disc = item.discountType === 'percentage'
      ? (item.quantity * item.unitPrice * (item.discount / 100))
      : item.discount;
    return sum + disc;
  }, 0);
  const taxAmount = settings.taxRate > 0 ? (subtotal - totalDiscount) * (settings.taxRate / 100) : 0;
  const grandTotal = Math.max(0, subtotal - totalDiscount + taxAmount);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Quick cash exact preset options
  const cashPresets = [
    grandTotal,
    Math.ceil(grandTotal),
    Math.ceil(grandTotal / 100) * 100 || 100,
    Math.ceil(grandTotal / 500) * 500 || 500,
    Math.ceil(grandTotal / 1000) * 1000 || 1000,
    Math.ceil(grandTotal / 5000) * 5000 || 5000
  ].filter((v, i, a) => v >= grandTotal && a.indexOf(v) === i);

  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    setAmountPaidInput(Math.round(grandTotal).toString());
    setIsCheckoutModalOpen(true);
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const paidVal = parseFloat(amountPaidInput) || 0;
    
    if (paymentMethod === 'due' && !selectedCustomer) {
      alert('Please select a customer for Credit / Due Payment.');
      return;
    }

    processCheckout({
      paymentMethod,
      amountPaid: paidVal,
      notes: checkoutNote
    });

    setIsCheckoutModalOpen(false);
    setCheckoutNote('');
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-slate-100 relative">
      {/* Left Column: Product Search & Grid */}
      <div className="flex-1 flex flex-col min-w-0 p-2.5 sm:p-3 space-y-2.5 sm:space-y-3 overflow-y-auto">
        {/* Top Search & Barcode Scan Bar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white p-2 rounded-2xl shadow-xs border border-slate-200">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name, SKU, barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium min-h-[38px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsBarcodeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0 min-h-[38px]"
              title="Scan Barcode"
            >
              <ScanBarcode className="w-4 h-4" />
              <span className="inline sm:inline">Scan</span>
            </button>

            {/* Held Sales Button Badge */}
            {heldSales.length > 0 && (
              <button
                onClick={() => setIsHeldModalOpen(true)}
                className="relative px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-xs border border-amber-300 transition-colors cursor-pointer shrink-0 flex items-center gap-1 min-h-[38px]"
              >
                <PauseCircle className="w-4 h-4 text-amber-700" />
                <span>Held ({heldSales.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Hardware
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-red-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 flex-1 min-h-0 overflow-y-auto pb-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              No hardware items match "{searchQuery}"
            </div>
          ) : (
            filteredProducts.map(prod => {
              const inCartItem = cart.find(c => c.product.id === prod.id);
              const isOutOfStock = prod.currentStock <= 0;
              const isLowStock = prod.currentStock > 0 && prod.currentStock <= prod.minStockLevel;

              return (
                <div
                  key={prod.id}
                  onClick={() => handleProductAddToCart(prod)}
                  className={`bg-white p-2 rounded-xl sm:rounded-2xl border transition-all hover:shadow-md cursor-pointer flex flex-col justify-between relative group overflow-hidden ${
                    isOutOfStock
                      ? 'border-rose-200 bg-rose-50/10'
                      : inCartItem
                      ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Quantity Badge in Cart */}
                  {inCartItem && (
                    <span className="absolute top-1.5 left-1.5 z-10 w-5 h-5 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                      {inCartItem.quantity}
                    </span>
                  )}

                  {/* Top Right 1/4 Image Holding Box (4:3 ratio) */}
                  <div className="absolute top-1.5 right-1.5 w-[36%] aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden border border-slate-200/70 bg-slate-50 shrink-0 shadow-2xs">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-0.5 text-center">
                        <Package className="w-4 h-4 opacity-50" />
                        <span className="text-[7.5px] font-bold mt-0.5 opacity-60">No Image</span>
                      </div>
                    )}

                    {/* Stock Badge Overlay on Image */}
                    {isOutOfStock ? (
                      <span className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-rose-300 text-[8px] font-extrabold py-0.5 text-center uppercase tracking-wider backdrop-blur-xs">
                        Out
                      </span>
                    ) : isLowStock ? (
                      <span className="absolute bottom-0 inset-x-0 bg-rose-600/90 text-white text-[8px] font-bold py-0.5 text-center uppercase tracking-wider backdrop-blur-xs">
                        Low
                      </span>
                    ) : null}
                  </div>

                  {/* Text Content Area on the Left - Avoids Top-Right Image Collision */}
                  <div className="pr-[35%]">
                    <div className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider truncate">
                      {prod.category}
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs line-clamp-2 mt-0.5 group-hover:text-red-600 transition-colors leading-tight">
                      {prod.name}
                    </h4>
                    <div className="text-[9.5px] text-slate-500 mt-1">
                      SKU: <span className="font-mono text-slate-700 font-semibold">{prod.sku}</span>
                    </div>
                  </div>

                  {/* Bottom Price & Stock Row Across Full Width */}
                  <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-red-700">
                        {settings.currencySymbol} {Math.round(prod.sellingPrice)}
                      </span>
                      <span className="text-[9.5px] text-slate-400 block">/ {prod.unit}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[9.5px] font-bold text-slate-500">
                      Stock: <span className={isOutOfStock ? 'text-rose-600 font-black' : isLowStock ? 'text-amber-600 font-extrabold' : 'text-slate-800'}>{prod.currentStock}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Bottom-Right Sale Cart Button */}
      <button
        id="btn-floating-cart"
        onClick={() => setIsCartModalOpen(true)}
        className="fixed bottom-20 right-4 sm:right-6 z-40 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-4 py-3 rounded-full shadow-2xl transition-all flex items-center gap-2.5 cursor-pointer border-2 border-white shadow-red-600/30 group"
        title="View Sale Cart"
      >
        <div className="relative flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-2.5 -right-2.5 min-w-[20px] h-5 bg-rose-500 text-white text-[10px] font-black rounded-full px-1 flex items-center justify-center border-2 border-red-600 shadow-xs animate-in zoom-in-50">
              {totalItemsCount}
            </span>
          )}
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-[9px] uppercase font-bold text-red-200 leading-none">Cart</span>
          <span className="text-xs sm:text-sm font-black leading-tight">
            {settings.currencySymbol} {Math.round(grandTotal)}
          </span>
        </div>
      </button>

      {/* Cart Popup Modal */}
      {isCartModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh] sm:max-h-[90vh]">
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Added Items Cart</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {totalItemsCount} item(s) selected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Cart
                  </button>
                )}
                <button
                  onClick={() => setIsCartModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer Selection Bar */}
            <div className="px-4 py-2.5 bg-red-50/70 border-b border-red-100 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 overflow-hidden">
                <User className="w-4 h-4 text-red-600 shrink-0" />
                {selectedCustomer ? (
                  <div className="truncate">
                    <span className="font-bold text-slate-900">{selectedCustomer.name}</span>
                    {selectedCustomer.totalDue > 0 && (
                      <span className="text-[10px] text-rose-600 block font-semibold">
                        Due: {settings.currencySymbol} {Math.round(selectedCustomer.totalDue)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-600 font-medium italic">Walk-in Customer</span>
                )}
              </div>
              <button
                onClick={() => setIsCustomerModalOpen(true)}
                className="text-xs font-bold text-red-700 hover:underline bg-white px-2.5 py-1 rounded-lg border border-red-200 cursor-pointer shrink-0"
              >
                {selectedCustomer ? 'Change Customer' : '+ Add Customer'}
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 min-h-[160px]">
              {cart.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Your cart is empty</p>
                  <p className="text-xs text-slate-400 max-w-[220px]">
                    Tap products from the list to add them to this sale cart.
                  </p>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.product.id}
                    className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="pr-2">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {settings.currencySymbol} {Math.round(item.unitPrice)} / {item.product.unit}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Controls: Quantity Selector & Line Total */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <div className="flex items-center bg-white border border-slate-300 rounded-xl shadow-2xs">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-l-xl transition-colors cursor-pointer min-w-[32px] flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-black text-xs sm:text-sm text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrementCartQty(item)}
                          className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-r-xl transition-colors cursor-pointer min-w-[32px] flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold">Line Total</span>
                        <span className="font-black text-slate-900 text-sm">
                          {settings.currencySymbol} {Math.round(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary & Action Buttons */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">{settings.currencySymbol} {Math.round(subtotal)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-bold">-{settings.currencySymbol} {Math.round(totalDiscount)}</span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Tax ({settings.taxRate}%)</span>
                    <span>+{settings.currencySymbol} {Math.round(taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-red-600">{settings.currencySymbol} {Math.round(grandTotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => { holdSale(); setIsCartModalOpen(false); }}
                  disabled={cart.length === 0}
                  className="py-3 px-3 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 rounded-2xl disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs min-h-[44px]"
                >
                  <PauseCircle className="w-4 h-4 text-amber-600" /> Hold Sale
                </button>

                <button
                  id="btn-pos-checkout"
                  onClick={() => {
                    setIsCartModalOpen(false);
                    handleOpenCheckout();
                  }}
                  disabled={cart.length === 0}
                  className="py-3 px-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black rounded-2xl shadow-md shadow-red-200 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm min-h-[44px]"
                >
                  <span>Pay Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Selector Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="p-3 bg-red-600 text-white flex items-center justify-between font-bold text-xs">
              <span>Select Customer for Bill</span>
              <button onClick={() => setIsCustomerModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto space-y-1.5 text-xs">
              <button
                onClick={() => { setSelectedCustomer(null); setIsCustomerModalOpen(false); }}
                className="w-full text-left p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 font-semibold text-slate-700"
              >
                Walk-in Customer (No Credit)
              </button>

              {customers.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCustomer(c); setIsCustomerModalOpen(false); }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-colors flex items-center justify-between ${
                    selectedCustomer?.id === c.id
                      ? 'bg-red-50 border-red-500 font-bold text-red-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-bold">{c.name}</div>
                    <div className="text-[10px] text-slate-500">{c.phone}</div>
                  </div>
                  {c.totalDue > 0 && (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-extrabold text-[10px] rounded-md">
                      Due: {settings.currencySymbol} {Math.round(c.totalDue)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Held Sales Modal */}
      {isHeldModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="p-3.5 bg-amber-600 text-white flex items-center justify-between font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <PauseCircle className="w-4 h-4" /> On-Hold Sales Orders ({heldSales.length})
              </span>
              <button onClick={() => setIsHeldModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto space-y-2 text-xs">
              {heldSales.map(h => (
                <div key={h.id} className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-amber-900">{h.name}</div>
                    <div className="text-[10px] text-amber-700">
                      Time: {h.time} • {h.items.length} items
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { resumeSale(h.id); setIsHeldModalOpen(false); }}
                      className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => deleteHeldSale(h.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Payment Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-200">
            <div className="p-4 bg-red-600 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-red-200 font-bold uppercase tracking-wider">Fast Checkout</span>
                <h3 className="text-lg font-black">Pay {settings.currencySymbol} {Math.round(grandTotal)}</h3>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="p-1.5 text-red-100 hover:text-white rounded-xl hover:bg-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteCheckout} className="p-4 space-y-4 text-xs">
              {/* Payment Method Tabs */}
              <div>
                <label className="block text-slate-600 font-bold mb-1.5 uppercase text-[10px] tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'cash', label: 'Cash' },
                    { id: 'upi', label: 'UPI / QR' },
                    { id: 'card', label: 'Card' },
                    { id: 'due', label: 'Store Credit' }
                  ].map(m => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`py-2 px-1 rounded-xl font-extrabold text-[11px] border transition-all cursor-pointer ${
                        paymentMethod === m.id
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Tendered (Cash Presets) */}
              {paymentMethod !== 'due' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      Amount Paid / Tendered
                    </label>
                    <span className="text-slate-500 font-semibold text-[11px]">
                      Change: <span className="font-extrabold text-emerald-600">
                        {settings.currencySymbol} {Math.max(0, Math.round((parseFloat(amountPaidInput) || 0) - grandTotal))}
                      </span>
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={amountPaidInput}
                    onChange={(e) => setAmountPaidInput(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-extrabold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />

                  {/* Cash Presets */}
                  <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                    {cashPresets.map((val, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setAmountPaidInput(Math.round(val).toString())}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-red-100 text-slate-800 font-bold text-[11px] rounded-lg border border-slate-200 shrink-0 cursor-pointer"
                      >
                        {settings.currencySymbol} {Math.round(val)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Warning if Credit */}
              {paymentMethod === 'due' && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Customer Due / Credit Transaction
                  </div>
                  <p className="text-[11px] text-amber-800">
                    {selectedCustomer
                      ? `Amount ${settings.currencySymbol} ${Math.round(grandTotal)} will be added to ${selectedCustomer.name}'s outstanding due balance.`
                      : 'Please select or add a customer to record this due payment.'}
                  </p>
                </div>
              )}

              {/* Transaction Note */}
              <div>
                <label className="block text-slate-600 font-bold mb-1 uppercase text-[10px] tracking-wider">
                  Order Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delivered to site / 10% builder discount approved"
                  value={checkoutNote}
                  onChange={(e) => setCheckoutNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Complete Payment Button */}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Complete Sale & Print Receipt</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quantity Ends / Out of Stock Popup Modal */}
      {outOfStockProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-5 space-y-4 text-center">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-rose-200">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-black text-slate-900 text-base sm:text-lg">Quantity Ends!</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                The stock for <span className="font-extrabold text-slate-900">"{outOfStockProduct.name}"</span> has ended (Available Stock: <span className="font-extrabold text-rose-600">{outOfStockProduct.currentStock} pcs</span>).
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                You cannot add more units to the cart right now.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => {
                  const prod = outOfStockProduct;
                  setOutOfStockProduct(null);
                  setSelectedStockProductId(prod.id);
                  setIsQuickStockModalOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
              >
                <PackagePlus className="w-4 h-4" />
                <span>Add Stock to Product</span>
              </button>

              <button
                onClick={() => {
                  setOutOfStockProduct(null);
                  navigateAndOpen('inventory', 'products');
                }}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md shadow-red-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Go to Inventory Page</span>
              </button>

              <button
                onClick={() => setOutOfStockProduct(null)}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer min-h-[38px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
