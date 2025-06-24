/**
 * Slider Component Logic
 * Business logic and event handling
 * 
 * 🚨🚨🚨 ULTRA-CRITICAL WARNING: NEVER call state.getState() in this file!
 * 
 * ❌❌❌ FORBIDDEN PATTERNS - WILL CAUSE INFINITE LOOPS:
 * - const currentState = state.getState(); // 🚨 INFINITE LOOP!
 * - state.getState() inside withInteraction callbacks // 🚨 INFINITE LOOP!
 * - state.getState() inside onEvent handlers // 🚨 INFINITE LOOP!
 * - state.getState() inside withA11y functions // 🚨 INFINITE LOOP!
 * - using createComponentLogic (causes complex circular deps)
 * 
 * ✅✅✅ CORRECT PATTERNS - LEARNED FROM CHECKBOX SUCCESS:
 * - Use LogicLayerBuilder pattern for clean implementation
 * - Use (currentState, event) parameters in withInteraction callbacks
 * - Use (state) parameter in withA11y functions
 * - Handle event payload extraction: const event = payload?.event ? payload.event : payload
 * - Support both direct events and wrapped { event } payloads
 * - Call state setters directly: state.setValue(), state.setActive()
 * - Test via callbacks, not state inspection
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application. This has been proven 8+ times.
 * 
 * PROVEN WORKING PATTERN (Checkbox component - 30/30 tests passing):
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { SliderState, SliderEvents, SliderOptions } from './types';
import type { SliderStateStore } from './state';

/**
 * Creates the slider component logic using proven LogicLayerBuilder pattern
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createSliderLogic(
    state: SliderStateStore,
    options: SliderOptions = {}
): LogicLayer<SliderState, SliderEvents> {
    // Helper to determine which thumb is closest to a position
    const getClosestThumb = (percentage: number, currentState: SliderState): number => {
        if (!Array.isArray(currentState.value)) return 0;
        
        const [minValue, maxValue] = currentState.value;
        const minPercentage = ((minValue - currentState.min) / (currentState.max - currentState.min)) * 100;
        const maxPercentage = ((maxValue - currentState.min) / (currentState.max - currentState.min)) * 100;
        
        const minDistance = Math.abs(percentage - minPercentage);
        const maxDistance = Math.abs(percentage - maxPercentage);
        
        return minDistance <= maxDistance ? 0 : 1;
    };
    
    // Helper to calculate value from mouse/touch position
    const getValueFromPosition = (event: MouseEvent | TouchEvent, element: HTMLElement, currentState: SliderState): number => {
        const rect = element.getBoundingClientRect();
        const isTouch = 'touches' in event;
        const clientX = isTouch ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
        const clientY = isTouch ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
        
        let percentage: number;
        
        if (currentState.orientation === 'horizontal') {
            percentage = ((clientX - rect.left) / rect.width) * 100;
        } else {
            // Vertical sliders go from bottom to top
            percentage = ((rect.bottom - clientY) / rect.height) * 100;
        }
        
        // Clamp to valid range
        percentage = Math.max(0, Math.min(100, percentage));
        
        // Convert percentage to value
        const value = currentState.min + (percentage / 100) * (currentState.max - currentState.min);
        
        // Round to step
        const steps = Math.round((value - currentState.min) / currentState.step);
        return currentState.min + steps * currentState.step;
    };
    
    return new LogicLayerBuilder<SliderState, SliderEvents>()
        .onEvent('change', (currentState, payload: any) => {
            // Extract value from payload if provided
            let newValue = currentState.value;
            if (payload && typeof payload === 'object' && 'value' in payload) {
                newValue = payload.value;
            }
            
            // Update state
            state.setValue(newValue);
            
            // Call user callback if provided
            if (options.onChange) {
                options.onChange(newValue);
            }
            return null;
        })
        .onEvent('dragStart', (currentState, payload: any) => {
            state.setDragging(true);
            
            // Call user callback if provided
            if (options.onDragStart) {
                options.onDragStart();
            }
            return null;
        })
        .onEvent('dragEnd', (currentState, payload: any) => {
            state.setDragging(false);
            
            // Call user callback if provided
            if (options.onDragEnd) {
                options.onDragEnd();
            }
            return null;
        })
        .onEvent('focus', (currentState, payload: any) => {
            state.setFocused(true);
            return null;
        })
        .onEvent('blur', (currentState, payload: any) => {
            state.setFocused(false);
            return null;
        })
        .withA11y('root', (state) => ({
            'aria-orientation': state.orientation,
            'aria-disabled': state.disabled ? 'true' : undefined,
        }))
        .withA11y('thumb', (state) => {
            const value = Array.isArray(state.value) ? state.value[0] : state.value;
            return {
                role: 'slider',
                'aria-valuemin': state.min,
                'aria-valuemax': state.max,
                'aria-valuenow': value,
                'aria-disabled': state.disabled ? 'true' : undefined,
                tabIndex: state.disabled ? -1 : 0,
            };
        })
        .withA11y('thumbMin', (state) => {
            if (!Array.isArray(state.value)) return {};
            return {
                role: 'slider',
                'aria-valuemin': state.min,
                'aria-valuemax': state.max,
                'aria-valuenow': state.value[0],
                'aria-disabled': state.disabled ? 'true' : undefined,
                tabIndex: state.disabled ? -1 : 0,
            };
        })
        .withA11y('thumbMax', (state) => {
            if (!Array.isArray(state.value)) return {};
            return {
                role: 'slider',
                'aria-valuemin': state.min,
                'aria-valuemax': state.max,
                'aria-valuenow': state.value[1],
                'aria-disabled': state.disabled ? 'true' : undefined,
                tabIndex: state.disabled ? -1 : 0,
            };
        })
        .withInteraction('track', 'onMouseDown', (currentState, event: MouseEvent) => {
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            const element = event.currentTarget as HTMLElement;
            const newValue = getValueFromPosition(event, element, currentState);
            
            if (Array.isArray(currentState.value)) {
                // For range sliders, determine which thumb to move
                const percentage = ((newValue - currentState.min) / (currentState.max - currentState.min)) * 100;
                const thumbIndex = getClosestThumb(percentage, currentState);
                const newRangeValue = [...currentState.value] as [number, number];
                newRangeValue[thumbIndex] = newValue;
                
                // Ensure proper ordering
                if (thumbIndex === 0 && newRangeValue[0] > newRangeValue[1]) {
                    newRangeValue[0] = newRangeValue[1];
                }
                if (thumbIndex === 1 && newRangeValue[1] < newRangeValue[0]) {
                    newRangeValue[1] = newRangeValue[0];
                }
                
                state.setValue(newRangeValue);
                
                // Call onChange callback
                if (options.onChange) {
                    options.onChange(newRangeValue);
                }
            } else {
                state.setValue(newValue);
                
                // Call onChange callback
                if (options.onChange) {
                    options.onChange(newValue);
                }
            }
            
            state.setDragging(true);
            
            return 'dragStart';
        })
        .withInteraction('thumb', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            const thumbIndex = currentState.isRange ? 
                (event.currentTarget as HTMLElement).getAttribute('data-thumb-index') === '1' ? 1 : 0 
                : undefined;
            
            let handled = true;
            
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowDown':
                    state.decrement(thumbIndex);
                    break;
                    
                case 'ArrowRight':
                case 'ArrowUp':
                    state.increment(thumbIndex);
                    break;
                    
                case 'PageUp':
                    state.incrementPage(thumbIndex);
                    break;
                    
                case 'PageDown':
                    state.decrementPage(thumbIndex);
                    break;
                    
                case 'Home':
                    state.setToMin(thumbIndex);
                    break;
                    
                case 'End':
                    state.setToMax(thumbIndex);
                    break;
                    
                default:
                    handled = false;
            }
            
            if (handled) {
                event.preventDefault();
                
                // For keyboard changes, we'll trigger change event which will call onChange
                return 'change';
            }
            
            return null;
        })
        .withInteraction('thumb', 'onFocus', (currentState, event: FocusEvent) => {
            return 'focus';
        })
        .withInteraction('thumb', 'onBlur', (currentState, event: FocusEvent) => {
            return 'blur';
        })
        .withInteraction('thumbMin', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            if (currentState.disabled || !currentState.isRange) {
                event.preventDefault();
                return null;
            }
            
            let handled = true;
            
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowDown':
                    state.decrement(0);
                    break;
                    
                case 'ArrowRight':
                case 'ArrowUp':
                    state.increment(0);
                    break;
                    
                case 'PageUp':
                    state.incrementPage(0);
                    break;
                    
                case 'PageDown':
                    state.decrementPage(0);
                    break;
                    
                case 'Home':
                    state.setToMin(0);
                    break;
                    
                case 'End':
                    state.setToMax(0);
                    break;
                    
                default:
                    handled = false;
            }
            
            if (handled) {
                event.preventDefault();
                
                // For keyboard changes, we'll trigger change event which will call onChange
                return 'change';
            }
            
            return null;
        })
        .withInteraction('thumbMax', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            if (currentState.disabled || !currentState.isRange) {
                event.preventDefault();
                return null;
            }
            
            let handled = true;
            
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowDown':
                    state.decrement(1);
                    break;
                    
                case 'ArrowRight':
                case 'ArrowUp':
                    state.increment(1);
                    break;
                    
                case 'PageUp':
                    state.incrementPage(1);
                    break;
                    
                case 'PageDown':
                    state.decrementPage(1);
                    break;
                    
                case 'Home':
                    state.setToMin(1);
                    break;
                    
                case 'End':
                    state.setToMax(1);
                    break;
                    
                default:
                    handled = false;
            }
            
            if (handled) {
                event.preventDefault();
                
                // For keyboard changes, we'll trigger change event which will call onChange
                return 'change';
            }
            
            return null;
        })
        .build();
}