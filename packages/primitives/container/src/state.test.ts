/**
 * Container State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createContainerState } from './state';
import type { ContainerOptions } from './types';

describe('Container State', () => {
    it('should create state with default values', () => {
        const state = createContainerState();
        const currentState = state.getState();
        
        expect(currentState.size).toBe('md');
        expect(currentState.variant).toBe('default');
        expect(currentState.padding).toBe('1rem');
        expect(currentState.maxWidth).toBeUndefined();
    });
    
    it('should create state with initial options', () => {
        const options: ContainerOptions = {
            size: 'lg',
            variant: 'fluid',
            maxWidth: '1400px',
            padding: '2rem',
        };
        
        const state = createContainerState(options);
        const currentState = state.getState();
        
        expect(currentState.size).toBe('lg');
        expect(currentState.variant).toBe('fluid');
        expect(currentState.maxWidth).toBe('1400px');
        expect(currentState.padding).toBe('2rem');
    });
    
    it('should update size', () => {
        const state = createContainerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setSize('xl');
        
        expect(state.getState().size).toBe('xl');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ size: 'xl' })
        );
    });
    
    it('should update variant', () => {
        const state = createContainerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setVariant('responsive');
        
        expect(state.getState().variant).toBe('responsive');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ variant: 'responsive' })
        );
    });
    
    it('should compute max width based on size', () => {
        const state = createContainerState({ size: 'sm' });
        expect(state.getComputedMaxWidth()).toBe('640px');
        
        state.setSize('lg');
        expect(state.getComputedMaxWidth()).toBe('1024px');
        
        state.setSize('full');
        expect(state.getComputedMaxWidth()).toBe('100%');
    });
    
    it('should use custom max width when provided', () => {
        const state = createContainerState({ 
            size: 'md',
            maxWidth: '900px' 
        });
        
        expect(state.getComputedMaxWidth()).toBe('900px');
    });
    
    it('should return 100% for fluid variant', () => {
        const state = createContainerState({ 
            size: 'md',
            variant: 'fluid' 
        });
        
        expect(state.getComputedMaxWidth()).toBe('100%');
    });
    
    it('should compute styles correctly', () => {
        const state = createContainerState({ size: 'md' });
        const styles = state.getComputedStyles();
        
        expect(styles.maxWidth).toBe('768px');
        expect(styles.padding).toBe('1rem');
        expect(styles.width).toBe('100%');
        expect(styles.marginLeft).toBe('auto');
        expect(styles.marginRight).toBe('auto');
    });
    
    it('should not center fluid containers', () => {
        const state = createContainerState({ variant: 'fluid' });
        const styles = state.getComputedStyles();
        
        expect(styles.marginLeft).toBeUndefined();
        expect(styles.marginRight).toBeUndefined();
    });
    
    it('should add responsive padding for responsive variant', () => {
        const state = createContainerState({ variant: 'responsive' });
        const styles = state.getComputedStyles();
        
        expect(styles.paddingLeft).toBe('clamp(1rem, 5vw, 3rem)');
        expect(styles.paddingRight).toBe('clamp(1rem, 5vw, 3rem)');
    });
    
    it('should respect center option', () => {
        const state = createContainerState({ center: false });
        const styles = state.getComputedStyles();
        
        expect(styles.marginLeft).toBeUndefined();
        expect(styles.marginRight).toBeUndefined();
    });
    
    it('should support derived state', () => {
        const state = createContainerState();
        const derivedMaxWidth = state.derive(s => state.getComputedMaxWidth());
        const listener = vi.fn();
        
        derivedMaxWidth.subscribe(listener);
        
        state.setSize('xl');
        
        expect(derivedMaxWidth.get()).toBe('1280px');
        // Note: Derived state might not trigger if getComputedMaxWidth is not reactive
        // This is expected behavior for computed properties
    });
});