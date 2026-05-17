'use client';

import { PortfolioData } from '@/lib/types';
import { generateHTML } from '@/lib/templates';
import { useEffect, useRef } from 'react';

interface Props {
  data: PortfolioData;
}

export default function Preview({ data }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const html = generateHTML(data);
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(html);
    doc.close();
  }, [data]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          Попередній перегляд
        </h3>
        <span className="text-xs text-gray-400">Оновлюється автоматично</span>
      </div>
      <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden shadow-inner bg-white">
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          style={{ minHeight: '600px' }}
          title="Portfolio Preview"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
