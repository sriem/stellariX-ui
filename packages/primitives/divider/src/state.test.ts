/**
 * Divider State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createDividerState } from './state';
import type { DividerOptions } from './types';

describe('Divider State', () => {
    it('should create state with default values', () => {
        const state = createDividerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setOrientation('horizontal'); // Trigger subscription with default value
        
        // State updates with full object
        expect(listener).toHaveBeenCalledWith({
            orientation: 'horizontal',
            variant: 'solid',
            labelPosition: 'center',
            hasLabel: false
        });
        
        // Verify other defaults through individual updates
        listener.mockClear();
        state.setVariant('solid');
        expect(listener).toHaveBeenCalledWith({
            orientation: 'horizontal',
            variant: 'solid',
            labelPosition: 'center',
            hasLabel: false
        });
        
        listener.mockClear();
        state.setLabelPosition('center');
        expect(listener).toHaveBeenCalledWith({
            orientation: 'horizontal',
            variant: 'solid',
            labelPosition: 'center',
            hasLabel: false
        });
    });
    
    it('should create state with initial options', () => {
        const options: DividerOptions = {
            orientation: 'vertical',
            variant: 'dashed',
            label: 'Section Break',
            labelPosition: 'start',
        };
        
        const state = createDividerState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setOrientation('vertical'); // Trigger subscription with initial value
        
        // State updates with full object
        expect(listener).toHaveBeenCalledWith({
            orientation: 'vertical',
            variant: 'dashed',
            labelPosition: 'start',
            hasLabel: true
        });
        
        // Verify other options through individual updates
        listener.mockClear();
        state.setVariant('dashed');
        expect(listener).toHaveBeenCalledWith({
            orientation: 'vertical',
            variant: 'dashed',
            labelPosition: 'start',
            hasLabel: true
        });
        
        listener.mockClear();
        state.setLabelPosition('start');
        expect(listener).toHaveBeenCalledWith({
            orientation: 'vertical',
            variant: 'dashed',
            labelPosition: 'start',
            hasLabel: true
        });
    });
    
    it('should update orientation', () => {
        const state = createDividerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setOrientation('vertical');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ orientation: 'vertical' })
        );
    });
    
    it('should update variant', () => {
        const state = createDividerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setVariant('dotted');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ variant: 'dotted' })
        );
    });
    
    it('should update label position', () => {
        const state = createDividerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setLabelPosition('end');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ labelPosition: 'end' })
        );
    });
    
    it('should update hasLabel', () => {
        const state = createDividerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.updateLabel(true);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ hasLabel: true })
        );
        
        listener.mockClear();
        state.updateLabel(false);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ hasLabel: false })
        );
    });
    
    it('should compute isHorizontal correctly', () => {
        const state = createDividerState();
        
        expect(state.isHorizontal()).toBe(true);
        
        state.setOrientation('vertical');
        expect(state.isHorizontal()).toBe(false);
        
        state.setOrientation('horizontal');
        expect(state.isHorizontal()).toBe(true);
    });
    
    it('should compute isVertical correctly', () => {
        const state = createDividerState();
        
        expect(state.isVertical()).toBe(false);
        
        state.setOrientation('vertical');
        expect(state.isVertical()).toBe(true);
        
        state.setOrientation('horizontal');
        expect(state.isVertical()).toBe(false);
    });
    
    it('should support derived state', () => {
        const state = createDividerState();
        const derivedOrientation = state.derive(s => `divider-${s.orientation}`);
        const listener = vi.fn();
        
        derivedOrientation.subscribe(listener);
        
        state.setOrientation('vertical');
        
        expect(derivedOrientation.get()).toBe('divider-vertical');
        expect(listener).toHaveBeenCalledWith('divider-vertical');
    });
    
    it('should detect label from options', () => {
        const stateWithLabel = createDividerState({ label: 'OR' });
        const listener1 = vi.fn();
        stateWithLabel.subscribe(listener1);
        stateWithLabel.updateLabel(true); // Trigger subscription
        expect(listener1.mock.calls[0][0].hasLabel).toBe(true);
        
        const stateWithoutLabel = createDividerState({});
        const listener2 = vi.fn();
        stateWithoutLabel.subscribe(listener2);
        stateWithoutLabel.updateLabel(false); // Trigger subscription
        expect(listener2.mock.calls[0][0].hasLabel).toBe(false);
    });
});