'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useWorkspace } from './controller/use-workspace';
import FileUploader from './FileUploader';
import FileList from './FileList';
import { PDF_FEATURES, PDF_FEATURE_KEYS } from '../../modules/pdf';
import { PdfOperationKey } from '../../modules/pdf';
import { usePdfProcessorServices } from './services';
import { ExtractWorkspace } from './features/ExtractWorkspace';
import { RotateWorkspace } from './features/RotateWorkspace';
import { CropWorkspace } from './features/CropWorkspace';
import { ReorderWorkspace } from './features/ReorderWorkspace';
import { useDictionary } from '../../i18n/LocaleProvider';
import ProcessingOptions from './ProcessingOptions';
import CompressionPreviewCard, { PreviewStatus } from './CompressionPreviewCard';
import { InsightfulProgressIndicator } from './InsightfulProgressIndicator';
import type { PdfProgressUpdate } from '../../modules/pdf/core/contracts';
import { resolveGeneratedFilename } from '../../lib/filename';
import { PwaInstallPrompt } from '../pwa/PwaInstallPrompt';
import {
  Layers,
  Minimize2,
  Scissors,
  FileOutput,
  Crop,
  RotateCw,
  ArrowUpDown,
  Wrench,
  FileImage,
  Images,
  Trash2,
  Download,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const OPERATION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  merge: Layers,
  compress: Minimize2,
  split: Scissors,
  extract: FileOutput,
  crop: Crop,
  rotate: RotateCw,
  reorder: ArrowUpDown,
  repair: Wrench,
  pdfToImages: FileImage,
  imagesToPdf: Images,
};

interface WorkspaceShellProps {
  initialMode?: PdfOperationKey;
}

