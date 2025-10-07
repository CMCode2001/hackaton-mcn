import React, { useEffect, useRef, useState } from "react";
import QrScanner from "react-qr-scanner";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Zap, Sparkles, Camera } from "lucide-react";

interface QRCodeScannerProps {
  onScanSuccess: (oeuvreId: string) => void;
  onClose?: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess, onClose }) => {
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const [cameraFacingMode, setCameraFacingMode] = useState<"environment" | "user">("environment");
  const [flash, setFlash] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<any>(null);

  const handleScan = (result: any) => {
    if (!result?.text || isProcessing) return;
    try {
      const url = new URL(result.text);
      if (url.hostname === "hackaton-mcn-pi.vercel.app" && url.pathname.startsWith("/oeuvres/")) {
        const id = url.pathname.replace("/oeuvres/", "").replace(/^\/+|\/+$/g, "");
        if (id) {
          setIsProcessing(true);
          setFlash(true);
          setTimeout(() => {
            onScanSuccess(id);
          }, 1200);
        }
      } else {
        console.warn("QR Code externe ou invalide :", result.text);
      }
    } catch {
      console.warn("QR Code invalide :", result.text);
    }
  };

  const handleError = (err: any) => {
    console.error("Erreur scanner :", err);
    setPermission("denied");
  };

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacingMode } });
      setPermission("granted");
    } catch {
      setPermission("denied");
    }
  };

  const switchCamera = async () => {
    const newMode = cameraFacingMode === "environment" ? "user" : "environment";
    setCameraFacingMode(newMode);
    await requestPermission();
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-gradient-to-br from-[#0A0603] to-[#1a120b] border-2 border-[#D4AF37]/40 rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-[#D4AF37] to-[#E6C158] rounded-2xl shadow-lg">
                <QrCode className="w-8 h-8 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#D4AF37]">Scanner d'Œuvre</h2>
                <p className="text-[#C6B897] text-sm">Scannez le QR code pour découvrir l'œuvre</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={switchCamera}
                className="p-2 text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/10 rounded-xl transition-all duration-300 border border-[#D4AF37]/30"
                title={`Changer caméra`}
              >
                <Camera className="w-5 h-5" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/10 rounded-xl transition-all duration-300 border border-[#D4AF37]/30"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          <div className="relative w-80 h-80 mx-auto border-2 border-[#D4AF37]/60 rounded-2xl overflow-hidden shadow-lg shadow-[#D4AF37]/20">
            {permission === "granted" && (
              <QrScanner
                ref={scannerRef}
                delay={500}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            {permission === "unknown" && <p className="text-[#C6B897] text-center mt-4">Demande d'accès caméra...</p>}
            {permission === "denied" && <p className="text-red-500 text-center mt-4">Accès caméra refusé</p>}
          </div>

          <AnimatePresence>
            {flash && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/40 to-[#E6C158]/40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-black/80 rounded-2xl p-8 border-2 border-[#D4AF37] shadow-2xl text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Sparkles className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                  <p className="text-2xl font-bold text-[#D4AF37]">Œuvre trouvée !</p>
                  <p className="text-[#C6B897] mt-2">Redirection...</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRCodeScanner;
