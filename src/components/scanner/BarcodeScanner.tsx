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
        if (state === 2) { // SCANNING state
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
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    // Visual feedback
    setScanSuccess(true);
    setTimeout(() => setScanSuccess(false), 500);
  }, []);

  const handleSuccessfulScan = useCallback((decodedText: string) => {
    if (hasScannedRef.current) return;
    hasScannedRef.current = true;
    
    console.log("Barcode detected:", decodedText);
    triggerSuccessFeedback();
    
    // Small delay to show success feedback before closing
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
        // @ts-ignore - torch is a valid constraint but not in types
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

      // Wait for DOM element to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        const scanner = new Html5Qrcode("barcode-scanner");
        scannerRef.current = scanner;

        // 720p resolution for mobile optimization
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 280, height: 120 },
            aspectRatio: 1.0,
            disableFlip: false,
            videoConstraints: {
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }
          },
          handleSuccessfulScan,
          () => {
            // Ignore scan errors during active scanning
          }
        );

        // Check if torch is supported
        try {
          const capabilities = scanner.getRunningTrackCapabilities();
          // @ts-ignore - torch may exist in capabilities
          if (capabilities && capabilities.torch) {
            setTorchSupported(true);
          }
        } catch {
          // Torch not supported
        }

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
    <div className={`fixed inset-0 z-50 bg-background transition-colors duration-300 ${scanSuccess ? 'bg-primary/20' : ''}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12 z-10 bg-gradient-to-b from-background to-transparent">
        <h2 className="text-lg font-semibold text-foreground">Scan Barcode</h2>
        <div className="flex items-center gap-2">
          {torchSupported && (
            <button
              onClick={toggleTorch}
              className={`p-2.5 rounded-full backdrop-blur-sm border shadow-soft transition-colors ${
                torchOn 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-card/90 border-border/50 hover:bg-card'
              }`}
            >
              <Flashlight className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-2.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-soft hover:bg-card transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Scanner Area */}
      <div className="h-full flex flex-col items-center justify-center px-5">
        {showManualEntry ? (
          <div className="w-full max-w-sm space-y-4">
            <div className="text-center space-y-2">
              <Keyboard className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">Enter Barcode Manually</h3>
              <p className="text-sm text-muted-foreground">Type the numbers below the barcode</p>
            </div>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g., 8901234567890"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value.replace(/[^0-9]/g, ''))}
              className="text-center text-lg tracking-widest"
              autoFocus
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowManualEntry(false)}
              >
                Back to Camera
              </Button>
              <Button
                className="flex-1"
                onClick={handleManualSubmit}
                disabled={manualBarcode.length < 8}
              >
                Search
              </Button>
            </div>
          </div>
        ) : error ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-muted-foreground max-w-xs">{error}</p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setShowManualEntry(true)} variant="default">
                Enter Code Manually
              </Button>
              <Button onClick={handleClose} variant="outline">
                Go Back
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-muted">
              {isStarting && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                  <div className="text-center space-y-3">
                    <Camera className="w-12 h-12 text-primary animate-pulse mx-auto" />
                    <p className="text-muted-foreground text-sm">Starting camera...</p>
                  </div>
                </div>
              )}
              <div id="barcode-scanner" className="w-full h-full" />
              
              {/* Scanning overlay with corner guides */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Darkened areas */}
                <div className="absolute inset-0 bg-background/40" />
                
                {/* Clear center area */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-28 bg-transparent" 
                     style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }} />
                
                {/* Corner guides */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-28">
                  {/* Top-left corner */}
                  <div className={`absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 rounded-tl-lg transition-colors duration-200 ${scanSuccess ? 'border-primary' : 'border-primary/80'}`} />
                  {/* Top-right corner */}
                  <div className={`absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 rounded-tr-lg transition-colors duration-200 ${scanSuccess ? 'border-primary' : 'border-primary/80'}`} />
                  {/* Bottom-left corner */}
                  <div className={`absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 rounded-bl-lg transition-colors duration-200 ${scanSuccess ? 'border-primary' : 'border-primary/80'}`} />
                  {/* Bottom-right corner */}
                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 rounded-br-lg transition-colors duration-200 ${scanSuccess ? 'border-primary' : 'border-primary/80'}`} />
                  
                  {/* Laser line animation */}
                  <div 
                    className="absolute inset-x-2 h-0.5 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]"
                    style={{ 
                      animation: 'laserScan 2s ease-in-out infinite',
                    }} 
                  />
                </div>
              </div>

              {/* Success flash overlay */}
              {scanSuccess && (
                <div className="absolute inset-0 bg-primary/30 animate-pulse z-20" />
              )}
            </div>
            
            <p className="text-muted-foreground text-sm text-center mt-6 max-w-xs">
              Position the barcode within the frame — it will scan automatically
            </p>

            {/* Manual entry button */}
            <button
              onClick={() => setShowManualEntry(true)}
              className="mt-4 text-primary text-sm font-medium underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              Enter Code Manually
            </button>
          </>
        )}
      </div>

      {/* Laser animation keyframes */}
      <style>{`
        @keyframes laserScan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 2px); }
        }
      `}</style>
    </div>
  );
};