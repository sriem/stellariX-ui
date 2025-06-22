/**
 * Spinner State Tests
 */

import { describe, it, expect } from 'vitest';
import { createSpinnerState } from './state';

describe('createSpinnerState', () => {
    it('should create state with default values', () => {
        const state = createSpinnerState();
        const currentState = state.getState();
        
        expect(currentState.spinning).toBe(true);
        expect(currentState.size).toBe('md');
        expect(currentState.color).toBeUndefined();
        expect(currentState.label).toBe('Loading...');
        expect(currentState.speed).toBe(750);
    });
    
    it('should create state with custom options', () => {
        const state = createSpinnerState({
            spinning: false,
            size: 'lg',
            color: '#3182ce',
            label: 'Processing...',
            speed: 1000,
        });
        
        const currentState = state.getState();
        expect(currentState.spinning).toBe(false);
        expect(currentState.size).toBe('lg');
        expect(currentState.color).toBe('#3182ce');
        expect(currentState.label).toBe('Processing...');
        expect(currentState.speed).toBe(1000);
    });
    
    it('should start spinning', () => {
        const state = createSpinnerState({ spinning: false });
        
        expect(state.getState().spinning).toBe(false);
        state.start();
        expect(state.getState().spinning).toBe(true);
    });
    
    it('should stop spinning', () => {
        const state = createSpinnerState({ spinning: true });
        
        expect(state.getState().spinning).toBe(true);
        state.stop();
        expect(state.getState().spinning).toBe(false);
    });
    
    it('should set size', () => {
        const state = createSpinnerState();
        
        state.setSize('xs');
        expect(state.getState().size).toBe('xs');
        
        state.setSize('xl');
        expect(state.getState().size).toBe('xl');
    });
    
    it('should set color', () => {
        const state = createSpinnerState();
        
        state.setColor('#ff0000');
        expect(state.getState().color).toBe('#ff0000');
        
        state.setColor(undefined);
        expect(state.getState().color).toBeUndefined();
    });
    
    it('should set label', () => {
        const state = createSpinnerState();
        
        state.setLabel('Please wait...');
        expect(state.getState().label).toBe('Please wait...');
    });
    
    it('should set speed', () => {
        const state = createSpinnerState();
        
        state.setSpeed(500);
        expect(state.getState().speed).toBe(500);
        
        state.setSpeed(2000);
        expect(state.getState().speed).toBe(2000);
    });
    
    it('should notify subscribers on state changes', () => {
        const state = createSpinnerState();
        let notifiedState: any = null;
        
        const unsubscribe = state.subscribe((newState) => {
            notifiedState = newState;
        });
        
        state.start();
        expect(notifiedState).toEqual(state.getState());
        expect(notifiedState.spinning).toBe(true);
        
        state.setSize('lg');
        expect(notifiedState.size).toBe('lg');
        
        unsubscribe();
    });
    
    it('should support derived state', () => {
        const state = createSpinnerState({ size: 'sm' });
        
        const derivedSize = state.derive((s) => s.size);
        expect(derivedSize.get()).toBe('sm');
        
        let derivedValue: string | undefined;
        const unsubscribe = derivedSize.subscribe((value) => {
            derivedValue = value;
        });
        
        state.setSize('lg');
        expect(derivedValue).toBe('lg');
        
        unsubscribe();
    });
});