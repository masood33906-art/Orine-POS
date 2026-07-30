import React, { useState, useEffect } from 'react';
import {
  Smartphone, Tablet, Maximize2, Minimize2, ScanBarcode,
  Bell, Store, RefreshCw, HelpCircle
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { BottomNav } from './BottomNav';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const {
    deviceView, setDeviceView, showDeviceFrame, setShowDeviceFrame,
    settings, currentUser, setCurrentUser, users,
    setIsBarcodeModalOpen, notifications, navigateAndOpen,
    resetToSampleData, setIsStoreSetupOpen
  } = usePOS();

  const [time, setTime] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 font-sans flex flex-col items-center justify-start p-0 md:p-4 select-none">
      {/* Top Controls Toolbar (AI Studio Canvas Controls) */}
      <div className="w-full max-w-5xl mb-2 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-800 text-slate-200 rounded-xl shadow-md border border-slate-700/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-xs">
            B
          </div>
          <span className="font-bold text-white tracking-wide text-sm">{settings.storeName}</span>
          <span className="bg-red-900/80 text-red-200 text-[10px] px-2 py-0.5 rounded-full border border-red-700">
            Hardware POS Mode
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Frame View Switcher */}
          <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-700 flex items-center">
            <button
              id="btn-view-phone"
              onClick={() => { setDeviceView('phone'); setShowDeviceFrame(true); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                deviceView === 'phone' && showDeviceFrame ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone</span>
            </button>
            <button
              id="btn-view-tablet"
              onClick={() => { setDeviceView('tablet'); setShowDeviceFrame(true); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                deviceView === 'tablet' && showDeviceFrame ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              id="btn-view-fullscreen"
              onClick={() => setShowDeviceFrame(!showDeviceFrame)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                !showDeviceFrame ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Fullscreen Canvas"
            >
              {showDeviceFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              <span>{showDeviceFrame ? 'Full' : 'Frame'}</span>
            </button>
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={resetToSampleData}
            className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg border border-slate-600 text-[11px]"
            title="Reset Sample Hardware Store Data"
          >
            <RefreshCw className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Container Envelope */}
      <div
        className={`w-full transition-all duration-300 flex flex-col items-center ${
          showDeviceFrame
            ? deviceView === 'phone'
              ? 'max-w-[430px]'
              : 'max-w-[980px]'
            : 'max-w-7xl'
        }`}
      >
        {/* Device Shell Frame */}
        <div
          className={`w-full bg-white flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
            showDeviceFrame
              ? 'rounded-[32px] border-[8px] border-slate-800 shadow-slate-950/50 min-h-[780px] max-h-[920px] relative'
              : 'rounded-2xl border border-slate-200 min-h-[85vh]'
          }`}
        >
          {/* Android Status Bar */}
          <div className="bg-slate-900 text-white px-6 py-1.5 flex items-center justify-between text-xs font-semibold shrink-0 select-none z-30">
            <span className="tracking-wide text-[12px] text-slate-200">{time || '09:41'}</span>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="opacity-90 font-mono">5G</span>
              {/* Signal Bar SVG */}
              <svg className="w-3.5 h-3.5 fill-current text-slate-200" viewBox="0 0 24 24">
                <path d="M2 22h20V2L2 22z" />
              </svg>
              {/* Battery SVG */}
              <div className="flex items-center border border-slate-400 rounded-sm px-1 py-0.2">
                <span className="text-[9px] font-bold text-slate-200">98%</span>
              </div>
            </div>
          </div>

          {/* Top Professional App Header Bar */}
          <header className="h-14 sm:h-16 px-3.5 sm:px-6 flex items-center justify-between border-b border-slate-100 bg-white shrink-0 z-20">
            <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
                <Store className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 leading-tight truncate">
                  {settings.storeName}
                </h1>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold tracking-wide uppercase truncate">
                  Orine POS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Barcode Scanner Launch */}
              <button
                id="btn-header-scan"
                onClick={() => setIsBarcodeModalOpen(true)}
                className="p-2 sm:p-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 active:scale-95 rounded-xl sm:rounded-2xl transition-all text-slate-700 flex items-center gap-1 text-xs font-bold border border-slate-200/80 cursor-pointer min-h-[38px]"
                title="Scan Barcode"
              >
                <ScanBarcode className="w-4 h-4 text-red-600 shrink-0" />
                <span className="hidden sm:inline text-xs">Scan</span>
              </button>

              {/* Notifications Button */}
              <button
                id="btn-header-notif"
                onClick={() => navigateAndOpen('more', 'notifications')}
                className="relative p-2 sm:p-2.5 bg-slate-100 hover:bg-red-50 active:scale-95 rounded-xl sm:rounded-2xl transition-all text-slate-700 border border-slate-200/80 cursor-pointer min-h-[38px] flex items-center justify-center"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Store Setup Button */}
              <button
                id="btn-header-setup"
                onClick={() => setIsStoreSetupOpen(true)}
                className="p-2 sm:p-2.5 bg-red-50 hover:bg-red-100 text-red-700 active:scale-95 rounded-xl sm:rounded-2xl transition-all flex items-center gap-1 border border-red-200 cursor-pointer min-h-[38px]"
                title="Store Setup"
              >
                <Store className="w-4 h-4 text-red-600" />
                <span className="hidden sm:inline text-xs font-bold">Setup</span>
              </button>

            </div>
          </header>

          {/* Main Content Body */}
          <main className="flex-1 bg-slate-50 overflow-y-auto relative flex flex-col min-h-0">
            {children}
          </main>

          {/* Android Material 3 Bottom Navigation Bar */}
          <BottomNav />

          {/* Android Gesture Bar */}
          <div className="bg-white py-1 flex justify-center shrink-0 border-t border-slate-100">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
