import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, SwitchCamera, AlertTriangle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  title?: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Take Product Photo'
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Start camera stream when modal opens or facingMode changes
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      if (!isOpen) return;
      setIsStarting(true);
      setErrorMsg(null);
      setCapturedDataUrl(null);

      try {
        // Stop any existing stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        let mediaStream: MediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });
        } catch (modeErr) {
          console.warn('facingMode failed, trying generic video constraint:', modeErr);
          // Fallback to any available video device
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }

        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
      } catch (err: unknown) {
        console.warn('Camera access status:', err);
        const errStr = err instanceof Error ? err.message : String(err);
        if (errStr.includes('Permission') || errStr.includes('denied')) {
          setErrorMsg('Camera permission was denied. Please allow camera access in browser settings.');
        } else if (
          errStr.includes('NotFound') ||
          errStr.includes('DevicesNotFoundError') ||
          errStr.includes('Requested device not found') ||
          errStr.includes('device not found')
        ) {
          setErrorMsg('No camera found on this device.');
        } else {
          setErrorMsg('Unable to access camera. Please check camera permissions.');
        }
      } finally {
        setIsStarting(false);
      }
    };

    if (isOpen && !capturedDataUrl) {
      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  // Clean up tracks when closing
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturedDataUrl(null);
    setErrorMsg(null);
    onClose();
  };

  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;
    const targetAspect = 4 / 3; // 4:3 ratio matching POS billing box

    let cropWidth = vWidth;
    let cropHeight = vHeight;
    let cropX = 0;
    let cropY = 0;

    const currentAspect = vWidth / vHeight;
    if (currentAspect > targetAspect) {
      // Wider video, crop sides
      cropWidth = vHeight * targetAspect;
      cropX = (vWidth - cropWidth) / 2;
    } else {
      // Taller video, crop top/bottom
      cropHeight = vWidth / targetAspect;
      cropY = (vHeight - cropHeight) / 2;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // If user facing, mirror the canvas image horizontally for intuitive photo
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedDataUrl(dataUrl);

      // Stop camera stream while reviewing photo
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const handleRetake = () => {
    setCapturedDataUrl(null);
  };

  const handleConfirmPhoto = () => {
    if (capturedDataUrl) {
      onCapture(capturedDataUrl);
      handleClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between font-bold text-xs shrink-0">
          <span className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-red-400" />
            <span>{title}</span>
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewfinder / Preview Body */}
        <div className="p-4 flex-1 flex flex-col items-center justify-center space-y-3 bg-slate-950 min-h-[300px] relative overflow-hidden">
          {capturedDataUrl ? (
            /* Captured Snapshot Preview */
            <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center shadow-inner">
              <img
                src={capturedDataUrl}
                alt="Captured Product"
                className="w-full h-full object-contain"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white font-extrabold text-[10px] rounded-md shadow-xs">
                Photo Captured
              </span>
            </div>
          ) : errorMsg ? (
            /* Error Fallback */
            <div className="text-center p-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs space-y-3">
              <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-300">{errorMsg}</p>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Use Device Upload Instead
              </button>
            </div>
          ) : (
            /* Live Camera Stream */
            <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {isStarting && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 text-white text-xs font-semibold">
                  <RefreshCw className="w-6 h-6 animate-spin text-red-400" />
                  <span>Starting Camera...</span>
                </div>
              )}

              {/* Viewfinder Target Box Overlay */}
              <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs font-medium">
                  Center product in frame
                </span>
              </div>

              {/* Flip Camera Toggle Button */}
              <button
                type="button"
                onClick={toggleFacingMode}
                className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full backdrop-blur-xs transition-colors cursor-pointer border border-white/20"
                title="Switch Front/Back Camera"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0 gap-2">
          {capturedDataUrl ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Use This Photo</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSnapPhoto}
                disabled={!!errorMsg || isStarting}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
