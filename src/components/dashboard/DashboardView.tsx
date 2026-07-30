import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, ShoppingCart, AlertTriangle, PlusCircle,
  PackagePlus, UserPlus, ArrowRight, Clock, CheckCircle2,
  ChevronRight, Receipt, Eye, Mail, Trash2, Sparkles
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const DashboardView: React.FC = () => {
  const {
    getTodayMetrics, getLowStockProducts, sales,
    navigateAndOpen, setIsQuickProductModalOpen,
    setIsQuickStockModalOpen, setIsQuickCustomerModalOpen,
    openReceiptModal, settings, isDummyDataCleared, clearAllData
  } = usePOS();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const metrics = getTodayMetrics();
  const lowStockProducts = getLowStockProducts();
  const recentSales = sales.slice(0, 5);

  return (
    <div className="p-3.5 sm:p-6 bg-slate-50/50 flex-1 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
      {/* Key Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        {/* Today's Sales */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 bg-red-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-red-600 shrink-0">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Today's Sales</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">
              {settings.currencySymbol} {Math.round(metrics.sales)}
            </p>
          </div>
        </div>

        {/* Today's Profit */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 bg-emerald-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Today's Profit</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">
              {settings.currencySymbol} {Math.round(metrics.profit)}
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 bg-amber-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Total Orders</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">
              {metrics.ordersCount} Orders
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {/* New Sale */}
          <button
            id="btn-quick-new-sale"
            onClick={() => navigateAndOpen('sales', 'billing')}
            className="bg-red-600 text-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-md shadow-red-200/80 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer min-h-[90px]"
          >
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="font-bold text-xs sm:text-sm text-center">New Sale</span>
          </button>

          {/* Add Product */}
          <button
            id="btn-quick-add-product"
            onClick={() => setIsQuickProductModalOpen(true)}
            className="bg-white border border-slate-200 hover:border-red-300 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-800 hover:text-red-700 active:scale-95 transition-all cursor-pointer shadow-2xs min-h-[90px]"
          >
            <PlusCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
            <span className="font-bold text-xs sm:text-sm text-center">Add Product</span>
          </button>

          {/* Add Stock */}
          <button
            id="btn-quick-add-stock"
            onClick={() => setIsQuickStockModalOpen(true)}
            className="bg-white border border-slate-200 hover:border-red-300 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-800 hover:text-red-700 active:scale-95 transition-all cursor-pointer shadow-2xs min-h-[90px]"
          >
            <PackagePlus className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
            <span className="font-bold text-xs sm:text-sm text-center">Add Stock</span>
          </button>

          {/* Add Customer */}
          <button
            id="btn-quick-add-customer"
            onClick={() => setIsQuickCustomerModalOpen(true)}
            className="bg-white border border-slate-200 hover:border-red-300 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-800 hover:text-red-700 active:scale-95 transition-all cursor-pointer shadow-2xs min-h-[90px]"
          >
            <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
            <span className="font-bold text-xs sm:text-sm text-center">Add Customer</span>
          </button>
        </div>
      </div>

      {/* Initial Reset - Clear Sample Data (Shows on dashboard until cleared) */}
      {!isDummyDataCleared && (
        <div className="bg-rose-50/80 p-4 rounded-3xl border border-rose-200 space-y-2 text-xs">
          <h3 className="font-extrabold text-rose-900 text-sm flex items-center gap-1.5">
            <Trash2 className="w-4 h-4 text-rose-700" /> Initial Reset (Clear All Sample Data)
          </h3>
          <p className="text-rose-800 text-[11px]">
            Completely clears out all pre-populated sample products, sales records, customers, and expenses to start completely fresh with an empty store.
          </p>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
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
                    setShowResetConfirm(false);
                  }}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-xs transition-all"
                >
                  Yes, Delete & Clear All Data
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 font-bold rounded-xl text-xs cursor-pointer transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complaints & Feature Wishlist Section */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white p-3.5 rounded-2xl shadow-xs border border-red-900/50 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-red-300 bg-red-900/80 px-1.5 py-0.5 rounded border border-red-700/50 shrink-0">
            Support
          </span>
          <h3 className="text-xs font-bold text-slate-100">
            Have a complaint or feature request?
          </h3>
        </div>

        <div className="flex items-center gap-2 w-full pt-0.5">
          {/* WhatsApp Contact Button */}
          <a
            href="https://wa.me/923295626026?text=Hello%20Orine%20Team,%20I%20have%20a%20complaint%20/%20feature%20request%20for%20the%20app:"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-[11px] rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span className="truncate">WhatsApp</span>
          </a>

          {/* Email Contact Button */}
          <a
            href="mailto:bizmate09@gmail.com?subject=Orine%20Complaint%20/%20Feature%20Wishlist"
            className="flex-1 py-2 px-3 bg-white text-red-700 hover:bg-slate-100 active:scale-95 font-extrabold text-[11px] rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate">Email Support</span>
          </a>
        </div>
      </div>

      {/* Tables Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Low Stock Products ({lowStockProducts.length})
            </h3>
            {lowStockProducts.length > 0 && (
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">
                Action Required
              </span>
            )}
          </div>
          <div className="p-4 divide-y divide-slate-100">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                All stock levels are healthy.
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map(prod => (
                <div key={prod.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-extrabold text-xs shrink-0">
                      {prod.category.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-xs">{prod.name}</p>
                      <p className="text-[11px] text-slate-500">SKU: {prod.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-bold text-xs">{prod.currentStock} left</p>
                    <p className="text-[10px] text-slate-400 uppercase">Min: {prod.minStockLevel}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              Recent Sales
            </h3>
            <button
              onClick={() => navigateAndOpen('sales', 'history')}
              className="text-red-600 text-xs font-bold hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="p-4 divide-y divide-slate-100">
            {recentSales.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No recent sales recorded yet.
              </div>
            ) : (
              recentSales.map(order => (
                <div
                  key={order.id}
                  onClick={() => openReceiptModal(order)}
                  className="py-3 flex justify-between items-center first:pt-0 last:pb-0 hover:bg-slate-50/60 transition-colors cursor-pointer rounded-xl px-1"
                >
                  <div>
                    <p className="font-semibold text-slate-800 text-xs underline decoration-slate-200">
                      {order.receiptNumber}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {(() => {
                        const d = new Date(order.timestamp || order.date);
                        return !isNaN(d.getTime()) ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                      })()} • {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 font-mono text-xs">
                      {settings.currencySymbol} {Math.round(order.grandTotal)}
                    </p>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
