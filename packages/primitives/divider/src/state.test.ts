/**
 * Divider State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createDividerState } from './state';
import type { DividerOptions } from './types';

describe('Divider State', () => {
    it('should create state with default values', () => {
        const state = createDividerState();
        const currentState = state.getState();
        
        expect(currentState.orientation).toBe('horizontal');
        expect(currentState.variant).toBe('solid');
        expect(currentState.hasLabel).toBe(false);
        expect(currentState.labelPosition).toBe('center');
    });
    
    it('should create state with initial options', () => {
        const options: DividerOptions = {
            orientation: 'vertical',
            variant: 'dashed',
            label: 'Section Break',
            labelPosition: 'start',
        };
        
        const state = createDividerState(options);
        const currentState = state.getState();
        
        expect(currentState.orientation).toBe('vertical');
        expect(currentState.variant).toBe('dashed');
        expect(currentState.hasLabel).toBe(true);
        expect(currentState.labelPosition).toBe('start');
    });
    
    it('should update orientation', () => {
        const state = createDividerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setOrientation('vertical');
        
        expect(state.getState().orientation).toBe('vertical');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ orientation: 'vertical' })
        );
    });
    
    it('should update variant', () => {
        const state = createDividerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setVariant('dotted');
        
        expect(state.getState().variant).toBe('dotted');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ variant: 'dotted' })
        );
    });
    
    it('should update label position', () => {
        const state = createDividerState();
        
        state.setLabelPosition('end');
        expect(state.getState().labelPosition).toBe('end');
    });
    
    it('should update hasLabel', () => {
        const state = createDividerState();
        
        expect(state.getState().hasLabel).toBe(false);
        
        state.updateLabel(true);
        expect(state.getState().hasLabel).toBe(true);
        
        state.updateLabel(false);
        expect(state.getState().hasLabel).toBe(false);
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
        expect(stateWithLabel.getState().hasLabel).toBe(true);
        
        const stateWithoutLabel = createDividerState({});
        expect(stateWithoutLabel.getState().hasLabel).toBe(false);
    });
});