import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { ScanBarcode, RefreshCw, SwitchCamera, AlertCircle, Volume2 } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface BarcodeCameraScannerProps {
  onScan: (decodedText: string) => void;
  active: boolean;
  className?: string;
  continuous?: boolean;
}

export const BarcodeCameraScanner: React.FC<BarcodeCameraScannerProps> = ({
  onScan,
  active,
  className = '',
  continuous = true
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = 'html5-camera-barcode-reader';
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const lastScanTimeRef = useRef<number>(0);
  const lastScannedCodeRef = useRef<string>('');

  useEffect(() => {
    let html5Qrcode: Html5Qrcode | null = null;

    const startScanner = async () => {
      if (!active) return;
      setErrorMsg(null);
      setIsScanning(false);

      try {
        // Ensure element exists in DOM
        const element = document.getElementById(readerElementId);
        if (!element) return;

        // Initialize Html5Qrcode with all standard barcode formats
        html5Qrcode = new Html5Qrcode(readerElementId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_93,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.QR_CODE
          ],
          verbose: false
        });

        scannerRef.current = html5Qrcode;

        const scanConfig = {
          fps: 15,
          qrbox: { width: 260, height: 160 },
          aspectRatio: 1.5
        };

        const onScanSuccess = (decodedText: string) => {
          const now = Date.now();
          const trimmed = decodedText.trim();
          
          // Debounce same code scan within 1.2 seconds to avoid rapid duplicate triggers
          if (
            trimmed === lastScannedCodeRef.current &&
            now - lastScanTimeRef.current < 1200
          ) {
            return;
          }

          lastScanTimeRef.current = now;
          lastScannedCodeRef.current = trimmed;

          sounds.playBeep();
          onScan(trimmed);

          if (!continuous && scannerRef.current) {
            scannerRef.current.stop().catch(() => {});
          }
        };

        try {
          // Attempt 1: Start with selected facingMode
          await html5Qrcode.start(
            { facingMode: facingMode },
            scanConfig,
            onScanSuccess,
            () => {}
          );
        } catch (startErr) {
          console.warn('FacingMode camera start failed, attempting camera device enumeration fallback...', startErr);
          
          // Attempt 2: Fallback to getting list of camera devices
          const cameras = await Html5Qrcode.getCameras();
          if (cameras && cameras.length > 0) {
            const cameraId = cameras[0].id;
            await html5Qrcode.start(
              cameraId,
              scanConfig,
              onScanSuccess,
              () => {}
            );
          } else {
            throw startErr;
          }
        }

        setIsScanning(true);
      } catch (err: unknown) {
        console.warn('Barcode scanner start status:', err);
        const errStr = err instanceof Error ? err.message : String(err);
        if (errStr.includes('Permission') || errStr.includes('denied')) {
          setErrorMsg('Camera permission denied. Please allow camera access in browser.');
        } else if (
          errStr.includes('NotFound') ||
          errStr.includes('DevicesNotFoundError') ||
          errStr.includes('Requested device not found') ||
          errStr.includes('device not found')
        ) {
          setErrorMsg('No camera detected on this device.');
        } else {
          setErrorMsg('Could not open camera stream. Make sure no other app is using the camera.');
        }
      }
    };

    if (active) {
      // Delay slightly to ensure DOM element is mounted
      const timer = setTimeout(() => {
        startScanner();
      }, 100);
      return () => {
        clearTimeout(timer);
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
      };
    }
  }, [active, facingMode]);

  const toggleFacingMode = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
      }).catch(() => {
        setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
      });
    } else {
      setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
    }
  };

  return (
    <div className={`relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center ${className}`}>
      {/* CSS overrides to hide html5-qrcode default guide images, white horizontal T's, and borders */}
      <style>{`
        #html5-camera-barcode-reader img,
        #html5-camera-barcode-reader canvas,
        #html5-camera-barcode-reader__scan_region img,
        #html5-camera-barcode-reader__scan_region canvas {
          display: none !important;
        }
        #html5-camera-barcode-reader__scan_region {
          border: none !important;
          background: transparent !important;
        }
        #html5-camera-barcode-reader video {
          object-fit: cover !important;
          border-radius: 1rem;
        }
        @keyframes scanline {
          0% { top: 15%; opacity: 0.9; }
          50% { top: 82%; opacity: 1; }
          100% { top: 15%; opacity: 0.9; }
        }
        .animate-laser-line {
          animation: scanline 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Container Element for Html5Qrcode Video Feed */}
      <div id={readerElementId} className="w-full h-full min-h-[220px]" />

      {/* Loading overlay */}
      {!isScanning && !errorMsg && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-2 text-white text-xs font-semibold">
          <RefreshCw className="w-6 h-6 animate-spin text-red-400" />
          <span>Starting Barcode Camera...</span>
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <div className="absolute inset-0 bg-slate-950/95 p-4 flex flex-col items-center justify-center text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-500" />
          <p className="text-xs font-bold text-slate-200 max-w-xs">{errorMsg}</p>
          <p className="text-[10px] text-slate-400">
            You can also type barcode numbers manually in the text box below.
          </p>
        </div>
      )}

      {/* Scanner viewfinder overlay - clean laser scan line only */}
      {isScanning && !errorMsg && (
        <>
          {/* Animated laser line */}
          <div className="absolute inset-x-6 h-0.5 bg-gradient-to-r from-rose-500/20 via-rose-500 to-rose-500/20 shadow-[0_0_12px_#f43f5e] animate-laser-line pointer-events-none z-10" />
        </>
      )}
    </div>
  );
};
