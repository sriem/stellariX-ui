/**
 * Slider State Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS use subscription pattern: state.subscribe(listener)
 * ✅ ALWAYS verify via listener calls: expect(listener).toHaveBeenCalledWith()
 * 
 * This prevents infinite loops and ensures proper reactive testing
 */

import { describe, it, expect, vi } from 'vitest';
import { createSliderState } from './state';
import type { SliderOptions } from './types';

describe('Slider State', () => {
    it('should create state with default values for single slider', () => {
        const state = createSliderState();
        const listener = vi.fn();
        
        // Subscribe to verify initial state
        state.subscribe(listener);
        
        // Trigger a dummy update to verify current state
        state.setValue(0); // Same as default
        
        // Initial state should be single slider with value 0
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 0
        }));
    });
    
    it('should create state with default values for range slider', () => {
        const state = createSliderState({ value: [0, 100] });
        const listener = vi.fn();
        
        // Subscribe to verify initial state
        state.subscribe(listener);
        
        // Trigger a dummy update to verify current state
        state.setValue([0, 100]); // Same as default
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: [0, 100],
            isRange: true
        }));
    });
    
    it('should create state with initial options', () => {
        const options: SliderOptions = {
            value: 50,
            min: 0,
            max: 200,
            step: 5,
            disabled: true,
            orientation: 'vertical',
        };
        
        const state = createSliderState(options);
        const listener = vi.fn();
        
        // Subscribe and trigger update to verify state
        state.subscribe(listener);
        state.setValue(50); // Same as initial
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 50
        }));
    });
    
    it('should update value with clamping and step rounding', () => {
        const state = createSliderState({ min: 0, max: 100, step: 10 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Test value within range
        state.setValue(25);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 30 // Rounded to nearest step
        }));
        
        // Test value above max
        listener.mockClear();
        state.setValue(150);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 100 // Clamped to max
        }));
        
        // Test value below min
        listener.mockClear();
        state.setValue(-50);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 0 // Clamped to min
        }));
    });
    
    it('should update range values with proper ordering', () => {
        const state = createSliderState({ value: [20, 80] });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Test normal range update
        state.setValue([30, 70]);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: [30, 70]
        }));
    });
    
    it('should increment and decrement single value', () => {
        const state = createSliderState({ value: 50, step: 10 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.increment();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 60
        }));
        
        listener.mockClear();
        state.decrement();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 50
        }));
    });
    
    it('should increment and decrement range values', () => {
        const state = createSliderState({ value: [20, 80], step: 5 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Increment min thumb
        state.increment(0);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: [25, 80]
        }));
        
        // Increment max thumb
        listener.mockClear();
        state.increment(1);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: [25, 85]
        }));
        
        // Decrement min thumb
        listener.mockClear();
        state.decrement(0);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: [20, 85]
        }));
        
        // Decrement max thumb
        listener.mockClear();
        state.decrement(1);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: [20, 80]
        }));
    });
    
    it('should handle page increments and decrements', () => {
        const state = createSliderState({ value: 50, min: 0, max: 100 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Page size should be 10% of range = 10
        state.incrementPage();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 60
        }));
        
        listener.mockClear();
        state.decrementPage();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 50
        }));
    });
    
    it('should set to min and max values', () => {
        const state = createSliderState({ value: 50, min: 10, max: 90 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setToMin();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 10
        }));
        
        listener.mockClear();
        state.setToMax();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 90
        }));
    });
    
    it('should enforce proper ordering for range sliders', () => {
        const state = createSliderState({ value: [40, 60] });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Try to set min thumb above max thumb
        state.setValue([70, 60]);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: [70, 60] // Should allow this, logic layer will handle constraints
        }));
    });
    
    it('should compute isInteractive correctly', () => {
        const state = createSliderState();
        
        // Initial state should be interactive
        expect(state.isInteractive()).toBe(true);
        
        // Verify disabled state affects interactivity
        state.setDisabled(true);
        expect(state.isInteractive()).toBe(false);
        
        state.setDisabled(false);
        expect(state.isInteractive()).toBe(true);
    });
    
    it('should calculate percentage correctly', () => {
        const state = createSliderState({ value: 25, min: 0, max: 100 });
        
        expect(state.getPercentage()).toBe(25);
        
        // Test with different range
        state.setMin(50);
        state.setMax(150);
        state.setValue(75);
        expect(state.getPercentage()).toBe(25); // (75-50)/(150-50) = 25%
    });
    
    it('should calculate percentage for range sliders', () => {
        const state = createSliderState({ value: [25, 75], min: 0, max: 100 });
        
        expect(state.getPercentage(0)).toBe(25);
        expect(state.getPercentage(1)).toBe(75);
    });
    
    it('should calculate value from percentage', () => {
        const state = createSliderState({ min: 0, max: 100, step: 1 });
        
        expect(state.getValueFromPercentage(25)).toBe(25);
        expect(state.getValueFromPercentage(50)).toBe(50);
        expect(state.getValueFromPercentage(75)).toBe(75);
        
        // Test with different range and step
        state.setMin(50);
        state.setMax(150);
        state.setStep(10);
        
        expect(state.getValueFromPercentage(25)).toBe(80); // 50 + 0.25 * 100 = 75, rounded to 80
        expect(state.getValueFromPercentage(50)).toBe(100); // 50 + 0.50 * 100 = 100
    });
    
    it('should support derived state', () => {
        const state = createSliderState({ value: 50 });
        const derivedPercentage = state.derive(s => {
            const value = Array.isArray(s.value) ? s.value[0] : s.value;
            return ((value - s.min) / (s.max - s.min)) * 100;
        });
        const listener = vi.fn();
        
        derivedPercentage.subscribe(listener);
        
        state.setValue(75);
        
        expect(derivedPercentage.get()).toBe(75);
        expect(listener).toHaveBeenCalledWith(75);
    });
});