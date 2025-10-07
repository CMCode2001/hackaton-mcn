declare module 'react-qr-scanner' {
  import { ComponentType } from 'react';

  interface QrScannerProps {
    delay?: number;
    style?: React.CSSProperties;
    onError?: (err: any) => void;
    onScan?: (data: string | null) => void;
  }

  const QrScanner: ComponentType<QrScannerProps>;
  export default QrScanner;
}
