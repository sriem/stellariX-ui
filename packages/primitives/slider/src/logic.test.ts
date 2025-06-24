/**
 * Slider Logic Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS test via callbacks: onChange, onFocus, etc.
 * ✅ ALWAYS verify behavior through callback invocations
 * ✅ For a11y props, call logic.getA11yProps() directly
 * 
 * This prevents infinite loops and ensures proper behavior testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSliderLogic } from './logic';
import { createSliderState } from './state';
import type { SliderOptions } from './types';

describe('Slider Logic', () => {
    let stateStore: ReturnType<typeof createSliderState>;
    let logic: ReturnType<typeof createSliderLogic>;
    let mockOnChange: ReturnType<typeof vi.fn>;
    let mockOnDragStart: ReturnType<typeof vi.fn>;
    let mockOnDragEnd: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnChange = vi.fn();
        mockOnDragStart = vi.fn();
        mockOnDragEnd = vi.fn();
        
        const options: SliderOptions = {
            onChange: mockOnChange,
            onDragStart: mockOnDragStart,
            onDragEnd: mockOnDragEnd,
        };
        
        stateStore = createSliderState(options);
        logic = createSliderLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle change events', () => {
        // Subscribe to verify state updates
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('change', { 
            value: 50, 
            previousValue: 0 
        });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 50
        }));
        expect(mockOnChange).toHaveBeenCalledWith(50);
    });
    
    it('should handle range change events', () => {
        const options: SliderOptions = {
            value: [20, 80],
            onChange: mockOnChange,
        };
        
        stateStore = createSliderState(options);
        logic = createSliderLogic(stateStore, options);
        logic.connect(stateStore);
        logic.initialize();
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('change', { 
            value: [30, 70], 
            previousValue: [20, 80] 
        });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: [30, 70]
        }));
        expect(mockOnChange).toHaveBeenCalledWith([30, 70]);
    });
    
    it('should handle dragStart events', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('dragStart', { value: 50 });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            dragging: true
        }));
        expect(mockOnDragStart).toHaveBeenCalledWith();
    });
    
    it('should handle dragEnd events', () => {
        stateStore.setDragging(true);
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('dragEnd', { value: 50 });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            dragging: false
        }));
        expect(mockOnDragEnd).toHaveBeenCalledWith();
    });
    
    it('should handle focus events', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('focus', { event: new FocusEvent('focus') });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focused: true
        }));
    });
    
    it('should handle blur events', () => {
        stateStore.setFocused(true);
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('blur', { event: new FocusEvent('blur') });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focused: false
        }));
    });
    
    it('should provide correct a11y props for root', () => {
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            'aria-orientation': 'horizontal',
            'aria-disabled': undefined,
        });
        
        // Update state and check again
        stateStore.setDisabled(true);
        stateStore.setOrientation('vertical');
        
        const updatedProps = logic.getA11yProps('root');
        expect(updatedProps).toEqual({
            'aria-orientation': 'vertical',
            'aria-disabled': 'true',
        });
    });
    
    it('should provide correct a11y props for thumb', () => {
        stateStore.setValue(50);
        
        const props = logic.getA11yProps('thumb');
        
        expect(props).toEqual({
            role: 'slider',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': 50,
            'aria-disabled': undefined,
            tabIndex: 0,
        });
        
        // Test disabled state
        stateStore.setDisabled(true);
        const disabledProps = logic.getA11yProps('thumb');
        expect(disabledProps.tabIndex).toBe(-1);
        expect(disabledProps['aria-disabled']).toBe('true');
    });
    
    it('should provide correct a11y props for range thumbs', () => {
        const options: SliderOptions = {
            value: [25, 75],
        };
        
        stateStore = createSliderState(options);
        logic = createSliderLogic(stateStore, options);
        logic.connect(stateStore);
        
        const minProps = logic.getA11yProps('thumbMin');
        expect(minProps).toEqual({
            role: 'slider',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': 25,
            'aria-disabled': undefined,
            tabIndex: 0,
        });
        
        const maxProps = logic.getA11yProps('thumbMax');
        expect(maxProps).toEqual({
            role: 'slider',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': 75,
            'aria-disabled': undefined,
            tabIndex: 0,
        });
    });
    
    it('should provide interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('thumb');
        
        expect(handlers).toHaveProperty('onKeyDown');
        expect(handlers).toHaveProperty('onFocus');
        expect(handlers).toHaveProperty('onBlur');
    });
    
    it('should handle keyboard navigation for single slider', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        const handlers = logic.getInteractionHandlers('thumb');
        
        // Test arrow right
        listener.mockClear();
        const arrowRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        handlers.onKeyDown(arrowRightEvent);
        
        expect(listener).toHaveBeenCalled();
        
        // Test arrow left
        listener.mockClear();
        const arrowLeftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        handlers.onKeyDown(arrowLeftEvent);
        
        expect(listener).toHaveBeenCalled();
        
        // Test Home key
        listener.mockClear();
        const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
        handlers.onKeyDown(homeEvent);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 0
        }));
        
        // Test End key
        listener.mockClear();
        const endEvent = new KeyboardEvent('keydown', { key: 'End' });
        handlers.onKeyDown(endEvent);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 100
        }));
    });
    
    it('should not handle keyboard events when disabled', () => {
        stateStore.setDisabled(true);
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        const handlers = logic.getInteractionHandlers('thumb');
        const arrowRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        
        handlers.onKeyDown(arrowRightEvent);
        
        expect(listener).not.toHaveBeenCalled();
    });
    
    it('should handle track mouse interactions', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        const handlers = logic.getInteractionHandlers('track');
        
        // Create a mock mouse event with proper target
        const mockElement = document.createElement('div');
        Object.defineProperty(mockElement, 'getBoundingClientRect', {
            value: () => ({
                left: 0,
                width: 100,
                top: 0,
                height: 20,
                bottom: 20,
            })
        });
        
        const mouseEvent = new MouseEvent('mousedown', { 
            clientX: 50, // Middle of the track
            clientY: 10
        });
        Object.defineProperty(mouseEvent, 'currentTarget', {
            value: mockElement,
            configurable: true
        });
        
        handlers.onMouseDown(mouseEvent);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            value: 50,
            dragging: true
        }));
        expect(mockOnChange).toHaveBeenCalledWith(50);
    });
    
    it('should not handle track interactions when disabled', () => {
        stateStore.setDisabled(true);
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        const handlers = logic.getInteractionHandlers('track');
        const mouseEvent = new MouseEvent('mousedown');
        
        handlers.onMouseDown(mouseEvent);
        
        expect(listener).not.toHaveBeenCalled();
        expect(mockOnChange).not.toHaveBeenCalled();
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, events should not be processed
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('change', { value: 50 });
        
        // onChange callback should not be called after cleanup
        expect(mockOnChange).not.toHaveBeenCalled();
    });
});