'use client';

import React from 'react';

export interface InsightfulProgressProps {
  percent: number;
  operationKey?: string;
  operationLabel?: string;
  stage?: string;
  detail?: string;
  current?: number;
  total?: number;
  elapsedSeconds?: number;
  fileCount?: number;
  activeFileName?: string;
  privacyGuaranteeText?: string;
}

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function InsightfulProgressIndicator({
  percent,
  operationKey,
  operationLabel,
  stage,
  detail,
  current,
  total,
  elapsedSeconds = 0,
  fileCount,
  activeFileName,
  privacyGuaranteeText = '100% Client-Side Processing • Your files stay on this device',
}: InsightfulProgressProps) {
  const boundedPercent = Math.min(100, Math.max(0, Math.round(percent)));

  // Derive step milestone based on percentage
  const isStep1Done = boundedPercent > 15;
  const isStep1Active = boundedPercent <= 15;
  const isStep2Done = boundedPercent > 85;
  const isStep2Active = boundedPercent > 15 && boundedPercent <= 85;
  const isStep3Active = boundedPercent > 85;
  const isStep3Done = boundedPercent >= 100;

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-[var(--bg)] rounded-2xl shadow-sm border border-[var(--ui-2)] space-y-6">
      {/* Top Bar: Operation Title & Percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <svg
              className="w-5 h-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[var(--tx)]">
              {operationLabel || (operationKey ? `${operationKey.charAt(0).toUpperCase() + operationKey.slice(1)}ing PDF...` : 'Processing PDF...')}
            </h3>
            {activeFileName ? (
              <p className="text-xs text-[var(--tx-3)] truncate max-w-[240px] sm:max-w-xs" title={activeFileName}>
                {activeFileName}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-baseline gap-1 text-right">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--accent)]">
            {boundedPercent}%
          </span>
        </div>
      </div>

      {/* Progress Bar with smooth animation and shimmer */}
      <div className="space-y-2">
        <div
          role="progressbar"
          aria-valuenow={boundedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={detail || 'Processing progress'}
          className="relative w-full h-3.5 bg-[var(--ui-2)] rounded-full overflow-hidden shadow-inner"
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${boundedPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Live Detail and Elapsed Timer */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-[var(--tx-2)] pt-1">
          <span className="font-medium text-[var(--tx)] truncate max-w-[70%]">
            {detail || 'Processing...'}
          </span>
          <span className="font-mono text-[var(--tx-3)] whitespace-nowrap">
            ⏱️ {formatElapsed(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Insightful Details & Counter Badge */}
      {current !== undefined && total !== undefined && total > 0 ? (
        <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
          <div className="flex flex-col p-2.5 rounded-lg bg-[var(--ui)] border border-[var(--ui-2)]">
            <span className="text-[var(--tx-3)] font-medium">Completed</span>
            <span className="text-sm font-semibold text-[var(--tx)]">
              {current} of {total}
            </span>
          </div>
          <div className="flex flex-col p-2.5 rounded-lg bg-[var(--ui)] border border-[var(--ui-2)]">
            <span className="text-[var(--tx-3)] font-medium">Remaining</span>
            <span className="text-sm font-semibold text-[var(--tx)]">
              {Math.max(0, total - current)} items
            </span>
          </div>
        </div>
      ) : fileCount && fileCount > 1 ? (
        <div className="p-2.5 rounded-lg bg-[var(--ui)] border border-[var(--ui-2)] text-xs flex justify-between items-center">
          <span className="text-[var(--tx-3)] font-medium">Batch processing</span>
          <span className="font-semibold text-[var(--tx)]">{fileCount} files total</span>
        </div>
      ) : null}

      {/* Step Milestones Checklist */}
      <div className="pt-2 border-t border-[var(--ui-2)]">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div
            className={`flex flex-col items-center gap-1 transition-colors ${
              isStep1Done ? 'text-green-600 font-semibold' : isStep1Active ? 'text-[var(--accent)] font-medium' : 'text-[var(--tx-3)]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                isStep1Done
                  ? 'bg-green-100 text-green-700 font-bold'
                  : isStep1Active
                  ? 'bg-[var(--accent)]/20 text-[var(--accent)] font-bold animate-pulse'
                  : 'bg-[var(--ui-2)] text-[var(--tx-3)]'
              }`}
            >
              {isStep1Done ? '✓' : '1'}
            </div>
            <span className="truncate">1. Read & Validate</span>
          </div>

          <div
            className={`flex flex-col items-center gap-1 transition-colors ${
              isStep2Done ? 'text-green-600 font-semibold' : isStep2Active ? 'text-[var(--accent)] font-medium' : 'text-[var(--tx-3)]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                isStep2Done
                  ? 'bg-green-100 text-green-700 font-bold'
                  : isStep2Active
                  ? 'bg-[var(--accent)]/20 text-[var(--accent)] font-bold animate-pulse'
                  : 'bg-[var(--ui-2)] text-[var(--tx-3)]'
              }`}
            >
              {isStep2Done ? '✓' : '2'}
            </div>
            <span className="truncate">2. Process Pages</span>
          </div>

          <div
            className={`flex flex-col items-center gap-1 transition-colors ${
              isStep3Done ? 'text-green-600 font-semibold' : isStep3Active ? 'text-[var(--accent)] font-medium' : 'text-[var(--tx-3)]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                isStep3Done
                  ? 'bg-green-100 text-green-700 font-bold'
                  : isStep3Active
                  ? 'bg-[var(--accent)]/20 text-[var(--accent)] font-bold animate-pulse'
                  : 'bg-[var(--ui-2)] text-[var(--tx-3)]'
              }`}
            >
              {isStep3Done ? '✓' : '3'}
            </div>
            <span className="truncate">3. Finalize Output</span>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Footer */}
      <div className="flex items-center justify-center gap-2 pt-1 text-center text-xs text-[var(--tx-3)]">
        <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>{privacyGuaranteeText}</span>
      </div>
    </div>
  );
}
