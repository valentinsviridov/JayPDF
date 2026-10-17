import { PdfOperationKey, ProcessorOptions } from '../../../modules/pdf';
import { PDF_FEATURES, isPdfFile, isImageFile } from '../../../modules/pdf';

export type WorkspacePhase =
  | 'EMPTY'
  | 'ANALYZING'
  | 'READY'
  | 'EDITING'
  | 'PROCESSING'
  | 'RESULT'
  | 'ERROR';

export interface FileSession {
  id: string;
  originalFile: File;
  selectedPages?: number[];
  pageOrder?: number[];
  rotation?: number; // per file rotation if needed, or in options
}

export interface ProcessingResultEntry {
  fileId?: string;
  blob?: Blob;
  blobs?: Blob[]; // for split or extract returning multiple files
  filename?: string;
  originalSize?: number;
  processedSize?: number;
  elapsedMs?: number;
  error?: string;
}

export interface WorkspaceState {
  phase: WorkspacePhase;
  sessions: Record<string, FileSession>;
  sessionIds: string[]; // preserves order
  activeKey: PdfOperationKey | null;
  options: Partial<ProcessorOptions>;
  results: ProcessingResultEntry[];
  globalError?: string;
}

export type WorkspaceAction =
  | { type: 'ADD_FILES'; files: File[]; generateId: (file: File) => string }
  | { type: 'REMOVE_FILE'; id: string }
  | { type: 'CLEAR_FILES' }
  | { type: 'ANALYSIS_COMPLETE'; recommendedKey: PdfOperationKey | null; incompatibleIds?: string[] }
  | { type: 'SELECT_OPERATION'; key: PdfOperationKey }
  | { type: 'UPDATE_OPTIONS'; payload: Partial<ProcessorOptions> }
  | { type: 'UPDATE_FILE_STATE'; id: string; payload: Partial<Omit<FileSession, 'id' | 'originalFile'>> }
  | { type: 'ENTER_EDITING' }
  | { type: 'CANCEL_EDITING' }
  | { type: 'START_PROCESSING' }
  | { type: 'PROCESSING_COMPLETE'; results: ProcessingResultEntry[] }
  | { type: 'PROCESSING_FAILED'; error: string }
  | { type: 'RESET_TO_READY' };

export const initialWorkspaceState: WorkspaceState = {
  phase: 'EMPTY',
  sessions: {},
  sessionIds: [],
  activeKey: null,
  options: {},
  results: [],
};

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'ADD_FILES': {
      if (action.files.length === 0) return state;
      const newSessions = { ...state.sessions };
      const newSessionIds = [...state.sessionIds];
      action.files.forEach(f => {
        let id = action.generateId(f);
        let counter = 1;
        while (newSessions[id]) {
          id = `${action.generateId(f)}-${counter}`;
          counter++;
        }
        newSessions[id] = { id, originalFile: f };
        newSessionIds.push(id);
      });
      return {
        ...state,
        phase: 'ANALYZING',
        sessions: newSessions,
        sessionIds: newSessionIds,
        globalError: undefined,
        results: [],
      };
    }
    case 'REMOVE_FILE': {
      const newSessionIds = state.sessionIds.filter(id => id !== action.id);
      const newSessions = { ...state.sessions };
      delete newSessions[action.id];
      const nextPhase = newSessionIds.length === 0 ? 'EMPTY' : 'ANALYZING'; // re-analyze when a file is removed
      return {
        ...state,
        sessions: newSessions,
        sessionIds: newSessionIds,
        phase: nextPhase,
      };
    }
    case 'CLEAR_FILES':
      return {
        ...initialWorkspaceState,
        activeKey: state.activeKey,
        options: state.activeKey && PDF_FEATURES[state.activeKey]
          ? { ...PDF_FEATURES[state.activeKey].defaults }
          : {},
      };
    case 'ANALYSIS_COMPLETE': {
      // If the user is already on a specific tool (activeKey is set), don't override it.
      // Only use the recommendedKey if there is no active tool selected.
      const nextKey = state.activeKey || action.recommendedKey;
      return {
        ...state,
        phase: 'READY',
        activeKey: nextKey,
        options: nextKey && PDF_FEATURES[nextKey]
          ? { ...PDF_FEATURES[nextKey].defaults, ...state.options }
          : state.options,
      };
    }
    case 'SELECT_OPERATION':
      return {
        ...state,
        activeKey: action.key,
        options: PDF_FEATURES[action.key] ? { ...PDF_FEATURES[action.key].defaults } : {},
      };
    case 'UPDATE_OPTIONS':
      return { ...state, options: { ...state.options, ...action.payload } };
    case 'UPDATE_FILE_STATE':
      if (!state.sessions[action.id]) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.id]: { ...state.sessions[action.id], ...action.payload },
        },
      };
    case 'ENTER_EDITING':
      return state.phase === 'READY' ? { ...state, phase: 'EDITING' } : state;
    case 'CANCEL_EDITING':
      return state.phase === 'EDITING' ? { ...state, phase: 'READY' } : state;
    case 'START_PROCESSING':
      return { ...state, phase: 'PROCESSING', globalError: undefined, results: [] };
    case 'PROCESSING_COMPLETE':
      return { ...state, phase: 'RESULT', results: action.results };
    case 'PROCESSING_FAILED':
      return { ...state, phase: 'ERROR', globalError: action.error };
    case 'RESET_TO_READY':
      return { ...state, phase: 'READY', results: [], globalError: undefined };
    default:
      return state;
  }
}

// Helpers for inference
export function inferRecommendedOperation(files: File[]): PdfOperationKey | null {
  if (files.length === 0) return null;
  const isAllImages = files.every(f => isImageFile(f));
  const isAllPdfs = files.every(f => isPdfFile(f));

  if (isAllImages) return 'imagesToPdf';
  if (isAllPdfs) {
    if (files.length === 1) return 'compress';
    return 'merge';
  }
  return null; // Mixed or unsupported
}
