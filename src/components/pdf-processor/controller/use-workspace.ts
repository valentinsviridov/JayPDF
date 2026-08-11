import { useReducer, useCallback, useEffect } from 'react';
import { 
  workspaceReducer, 
  initialWorkspaceState, 
  WorkspaceAction, 
  inferRecommendedOperation 
} from './workspace-reducer';
import { PdfOperationKey, ProcessorOptions } from '../../../modules/pdf/operation-map';

export function useWorkspace(initialMode?: PdfOperationKey) {
  const [state, dispatch] = useReducer(workspaceReducer, {
    ...initialWorkspaceState,
    activeKey: initialMode || null,
  });

  // Expose dispatch actions as named methods
  const addFiles = useCallback((files: File[]) => {
    dispatch({
      type: 'ADD_FILES',
      files,
      generateId: (f) => `${f.name}-${f.size}-${f.lastModified}`,
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FILE', id });
  }, []);

  const clearFiles = useCallback(() => {
    dispatch({ type: 'CLEAR_FILES' });
  }, []);

  const selectOperation = useCallback((key: PdfOperationKey) => {
    dispatch({ type: 'SELECT_OPERATION', key });
  }, []);

  const updateOptions = useCallback((options: Partial<ProcessorOptions>) => {
    dispatch({ type: 'UPDATE_OPTIONS', payload: options });
  }, []);

  const enterEditing = useCallback(() => {
    dispatch({ type: 'ENTER_EDITING' });
  }, []);

  const cancelEditing = useCallback(() => {
    dispatch({ type: 'CANCEL_EDITING' });
  }, []);

  // Analysis effect
  useEffect(() => {
    if (state.phase === 'ANALYZING') {
      const activeFiles = state.sessionIds.map(id => state.sessions[id].originalFile);
      const recommendedKey = inferRecommendedOperation(activeFiles);
      
      // We can also determine incompatible files here if needed in the future
      
      dispatch({ 
        type: 'ANALYSIS_COMPLETE', 
        recommendedKey 
      });
    }
  }, [state.phase, state.sessionIds, state.sessions]);

  return {
    state,
    dispatch,
    addFiles,
    removeFile,
    clearFiles,
    selectOperation,
    updateOptions,
    enterEditing,
    cancelEditing,
  };
}
