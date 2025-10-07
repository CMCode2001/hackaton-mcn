import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Camera, X, Keyboard } from 'lucide-react';

interface QRCodeScannerProps {
  onDetected?: (qrCodeRef: string) => void;
  onClose?: () => void;
}

export function QRCodeScanner({ onDetected, onClose }: QRCodeScannerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [manualEntry, setManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const readerRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    if (manualEntry) return;

    const startScanner = async () => {
      try {
        const codeReader = new BrowserQRCodeReader();
        readerRef.current = codeReader;

        const videoInputDevices = await codeReader.listVideoInputDevices();

        if (videoInputDevices.length === 0) {
          setError(t('scanner.error'));
          return;
        }

        const selectedDevice = videoInputDevices[0].deviceId;

        if (videoRef.current) {
          codeReader.decodeFromVideoDevice(
            selectedDevice,
            videoRef.current,
            (result, err) => {
              if (result) {
                const qrCode = result.getText();
                if (onDetected) {
                  onDetected(qrCode);
                } else {
                  navigate(`/oeuvres/qr/${qrCode}`);
                }
              }
              if (err && !(err.name === 'NotFoundException')) {
                console.error('QR Scanner Error:', err);
              }
            }
          );
        }
      } catch (err) {
        console.error('Scanner initialization error:', err);
        if (err instanceof Error && err.name === 'NotAllowedError') {
          setError(t('scanner.permissionDenied'));
        } else {
          setError(t('scanner.error'));
        }
      }
    };

    startScanner();

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, [manualEntry, navigate, onDetected, t]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      if (onDetected) {
        onDetected(manualCode.trim());
      } else {
        navigate(`/oeuvres/qr/${manualCode.trim()}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-900">
        <h2 className="text-white text-xl font-semibold flex items-center gap-2">
          <Camera className="w-6 h-6" />
          {t('scanner.title')}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Close scanner"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-red-900/50 text-white p-6 rounded-lg max-w-md text-center">
            <p className="mb-4">{error}</p>
            <button
              onClick={() => setManualEntry(true)}
              className="bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t('scanner.manualEntry')}
            </button>
          </div>
        </div>
      ) : manualEntry ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <form
            onSubmit={handleManualSubmit}
            className="bg-gray-800 p-6 rounded-lg w-full max-w-md"
          >
            <label className="block text-white mb-2 font-medium">
              {t('scanner.enterCode')}
            </label>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="QR-001"
              autoFocus
            />
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('scanner.submit')}
            </button>
            <button
              type="button"
              onClick={() => setManualEntry(false)}
              className="w-full mt-2 text-gray-300 hover:text-white transition-colors"
            >
              {t('scanner.title')}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="flex-1 relative overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-white rounded-lg shadow-lg"></div>
            </div>
          </div>
          <div className="bg-gray-900 p-4 text-center">
            <p className="text-white mb-3">{t('scanner.instructions')}</p>
            <button
              onClick={() => setManualEntry(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <Keyboard className="w-5 h-5" />
              {t('scanner.manualEntry')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
