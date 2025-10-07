// src/pages/ScanPage.tsx
import { useEffect } from "react";
import QRCodeScanner from "@/components/QRCodeScanner";
import { useNavigate } from "react-router-dom";

export function ScanPage() {
  const navigate = useNavigate();

  // Bloquer le scroll pendant le scan
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleScanSuccess = (data: string) => {
    if (!data) return;

    console.log("QR Code scanné:", data);

    try {
      // Si le QR code contient "/oeuvres/"
      if (data.includes("/oeuvres/")) {
        const parts = data.split("/oeuvres/");
        const oeuvreId = parts[1] || "";
        if (oeuvreId) navigate(`/oeuvres/${oeuvreId}`);
        else navigate("/oeuvres");
      } else {
        // Si c'est juste un ID
        navigate(`/oeuvres/${data}`);
      }
    } catch (err) {
      console.error("Erreur lors de la redirection du QR code:", err);
      navigate("/");
    }
  };

  const handleClose = () => {
    navigate("/"); // Retour galerie
  };

  return <QRCodeScanner onScanSuccess={handleScanSuccess} onClose={handleClose} />;
}
