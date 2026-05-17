'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface Props {
  url: string;
  onClose: () => void;
}

export default function QRModal({ url, onClose }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: { dark: '#1e1b4b', light: '#ffffff' },
    }).then(setQrDataUrl);
  }, [url]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          zIndex: 9998,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          width: '320px',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#111',
          }}
        >
          QR-код портфоліо
        </h3>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
          Відскануйте щоб відкрити на телефоні
        </p>
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="QR Code"
            style={{
              margin: '0 auto 16px',
              borderRadius: '12px',
              display: 'block',
            }}
            width={256}
            height={256}
          />
        ) : (
          <div
            style={{
              width: 256,
              height: 256,
              margin: '0 auto 16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa',
              fontSize: '14px',
            }}
          >
            Генерація...
          </div>
        )}
        <p
          style={{
            fontSize: '11px',
            color: '#aaa',
            marginBottom: '16px',
            wordBreak: 'break-all',
          }}
        >
          {url}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = qrDataUrl;
              a.download = 'portfolio-qr.png';
              a.click();
            }}
            disabled={!qrDataUrl}
            style={{
              flex: 1,
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            ⬇ Скачати PNG
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              backgroundColor: 'white',
              color: '#555',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Закрити
          </button>
        </div>
      </div>
    </>
  );
}
