import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, AlertCircle, Flashlight, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export const BarcodeScanner = ({ isOpen, onClose, onScan }: BarcodeScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
  }, []);

  const triggerSuccessFeedback = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    setScanSuccess(true);
    setTimeout(() => setScanSuccess(false), 500);
  }, []);

  const handleSuccessfulScan = useCallback((decodedText: string) => {
    if (hasScannedRef.current) return;
    hasScannedRef.current = true;
    
    console.log("Barcode detected:", decodedText);
    triggerSuccessFeedback();
    
    setTimeout(() => {
      onScan(decodedText);
      stopScanner();
    }, 300);
  }, [onScan, stopScanner, triggerSuccessFeedback]);

  const toggleTorch = useCallback(async () => {
    if (!scannerRef.current) return;
    
    try {
      const newTorchState = !torchOn;
      await scannerRef.current.applyVideoConstraints({
        // @ts-ignore
        advanced: [{ torch: newTorchState }]
      });
      setTorchOn(newTorchState);
    } catch (err) {
      console.error("Torch toggle error:", err);
    }
  }, [torchOn]);

  useEffect(() => {
    if (!isOpen) {
      hasScannedRef.current = false;
      setShowManualEntry(false);
      setManualBarcode("");
      setTorchOn(false);
      return;
    }

    const startScanner = async () => {
      setIsStarting(true);
      setError(null);
      hasScannedRef.current = false;

      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        const scanner = new Html5Qrcode("barcode-scanner");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 280, height: 140 },
            aspectRatio: 1.0,
            disableFlip: false,
            videoConstraints: {
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }
          },
          handleSuccessfulScan,
          () => {}
        );

        try {
          const capabilities = scanner.getRunningTrackCapabilities();
          // @ts-ignore
          if (capabilities && capabilities.torch) {
            setTorchSupported(true);
          }
        } catch {}

        setIsStarting(false);
      } catch (err) {
        console.error("Scanner error:", err);
        setError("Could not access camera. Please ensure camera permissions are granted.");
        setIsStarting(false);
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [isOpen, handleSuccessfulScan, stopScanner]);

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  const handleManualSubmit = () => {
    const trimmed = manualBarcode.trim();
    if (trimmed.length >= 8) {
      triggerSuccessFeedback();
      onScan(trimmed);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black transition-colors duration-300 ${scanSuccess ? 'bg-primary/20' : ''}`}>
      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12 z-20">
        <h2 className="text-lg font-bold text-white tracking-wide drop-shadow-lg">SCAN MODE</h2>
        <div className="flex items-center gap-2">
          {torchSupported && (
            <button
              onClick={toggleTorch}
              className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                torchOn 
                  ? 'bg-cyan-500/30 text-cyan-400 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <Flashlight className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Scanner Area - Full Screen */}
      <div className="h-full w-full relative">
        {showManualEntry ? (
          <div className="absolute inset-0 flex items-center justify-center p-5 bg-black/90 z-30">
            <div className="w-full max-w-sm space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                  <Keyboard className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">MANUAL ENTRY</h3>
                <p className="text-sm text-white/60">Enter the barcode numbers</p>
              </div>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g., 8901234567890"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value.replace(/[^0-9]/g, ''))}
                className="text-center text-lg tracking-widest bg-white/10 border-white/20 text-white placeholder:text-white/40"
                autoFocus
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => setShowManualEntry(false)}
                >
                  Back to Camera
                </Button>
                <Button
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
                  onClick={handleManualSubmit}
                  disabled={manualBarcode.length < 8}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center p-5 bg-black/90 z-30">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-white/60 max-w-xs">{error}</p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => setShowManualEntry(true)} 
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
                >
                  Enter Code Manually
                </Button>
                <Button 
                  onClick={handleClose} 
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Camera Feed */}
            <div id="barcode-scanner" className="w-full h-full" />
            
            {/* Loading State */}
            {isStarting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center mx-auto animate-pulse shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                    <Camera className="w-10 h-10 text-cyan-400" />
                  </div>
                  <p className="text-white/60 text-sm tracking-wider">INITIALIZING CAMERA...</p>
                </div>
              </div>
            )}
            
            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* Dark overlay with cutout */}
              <div className="absolute inset-0">
                {/* Top dark area */}
                <div className="absolute top-0 left-0 right-0 h-[calc(50%-80px)] bg-black/70" />
                {/* Bottom dark area */}
                <div className="absolute bottom-0 left-0 right-0 h-[calc(50%-80px)] bg-black/70" />
                {/* Left dark area */}
                <div className="absolute top-[calc(50%-80px)] left-0 w-[calc(50%-140px)] h-[160px] bg-black/70" />
                {/* Right dark area */}
                <div className="absolute top-[calc(50%-80px)] right-0 w-[calc(50%-140px)] h-[160px] bg-black/70" />
              </div>
              
              {/* Scan Frame with Corner Brackets */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[160px]">
                {/* Corner Brackets */}
                {/* Top-left */}
                <div className="absolute -top-1 -left-1 w-12 h-12">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div className="absolute top-0 left-0 h-full w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
                {/* Top-right */}
                <div className="absolute -top-1 -right-1 w-12 h-12">
                  <div className="absolute top-0 right-0 w-full h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div className="absolute top-0 right-0 h-full w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
                {/* Bottom-left */}
                <div className="absolute -bottom-1 -left-1 w-12 h-12">
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div className="absolute bottom-0 left-0 h-full w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
                {/* Bottom-right */}
                <div className="absolute -bottom-1 -right-1 w-12 h-12">
                  <div className="absolute bottom-0 right-0 w-full h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div className="absolute bottom-0 right-0 h-full w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
                
                {/* Laser Scan Line */}
                <div 
                  className="absolute inset-x-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{ 
                    animation: 'laserScan 2s ease-in-out infinite',
                    boxShadow: '0 0 20px 4px rgba(34,211,238,0.6), 0 0 40px 8px rgba(34,211,238,0.3)',
                  }} 
                />
              </div>
              
              {/* Success Flash */}
              {scanSuccess && (
                <div className="absolute inset-0 bg-cyan-500/30 animate-pulse" />
              )}
            </div>
            
            {/* Floating Label Pill */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
              <div className="px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                <p className="text-white/90 text-sm font-medium text-center">
                  Point camera at barcode
                </p>
              </div>
            </div>

            {/* Manual Entry Button */}
            <button
              onClick={() => setShowManualEntry(true)}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-cyan-400 text-sm font-medium underline underline-offset-4 hover:text-cyan-300 transition-colors pointer-events-auto"
            >
              Enter Code Manually
            </button>
          </>
        )}
      </div>

      {/* Laser animation keyframes */}
      <style>{`
        @keyframes laserScan {
          0%, 100% { top: 8px; }
          50% { top: calc(100% - 10px); }
        }
      `}</style>
    </div>
  );
};