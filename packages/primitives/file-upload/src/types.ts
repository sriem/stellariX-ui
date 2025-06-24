/**
 * FileUpload Component Types
 * Define all TypeScript interfaces for the file upload component
 */

/**
 * FileUpload component state
 * Represents the internal state of the component
 */
export interface FileUploadState {
    /**
     * Array of selected files
     */
    files: File[];
    
    /**
     * Whether any file is currently uploading
     */
    uploading: boolean;
    
    /**
     * Upload progress for each file (file name -> progress percentage)
     */
    progress: Record<string, number>;
    
    /**
     * Errors for each file (file name -> error message)
     */
    errors: Record<string, string>;
    
    /**
     * Whether drag is currently active over the component
     */
    dragActive: boolean;
    
    /**
     * Whether the component is disabled
     */
    disabled: boolean;
    
    /**
     * Whether multiple files can be selected
     */
    multiple: boolean;
    
    /**
     * Accepted file types (e.g., "image/*", ".pdf")
     */
    accept?: string;
    
    /**
     * Maximum file size in bytes
     */
    maxSize?: number;
    
    /**
     * Maximum number of files
     */
    maxFiles?: number;
}

/**
 * FileUpload component options
 * Configuration passed when creating the component
 */
export interface FileUploadOptions {
    /**
     * Initial files
     * @default []
     */
    files?: File[];
    
    /**
     * Whether the component is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Whether multiple files can be selected
     * @default true
     */
    multiple?: boolean;
    
    /**
     * Accepted file types
     * @default undefined (all files)
     */
    accept?: string;
    
    /**
     * Maximum file size in bytes
     * @default undefined (no limit)
     */
    maxSize?: number;
    
    /**
     * Maximum number of files
     * @default undefined (no limit)
     */
    maxFiles?: number;
    
    /**
     * Callback when files are selected
     */
    onChange?: (files: File[]) => void;
    
    /**
     * Callback when a file is removed
     */
    onRemove?: (file: File) => void;
    
    /**
     * Callback when files are dropped
     */
    onDrop?: (files: File[]) => void;
    
    /**
     * Callback when drag enters the component
     */
    onDragEnter?: (event: DragEvent) => void;
    
    /**
     * Callback when drag leaves the component
     */
    onDragLeave?: (event: DragEvent) => void;
    
    /**
     * Callback when an error occurs
     */
    onError?: (error: { file: File; message: string }) => void;
    
    /**
     * Custom upload handler
     */
    onUpload?: (file: File) => Promise<void>;
    
    /**
     * Callback for upload progress
     */
    onProgress?: (file: File, progress: number) => void;
}

/**
 * FileUpload component events
 * Events that can be triggered by the component
 */
export interface FileUploadEvents {
    /**
     * Fired when files are added or removed
     */
    change: {
        files: File[];
    };
    
    /**
     * Fired when a file is removed
     */
    remove: {
        file: File;
    };
    
    /**
     * Fired when files are dropped
     */
    drop: {
        files: File[];
    };
    
    /**
     * Fired when drag enters
     */
    dragenter: {
        event: DragEvent;
    };
    
    /**
     * Fired when drag leaves
     */
    dragleave: {
        event: DragEvent;
    };
    
    /**
     * Fired when drag is over the component
     */
    dragover: {
        event: DragEvent;
    };
    
    /**
     * Fired when an error occurs
     */
    error: {
        file: File;
        message: string;
    };
    
    /**
     * Fired when upload starts
     */
    uploadstart: {
        file: File;
    };
    
    /**
     * Fired when upload progress updates
     */
    uploadprogress: {
        file: File;
        progress: number;
    };
    
    /**
     * Fired when upload completes
     */
    uploadcomplete: {
        file: File;
    };
    
    /**
     * Fired when upload is cancelled
     */
    uploadcancel: {
        file: File;
    };
}

/**
 * FileUpload component props
 * Props that can be passed to the component
 */
export interface FileUploadProps extends FileUploadOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Component ID
     */
    id?: string;
    
    /**
     * ARIA label
     */
    'aria-label'?: string;
    
    /**
     * ARIA labelledby
     */
    'aria-labelledby'?: string;
    
    /**
     * ARIA describedby
     */
    'aria-describedby'?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}