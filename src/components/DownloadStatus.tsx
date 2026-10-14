'use client';

import { useEffect, useState } from 'react';
import { DOWNLOAD_STATUS_EVENT } from '../modules/pdf/download-service';

export default function DownloadStatus() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const listener = (event: Event) => setMessage((event as CustomEvent<string>).detail);
    window.addEventListener(DOWNLOAD_STATUS_EVENT, listener);
    return () => window.removeEventListener(DOWNLOAD_STATUS_EVENT, listener);
  }, []);
  if (!message) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] mx-auto flex max-w-lg items-center gap-4 rounded-xl border border-[var(--ui)] bg-[var(--bg)] p-4 text-sm text-[var(--tx)] shadow-lg">
      <p role="status" className="flex-1">{message}</p>
      <button onClick={() => setMessage('')} aria-label="Dismiss save notification" className="p-2">×</button>
    </div>
  );
}
