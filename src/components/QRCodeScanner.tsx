import React, { useEffect, useRef, useState } from "react";
import QrScanner from "react-qr-scanner";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Sparkles, Camera } from "lucide-react";

interface QRCodeScannerProps {
  onScanSuccess: (oeuvreId: string) => void;
  onClose?: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScanSuccess,
  onClose,
}) => {
  const [permission, setPermission] = useState<
    "unknown" | "granted" | "denied"
  >("unknown");
  const [flash, setFlash] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<QrScanner>(null);

  const handleScan = (result: any) => {
    if (!result?.text || isProcessing) return;

    console.log("QR Code détecté:", result.text);

    try {
      let oeuvreId = "";

      // Méthode robuste pour extraire l'ID depuis l'URL
      if (result.text.includes("/oeuvres/")) {
        // Extraction depuis une URL complète
        const match = result.text.match(/\/oeuvres\/([^/?]+)/);
        if (match && match[1]) {
          oeuvreId = match[1];
        }
      } else {
        // Si c'est juste l'ID directement
        oeuvreId = result.text.trim();
      }

      // Nettoyer l'ID (supprimer les slashes en début/fin)
      oeuvreId = oeuvreId.replace(/^\/+|\/+$/g, "");

      if (oeuvreId) {
        console.log("ID d'œuvre extrait:", oeuvreId);
        setIsProcessing(true);
        setFlash(true);

        setTimeout(() => {
          onScanSuccess(oeuvreId);
          setIsProcessing(false);
          setTimeout(() => setFlash(false), 500);
        }, 1200);
      } else {
        console.warn("Aucun ID d'œuvre valide trouvé:", result.text);
      }
    } catch (error) {
      console.error("Erreur lors du traitement du QR code:", error);
    }
  };

  const handleError = (err: any) => {
    console.error("Erreur scanner :", err);
    if (err.name === "NotAllowedError") {
      setPermission("denied");
    }
  };

  const requestPermission = async () => {
    try {
      // Configuration optimisée pour la caméra arrière avec meilleur zoom
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          // Paramètres optimisés pour un meilleur zoom
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          aspectRatio: { ideal: 1.777777778 } // 16:9 pour un meilleur cadrage
        },
      });
      setPermission("granted");
      
      // Appliquer un zoom via CSS si possible
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        const track = videoTracks[0];
        const capabilities = track.getCapabilities();
        
        // Essayer d'appliquer un zoom si supporté
        if (capabilities.zoom) {
          const settings = track.getSettings();
          if (settings.zoom !== undefined) {
            // Ajuster le zoom pour un cadrage plus large
            await track.applyConstraints({
              advanced: [{ zoom: Math.min(capabilities.zoom.max || 1, 1.2) }]
            });
          }
        }
      }
    } catch (err: any) {
      console.error("Erreur permission caméra:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setPermission("denied");
      } else {
        setPermission("denied");
      }
    }
  };

  // Charger directement avec la caméra arrière
  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    return () => {
      setIsProcessing(false);
      setFlash(false);
    };
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
          className="relative bg-gradient-to-br from-[#0A0603] to-[#1a120b] border-2 border-[#D4AF37]/40 rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto shadow-2xl overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Effets d'arrière-plan */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          {/* En-tête */}
          <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-[#D4AF37] to-[#E6C158] rounded-xl sm:rounded-2xl shadow-lg">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-black" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#D4AF37]">
                  Scanner d'Œuvre
                </h2>
                <p className="text-[#C6B897] text-xs sm:text-sm">
                  Caméra arrière active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/10 rounded-lg sm:rounded-xl transition-all duration-300 border border-[#D4AF37]/30"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Zone de scan - Responsive */}
          <div className="relative w-full mx-auto border-2 border-[#D4AF37]/60 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg shadow-[#D4AF37]/20 bg-black">
            <div className="aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              {permission === "granted" && (
                <QrScanner
                  ref={scannerRef}
                  delay={100}
                  onError={handleError}
                  onScan={handleScan}
                  constraints={{
                    video: { 
                      facingMode: "environment",
                      width: { ideal: 1280 },
                      height: { ideal: 720 }
                    },
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scale(1.1)" // Légèrement zoomé pour mieux voir
                  }}
                />
              )}
              {permission === "unknown" && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto mb-2"></div>
                    <p className="text-[#C6B897] text-sm">Demande d'accès caméra...</p>
                  </div>
                </div>
              )}
              {permission === "denied" && (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center">
                    <p className="text-red-500 mb-3 text-sm sm:text-base">Accès caméra refusé</p>
                    <button
                      onClick={requestPermission}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#E6C158] transition-colors text-sm sm:text-base"
                    >
                      Réautoriser l'accès
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Cadre de guidage */}
            <div className="absolute inset-0 pointer-events-none border-8 border-transparent">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 border-2 border-[#D4AF37] rounded-lg shadow-lg"></div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-[#C6B897] text-xs sm:text-sm">
              Positionnez le QR code dans le cadre
            </p>
            <p className="text-[#D4AF37]/70 text-xs mt-1">
              La caméra s'ajuste automatiquement
            </p>
          </div>

          {/* Overlay de succès */}
          <AnimatePresence>
            {flash && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/40 to-[#E6C158]/40 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-black/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-[#D4AF37] shadow-2xl text-center mx-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-[#D4AF37] mx-auto mb-2 sm:mb-4" />
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#D4AF37]">
                    Œuvre trouvée !
                  </p>
                  <p className="text-[#C6B897] text-sm sm:text-base mt-1 sm:mt-2">Redirection...</p>
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