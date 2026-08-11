'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useWorkspace } from './controller/use-workspace';
import FileUploader from './FileUploader';
import FileList from './FileList';
import { BrandConfig } from '../../config/brand';
import { PDF_FEATURES, PDF_FEATURE_KEYS } from '../../modules/pdf/catalog';
import { PdfOperationKey } from '../../modules/pdf/operation-map';
import { usePdfProcessorServices } from './services';
import { ExtractWorkspace } from './features/ExtractWorkspace';
import { RotateWorkspace } from './features/RotateWorkspace';
import { CropWorkspace } from './features/CropWorkspace';
import { ReorderWorkspace } from './features/ReorderWorkspace';
import { useDictionary } from '../../i18n/LocaleProvider';
import ProcessingOptions from './ProcessingOptions';
import CompressionPreviewCard, { PreviewStatus } from './CompressionPreviewCard';

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
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const files = state.sessionIds.map(id => state.sessions[id].originalFile);

  useEffect(() => {
    if (state.activeKey !== 'compress' || files.length === 0) {
      setPreviewStatus('idle');
      setPreviewResult(null);
      return;
    }
    
    setPreviewStatus('running');
    const timer = setTimeout(async () => {
      try {
        const fileToPreview = files[0];
        const res = await processorService.processor.execute('compress', [fileToPreview], state.options as any);
        setPreviewResult(res);
        setPreviewStatus('ready');
      } catch (err) {
        setPreviewStatus('error');
      }
    }, 500); // debounce

    return () => clearTimeout(timer);
  }, [state.activeKey, files, state.options]);

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
    const stripPdfExtension = (name: string) => name.replace(/\.pdf$/i, '');
    if (operation === 'pdfToImages') {
      if ((state.options as any).bundleAsZip) {
        return `${originalName ? stripPdfExtension(originalName) : 'pdflince_images'}.zip`;
      }
      return `${originalName ? stripPdfExtension(originalName) : 'pdflince_image'}${index !== undefined ? `_${index + 1}` : ''}.png`;
    }
    const modeNames: Record<string, string> = (processorStrings as any).downloadNames || {};
    const base = modeNames[operation] || 'result_PDFLince';
    const suffix = index !== undefined ? `_${index + 1}` : '';
    return originalName ? `${stripPdfExtension(originalName)}_${base}${suffix}.pdf` : `${base}${suffix}.pdf`;
  };

  const handleStartProcessing = async () => {
    if (!state.activeKey || state.sessionIds.length === 0) return;
    
    dispatch({ type: 'START_PROCESSING' });
    
    try {
      const activeFiles = state.sessionIds.map(id => state.sessions[id].originalFile);
      
      const pageOrder = state.activeKey === 'reorder' && state.sessionIds.length > 0
        ? state.sessions[state.sessionIds[0]].pageOrder
        : undefined;

      const mappedOptions: any = { ...state.options, pageOrder };
      
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
        for (const file of activeFiles) {
          const res = await processorService.processor.execute('compress', [file], mappedOptions);
          (res as any).name = file.name;
          results.push(res);
        }
        result = results;
      } else {
        result = await processorService.processor.execute(
          state.activeKey,
          activeFiles,
          mappedOptions
        );
      }
      
      if (result) {
        const getBlob = (r: any) => {
          if (r instanceof Blob) return r;
          if (r instanceof Uint8Array) return new Blob([r as any], { type: 'application/pdf' });
          if (r?.blob instanceof Blob) return r.blob;
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
    <div className="w-full max-w-5xl mx-auto flex flex-col space-y-6">
      <div className="text-center space-y-2 mb-8" id="pdf-processor">
        <h2 className="text-3xl font-bold">{BrandConfig.productName} Workspace</h2>
        <p className="text-[var(--tx-2)]">{BrandConfig.shortPromise}</p>
      </div>

      {(state.phase === 'EMPTY' || state.phase === 'READY') && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">{processorStrings.title}</h2>
          <div className="overflow-x-auto pb-2">
            <div className="flex flex-wrap gap-2 min-w-max">
              {PDF_FEATURE_KEYS.map(modeKey => {
                const tabStrings = (dictionary.components.pdfProcessor.modes as any)[modeKey];
                const label = tabStrings?.label ?? modeKey;
                const isActive = state.activeKey === modeKey;
                return (
                  <button
                    key={modeKey}
                    className={`px-4 py-2 rounded-lg ${isActive
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--ui-2)] text-[var(--tx-2)] hover:bg-[var(--ui)]'
                      }`}
                    onClick={() => selectOperation(modeKey)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {(state.phase === 'EMPTY' || state.phase === 'READY' || state.phase === 'EDITING' || state.phase === 'ANALYZING') && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{processorStrings.upload.title}</h2>
            {files.length > 0 && (
              <button
                className="text-sm text-[var(--tx-3)] hover:text-[var(--accent)] transition-colors"
                onClick={clearFiles}
              >
                {processorStrings.upload.clearAll}
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
              className="text-sm text-[var(--tx-3)] hover:text-[var(--accent)] transition-colors"
            >
              {processorStrings.upload.clearAll}
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

            {state.activeKey === 'compress' && (
              <CompressionPreviewCard
                strings={processorStrings.compressionPreview}
                status={previewStatus}
                result={previewResult}
                formatFileSizeAction={formatFileSize}
                fileName={files[0]?.name}
              />
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleStartProcessing}
              className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-sm font-medium"
            >
              {resolveIdleButtonLabel()}
            </button>
          </div>
        </div>
      )}

      {state.phase === 'PROCESSING' && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--ui-2)] p-12 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mb-4"></div>
          <p className="text-lg font-medium">{processorStrings.processButton.processing}</p>
          <p className="text-sm text-[var(--tx-3)] mt-2">Your files stay on this device.</p>
        </div>
      )}

      {state.phase === 'RESULT' && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--ui-2)] p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Success!</h2>
          <p className="text-[var(--tx-2)] mb-8">Your files have been processed locally.</p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={clearFiles}
              className="px-6 py-2 border border-[var(--ui-2)] rounded-lg hover:bg-[var(--ui)] transition-colors"
            >
              Process More Files
            </button>
            {state.results[0]?.blob && (
              <button
              onClick={() => {
                if (state.results.length > 0 && state.results[0].blob) {
                  const result = state.results[0];
                  const url = URL.createObjectURL(result.blob as Blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = result.filename || 'pdflince_result.pdf';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              }}
              className="px-8 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-sm font-bold"
            >
              Download Result
            </button>
            )}
          </div>
        </div>
      )}
      
      {state.phase === 'ERROR' && (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
          <p className="text-red-600 mb-8">{state.globalError || 'Something went wrong.'}</p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => dispatch({ type: 'RESET_TO_READY' })}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={clearFiles}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
