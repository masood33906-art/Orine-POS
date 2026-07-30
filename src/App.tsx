import React from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { AndroidFrame } from './components/layout/AndroidFrame';
import { DashboardView } from './components/dashboard/DashboardView';
import { SalesView } from './components/sales/SalesView';
import { InventoryView } from './components/inventory/InventoryView';
import { MoreView } from './components/more/MoreView';
import { BarcodeScannerModal } from './components/modals/BarcodeScannerModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { QuickActionModals } from './components/modals/QuickActionModals';
import { InitialStoreSetupModal } from './components/common/InitialStoreSetupModal';
import { SplashScreen } from './components/common/SplashScreen';

const MainScreenContent: React.FC = () => {
  const { activeMainTab, isStoreSetupOpen, setIsStoreSetupOpen, isLaunching, setIsLaunching } = usePOS();

  if (isLaunching) {
    return <SplashScreen onFinished={() => setIsLaunching(false)} />;
  }

  return (
    <>
      {activeMainTab === 'dashboard' && <DashboardView />}
      {activeMainTab === 'sales' && <SalesView />}
      {activeMainTab === 'inventory' && <InventoryView />}
      {activeMainTab === 'more' && <MoreView />}

      {/* Global Modals */}
      <BarcodeScannerModal />
      <ReceiptModal />
      <QuickActionModals />
      <InitialStoreSetupModal
        isOpen={isStoreSetupOpen}
        onClose={() => setIsStoreSetupOpen(false)}
      />
    </>
  );
};

export default function App() {
  return (
    <POSProvider>
      <AndroidFrame>
        <MainScreenContent />
      </AndroidFrame>
    </POSProvider>
  );
}
