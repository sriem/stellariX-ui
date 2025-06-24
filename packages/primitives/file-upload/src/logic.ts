/**
 * FileUpload Component Logic
 * Handles interactions and business logic for the file upload component
 */

import { LogicLayerBuilder } from '@stellarix/core';
import type { LogicLayer } from '@stellarix/core';
import { generateComponentId } from '@stellarix/utils';
import type { FileUploadState, FileUploadEvents, FileUploadOptions } from './types';
import type { FileUploadStateStore } from './state';

/**
 * Creates the logic layer for the file upload component
 */
export function createFileUploadLogic(
    state: FileUploadStateStore,
    options: FileUploadOptions = {}
): LogicLayer<FileUploadState, FileUploadEvents> {
    const componentId = generateComponentId('file-upload');
    const dropzoneId = `${componentId}-dropzone`;
    const inputId = `${componentId}-input`;
    const statusId = `${componentId}-status`;

    return new LogicLayerBuilder<FileUploadState, FileUploadEvents>()
        .onEvent('change', (currentState, payload) => {
            const files = payload && 'files' in payload ? payload.files : [];
            
            state.setFiles(files);
            if (options.onChange) {
                options.onChange(files);
            }
            
            return null;
        })
        
        .onEvent('remove', (currentState, payload) => {
            const file = payload && 'file' in payload ? payload.file : null;
            
            if (file) {
                state.removeFile(file);
                
                if (options.onRemove) {
                    options.onRemove(file);
                }
                
                if (options.onChange) {
                    const newFiles = currentState.files.filter(f => f !== file);
                    options.onChange(newFiles);
                }
            }
            
            return null;
        })
        
        .onEvent('drop', (currentState, payload) => {
            const files = payload && 'files' in payload ? payload.files : [];
            
            if (files.length > 0) {
                const validFiles: File[] = [];
                const errors: Array<{ file: File; message: string }> = [];
                
                files.forEach((file: File) => {
                    const error = state.validateFile(file);
                    if (error) {
                        errors.push({ file, message: error });
                        state.setError(file.name, error);
                    } else {
                        validFiles.push(file);
                    }
                });
                
                if (validFiles.length > 0) {
                    state.addFiles(validFiles);
                }
                
                if (options.onDrop) {
                    options.onDrop(validFiles);
                }
                
                if (options.onChange && validFiles.length > 0) {
                    options.onChange([...currentState.files, ...validFiles]);
                }
                
                errors.forEach(error => {
                    if (options.onError) {
                        options.onError(error);
                    }
                });
            }
            
            state.setDragActive(false);
            return null;
        })
        
        .onEvent('dragenter', (currentState, payload) => {
            const event = payload && 'event' in payload ? payload.event : payload;
            
            state.setDragActive(true);
            
            if (options.onDragEnter && event) {
                options.onDragEnter(event);
            }
            
            return null;
        })
        
        .onEvent('dragleave', (currentState, payload) => {
            const event = payload && 'event' in payload ? payload.event : payload;
            
            state.setDragActive(false);
            
            if (options.onDragLeave && event) {
                options.onDragLeave(event);
            }
            
            return null;
        })
        
        .onEvent('error', (currentState, payload) => {
            const file = payload && 'file' in payload ? payload.file : null;
            const message = payload && 'message' in payload ? payload.message : '';
            
            if (file && message) {
                state.setError(file.name, message);
                
                if (options.onError) {
                    options.onError({ file, message });
                }
            }
            
            return null;
        })
        
        .onEvent('uploadstart', (currentState, payload) => {
            const file = payload && 'file' in payload ? payload.file : null;
            
            if (file) {
                state.setUploading(true);
                state.setProgress(file.name, 0);
            }
            
            return null;
        })
        
        .onEvent('uploadprogress', (currentState, payload) => {
            const file = payload && 'file' in payload ? payload.file : null;
            const progress = payload && 'progress' in payload ? payload.progress : 0;
            
            if (file) {
                state.setProgress(file.name, progress);
                
                if (options.onProgress) {
                    options.onProgress(file, progress);
                }
            }
            
            return null;
        })
        
        .onEvent('uploadcomplete', (currentState, payload) => {
            const file = payload && 'file' in payload ? payload.file : null;
            
            if (file) {
                state.setProgress(file.name, 100);
                
                const allComplete = currentState.files.every(
                    f => (currentState.progress[f.name] || 0) === 100
                );
                
                if (allComplete) {
                    state.setUploading(false);
                }
            }
            
            return null;
        })
        
        .onEvent('uploadcancel', (currentState, payload) => {
            const file = payload && 'file' in payload ? payload.file : null;
            
            if (file) {
                state.removeFile(file);
            }
            
            return null;
        })
        
        .withA11y('dropzone', (state) => ({
            role: 'region',
            'aria-label': 'File upload dropzone',
            'aria-describedby': statusId,
            'aria-disabled': state.disabled,
            'aria-busy': state.uploading,
            tabIndex: state.disabled ? -1 : 0,
            id: dropzoneId
        }))
        
        .withA11y('input', (state) => ({
            type: 'file',
            id: inputId,
            multiple: state.multiple,
            accept: state.accept,
            disabled: state.disabled,
            'aria-label': 'Select files to upload',
            'aria-describedby': statusId,
            tabIndex: -1
        }))
        
        .withA11y('status', (state) => ({
            role: 'status',
            'aria-live': 'polite',
            'aria-atomic': 'true',
            id: statusId
        }))
        
        .withA11y('fileItem', (state) => (fileName: string) => ({
            role: 'article',
            'aria-label': `File: ${fileName}`,
            'aria-describedby': state.errors[fileName] 
                ? `${componentId}-error-${fileName}` 
                : state.progress[fileName] !== undefined
                    ? `${componentId}-progress-${fileName}`
                    : undefined
        }))
        
        .withInteraction('dropzone', 'onDragEnter', (currentState, event: DragEvent) => {
            if (currentState.disabled) {
                return null;
            }
            
            event.preventDefault();
            event.stopPropagation();
            
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
            }
            
            state.setDragActive(true);
            
            if (options.onDragEnter) {
                options.onDragEnter(event);
            }
            
            return 'dragenter';
        })
        
        .withInteraction('dropzone', 'onDragOver', (currentState, event: DragEvent) => {
            if (currentState.disabled) {
                return null;
            }
            
            event.preventDefault();
            event.stopPropagation();
            
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
            }
            
            return 'dragover';
        })
        
        .withInteraction('dropzone', 'onDragLeave', (currentState, event: DragEvent) => {
            if (currentState.disabled) {
                return null;
            }
            
            event.preventDefault();
            event.stopPropagation();
            
            const target = event.target as HTMLElement;
            const currentTarget = event.currentTarget as HTMLElement;
            
            if (!currentTarget.contains(event.relatedTarget as Node)) {
                state.setDragActive(false);
                
                if (options.onDragLeave) {
                    options.onDragLeave(event);
                }
                
                return 'dragleave';
            }
            
            return null;
        })
        
        .withInteraction('dropzone', 'onDrop', (currentState, event: DragEvent) => {
            if (currentState.disabled) {
                return null;
            }
            
            event.preventDefault();
            event.stopPropagation();
            
            state.setDragActive(false);
            
            const files = Array.from(event.dataTransfer?.files || []);
            if (files.length > 0) {
                const validFiles: File[] = [];
                
                files.forEach((file) => {
                    const error = state.validateFile(file);
                    if (error) {
                        state.setError(file.name, error);
                        if (options.onError) {
                            options.onError({ file, message: error });
                        }
                    } else {
                        validFiles.push(file);
                    }
                });
                
                if (validFiles.length > 0) {
                    state.addFiles(validFiles);
                    
                    if (options.onDrop) {
                        options.onDrop(validFiles);
                    }
                    
                    if (options.onChange) {
                        options.onChange([...currentState.files, ...validFiles]);
                    }
                }
                
                return 'drop';
            }
            
            return null;
        })
        
        .withInteraction('dropzone', 'onClick', (currentState, event: MouseEvent) => {
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            const input = document.getElementById(inputId) as HTMLInputElement;
            input?.click();
            
            return null;
        })
        
        .withInteraction('dropzone', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const input = document.getElementById(inputId) as HTMLInputElement;
                input?.click();
            }
            
            return null;
        })
        
        .withInteraction('input', 'onChange', (currentState, event: Event) => {
            const input = event.target as HTMLInputElement;
            const files = Array.from(input.files || []);
            
            if (files.length > 0) {
                const validFiles: File[] = [];
                
                files.forEach((file) => {
                    const error = state.validateFile(file);
                    if (error) {
                        state.setError(file.name, error);
                        if (options.onError) {
                            options.onError({ file, message: error });
                        }
                    } else {
                        validFiles.push(file);
                    }
                });
                
                if (validFiles.length > 0) {
                    if (currentState.multiple) {
                        state.addFiles(validFiles);
                    } else {
                        state.setFiles(validFiles);
                    }
                    
                    if (options.onChange) {
                        options.onChange(currentState.multiple 
                            ? [...currentState.files, ...validFiles]
                            : validFiles
                        );
                    }
                }
            }
            
            input.value = '';
            
            return 'change';
        })
        
        .withInteraction('removeButton', 'onClick', (currentState, event: MouseEvent) => {
            event.stopPropagation();
            
            const fileName = (event.currentTarget as HTMLElement).dataset.fileName;
            const file = currentState.files.find(f => f.name === fileName);
            
            if (file) {
                state.removeFile(file);
                
                if (options.onRemove) {
                    options.onRemove(file);
                }
                
                if (options.onChange) {
                    const newFiles = currentState.files.filter(f => f !== file);
                    options.onChange(newFiles);
                }
                
                return 'remove';
            }
            
            return null;
        })
        
        .withInteraction('uploadButton', 'onClick', async (currentState, event: MouseEvent) => {
            if (currentState.disabled || currentState.uploading || !options.onUpload) {
                event.preventDefault();
                return null;
            }
            
            state.setUploading(true);
            
            for (const file of currentState.files) {
                if (currentState.errors[file.name]) {
                    continue;
                }
                
                try {
                    state.setProgress(file.name, 0);
                    
                    await options.onUpload(file);
                    
                    state.setProgress(file.name, 100);
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Upload failed';
                    state.setError(file.name, message);
                    
                    if (options.onError) {
                        options.onError({ file, message });
                    }
                }
            }
            
            state.setUploading(false);
            
            return 'uploadcomplete';
        })
        
        .build();
}