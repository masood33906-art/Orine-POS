import React from 'react';
import { BarChart3, TrendingUp, DollarSign, PackageCheck, AlertCircle, PieChart } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { GrowthChart } from './GrowthChart';

export const ReportsView: React.FC = () => {
  const { sales, products, expenses, settings } = usePOS();

  const totalSalesVal = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalProfitVal = sales.reduce((sum, s) => sum + s.profit, 0);
  const totalExpensesVal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalProfitVal - totalExpensesVal;

  const totalStockValuation = products.reduce((sum, p) => sum + (p.currentStock * p.costPrice), 0);
  const totalStockRetailValuation = products.reduce((sum, p) => sum + (p.currentStock * p.sellingPrice), 0);

  // Top selling products logic
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  sales.forEach(s => {
    s.items.forEach(item => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].revenue += item.total;
    });
  });

  const topSelling = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="p-4 space-y-4">
      {/* Interactive Growth Chart Graph */}
      <GrowthChart />

      {/* Executive Financial Summary */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-red-600" /> Hardware Business Financial Overview
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Gross Revenue</span>
            <div className="text-base font-black text-slate-900 mt-1">
              {settings.currencySymbol} {Math.round(totalSalesVal)}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Gross Profit</span>
            <div className="text-base font-black text-emerald-600 mt-1">
              {settings.currencySymbol} {Math.round(totalProfitVal)}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Store Expenses</span>
            <div className="text-base font-black text-rose-600 mt-1">
              {settings.currencySymbol} {Math.round(totalExpensesVal)}
            </div>
          </div>

          <div className="bg-red-50 p-3 rounded-xl border border-red-200">
            <span className="text-[10px] text-red-700 font-bold uppercase">Net Operating Profit</span>
            <div className="text-base font-black text-red-800 mt-1">
              {settings.currencySymbol} {Math.round(netProfit)}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Valuation Breakdown */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <PackageCheck className="w-4 h-4 text-red-600" /> Inventory Stock Valuation Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-700">Total Asset Cost Price</div>
              <div className="text-[10px] text-slate-500">Capital invested in active hardware stock</div>
            </div>
            <div className="font-black text-slate-900 text-sm">
              {settings.currencySymbol} {Math.round(totalStockValuation)}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-700">Expected Retail Valuation</div>
              <div className="text-[10px] text-slate-500">Total selling value if all stock sold</div>
            </div>
            <div className="font-black text-red-700 text-sm">
              {settings.currencySymbol} {Math.round(totalStockRetailValuation)}
            </div>
          </div>
        </div>
      </div>

      {/* Top Hardware Items Breakdown */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
          Top Selling Hardware Items
        </h3>

        {topSelling.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            No sales data recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {topSelling.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] text-slate-500">Units Sold: {item.qty} pcs</div>
                  </div>
                </div>

                <div className="font-extrabold text-emerald-700 text-sm">
                  {settings.currencySymbol} {Math.round(item.revenue)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
