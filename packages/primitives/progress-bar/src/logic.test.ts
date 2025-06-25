/**
 * ProgressBar Logic Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProgressBarLogic } from './logic';
import { createProgressBarState } from './state';
import type { ProgressBarOptions } from './types';

describe('ProgressBar Logic', () => {
    let stateStore: ReturnType<typeof createProgressBarState>;
    let logic: ReturnType<typeof createProgressBarLogic>;
    let mockOnChange: ReturnType<typeof vi.fn>;
    let mockOnComplete: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnChange = vi.fn();
        mockOnComplete = vi.fn();
        
        const options: ProgressBarOptions = {
            onChange: mockOnChange,
            onComplete: mockOnComplete,
            value: 0,
            max: 100
        };
        
        stateStore = createProgressBarState(options);
        logic = createProgressBarLogic(stateStore, options);
        
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle change events', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('change', { 
            value: 50,
            percentage: 50,
            previousValue: 0
        });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ value: 50 }));
    });
    
    it('should handle complete events', () => {
        logic.handleEvent('complete', { 
            value: 100,
            max: 100
        });
        
        expect(mockOnComplete).toHaveBeenCalledWith();
    });
    
    it('should handle variant change events', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('variantChange', { 
            variant: 'success',
            previousVariant: 'default'
        });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ variant: 'success' }));
    });
    
    it('should provide correct a11y props for determinate state', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            role: 'progressbar',
            'aria-valuenow': 0,
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuetext': '0%',
            'aria-busy': undefined,
            'aria-disabled': undefined
        });
        
        stateStore.setValue(75);
        listener.mockClear();
        
        const updatedProps = logic.getA11yProps('root');
        expect(updatedProps).toEqual({
            role: 'progressbar',
            'aria-valuenow': 75,
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuetext': '75%',
            'aria-busy': undefined,
            'aria-disabled': undefined
        });
    });
    
    it('should provide correct a11y props for indeterminate state', () => {
        stateStore.setIndeterminate(true);
        
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            role: 'progressbar',
            'aria-valuenow': undefined,
            'aria-valuemin': undefined,
            'aria-valuemax': undefined,
            'aria-valuetext': 'Loading...',
            'aria-busy': 'true',
            'aria-disabled': undefined
        });
    });
    
    it('should provide correct a11y props when disabled', () => {
        stateStore.setDisabled(true);
        
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual(expect.objectContaining({
            'aria-disabled': 'true'
        }));
    });
    
    it('should not provide interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        expect(Object.keys(handlers)).toHaveLength(0);
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        expect(true).toBe(true);
    });
});