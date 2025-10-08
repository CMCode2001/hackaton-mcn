import QRCodeScanner from "@/components/QRCodeScanner";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ScanPage() {
  const navigate = useNavigate();

  const handleScanSuccess = (oeuvreId: string) => {
    console.log("Œuvre scannée :", oeuvreId);
    navigate(`/oeuvres/${oeuvreId}`);
  };

  const handleClose = () => {
    navigate(-1); // Retour à la page précédente
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black/90 text-white">
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-6">Scanner d'Œuvre</h1>
      <QRCodeScanner onScanSuccess={handleScanSuccess} onClose={handleClose} />
    </div>
  );
}
