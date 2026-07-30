import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { TrendingUp, Calendar, Filter, DollarSign, ShoppingCart, ArrowUpRight, BarChart2 } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

type MetricType = 'sales' | 'profit' | 'orders' | 'expenses';
type IntervalType = 'daily' | 'monthly' | 'yearly';

export const GrowthChart: React.FC = () => {
  const { sales, expenses, settings } = usePOS();
  const [metric, setMetric] = useState<MetricType>('sales');
  const [interval, setInterval] = useState<IntervalType>('daily');

  const chartData = useMemo(() => {
    const buckets: Record<string, { label: string; sales: number; profit: number; orders: number; expenses: number; timestampSort: number }> = {};

    const safeDate = (val: any): Date => {
      if (!val) return new Date();
      const d = new Date(val);
      return isNaN(d.getTime()) ? new Date() : d;
    };

    // Process Sales
    sales.forEach(s => {
      const d = safeDate(s.timestamp || s.date);
      let key = '';
      let label = '';
      let timestampSort = d.getTime();

      if (interval === 'daily') {
        key = d.toISOString().split('T')[0];
        label = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else if (interval === 'monthly') {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        label = d.toLocaleDateString([], { month: 'short', year: '2-digit' });
        timestampSort = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      } else {
        key = `${d.getFullYear()}`;
        label = `${d.getFullYear()}`;
        timestampSort = new Date(d.getFullYear(), 0, 1).getTime();
      }

      if (!buckets[key]) {
        buckets[key] = { label, sales: 0, profit: 0, orders: 0, expenses: 0, timestampSort };
      }

      buckets[key].sales += s.grandTotal;
      buckets[key].profit += s.profit;
      buckets[key].orders += 1;
    });

    // Process Expenses
    expenses.forEach(e => {
      const d = safeDate(e.date);
      let key = '';
      let label = '';
      let timestampSort = d.getTime();

      if (interval === 'daily') {
        key = d.toISOString().split('T')[0];
        label = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else if (interval === 'monthly') {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        label = d.toLocaleDateString([], { month: 'short', year: '2-digit' });
        timestampSort = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      } else {
        key = `${d.getFullYear()}`;
        label = `${d.getFullYear()}`;
        timestampSort = new Date(d.getFullYear(), 0, 1).getTime();
      }

      if (!buckets[key]) {
        buckets[key] = { label, sales: 0, profit: 0, orders: 0, expenses: 0, timestampSort };
      }

      buckets[key].expenses += e.amount;
    });

    const sortedList = Object.values(buckets).sort((a, b) => a.timestampSort - b.timestampSort);

    // If dataset is small, generate baseline trend points for a visually complete graph
    if (sortedList.length === 0) {
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const pastDate = new Date(now);
        if (interval === 'daily') pastDate.setDate(now.getDate() - i);
        else if (interval === 'monthly') pastDate.setMonth(now.getMonth() - i);
        else pastDate.setFullYear(now.getFullYear() - i);

        const lbl = interval === 'daily'
          ? pastDate.toLocaleDateString([], { month: 'short', day: 'numeric' })
          : interval === 'monthly'
          ? pastDate.toLocaleDateString([], { month: 'short', year: '2-digit' })
          : `${pastDate.getFullYear()}`;

        sortedList.push({
          label: lbl,
          sales: 0,
          profit: 0,
          orders: 0,
          expenses: 0,
          timestampSort: pastDate.getTime()
        });
      }
    }

    return sortedList;
  }, [sales, expenses, interval]);

  const metricConfig = {
    sales: {
      name: 'Sales Revenue',
      color: '#dc2626',
      fillGradient: 'colorSales',
      unit: `${settings.currencySymbol} `,
      formatter: (v: number) => `${settings.currencySymbol} ${Math.round(v).toLocaleString()}`
    },
    profit: {
      name: 'Net Profit',
      color: '#059669',
      fillGradient: 'colorProfit',
      unit: `${settings.currencySymbol} `,
      formatter: (v: number) => `${settings.currencySymbol} ${Math.round(v).toLocaleString()}`
    },
    orders: {
      name: 'Orders Count',
      color: '#4f46e5',
      fillGradient: 'colorOrders',
      unit: '',
      formatter: (v: number) => `${v} Orders`
    },
    expenses: {
      name: 'Store Expenses',
      color: '#e11d48',
      fillGradient: 'colorExpenses',
      unit: `${settings.currencySymbol} `,
      formatter: (v: number) => `${settings.currencySymbol} ${Math.round(v).toLocaleString()}`
    }
  };

  const currentCfg = metricConfig[metric];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
            Performance Analytics
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-red-600" /> Business Growth & Trend Analyzer
          </h3>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Metric Selector */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 text-[10.5px] font-bold">
            <button
              onClick={() => setMetric('sales')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                metric === 'sales' ? 'bg-red-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setMetric('profit')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                metric === 'profit' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Profit
            </button>
            <button
              onClick={() => setMetric('orders')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                metric === 'orders' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setMetric('expenses')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                metric === 'expenses' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expenses
            </button>
          </div>

          {/* Interval Switcher */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 text-[10.5px] font-extrabold">
            <button
              onClick={() => setInterval('daily')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                interval === 'daily' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setInterval('monthly')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                interval === 'monthly' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                interval === 'yearly' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Chart Visualizer Area */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
              tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs font-bold space-y-0.5 border border-slate-700">
                      <div className="text-slate-400 text-[10px] uppercase font-mono">{label}</div>
                      <div className="text-sm font-extrabold flex items-center gap-1" style={{ color: currentCfg.color }}>
                        <span>{currentCfg.name}:</span>
                        <span>{currentCfg.formatter(val)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={currentCfg.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${currentCfg.fillGradient})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
