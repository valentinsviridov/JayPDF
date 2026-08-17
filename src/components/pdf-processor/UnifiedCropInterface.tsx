"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDictionary } from '../../i18n/LocaleProvider';
import { usePdfProcessorServices } from './services';

type CropMargins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type UnifiedCropInterfaceProps = {
  file: File;
  pageNumber: number;
  cropMargins: CropMargins;
  onCropChangeAction: (nextMargins: CropMargins) => void;
};

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Unit = 'pt' | 'in' | 'cm' | 'mm';

const UNIT_CONVERSIONS = {
  pt: 1,
  in: 72,
  cm: 28.3465,
  mm: 2.83465,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const almostZero = (value: number) => Math.abs(value) < 0.5;

const roundDecimals = (num: number, decimals: number) => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

export default function UnifiedCropInterface({
  file,
  pageNumber,
  cropMargins,
  onCropChangeAction,
}: UnifiedCropInterfaceProps) {
  const { documents } = usePdfProcessorServices();
  const dictionary = useDictionary();
  const cropStrings = dictionary.components.processingOptions.crop;
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dragRect, setDragRect] = useState<Rect | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [unit, setUnit] = useState<Unit>('pt');
  const [isClient, setIsClient] = useState(false);

  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Load preferred unit from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const savedUnit = localStorage.getItem('JAYPDF_CROP_UNIT') as Unit;
      if (savedUnit && ['px', 'mm', 'cm', 'in', 'pt', '%'].includes(savedUnit)) {
        setUnit(savedUnit);
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
    try {
      localStorage.setItem('JAYPDF_CROP_UNIT', newUnit);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    async function loadPreview() {
      setIsLoading(true);
      setError(null);

      try {
        const [thumbnail, dimensions] = await Promise.all([
          documents.renderThumbnail(file, pageNumber, 960),
          documents.getPageDimensions(file, pageNumber),
        ]);

        if (!isMounted) return;
        
        objectUrl = thumbnail;
        setPreviewUrl(thumbnail);
        setPageSize(dimensions);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading crop preview:', err);
        setError(err instanceof Error ? err.message : cropStrings.manual.error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadPreview();

    return () => {
      isMounted = false;
      if (objectUrl && objectUrl.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [documents, file, pageNumber, cropStrings.manual.error]);

  const displayRect = useMemo(() => {
    const host = surfaceRef.current;
    if (!host || !pageSize) return null;

    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width <= 0 || height <= 0) return null;

    const nextWidth = width - (cropMargins.left / pageSize.width) * width - (cropMargins.right / pageSize.width) * width;
    const nextHeight = height - (cropMargins.top / pageSize.height) * height - (cropMargins.bottom / pageSize.height) * height;

    if (almostZero(cropMargins.left) && almostZero(cropMargins.right) && almostZero(cropMargins.top) && almostZero(cropMargins.bottom)) {
      return null;
    }

    return {
      left: (cropMargins.left / pageSize.width) * width,
      top: (cropMargins.top / pageSize.height) * height,
      width: Math.max(0, nextWidth),
      height: Math.max(0, nextHeight),
    };
  }, [cropMargins, pageSize]);

  const getPoint = (clientX: number, clientY: number) => {
    const host = surfaceRef.current;
    if (!host) return null;
    const bounds = host.getBoundingClientRect();
    const x = clamp(clientX - bounds.left, 0, bounds.width);
    const y = clamp(clientY - bounds.top, 0, bounds.height);
    return { x, y, width: bounds.width, height: bounds.height };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const point = getPoint(event.clientX, event.clientY);
    if (!point) return;

    dragStartRef.current = { x: point.x, y: point.y };
    setDragRect({ left: point.x, top: point.y, width: 0, height: 0 });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    if (!start) return;

    const point = getPoint(event.clientX, event.clientY);
    if (!point) return;

    const left = Math.min(start.x, point.x);
    const top = Math.min(start.y, point.y);
    const width = Math.abs(point.x - start.x);
    const height = Math.abs(point.y - start.y);

    setDragRect({ left, top, width, height });
  };

  const commitDragRect = (rect: Rect | null) => {
    const host = surfaceRef.current;
    if (!rect || !host || !pageSize) return;

    const hostWidth = host.clientWidth;
    const hostHeight = host.clientHeight;
    if (hostWidth <= 0 || hostHeight <= 0) return;

    if (rect.width < 6 || rect.height < 6) return;

    const left = (rect.left / hostWidth) * pageSize.width;
    const top = (rect.top / hostHeight) * pageSize.height;
    const right = ((hostWidth - (rect.left + rect.width)) / hostWidth) * pageSize.width;
    const bottom = ((hostHeight - (rect.top + rect.height)) / hostHeight) * pageSize.height;

    onCropChangeAction({
      top: Math.max(0, Math.round(top)),
      right: Math.max(0, Math.round(right)),
      bottom: Math.max(0, Math.round(bottom)),
      left: Math.max(0, Math.round(left)),
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current) commitDragRect(dragRect);
    dragStartRef.current = null;
    setDragRect(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleReset = () => {
    onCropChangeAction({ top: 0, right: 0, bottom: 0, left: 0 });
  };

  // Unit conversion helpers for inputs
  const convertToUnit = (ptValue: number) => roundDecimals(ptValue / UNIT_CONVERSIONS[unit], unit === 'pt' ? 0 : 2);
  const convertToPt = (unitValue: number) => Math.round(unitValue * UNIT_CONVERSIONS[unit]);

  const handleMarginInputChange = (side: keyof CropMargins, valueString: string) => {
    const val = parseFloat(valueString);
    if (isNaN(val)) return;
    const ptVal = Math.max(0, convertToPt(val));
    onCropChangeAction({ ...cropMargins, [side]: ptVal });
  };

  const activeRect = dragRect ?? displayRect;

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className="rounded-xl border border-[var(--ui-2)] bg-[var(--bg-2)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ui-2)] pb-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--tx)]">{cropStrings.title || 'Crop PDF'}</h3>
          <p className="text-sm text-[var(--tx-3)]">{cropStrings.hint}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-[var(--ui-2)] bg-white p-1 shadow-sm">
            {(['pt', 'in', 'cm', 'mm'] as const).map(u => (
              <button
                key={u}
                type="button"
                onClick={() => handleUnitChange(u)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  unit === u 
                    ? 'bg-[var(--accent)] text-white shadow' 
                    : 'text-[var(--tx-2)] hover:bg-[var(--bg-1)]'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--tx-2)] transition-colors hover:bg-[var(--bg-1)] hover:text-[var(--accent)]"
            onClick={handleReset}
          >
            {cropStrings.manual.reset}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left Side: Preview Canvas */}
        <div className="flex-1 rounded-lg border border-[var(--ui-2)] bg-[var(--bg-1)] p-4 flex items-center justify-center min-h-[300px]">
          {isLoading ? (
            <div className="text-sm text-[var(--tx-3)] animate-pulse">{cropStrings.manual.loading}</div>
          ) : error || !previewUrl ? (
            <div className="text-sm text-red-500">{error ?? cropStrings.manual.error}</div>
          ) : (
            <div className="relative flex flex-col items-center">
              <div
                ref={surfaceRef}
                className="relative mx-auto touch-none select-none overflow-hidden rounded-md border border-[var(--ui-3)] bg-white shadow-md transition-shadow hover:shadow-lg cursor-crosshair"
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  aspectRatio: pageSize ? `${pageSize.width} / ${pageSize.height}` : '3 / 4'
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={cropStrings.manual.pagePreview(pageNumber)}
                  className="h-full w-full object-contain pointer-events-none"
                  draggable={false}
                />

                {activeRect ? (
                  <>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                    <div
                      className="absolute border-2 border-[var(--accent)] bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.1)]"
                      style={{
                        left: `${activeRect.left}px`,
                        top: `${activeRect.top}px`,
                        width: `${activeRect.width}px`,
                        height: `${activeRect.height}px`,
                      }}
                    >
                      {/* Drag Handles */}
                      <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-[var(--accent)] shadow-sm" />
                      <div className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-[var(--accent)] shadow-sm" />
                      <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full bg-[var(--accent)] shadow-sm" />
                      <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-[var(--accent)] shadow-sm" />
                    </div>
                  </>
                ) : null}
              </div>
              <p className="mt-3 text-xs font-medium text-[var(--tx-3)]">
                {cropStrings.manual.pagePreview(pageNumber)}
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Inputs */}
        <div className="w-full md:w-64 space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[var(--tx)]">{cropStrings.marginsTitle}</h4>
            <div className="grid grid-cols-2 gap-4">
              {(['top', 'right', 'bottom', 'left'] as const).map(side => (
                <div key={side} className="space-y-1">
                  <label className="block text-xs font-medium text-[var(--tx-2)] capitalize" htmlFor={`crop-${side}`}>
                    {cropStrings.marginLabels?.[side] || side} ({unit})
                  </label>
                  <input
                    id={`crop-${side}`}
                    type="number"
                    min={0}
                    step={unit === 'pt' ? 1 : 0.1}
                    value={convertToUnit(cropMargins[side]).toString()}
                    onChange={e => handleMarginInputChange(side, e.target.value)}
                    className="w-full rounded-lg border border-[var(--ui-2)] bg-white px-3 py-2 text-sm text-[var(--tx)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--tx-3)] bg-[var(--bg-1)] p-3 rounded-lg border border-[var(--ui-2)]">
              {cropStrings.manual.hint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
