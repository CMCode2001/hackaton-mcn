import { useNavigate } from 'react-router-dom';
import { QRCodeScanner } from '../components/QRCodeScanner';

export function ScanPage() {
  const navigate = useNavigate();

  return (
    <QRCodeScanner
      onClose={() => navigate(-1)}
    />
  );
}
