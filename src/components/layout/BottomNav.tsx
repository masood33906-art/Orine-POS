import React from 'react';
import { Home, ShoppingBag, Package, MoreHorizontal } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { MainTab } from '../../types/pos';

export const BottomNav: React.FC = () => {
  const { activeMainTab, setActiveMainTab, cart, getLowStockProducts } = usePOS();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = getLowStockProducts().length;

  const navItems: { id: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: cartCount > 0 ? cartCount : undefined
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package className="w-5 h-5" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined
    },
    {
      id: 'more',
      label: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />
    }
  ];

  return (
    <nav className="h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 sm:px-8 shrink-0 z-30 shadow-sm">
      {navItems.map(item => {
        const isActive = activeMainTab === item.id;
        return (
          <button
            key={item.id}
            id={`nav-tab-${item.id}`}
            onClick={() => setActiveMainTab(item.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer py-1 ${
              isActive ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div
              className={`relative flex items-center justify-center px-3.5 py-1 rounded-full transition-all ${
                isActive
                  ? 'bg-red-100 text-red-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.icon}
              {item.badge !== undefined && (
                <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full border-2 border-white shadow-xs ${
                  item.id === 'sales' ? 'bg-red-600 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] tracking-tight ${
                isActive ? 'font-bold text-red-700' : 'font-medium text-slate-500'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
