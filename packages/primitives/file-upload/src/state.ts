/**
 * FileUpload Component State Management
 * Manages the state for the file upload component
 */

import { createComponentState } from '@stellarix-ui/core';
import type { FileUploadState, FileUploadOptions } from './types';

/**
 * Creates a file upload state store
 */
export function createFileUploadState(options: FileUploadOptions) {
    const initialState: FileUploadState = {
        files: options.files || [],
        uploading: false,
        progress: {},
        errors: {},
        dragActive: false,
        disabled: options.disabled || false,
        multiple: options.multiple !== false,
        accept: options.accept,
        maxSize: options.maxSize,
        maxFiles: options.maxFiles
    };

    const store = createComponentState('FileUpload', initialState);

    // Extended API for file upload-specific state management
    return {
        ...store,
        
        // File management methods
        setFiles: (files: File[]) => {
            store.setState((prev) => ({ ...prev, files }));
        },
        
        addFiles: (newFiles: File[]) => {
            store.setState((prev) => {
                const currentFiles = prev.files;
                const maxFiles = prev.maxFiles;
                
                // Filter out duplicates
                const uniqueNewFiles = newFiles.filter(
                    newFile => !currentFiles.some(
                        existingFile => existingFile.name === newFile.name && 
                                       existingFile.size === newFile.size
                    )
                );
                
                // Apply max files limit
                let filesToAdd = uniqueNewFiles;
                if (maxFiles && currentFiles.length + uniqueNewFiles.length > maxFiles) {
                    const remainingSlots = Math.max(0, maxFiles - currentFiles.length);
                    filesToAdd = uniqueNewFiles.slice(0, remainingSlots);
                }
                
                return { 
                    ...prev, 
                    files: [...currentFiles, ...filesToAdd] 
                };
            });
        },
        
        removeFile: (file: File) => {
            store.setState((prev) => {
                const fileName = file.name;
                const { [fileName]: _, ...remainingProgress } = prev.progress;
                const { [fileName]: __, ...remainingErrors } = prev.errors;
                
                return {
                    ...prev,
                    files: prev.files.filter(f => f !== file),
                    progress: remainingProgress,
                    errors: remainingErrors
                };
            });
        },
        
        clearFiles: () => {
            store.setState((prev) => ({ 
                ...prev, 
                files: [], 
                progress: {}, 
                errors: {},
                uploading: false 
            }));
        },
        
        // Upload state methods
        setUploading: (uploading: boolean) => {
            store.setState((prev) => ({ ...prev, uploading }));
        },
        
        setProgress: (fileName: string, progress: number) => {
            store.setState((prev) => ({ 
                ...prev, 
                progress: { ...prev.progress, [fileName]: progress } 
            }));
        },
        
        setError: (fileName: string, error: string) => {
            store.setState((prev) => ({ 
                ...prev, 
                errors: { ...prev.errors, [fileName]: error } 
            }));
        },
        
        clearError: (fileName: string) => {
            store.setState((prev) => {
                const { [fileName]: _, ...remainingErrors } = prev.errors;
                return { ...prev, errors: remainingErrors };
            });
        },
        
        // Drag state methods
        setDragActive: (dragActive: boolean) => {
            store.setState((prev) => ({ ...prev, dragActive }));
        },
        
        // Configuration methods
        setDisabled: (disabled: boolean) => {
            store.setState((prev) => ({ ...prev, disabled }));
        },
        
        setMultiple: (multiple: boolean) => {
            store.setState((prev) => ({ ...prev, multiple }));
        },
        
        setAccept: (accept: string | undefined) => {
            store.setState((prev) => ({ ...prev, accept }));
        },
        
        setMaxSize: (maxSize: number | undefined) => {
            store.setState((prev) => ({ ...prev, maxSize }));
        },
        
        setMaxFiles: (maxFiles: number | undefined) => {
            store.setState((prev) => ({ ...prev, maxFiles }));
        },
        
        // Computed properties
        isInteractive: store.derive(state => !state.disabled && !state.uploading),
        hasFiles: store.derive(state => state.files.length > 0),
        canAddMore: store.derive(state => 
            !state.maxFiles || state.files.length < state.maxFiles
        ),
        totalProgress: store.derive(state => {
            const fileCount = state.files.length;
            if (fileCount === 0) return 0;
            
            const totalProgress = state.files.reduce((sum, file) => {
                return sum + (state.progress[file.name] || 0);
            }, 0);
            
            return Math.round(totalProgress / fileCount);
        }),
        hasErrors: store.derive(state => Object.keys(state.errors).length > 0),
        uploadedCount: store.derive(state => 
            state.files.filter(file => state.progress[file.name] === 100).length
        ),
        
        // Validation methods
        validateFile: (file: File): string | null => {
            const state = store.getState();
            
            // Check file type
            if (state.accept) {
                const acceptedTypes = state.accept.split(',').map(t => t.trim());
                const fileType = file.type;
                const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
                
                const isAccepted = acceptedTypes.some(accepted => {
                    if (accepted.startsWith('.')) {
                        return fileExtension === accepted.toLowerCase();
                    }
                    if (accepted.endsWith('/*')) {
                        const category = accepted.slice(0, -2);
                        return fileType.startsWith(category + '/');
                    }
                    return fileType === accepted;
                });
                
                if (!isAccepted) {
                    return `File type not accepted. Accepted types: ${state.accept}`;
                }
            }
            
            // Check file size
            if (state.maxSize && file.size > state.maxSize) {
                const sizeMB = (state.maxSize / 1024 / 1024).toFixed(2);
                return `File size exceeds ${sizeMB}MB limit`;
            }
            
            return null;
        }
    };
}

export type FileUploadStateStore = ReturnType<typeof createFileUploadState>;