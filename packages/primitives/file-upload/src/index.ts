/**
 * FileUpload Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix/core';
import { createFileUploadState } from './state';
import { createFileUploadLogic } from './logic';
import type { FileUploadOptions, FileUploadState, FileUploadEvents } from './types';

/**
 * Creates a file upload component
 * @param options Component options
 * @returns Component instance with state and logic
 */
export function createFileUpload(options: FileUploadOptions = {}) {
    const metadata = {
        name: 'FileUpload',
        version: '1.0.0',
        description: 'File upload component with drag and drop support',
        accessibility: {
            role: 'region',
            keyboardShortcuts: ['Enter', 'Space'],
            ariaAttributes: [
                'aria-label',
                'aria-describedby',
                'aria-disabled',
                'aria-busy',
                'aria-live',
                'aria-atomic'
            ],
            wcagLevel: 'AA',
            patterns: ['file-upload', 'drag-drop']
        },
        events: {
            supported: [
                'change',
                'remove',
                'drop',
                'dragenter',
                'dragleave',
                'dragover',
                'error',
                'uploadstart',
                'uploadprogress',
                'uploadcomplete',
                'uploadcancel'
            ],
            required: [],
            custom: {}
        },
        structure: {
            elements: {
                'dropzone': {
                    type: 'div',
                    role: 'region',
                    optional: false
                },
                'input': {
                    type: 'input',
                    role: 'none',
                    optional: false
                },
                'status': {
                    type: 'div',
                    role: 'status',
                    optional: false
                },
                'fileItem': {
                    type: 'div',
                    role: 'article',
                    optional: true
                },
                'removeButton': {
                    type: 'button',
                    role: 'button',
                    optional: true
                },
                'uploadButton': {
                    type: 'button',
                    role: 'button',
                    optional: true
                }
            }
        }
    };

    const state = createFileUploadState(options);
    const logic = createFileUploadLogic(state, options);

    return createPrimitive<FileUploadState, FileUploadEvents, FileUploadOptions>(
        'FileUpload',
        {
            initialState: state.getState(),
            logicConfig: options,
            metadata
        },
        {
            state,
            logic
        }
    );
}

// Re-export types
export type { 
    FileUploadOptions, 
    FileUploadState, 
    FileUploadEvents, 
    FileUploadProps 
} from './types';

export type { FileUploadStateStore } from './state';

// Default export for convenience
export default createFileUpload;