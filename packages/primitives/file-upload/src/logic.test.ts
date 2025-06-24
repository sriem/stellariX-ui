/**
 * FileUpload Logic Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFileUploadLogic } from './logic';
import { createFileUploadState } from './state';
import type { FileUploadOptions } from './types';

describe('FileUpload Logic', () => {
    let stateStore: ReturnType<typeof createFileUploadState>;
    let logic: ReturnType<typeof createFileUploadLogic>;
    let mockOnChange: ReturnType<typeof vi.fn>;
    let mockOnDrop: ReturnType<typeof vi.fn>;
    let mockOnError: ReturnType<typeof vi.fn>;
    let mockOnRemove: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnChange = vi.fn();
        mockOnDrop = vi.fn();
        mockOnError = vi.fn();
        mockOnRemove = vi.fn();
        
        const options: FileUploadOptions = {
            onChange: mockOnChange,
            onDrop: mockOnDrop,
            onError: mockOnError,
            onRemove: mockOnRemove,
        };
        
        stateStore = createFileUploadState(options);
        logic = createFileUploadLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle file change events', () => {
        const file = new File(['content'], 'test.txt');
        logic.handleEvent('change', { files: [file] });
        
        expect(mockOnChange).toHaveBeenCalledWith([file]);
    });
    
    it('should handle file remove events', () => {
        const file = new File(['content'], 'test.txt');
        stateStore.setFiles([file]);
        
        logic.handleEvent('remove', { file });
        
        expect(mockOnRemove).toHaveBeenCalledWith(file);
        expect(mockOnChange).toHaveBeenCalledWith([]);
    });
    
    it('should handle drop events with validation', () => {
        const validFile = new File(['content'], 'test.txt');
        stateStore.setAccept('.txt');
        
        logic.handleEvent('drop', { files: [validFile] });
        
        expect(mockOnDrop).toHaveBeenCalledWith([validFile]);
        expect(mockOnChange).toHaveBeenCalledWith([validFile]);
    });
    
    it('should handle validation errors on drop', () => {
        const invalidFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
        stateStore.setAccept('.txt');
        
        logic.handleEvent('drop', { files: [invalidFile] });
        
        expect(mockOnError).toHaveBeenCalledWith({
            file: invalidFile,
            message: expect.stringContaining('File type not accepted')
        });
    });
    
    it('should handle drag enter/leave events', () => {
        const mockDragEnter = vi.fn();
        const mockDragLeave = vi.fn();
        
        const options: FileUploadOptions = {
            onDragEnter: mockDragEnter,
            onDragLeave: mockDragLeave,
        };
        
        logic = createFileUploadLogic(stateStore, options);
        logic.connect(stateStore);
        
        const dragEvent = new DragEvent('dragenter');
        logic.handleEvent('dragenter', { event: dragEvent });
        expect(mockDragEnter).toHaveBeenCalledWith(dragEvent);
        
        const leaveEvent = new DragEvent('dragleave');
        logic.handleEvent('dragleave', { event: leaveEvent });
        expect(mockDragLeave).toHaveBeenCalledWith(leaveEvent);
    });
    
    it('should provide correct a11y props for dropzone', () => {
        const props = logic.getA11yProps('dropzone');
        
        expect(props).toMatchObject({
            role: 'region',
            'aria-label': 'File upload dropzone',
            'aria-disabled': false,
            'aria-busy': false,
            tabIndex: 0,
        });
        
        // Update state and check again
        stateStore.setDisabled(true);
        stateStore.setUploading(true);
        
        const updatedProps = logic.getA11yProps('dropzone');
        expect(updatedProps).toMatchObject({
            'aria-disabled': true,
            'aria-busy': true,
            tabIndex: -1,
        });
    });
    
    it('should provide correct a11y props for input', () => {
        stateStore.setMultiple(false);
        stateStore.setAccept('image/*');
        
        const props = logic.getA11yProps('input');
        
        expect(props).toMatchObject({
            type: 'file',
            multiple: false,
            accept: 'image/*',
            disabled: false,
            'aria-label': 'Select files to upload',
            tabIndex: -1,
        });
    });
    
    it('should provide interaction handlers for dropzone', () => {
        const handlers = logic.getInteractionHandlers('dropzone');
        
        expect(handlers).toHaveProperty('onDragEnter');
        expect(handlers).toHaveProperty('onDragOver');
        expect(handlers).toHaveProperty('onDragLeave');
        expect(handlers).toHaveProperty('onDrop');
        expect(handlers).toHaveProperty('onClick');
        expect(handlers).toHaveProperty('onKeyDown');
    });
    
    it('should handle dropzone drag events correctly', () => {
        const handlers = logic.getInteractionHandlers('dropzone');
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        const dragEvent = new DragEvent('dragenter', {
            dataTransfer: new DataTransfer()
        });
        
        handlers.onDragEnter(dragEvent);
        expect(listener).toHaveBeenCalled();
        
        // Clear and test drop
        listener.mockClear();
        
        const dropEvent = new DragEvent('drop', {
            dataTransfer: new DataTransfer()
        });
        handlers.onDrop(dropEvent);
        expect(listener).toHaveBeenCalled();
    });
    
    it('should not handle interactions when disabled', () => {
        stateStore.setDisabled(true);
        
        const handlers = logic.getInteractionHandlers('dropzone');
        const clickEvent = new MouseEvent('click', { cancelable: true });
        
        // Mock getElementById to ensure input click is not called
        const mockInput = { click: vi.fn() };
        vi.spyOn(document, 'getElementById').mockReturnValue(mockInput as any);
        
        // The handler is called but nothing happens
        handlers.onClick(clickEvent);
        
        // Verify the click was prevented and input was not clicked
        expect(clickEvent.defaultPrevented).toBe(true);
        expect(mockInput.click).not.toHaveBeenCalled();
    });
    
    it('should handle keyboard activation', () => {
        const handlers = logic.getInteractionHandlers('dropzone');
        
        // Mock getElementById to return a mock input
        const mockInput = { click: vi.fn() };
        vi.spyOn(document, 'getElementById').mockReturnValue(mockInput as any);
        
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        handlers.onKeyDown(enterEvent);
        
        expect(mockInput.click).toHaveBeenCalled();
    });
    
    it('should handle file input change', () => {
        const handlers = logic.getInteractionHandlers('input');
        const file = new File(['content'], 'test.txt');
        
        const changeEvent = {
            target: {
                files: [file],
                value: ''
            }
        } as any;
        
        handlers.onChange(changeEvent);
        
        expect(mockOnChange).toHaveBeenCalledWith([file]);
    });
    
    it('should track upload progress', () => {
        const file = new File(['content'], 'test.txt');
        
        // First add the file to the state
        stateStore.setFiles([file]);
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        listener.mockClear();
        
        logic.handleEvent('uploadstart', { file });
        
        // Test via subscription
        expect(listener).toHaveBeenCalled();
        
        logic.handleEvent('uploadprogress', { file, progress: 50 });
        expect(stateStore.totalProgress.get()).toBe(50);
        
        logic.handleEvent('uploadcomplete', { file });
        expect(stateStore.uploadedCount.get()).toBe(1);
    });
});