// src/pages/ScanPage.tsx
import { useEffect } from 'react';
import QRCodeScanner from '@/components/QRCodeScanner';
import { useNavigate } from 'react-router-dom';

export function ScanPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleScanSuccess = (data: string) => {
    console.log('QR Code scanné:', data);
    
    // Si le QR code contient une URL comme "http://localhost:5173/oeuvres/origines-africaines"
    if (data.includes('/oeuvres/')) {
      // On extrait juste "origines-africaines"
      const parts = data.split('/oeuvres/');
      if (parts.length > 1) {
        const oeuvreId = parts[1];
        navigate(`/oeuvres/${oeuvreId}`);
      }
    } else {
      // Si c'est juste l'ID directement
      navigate(`/oeuvres/${data}`);
    }
  };

  const handleClose = () => {
    navigate('/oeuvres'); // Retour à la galerie
  };

  return (
    <QRCodeScanner 
      onScanSuccess={handleScanSuccess}
      onClose={handleClose}
    />
  );
}