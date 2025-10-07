import React, { useEffect, useRef, useState } from "react";
import QrScanner from "react-qr-scanner";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ScanLine,
  QrCode,
  Loader2,
  CameraOff,
  Zap,
  Sparkles
} from "lucide-react";

interface QRCodeScannerProps {
  onScanSuccess: (data: string) => void;
  onClose?: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScanSuccess,
  onClose,
}) => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [permission, setPermission] = useState<
    "unknown" | "granted" | "denied"
  >("unknown");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const handleScan = (result: any) => {
    if (!result?.text && typeof result === "string") result = { text: result };
    if (result?.text && result.text !== lastScanned && !isProcessing) {
      const scannedData = result.text;
      setLastScanned(scannedData);
      setIsProcessing(true);
      setScanning(false);
      setFlash(true);

      setTimeout(() => {
        onScanSuccess(scannedData);
      }, 1200);
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scanner Error:", err);
    const errorMsg =
      err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError"
        ? "Accès à la caméra refusé. Autorisez l'accès pour scanner les QR codes des œuvres."
        : err?.message?.includes("NotFoundError") ||
          err?.name === "NotFoundError"
        ? "Aucune caméra arrière trouvée. Utilisez un appareil avec caméra."
        : "Erreur d'accès à la caméra. Vérifiez les permissions et réessayez.";

    setError(errorMsg);
    setPermission("denied");
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const requestPermission = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Votre navigateur ne supporte pas l'accès à la caméra.");
      setPermission("denied");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setPermission("granted");
      stopStream();
    } catch (err: any) {
      handleError(err);
    }
  };

  const handleRetry = () => {
    setError(null);
    setPermission("unknown");
    setLastScanned(null);
    setScanning(true);
    setIsProcessing(false);
    requestPermission();
  };

  const handleManualClose = () => {
    stopStream();
    if (onClose) onClose();
  };

  useEffect(() => {
    requestPermission();
    return () => stopStream();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Fenêtre principale */}
        <motion.div
          className="relative bg-gradient-to-br from-[#0A0603] to-[#1a120b] border-2 border-[#D4AF37]/40 rounded-3xl p-8 w-full max-w-2xl shadow-2xl shadow-[#D4AF37]/20 overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Effet doré */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 bg-gradient-to-br from-[#D4AF37] to-[#E6C158] rounded-2xl shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <QrCode className="w-8 h-8 text-black" />
              </motion.div>
              <div>
                <motion.h2
                  className="text-2xl font-bold text-[#D4AF37]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Scanner d'Œuvre
                </motion.h2>
                <motion.p
                  className="text-[#C6B897] text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Scannez le QR code d'une œuvre pour découvrir ses secrets
                </motion.p>
              </div>
            </div>

            {onClose && (
              <motion.button
                onClick={handleManualClose}
                className="p-2 text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/10 rounded-xl transition-all duration-300 border border-[#D4AF37]/30"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            )}
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Zone de scan */}
            <div className="relative w-80 h-80">
              <div className="absolute inset-4 border-2 border-[#D4AF37]/60 rounded-2xl overflow-hidden shadow-lg shadow-[#D4AF37]/20">
                {permission === "granted" ? (
                  <QrScanner
                    delay={500}
                    onError={handleError}
                    onScan={handleScan}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    facingMode="environment"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-[#C6B897] p-6">
                    {permission === "unknown" ? (
                      <>
                        <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mb-4" />
                        <p className="text-center text-sm mb-4">
                          Initialisation du scanner...
                        </p>
                        <button
                          onClick={requestPermission}
                          className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#E6C158] transition-colors shadow-lg"
                        >
                          Autoriser la Caméra
                        </button>
                      </>
                    ) : (
                      <>
                        <CameraOff className="w-12 h-12 text-red-400 mb-4" />
                        <p className="text-center text-sm mb-4">
                          {error || "Accès caméra non autorisé"}
                        </p>
                        <button
                          onClick={handleRetry}
                          className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#E6C158] transition-colors shadow-lg"
                        >
                          Réessayer
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Laser */}
              {permission === "granted" && scanning && (
                <motion.div
                  className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_20px_#D4AF37] rounded-full"
                  animate={{ y: ["10%", "90%", "10%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>

            {/* État */}
            <div className="text-center space-y-4">
              {scanning && permission === "granted" && (
                <motion.div
                  className="flex items-center justify-center gap-3 text-[#C6B897]"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ScanLine className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-medium">Recherche de QR code...</span>
                </motion.div>
              )}

              {isProcessing && (
                <motion.div
                  className="flex items-center justify-center gap-3 text-[#D4AF37] font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Zap className="w-5 h-5" />
                  <span>Œuvre détectée ! Redirection...</span>
                </motion.div>
              )}
            </div>

            {/* Flash succès */}
            <AnimatePresence>
              {flash && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/40 to-[#E6C158]/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-black/80 rounded-2xl p-8 border-2 border-[#D4AF37] shadow-2xl">
                      <Sparkles className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                      <p className="text-2xl font-bold text-[#D4AF37] text-center">
                        Œuvre Trouvée !
                      </p>
                      <p className="text-[#C6B897] text-center mt-2">
                        Redirection vers la fiche détaillée...
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRCodeScanner;
