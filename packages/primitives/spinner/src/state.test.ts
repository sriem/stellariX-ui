/**
 * Spinner State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createSpinnerState } from './state';

describe('createSpinnerState', () => {
    it('should create state with default values', () => {
        const state = createSpinnerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.start(); // Trigger subscription (spinning defaults to true)
        
        // Expect full state object
        expect(listener).toHaveBeenCalledWith({
            spinning: true,
            size: 'md',
            color: undefined,
            label: 'Loading...',
            speed: 750
        });
        
        // Verify state is properly initialized
        listener.mockClear();
        state.stop();
        expect(listener).toHaveBeenCalledWith({
            spinning: false,
            size: 'md',
            color: undefined,
            label: 'Loading...',
            speed: 750
        });
    });
    
    it('should create state with custom options', () => {
        const state = createSpinnerState({
            spinning: false,
            size: 'lg',
            color: '#3182ce',
            label: 'Processing...',
            speed: 1000,
        });
        
        const listener = vi.fn();
        state.subscribe(listener);
        state.start(); // Trigger subscription to get current state
        
        // Expect full state object with custom options
        expect(listener).toHaveBeenCalledWith({
            spinning: true,
            size: 'lg',
            color: '#3182ce',
            label: 'Processing...',
            speed: 1000
        });
        
        // Verify state changes work correctly
        listener.mockClear();
        state.stop();
        expect(listener).toHaveBeenCalledWith({
            spinning: false,
            size: 'lg',
            color: '#3182ce',
            label: 'Processing...',
            speed: 1000
        });
    });
    
    it('should start spinning', () => {
        const state = createSpinnerState({ spinning: false });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.start();
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ spinning: true })
        );
    });
    
    it('should stop spinning', () => {
        const state = createSpinnerState({ spinning: true });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.stop();
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ spinning: false })
        );
    });
    
    it('should set size', () => {
        const state = createSpinnerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setSize('xs');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ size: 'xs' })
        );
        
        listener.mockClear();
        state.setSize('xl');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ size: 'xl' })
        );
    });
    
    it('should set color', () => {
        const state = createSpinnerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setColor('#ff0000');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ color: '#ff0000' })
        );
        
        listener.mockClear();
        state.setColor(undefined);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ color: undefined })
        );
    });
    
    it('should set label', () => {
        const state = createSpinnerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setLabel('Please wait...');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ label: 'Please wait...' })
        );
    });
    
    it('should set speed', () => {
        const state = createSpinnerState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setSpeed(500);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ speed: 500 })
        );
        
        listener.mockClear();
        state.setSpeed(2000);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ speed: 2000 })
        );
    });
    
    it('should notify subscribers on state changes', () => {
        const state = createSpinnerState();
        let notifiedState: any = null;
        
        const unsubscribe = state.subscribe((newState) => {
            notifiedState = newState;
        });
        
        state.start();
        expect(notifiedState).toBeDefined();
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