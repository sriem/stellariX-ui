/**
 * ProgressBar State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createProgressBarState } from './state';
import type { ProgressBarOptions } from './types';

describe('ProgressBar State', () => {
    it('should create state with default values', () => {
        const state = createProgressBarState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setValue(0);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 0,
            max: 100,
            variant: 'default',
            showLabel: false,
            isIndeterminate: false,
            disabled: false
        }));
    });
    
    it('should create state with initial options', () => {
        const options: ProgressBarOptions = {
            value: 50,
            max: 200,
            variant: 'success',
            showLabel: true,
            isIndeterminate: false,
            disabled: true
        };
        
        const state = createProgressBarState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setValue(50);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 50,
            max: 200,
            variant: 'success',
            showLabel: true,
            isIndeterminate: false,
            disabled: true
        }));
    });
    
    it('should update value and clamp to bounds', () => {
        const state = createProgressBarState({ max: 100 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setValue(50);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ value: 50 }));
        
        listener.mockClear();
        state.setValue(150);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ value: 100 }));
        
        listener.mockClear();
        state.setValue(-10);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ value: 0 }));
    });
    
    it('should trigger onChange callback', () => {
        const onChange = vi.fn();
        const state = createProgressBarState({ onChange, max: 100 });
        
        state.setValue(25);
        expect(onChange).toHaveBeenCalledWith(25, 25);
        
        state.setValue(50);
        expect(onChange).toHaveBeenCalledWith(50, 50);
    });
    
    it('should trigger onComplete callback when reaching 100%', () => {
        const onComplete = vi.fn();
        const state = createProgressBarState({ onComplete, max: 100 });
        
        state.setValue(50);
        expect(onComplete).not.toHaveBeenCalled();
        
        state.setValue(100);
        expect(onComplete).toHaveBeenCalledTimes(1);
        
        state.setValue(100);
        expect(onComplete).toHaveBeenCalledTimes(1);
        
        state.setValue(90);
        state.setValue(100);
        expect(onComplete).toHaveBeenCalledTimes(2);
    });
    
    it('should update variant', () => {
        const state = createProgressBarState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setVariant('success');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ variant: 'success' }));
        
        listener.mockClear();
        state.setVariant('error');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ variant: 'error' }));
    });
    
    it('should increment and decrement value', () => {
        const state = createProgressBarState({ value: 50, max: 100 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.increment();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ value: 51 }));
        
        listener.mockClear();
        state.increment(10);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ value: 61 }));
        
        listener.mockClear();
        state.decrement();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ value: 60 }));
        
        listener.mockClear();
        state.decrement(20);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ value: 40 }));
    });
    
    it('should reset to initial state', () => {
        const state = createProgressBarState({ value: 30, max: 100 });
        const listener = vi.fn();
        
        state.setValue(80);
        state.setVariant('success');
        state.setShowLabel(true);
        
        state.subscribe(listener);
        state.reset();
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 30,
            max: 100,
            variant: 'default',
            showLabel: false
        }));
    });
    
    it('should set progress with value and max', () => {
        const state = createProgressBarState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setProgress(75, 150);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 75,
            max: 150
        }));
        
        listener.mockClear();
        state.setProgress(100);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 100,
            max: 150
        }));
    });
    
    it('should compute percentage correctly', () => {
        const state = createProgressBarState({ value: 50, max: 100 });
        
        expect(state.getPercentage()).toBe(50);
        
        state.setValue(75);
        expect(state.getPercentage()).toBe(75);
        
        state.setMax(200);
        expect(state.getPercentage()).toBe(38);
        
        state.setIndeterminate(true);
        expect(state.getPercentage()).toBe(0);
    });
    
    it('should compute isComplete correctly', () => {
        const state = createProgressBarState({ value: 50, max: 100 });
        
        expect(state.isComplete()).toBe(false);
        
        state.setValue(100);
        expect(state.isComplete()).toBe(true);
        
        state.setValue(150);
        expect(state.isComplete()).toBe(true);
        
        state.setValue(99);
        expect(state.isComplete()).toBe(false);
    });
    
    it('should support derived state', () => {
        const state = createProgressBarState({ value: 50, max: 100 });
        const derivedPercentage = state.derive(s => Math.round((s.value / s.max) * 100));
        const listener = vi.fn();
        
        derivedPercentage.subscribe(listener);
        
        state.setValue(75);
        
        expect(derivedPercentage.get()).toBe(75);
        expect(listener).toHaveBeenCalledWith(75);
    });
    
    it('should handle indeterminate state', () => {
        const state = createProgressBarState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setIndeterminate(true);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ isIndeterminate: true }));
        
        listener.mockClear();
        state.setIndeterminate(false);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ isIndeterminate: false }));
    });
});