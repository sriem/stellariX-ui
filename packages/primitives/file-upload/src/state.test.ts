/**
 * FileUpload State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createFileUploadState } from './state';
import type { FileUploadOptions } from './types';

describe('FileUpload State', () => {
    it('should create state with default values', () => {
        const state = createFileUploadState({});
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Verify defaults by checking derived properties
        expect(state.isInteractive.get()).toBe(true);
        expect(state.hasFiles.get()).toBe(false);
        expect(state.canAddMore.get()).toBe(true);
        expect(state.totalProgress.get()).toBe(0);
        expect(state.hasErrors.get()).toBe(false);
        expect(state.uploadedCount.get()).toBe(0);
    });
    
    it('should create state with initial options', () => {
        const file1 = new File(['content1'], 'file1.txt', { type: 'text/plain' });
        const options: FileUploadOptions = {
            files: [file1],
            disabled: true,
            multiple: false,
            accept: 'image/*',
            maxSize: 1024 * 1024,
            maxFiles: 5
        };
        
        const state = createFileUploadState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Verify initial options
        expect(state.hasFiles.get()).toBe(true);
        expect(state.isInteractive.get()).toBe(false);
        expect(state.canAddMore.get()).toBe(true);
    });
    
    it('should manage files correctly', () => {
        const state = createFileUploadState({});
        const listener = vi.fn();
        
        const file1 = new File(['content1'], 'file1.txt', { type: 'text/plain' });
        const file2 = new File(['content2'], 'file2.txt', { type: 'text/plain' });
        
        state.subscribe(listener);
        
        // Add files
        state.addFiles([file1, file2]);
        expect(listener).toHaveBeenCalled();
        expect(state.hasFiles.get()).toBe(true);
        
        // Remove file
        listener.mockClear();
        state.removeFile(file1);
        expect(listener).toHaveBeenCalled();
        
        // Clear all files
        listener.mockClear();
        state.clearFiles();
        expect(listener).toHaveBeenCalled();
        expect(state.hasFiles.get()).toBe(false);
    });
    
    it('should prevent duplicate files', () => {
        const state = createFileUploadState({});
        const listener = vi.fn();
        
        const file1 = new File(['content'], 'file.txt', { type: 'text/plain' });
        const file2 = new File(['content'], 'file.txt', { type: 'text/plain' });
        
        state.subscribe(listener);
        
        state.addFiles([file1]);
        listener.mockClear();
        
        // Try to add duplicate
        state.addFiles([file2]);
        expect(listener).toHaveBeenCalled();
    });
    
    it('should respect maxFiles limit', () => {
        const state = createFileUploadState({ maxFiles: 2 });
        const listener = vi.fn();
        
        const file1 = new File(['1'], 'file1.txt');
        const file2 = new File(['2'], 'file2.txt');
        const file3 = new File(['3'], 'file3.txt');
        
        state.subscribe(listener);
        
        state.addFiles([file1, file2, file3]);
        expect(listener).toHaveBeenCalled();
        
        // Should only add 2 files due to limit
        expect(state.canAddMore.get()).toBe(false);
    });
    
    it('should track upload progress', () => {
        const state = createFileUploadState({});
        const file = new File(['content'], 'file.txt');
        
        state.setFiles([file]);
        state.setProgress('file.txt', 50);
        
        expect(state.totalProgress.get()).toBe(50);
        
        state.setProgress('file.txt', 100);
        expect(state.totalProgress.get()).toBe(100);
        expect(state.uploadedCount.get()).toBe(1);
    });
    
    it('should manage errors', () => {
        const state = createFileUploadState({});
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setError('file.txt', 'Upload failed');
        expect(listener).toHaveBeenCalled();
        expect(state.hasErrors.get()).toBe(true);
        
        listener.mockClear();
        state.clearError('file.txt');
        expect(listener).toHaveBeenCalled();
        expect(state.hasErrors.get()).toBe(false);
    });
    
    it('should validate file types', () => {
        const state = createFileUploadState({ accept: 'image/*,.pdf' });
        
        const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
        const textFile = new File([''], 'test.txt', { type: 'text/plain' });
        
        expect(state.validateFile(imageFile)).toBeNull();
        expect(state.validateFile(pdfFile)).toBeNull();
        expect(state.validateFile(textFile)).toContain('File type not accepted');
    });
    
    it('should validate file size', () => {
        const state = createFileUploadState({ maxSize: 1024 }); // 1KB
        
        const smallFile = new File(['a'], 'small.txt');
        const largeFile = new File(['a'.repeat(2000)], 'large.txt');
        
        expect(state.validateFile(smallFile)).toBeNull();
        expect(state.validateFile(largeFile)).toContain('File size exceeds');
    });
    
    it('should manage drag state', () => {
        const state = createFileUploadState({});
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setDragActive(true);
        expect(listener).toHaveBeenCalled();
        
        listener.mockClear();
        state.setDragActive(false);
        expect(listener).toHaveBeenCalled();
    });
    
    it('should calculate total progress correctly', () => {
        const state = createFileUploadState({});
        const file1 = new File(['1'], 'file1.txt');
        const file2 = new File(['2'], 'file2.txt');
        
        state.setFiles([file1, file2]);
        state.setProgress('file1.txt', 50);
        state.setProgress('file2.txt', 30);
        
        expect(state.totalProgress.get()).toBe(40); // (50+30)/2
    });
    
    it('should support derived state', () => {
        const state = createFileUploadState({});
        const fileCount = state.derive(s => s.files.length);
        const listener = vi.fn();
        
        fileCount.subscribe(listener);
        
        const file = new File([''], 'test.txt');
        state.addFiles([file]);
        
        expect(fileCount.get()).toBe(1);
        expect(listener).toHaveBeenCalledWith(1);
    });
});