import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export const BarcodeScanner = ({ isOpen, onClose, onScan }: BarcodeScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const startScanner = async () => {
      setIsStarting(true);
      setError(null);

      try {
        const scanner = new Html5Qrcode("barcode-scanner");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            console.log("Barcode detected:", decodedText);
            onScan(decodedText);
            stopScanner();
          },
          () => {
            // Ignore errors during scanning
          }
        );
      } catch (err) {
        console.error("Scanner error:", err);
        setError("Could not access camera. Please ensure camera permissions are granted.");
      } finally {
        setIsStarting(false);
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [isOpen, onScan]);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12 z-10 bg-gradient-to-b from-background to-transparent">
        <h2 className="text-lg font-semibold text-foreground">Scan Barcode</h2>
        <button
          onClick={handleClose}
          className="p-2.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-soft hover:bg-card transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="h-full flex flex-col items-center justify-center px-5">
        {error ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-muted-foreground max-w-xs">{error}</p>
            <Button onClick={handleClose} variant="outline">
              Go Back
            </Button>
          </div>
        ) : (
          <>
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-muted">
              {isStarting && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center space-y-3">
                    <Camera className="w-12 h-12 text-primary animate-pulse mx-auto" />
                    <p className="text-muted-foreground text-sm">Starting camera...</p>
                  </div>
                </div>
              )}
              <div id="barcode-scanner" ref={containerRef} className="w-full h-full" />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-24 border-2 border-primary rounded-lg">
                  <div className="absolute inset-0 border border-primary/30 animate-pulse" />
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm text-center mt-6 max-w-xs">
              Position the barcode within the frame to scan
            </p>
          </>
        )}
      </div>
    </div>
  );
};
