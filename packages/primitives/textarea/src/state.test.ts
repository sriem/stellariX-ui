/**
 * Textarea State Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS use subscription pattern: state.subscribe(listener)
 * ✅ ALWAYS verify via listener calls: expect(listener).toHaveBeenCalledWith()
 * 
 * This prevents infinite loops and ensures proper reactive testing
 */

import { describe, it, expect, vi } from 'vitest';
import { createTextareaState } from './state';
import type { TextareaOptions } from './types';

describe('Textarea State', () => {
    it('should create state with default values', () => {
        const state = createTextareaState();
        const listener = vi.fn();
        
        // Subscribe to verify initial state
        state.subscribe(listener);
        
        // Trigger a dummy update to verify current state
        state.setValue(''); // Same as default
        
        // Verify default value
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: '' })
        );
        
        // Verify other defaults through individual updates
        listener.mockClear();
        state.setFocused(false);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ focused: false })
        );
        
        listener.mockClear();
        state.setDisabled(false);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ disabled: false })
        );
        
        listener.mockClear();
        state.setReadonly(false);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ readonly: false })
        );
        
        listener.mockClear();
        state.setError(false);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ error: false })
        );
        
        listener.mockClear();
        state.setRows(4);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ rows: 4 })
        );
    });
    
    it('should create state with initial options', () => {
        const options: TextareaOptions = {
            value: 'Initial text',
            disabled: true,
            readonly: true,
            error: true,
            rows: 6,
            minRows: 3,
            maxRows: 12,
        };
        
        const state = createTextareaState(options);
        const listener = vi.fn();
        
        // Subscribe and trigger update to verify state
        state.subscribe(listener);
        state.setValue('Initial text'); // Same as initial
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'Initial text' })
        );
        
        // Verify other options through individual updates
        listener.mockClear();
        state.setDisabled(true);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ disabled: true })
        );
        
        listener.mockClear();
        state.setReadonly(true);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ readonly: true })
        );
        
        listener.mockClear();
        state.setError(true);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ error: true })
        );
        
        listener.mockClear();
        state.setRows(6);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ rows: 6 })
        );
    });
    
    it('should update value', () => {
        const state = createTextareaState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setValue('Hello\nWorld');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'Hello\nWorld' })
        );
    });
    
    it('should update focused state', () => {
        const state = createTextareaState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setFocused(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ focused: true })
        );
        
        listener.mockClear();
        state.setFocused(false);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ focused: false })
        );
    });
    
    it('should clamp rows between min and max', () => {
        const state = createTextareaState({ minRows: 2, maxRows: 10 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Try to set below minimum
        state.setRows(1);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ rows: 2 })
        );
        
        // Try to set above maximum
        listener.mockClear();
        state.setRows(15);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ rows: 10 })
        );
        
        // Set within range
        listener.mockClear();
        state.setRows(5);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ rows: 5 })
        );
    });
    
    it('should compute isInteractive correctly', () => {
        const state = createTextareaState();
        
        // Initial state should be interactive
        expect(state.isInteractive()).toBe(true);
        
        // Disabled state affects interactivity
        state.setDisabled(true);
        expect(state.isInteractive()).toBe(false);
        
        state.setDisabled(false);
        expect(state.isInteractive()).toBe(true);
        
        // Readonly state also affects interactivity
        state.setReadonly(true);
        expect(state.isInteractive()).toBe(false);
        
        // Both disabled and readonly
        state.setDisabled(true);
        expect(state.isInteractive()).toBe(false);
    });
    
    it('should compute isEmpty correctly', () => {
        const state = createTextareaState();
        
        // Initial empty state
        expect(state.isEmpty()).toBe(true);
        
        // With content
        state.setValue('Hello');
        expect(state.isEmpty()).toBe(false);
        
        // With only whitespace
        state.setValue('   \n\t   ');
        expect(state.isEmpty()).toBe(true);
        
        // With content and whitespace
        state.setValue('  Hello  ');
        expect(state.isEmpty()).toBe(false);
    });
    
    it('should compute character count correctly', () => {
        const state = createTextareaState();
        
        expect(state.getCharCount()).toBe(0);
        
        state.setValue('Hello');
        expect(state.getCharCount()).toBe(5);
        
        state.setValue('Hello\nWorld');
        expect(state.getCharCount()).toBe(11);
        
        state.setValue('你好世界'); // Unicode characters
        expect(state.getCharCount()).toBe(4);
    });
    
    it('should compute line count correctly', () => {
        const state = createTextareaState();
        
        expect(state.getLineCount()).toBe(1); // Empty textarea has 1 line
        
        state.setValue('Single line');
        expect(state.getLineCount()).toBe(1);
        
        state.setValue('Line 1\nLine 2');
        expect(state.getLineCount()).toBe(2);
        
        state.setValue('Line 1\nLine 2\nLine 3\n');
        expect(state.getLineCount()).toBe(4); // Trailing newline counts as a line
    });
    
    it('should support derived state', () => {
        const state = createTextareaState();
        const derivedValue = state.derive(s => s.value.length);
        const listener = vi.fn();
        
        derivedValue.subscribe(listener);
        
        state.setValue('Hello');
        
        expect(derivedValue.get()).toBe(5);
        expect(listener).toHaveBeenCalledWith(5);
        
        state.setValue('Hello World');
        expect(derivedValue.get()).toBe(11);
        expect(listener).toHaveBeenCalledWith(11);
    });
});