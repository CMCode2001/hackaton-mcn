import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QRCodeScanner from "@/components/QRCodeScanner";

export default function ScanPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleScanSuccess = (data: string) => {
    console.log("QR Code scanné:", data);

    if (data.includes("/oeuvres/")) {
      const parts = data.split("/oeuvres/");
      if (parts.length > 1) {
        navigate(`/oeuvres/${parts[1]}`);
        return;
      }
    }
    // Si c'est juste l'ID
    navigate(`/oeuvres/${data}`);
  };

  const handleClose = () => {
    navigate("/");
  };

  return <QRCodeScanner onScanSuccess={handleScanSuccess} onClose={handleClose} />;
}