export default function WorkspaceShell({ initialMode }: WorkspaceShellProps) {
  const { 
    state, 
    addFiles, 
    removeFile, 
    clearFiles, 
    selectOperation, 
    updateOptions,
    dispatch 
  } = useWorkspace(initialMode);
  
  const processorService = usePdfProcessorServices();
  const dictionary = useDictionary();
  const processorStrings = dictionary.components.pdfProcessor;

  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>('idle');
  const [previewResult, setPreviewResult] = useState<any>(null);
  const [previewErrorMessage, setPreviewErrorMessage] = useState<string | undefined>(undefined);
  const [previewRetryCount, setPreviewRetryCount] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [progressState, setProgressState] = useState<{
    percent: number;
    stage?: string;
    detail?: string;
    current?: number;
    total?: number;
    elapsedSeconds: number;
    activeFileName?: string;
  }>({
    percent: 0,
    elapsedSeconds: 0,
  });

  const files = useMemo(
    () => state.sessionIds.map(id => state.sessions[id]?.originalFile).filter(Boolean),
    [state.sessionIds, state.sessions],
  );

  const activeFile = files[0] || null;
  const activeFileSignature = activeFile
    ? `${activeFile.name}-${activeFile.size}-${activeFile.lastModified}`
    : '';
  const optionsSignature = useMemo(() => JSON.stringify(state.options), [state.options]);

  const activeFileRef = useRef(activeFile);
  activeFileRef.current = activeFile;
  const optionsRef = useRef(state.options);
  optionsRef.current = state.options;

  useEffect(() => {
    if (state.activeKey !== 'compress' || !activeFileSignature) {
      setPreviewStatus('idle');
      setPreviewResult(null);
      setPreviewErrorMessage(undefined);
      return;
    }

    let isCancelled = false;
    setPreviewStatus('running');
    setPreviewErrorMessage(undefined);

    const timer = setTimeout(async () => {
      const fileToRun = activeFileRef.current;
      const optionsToRun = optionsRef.current;
      if (!fileToRun) return;

      try {
        const res = await processorService.processor.execute(
          'compress',
          [fileToRun],
          optionsToRun as any,
        );
        if (!isCancelled) {
          setPreviewResult(res);
          setPreviewStatus('ready');
          setPreviewErrorMessage(undefined);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setPreviewStatus('error');
          setPreviewErrorMessage(err?.message || 'Failed to calculate compression preview');
        }
      }
    }, 250); // debounce

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [
    state.activeKey,
    activeFileSignature,
    optionsSignature,
    previewRetryCount,
    processorService.processor,
  ]);

  const handleRetryPreview = () => {
    setPreviewRetryCount(count => count + 1);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const uploaderConfig = useMemo(() => {
    switch (state.activeKey) {
      case 'extract':
      case 'crop':
      case 'rotate':
      case 'reorder':
      case 'split':
      case 'pdfToImages':
        return { multiple: false, acceptImages: false };
      case 'imagesToPdf':
        return { multiple: true, acceptImages: true };
      default:
        // compress and merge
        return { multiple: true, acceptImages: false };
    }
  }, [state.activeKey]);

  const resolveDownloadName = (operation: string, originalName?: string, index?: number) => {
    const modeNames: Record<string, string> = (processorStrings as any).downloadNames || {};
    return resolveGeneratedFilename({
      operation,
      originalName,
      index,
      modeNames,
      bundleAsZip: Boolean((state.options as any).bundleAsZip),
    });
  };

  const handleStartProcessing = async (forceAutoRepair?: boolean) => {
    if (!state.activeKey || state.sessionIds.length === 0) return;
    
    dispatch({ type: 'START_PROCESSING' });
    setProgressState({
      percent: 0,
      elapsedSeconds: 0,
      stage: 'starting',
      detail: 'Initializing processing...',
      activeFileName: state.sessions[state.sessionIds[0]]?.originalFile.name,
    });

    const startTime = Date.now();
    const interval = setInterval(() => {
      setProgressState(prev => ({
        ...prev,
        elapsedSeconds: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);
    
    try {
      const activeFiles = state.sessionIds.map(id => state.sessions[id].originalFile);
      
      const pageOrder = state.activeKey === 'reorder' && state.sessionIds.length > 0
        ? state.sessions[state.sessionIds[0]].pageOrder
        : undefined;

      const mappedOptions: any = {
        ...state.options,
        pageOrder,
        ...(forceAutoRepair ? { autoRepairCorrupted: true } : {}),
      };
      
      const selectedPages: number[] = [];
      Object.values(extractSelectionsByFile).forEach(fileSelections => {
        Object.keys(fileSelections).forEach(pageNum => {
          if (fileSelections[Number(pageNum)]) {
            selectedPages.push(Number(pageNum));
          }
        });
      });

      if (state.activeKey === 'extract') mappedOptions.pagesToExtract = selectedPages;
      if (state.activeKey === 'rotate') mappedOptions.pagesToRotate = selectedPages;
      if (state.activeKey === 'crop') mappedOptions.pagesToCrop = selectedPages;
      if (state.activeKey === 'split') mappedOptions.pagesToSplit = selectedPages;

      let result: any;
      
      if (state.activeKey === 'compress') {
        const results = [];
        for (let i = 0; i < activeFiles.length; i += 1) {
          const file = activeFiles[i];
          const res = await processorService.processor.execute(
            'compress',
            [file],
            mappedOptions,
            (prog: PdfProgressUpdate) => {
              const filePercent = (prog.percent ?? 0) / 100;
              const overallPercent = Math.round(((i + filePercent) / activeFiles.length) * 100);
              setProgressState(prev => ({
                ...prev,
                percent: overallPercent,
                stage: prog.stage,
                detail: activeFiles.length > 1
                  ? `File ${i + 1}/${activeFiles.length} (${file.name}): ${prog.detail || ''}`
                  : prog.detail,
                current: prog.current ?? i + 1,
                total: prog.total ?? activeFiles.length,
                activeFileName: file.name,
              }));
            },
          );
          (res as any).name = file.name;
          results.push(res);
        }
        result = results;
      } else if (state.activeKey === 'repair') {
        const results = [];
        for (let i = 0; i < activeFiles.length; i += 1) {
          const file = activeFiles[i];
          const res = await processorService.processor.execute(
            'repair',
            [file],
            mappedOptions,
            (prog: PdfProgressUpdate) => {
              const filePercent = (prog.percent ?? 0) / 100;
              const overallPercent = Math.round(((i + filePercent) / activeFiles.length) * 100);
              setProgressState(prev => ({
                ...prev,
                percent: overallPercent,
                stage: prog.stage,
                detail: activeFiles.length > 1
                  ? `File ${i + 1}/${activeFiles.length} (${file.name}): ${prog.detail || ''}`
                  : prog.detail,
                current: prog.current,
                total: prog.total,
                activeFileName: file.name,
              }));
            },
          );
          results.push({ blob: res, name: file.name });
        }
        result = results.length === 1 ? results[0] : results;
      } else {
        result = await processorService.processor.execute(
          state.activeKey,
          activeFiles,
          mappedOptions,
          (prog: PdfProgressUpdate) => {
            setProgressState(prev => ({
              ...prev,
              percent: prog.percent,
              stage: prog.stage,
              detail: prog.detail,
              current: prog.current,
              total: prog.total,
              activeFileName: activeFiles[0]?.name,
            }));
          },
        );
      }
      
      if (result) {
        setProgressState(prev => ({ ...prev, percent: 100, stage: 'complete', detail: 'Finalized' }));
        const getBlob = (r: any) => {
          if (r instanceof Blob) return r;
          if (r instanceof Uint8Array) return new Blob([r as any], { type: 'application/pdf' });
          if (r?.blob instanceof Blob) return r.blob;
          if (r?.blob instanceof Uint8Array) return new Blob([r.blob as any], { type: 'application/pdf' });
          if (r?.data instanceof Uint8Array) return new Blob([r.data as any], { type: 'application/pdf' });
          if (r?.data instanceof Blob) return r.data;
          return r?.blob || r;
        };

        let resultsArray: any[] = [];
        if (Array.isArray(result)) {
          resultsArray = result.map((r, i) => ({
            blob: getBlob(r),
            filename: resolveDownloadName(state.activeKey!, (r as any).name || activeFiles[0]?.name, Array.isArray(result) && result.length > 1 ? i : undefined),
          }));
        } else {
          resultsArray = [{
            blob: getBlob(result),
            filename: (result as any).name || resolveDownloadName(state.activeKey!, activeFiles[0]?.name),
          }];
        }

        dispatch({ 
          type: 'PROCESSING_COMPLETE', 
          results: resultsArray.map(r => ({ fileId: state.sessionIds[0], blob: r.blob, filename: r.filename })) 
        });
        
        // Auto-download for all operations
        resultsArray.forEach(r => {
          if (r.blob) {
            const url = URL.createObjectURL(r.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = r.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      } else {
        dispatch({ type: 'PROCESSING_FAILED', error: 'Processing returned no result.' });
      }
    } catch (err: any) {
      dispatch({ type: 'PROCESSING_FAILED', error: err.message || 'Processing failed' });
    } finally {
      clearInterval(interval);
    }
  };

  const currentFile = files[currentFileIndex] || null;
  
  const buildFileSignature = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;
  const currentFileKey = currentFile ? buildFileSignature(currentFile) : '';

  const extractSelectionsByFile = useMemo(() => {
    const map: Record<string, Record<number, boolean>> = {};
    state.sessionIds.forEach(id => {
      const file = state.sessions[id].originalFile;
      const key = buildFileSignature(file);
      const selectedPages = state.sessions[id].selectedPages || [];
      const selMap: Record<number, boolean> = {};
      selectedPages.forEach(p => selMap[p] = true);
      if (selectedPages.length > 0) map[key] = selMap;
    });
    return map;
  }, [state.sessions, state.sessionIds]);

  const selectedPages = currentFileKey ? (extractSelectionsByFile[currentFileKey] || {}) : {};

  const handlePageSelection = (file: File, pageNumber: number, selected: boolean) => {
    const fileIndex = files.findIndex(f => f === file);
    if (fileIndex === -1) return;
    const id = state.sessionIds[fileIndex];
    const session = state.sessions[id];
    const currentSelection = session.selectedPages || [];
    let nextSelection = [...currentSelection];
    if (selected) {
      if (!nextSelection.includes(pageNumber)) nextSelection.push(pageNumber);
    } else {
      nextSelection = nextSelection.filter(p => p !== pageNumber);
    }
    dispatch({ type: 'UPDATE_FILE_STATE', id, payload: { selectedPages: nextSelection } });
  };

  const reorderOrdersByFile = useMemo(() => {
    const map: Record<string, number[]> = {};
    state.sessionIds.forEach(id => {
      const file = state.sessions[id].originalFile;
      const key = buildFileSignature(file);
      const order = state.sessions[id].pageOrder || [];
      if (order.length > 0) map[key] = order;
    });
    return map;
  }, [state.sessions, state.sessionIds]);
  
  const pageOrder = currentFileKey ? (reorderOrdersByFile[currentFileKey] || []) : [];

  const handleOrderChange = (file: File, newOrder: number[]) => {
    const fileIndex = files.findIndex(f => f === file);
    if (fileIndex === -1) return;
    const id = state.sessionIds[fileIndex];
    dispatch({ type: 'UPDATE_FILE_STATE', id, payload: { pageOrder: newOrder } });
  };

  const handleFileChange = (index: number) => {
    setCurrentFileIndex(index);
  };

  const hasExtractSelection = Object.values(extractSelectionsByFile).some(fileSelection =>
    Object.values(fileSelection).some(isSelected => isSelected)
  );

  const setProcessingOptions = (updater: any) => {
    const nextOptions = typeof updater === 'function' ? updater(state.options) : updater;
    updateOptions(nextOptions);
  };

  const autoRepairStrings = dictionary.components.processingOptions.autoRepair;

  const isCorruptionError = Boolean(
    state.globalError && (
      state.globalError.includes('corrupted or malformed') ||
      state.globalError.includes('CORRUPT_PDF') ||
      state.globalError.includes('repair the file before using it')
    )
  );
  useMemo(() => {
    if (!state.globalError) return state.sessions[state.sessionIds[0]]?.originalFile.name || '';
    const match = state.globalError.match(/\(file:\s*"([^"]+)"\)/);
    return match ? match[1] : (state.sessions[state.sessionIds[0]]?.originalFile.name || '');
  }, [state.globalError, state.sessions, state.sessionIds]);
  const handleRelaunchWithAutoRepair = () => {
    setProcessingOptions((prev: any) => ({ ...prev, autoRepairCorrupted: true }));
    handleStartProcessing(true);
  };

  const resolveIdleButtonLabel = () => {
    const processButton = processorStrings.processButton;
    
    let totalSelections = 0;
    Object.values(extractSelectionsByFile).forEach(sel => {
      totalSelections += Object.keys(sel).length;
    });

    if (state.activeKey === 'extract') return (processButton as any).extract(totalSelections);
    if (state.activeKey === 'crop') return (processButton as any).crop(totalSelections);
    if (state.activeKey === 'rotate') return (processButton as any).rotate(totalSelections);
    if (state.activeKey === 'reorder') return (processButton as any).reorder;

    if (state.activeKey === 'pdfToImages' && (processButton as any).pdfToImages) {
      return files.length <= 1
        ? (processButton as any).pdfToImages.single
        : (processButton as any).pdfToImages.multiple(files.length);
    }
    if (state.activeKey === 'imagesToPdf' && (processButton as any).imagesToPdf) {
      return files.length <= 1
        ? (processButton as any).imagesToPdf.single
        : (processButton as any).imagesToPdf.multiple(files.length);
    }

    return files.length === 1
      ? processButton.idleSingle
      : processButton.idleMultiple(files.length);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col space-y-6" id="pdf-processor">
      {(state.phase === 'EMPTY' || state.phase === 'READY') && (
        <div className="mb-6 bg-white/90 p-5 rounded-2xl border border-[var(--ui-2)] shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-base font-bold text-[var(--tx)]">{processorStrings.title}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {PDF_FEATURE_KEYS.map(modeKey => {
              const tabStrings = (dictionary.components.pdfProcessor.modes as any)[modeKey];
              const label = tabStrings?.label ?? modeKey;
              const isActive = state.activeKey === modeKey;
              const IconComponent = OPERATION_ICONS[modeKey] || Sparkles;
              return (
                <button
                  key={modeKey}
                  type="button"
                  className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent)] text-white shadow-sm ring-2 ring-[var(--accent)]/20 font-semibold scale-[1.01]'
                      : 'bg-[var(--bg-2)] border border-[var(--ui-2)] text-[var(--tx-2)] hover:bg-[var(--ui)] hover:text-[var(--tx)] hover:border-[var(--ui-3)]'
                  }`}
                  onClick={() => selectOperation(modeKey)}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[var(--accent)]'}`} />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(state.phase === 'EMPTY' || state.phase === 'READY' || state.phase === 'EDITING' || state.phase === 'ANALYZING') && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{processorStrings.upload.title}</h2>
            {files.length > 0 && (
              <button
                className="inline-flex items-center gap-1.5 text-sm text-[var(--tx-3)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                onClick={clearFiles}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{processorStrings.upload.clearAll}</span>
              </button>
            )}
          </div>
          <FileUploader 
            onFilesSelectedAction={addFiles}
            multiple={uploaderConfig.multiple}
            acceptImages={uploaderConfig.acceptImages}
          />
        </div>
      )}

      {(state.phase === 'READY' || state.phase === 'EDITING' || state.phase === 'ANALYZING') && files.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--ui-2)] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {(processorStrings.upload.listHeadings as any)[state.activeKey || 'default'] || processorStrings.upload.listHeadings.default}
            </h3>
            <button 
              onClick={clearFiles}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--tx-3)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{processorStrings.upload.clearAll}</span>
            </button>
          </div>
          
          <FileList 
            files={files}
            onRemoveFileAction={(idx) => removeFile(state.sessionIds[idx])}
            currentIndex={currentFileIndex}
            onFileSelectAction={handleFileChange}
          />

          {state.activeKey === 'extract' && (
            <ExtractWorkspace
              files={files}
              currentFileIndex={currentFileIndex}
              currentFileKey={currentFileKey}
              selectedPages={selectedPages}
              selectionsByFile={extractSelectionsByFile}
              buildFileSignature={buildFileSignature}
              onFileChange={handleFileChange}
              onPageSelection={handlePageSelection}
            />
          )}

          {state.activeKey === 'rotate' && (
            <RotateWorkspace
              files={files}
              currentFileIndex={currentFileIndex}
              currentFileKey={currentFileKey}
              selectedPages={selectedPages}
              selectionsByFile={extractSelectionsByFile}
              buildFileSignature={buildFileSignature}
              onFileChange={handleFileChange}
              onPageSelection={handlePageSelection}
              options={state.options}
              onOptionsChange={setProcessingOptions}
            />
          )}

          {state.activeKey === 'crop' && (
            <CropWorkspace
              files={files}
              currentFileIndex={currentFileIndex}
              currentFileKey={currentFileKey}
              selectedPages={selectedPages}
              selectionsByFile={extractSelectionsByFile}
              buildFileSignature={buildFileSignature}
              onFileChange={handleFileChange}
              onPageSelection={handlePageSelection}
              currentFile={currentFile}
              previewPage={parseInt(Object.keys(selectedPages)[0]) || 1}
              hasSelection={hasExtractSelection}
              cropMargins={state.options.cropMargins ?? { top: 0, right: 0, bottom: 0, left: 0 }}
              onCropChange={nextMargins =>
                setProcessingOptions((prev: any) => ({ ...prev, cropMargins: nextMargins }))
              }
            />
          )}

          {state.activeKey === 'reorder' && (
            <ReorderWorkspace
              files={files}
              currentFileIndex={currentFileIndex}
              currentFileKey={currentFileKey}
              pageOrder={pageOrder}
              ordersByFile={reorderOrdersByFile}
              buildFileSignature={buildFileSignature}
              onFileChange={handleFileChange}
              onOrderChange={handleOrderChange}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {state.activeKey && PDF_FEATURES[state.activeKey]?.defaults !== undefined && (
              <ProcessingOptions
                mode={state.activeKey}
                options={state.options}
                onOptionsChangeAction={setProcessingOptions}
              />
            )}

            {state.activeKey === 'compress' && activeFile && (
              <CompressionPreviewCard
                strings={processorStrings.compressionPreview}
                status={previewStatus}
                result={previewResult}
                formatFileSizeAction={formatFileSize}
                fileName={activeFile.name}
                errorMessage={previewErrorMessage}
                retryAction={handleRetryPreview}
              />
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => handleStartProcessing()}
              className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-2)] transition-all shadow-sm font-semibold text-sm sm:text-base cursor-pointer"
            >
              {(() => {
                const ActiveIcon = (state.activeKey && OPERATION_ICONS[state.activeKey]) || Sparkles;
                return <ActiveIcon className="w-4 h-4" />;
              })()}
              <span>{resolveIdleButtonLabel()}</span>
            </button>
          </div>
        </div>
      )}

      {state.phase === 'PROCESSING' && (
        <div className="py-4">
          <InsightfulProgressIndicator
            percent={progressState.percent}
            operationKey={state.activeKey}
            operationLabel={
              state.activeKey
                ? (processorStrings as any).processButton?.processing || 'Processing...'
                : 'Processing...'
            }
            stage={progressState.stage}
            detail={progressState.detail}
            current={progressState.current}
            total={progressState.total}
            elapsedSeconds={progressState.elapsedSeconds}
            fileCount={state.sessionIds.length}
            activeFileName={progressState.activeFileName}
            privacyGuaranteeText="100% Client-Side Processing • Your files stay on this device"
          />
        </div>
      )}

      {state.phase === 'RESULT' && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--ui-2)] p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Success!</h2>
          <p className="text-[var(--tx-2)] mb-8">Your files have been processed locally.</p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={clearFiles}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-[var(--ui-2)] rounded-xl hover:bg-[var(--ui)] transition-colors font-medium text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Process More Files</span>
            </button>
            {state.results[0]?.blob && (
              <button
              onClick={() => {
                if (state.results.length > 0 && state.results[0].blob) {
                  const result = state.results[0];
                  const url = URL.createObjectURL(result.blob as Blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = result.filename || 'jaypdf_result.pdf';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-2)] transition-all shadow-sm font-bold text-sm sm:text-base cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Result</span>
            </button>
            )}
          </div>

          <div className="mt-8 max-w-xl mx-auto text-left">
            <PwaInstallPrompt />
          </div>
        </div>
      )}
      
      {state.phase === 'ERROR' && (
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 sm:p-8 text-center max-w-2xl mx-auto">
          {isCorruptionError ? (
            <div>
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[var(--tx)]">
                Corrupted Document Detected
              </h2>
              {state.globalError && (
                <p className="text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200 mb-4 text-left leading-relaxed">
                  {state.globalError}
                </p>
              )}
              
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3.5 mb-6 text-xs text-amber-950 text-left shadow-xs dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-100">
                <p className="font-semibold mb-1">Automatic Repair Available:</p>
                <p className="leading-relaxed">
                  {autoRepairStrings.note}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <button
                  onClick={handleRelaunchWithAutoRepair}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-2)] transition-all shadow-sm font-semibold text-sm sm:text-base cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Fix with Auto-Repair &amp; Retry</span>
                </button>
                <button
                  onClick={() => dispatch({ type: 'RESET_TO_READY' })}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--ui-2)] rounded-xl hover:bg-[var(--ui)] text-[var(--tx-2)] transition-colors font-medium text-sm sm:text-base cursor-pointer"
                >
                  Back to Options
                </button>
                <button
                  onClick={clearFiles}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs text-[var(--tx-3)] hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
              <p className="text-red-600 mb-8">{state.globalError || 'Something went wrong.'}</p>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => dispatch({ type: 'RESET_TO_READY' })}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm cursor-pointer"
                >
                  Try Again
                </button>
                <button 
                  onClick={clearFiles}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm cursor-pointer"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
