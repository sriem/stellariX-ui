/**
 * Slider Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix-ui/core';
import type { SliderState, SliderOptions } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface SliderStateStore {
    // Core state methods
    getState: () => SliderState;
    setState: (updater: ((prev: SliderState) => SliderState) | Partial<SliderState>) => void;
    subscribe: (listener: (state: SliderState) => void) => () => void;
    derive: <U>(selector: (state: SliderState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    setValue: (value: number | [number, number]) => void;
    setMin: (min: number) => void;
    setMax: (max: number) => void;
    setStep: (step: number) => void;
    setDisabled: (disabled: boolean) => void;
    setFocused: (focused: boolean) => void;
    setDragging: (dragging: boolean) => void;
    setOrientation: (orientation: 'horizontal' | 'vertical') => void;
    
    // Value manipulation methods
    increment: (thumbIndex?: number) => void;
    decrement: (thumbIndex?: number) => void;
    incrementPage: (thumbIndex?: number) => void;
    decrementPage: (thumbIndex?: number) => void;
    setToMin: (thumbIndex?: number) => void;
    setToMax: (thumbIndex?: number) => void;
    
    // Computed properties
    isInteractive: () => boolean;
    getPercentage: (thumbIndex?: number) => number;
    getValueFromPercentage: (percentage: number) => number;
}

/**
 * Creates the slider component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createSliderState(options: SliderOptions = {}): SliderStateStore {
    // Determine if this is a range slider
    const isRange = Array.isArray(options.value);
    
    // Define initial state
    const initialState: SliderState = {
        value: options.value ?? (isRange ? [0, 100] : 0),
        min: options.min ?? 0,
        max: options.max ?? 100,
        step: options.step ?? 1,
        disabled: options.disabled ?? false,
        focused: false,
        dragging: false,
        orientation: options.orientation ?? 'horizontal',
        isRange,
    };
    
    // Create the core state store
    const store = createComponentState('Slider', initialState);
    
    // Helper to clamp value within bounds
    const clampValue = (value: number, min: number, max: number): number => {
        return Math.min(Math.max(value, min), max);
    };
    
    // Helper to round to step
    const roundToStep = (value: number, step: number, min: number): number => {
        const steps = Math.round((value - min) / step);
        return min + steps * step;
    };
    
    // Helper to validate and normalize value
    const normalizeValue = (value: number, state: SliderState): number => {
        const clamped = clampValue(value, state.min, state.max);
        return roundToStep(clamped, state.step, state.min);
    };
    
    // Extend with component-specific methods
    const extendedStore: SliderStateStore = {
        ...store,
        
        // Convenience setters
        setValue: (value: number | [number, number]) => {
            store.setState((prev: SliderState) => {
                if (Array.isArray(value)) {
                    const [min, max] = value;
                    return {
                        ...prev,
                        value: [
                            normalizeValue(min, prev),
                            normalizeValue(max, prev)
                        ]
                    };
                } else {
                    return {
                        ...prev,
                        value: normalizeValue(value, prev)
                    };
                }
            });
        },
        
        setMin: (min: number) => {
            store.setState((prev: SliderState) => ({ ...prev, min }));
        },
        
        setMax: (max: number) => {
            store.setState((prev: SliderState) => ({ ...prev, max }));
        },
        
        setStep: (step: number) => {
            store.setState((prev: SliderState) => ({ ...prev, step }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState((prev: SliderState) => ({ ...prev, disabled }));
        },
        
        setFocused: (focused: boolean) => {
            store.setState((prev: SliderState) => ({ ...prev, focused }));
        },
        
        setDragging: (dragging: boolean) => {
            store.setState((prev: SliderState) => ({ ...prev, dragging }));
        },
        
        setOrientation: (orientation: 'horizontal' | 'vertical') => {
            store.setState((prev: SliderState) => ({ ...prev, orientation }));
        },
        
        // Value manipulation methods
        increment: (thumbIndex?: number) => {
            store.setState((prev: SliderState) => {
                const { value, step } = prev;
                
                if (Array.isArray(value)) {
                    const index = thumbIndex ?? 1;
                    const newValue = [...value] as [number, number];
                    newValue[index] = normalizeValue(value[index] + step, prev);
                    
                    // Ensure min thumb doesn't exceed max thumb
                    if (index === 0 && newValue[0] > newValue[1]) {
                        newValue[0] = newValue[1];
                    }
                    // Ensure max thumb doesn't go below min thumb
                    if (index === 1 && newValue[1] < newValue[0]) {
                        newValue[1] = newValue[0];
                    }
                    
                    return { ...prev, value: newValue };
                } else {
                    return { ...prev, value: normalizeValue(value + step, prev) };
                }
            });
        },
        
        decrement: (thumbIndex?: number) => {
            store.setState((prev: SliderState) => {
                const { value, step } = prev;
                
                if (Array.isArray(value)) {
                    const index = thumbIndex ?? 0;
                    const newValue = [...value] as [number, number];
                    newValue[index] = normalizeValue(value[index] - step, prev);
                    
                    // Ensure min thumb doesn't exceed max thumb
                    if (index === 0 && newValue[0] > newValue[1]) {
                        newValue[0] = newValue[1];
                    }
                    // Ensure max thumb doesn't go below min thumb
                    if (index === 1 && newValue[1] < newValue[0]) {
                        newValue[1] = newValue[0];
                    }
                    
                    return { ...prev, value: newValue };
                } else {
                    return { ...prev, value: normalizeValue(value - step, prev) };
                }
            });
        },
        
        incrementPage: (thumbIndex?: number) => {
            store.setState((prev: SliderState) => {
                const { value, max, min } = prev;
                const pageSize = (max - min) / 10;
                
                if (Array.isArray(value)) {
                    const index = thumbIndex ?? 1;
                    const newValue = [...value] as [number, number];
                    newValue[index] = normalizeValue(value[index] + pageSize, prev);
                    
                    // Ensure min thumb doesn't exceed max thumb
                    if (index === 0 && newValue[0] > newValue[1]) {
                        newValue[0] = newValue[1];
                    }
                    // Ensure max thumb doesn't go below min thumb
                    if (index === 1 && newValue[1] < newValue[0]) {
                        newValue[1] = newValue[0];
                    }
                    
                    return { ...prev, value: newValue };
                } else {
                    return { ...prev, value: normalizeValue(value + pageSize, prev) };
                }
            });
        },
        
        decrementPage: (thumbIndex?: number) => {
            store.setState((prev: SliderState) => {
                const { value, max, min } = prev;
                const pageSize = (max - min) / 10;
                
                if (Array.isArray(value)) {
                    const index = thumbIndex ?? 0;
                    const newValue = [...value] as [number, number];
                    newValue[index] = normalizeValue(value[index] - pageSize, prev);
                    
                    // Ensure min thumb doesn't exceed max thumb
                    if (index === 0 && newValue[0] > newValue[1]) {
                        newValue[0] = newValue[1];
                    }
                    // Ensure max thumb doesn't go below min thumb
                    if (index === 1 && newValue[1] < newValue[0]) {
                        newValue[1] = newValue[0];
                    }
                    
                    return { ...prev, value: newValue };
                } else {
                    return { ...prev, value: normalizeValue(value - pageSize, prev) };
                }
            });
        },
        
        setToMin: (thumbIndex?: number) => {
            store.setState((prev: SliderState) => {
                const { value, min } = prev;
                
                if (Array.isArray(value)) {
                    const index = thumbIndex ?? 0;
                    const newValue = [...value] as [number, number];
                    newValue[index] = min;
                    
                    // Ensure min thumb doesn't exceed max thumb
                    if (index === 0 && newValue[0] > newValue[1]) {
                        newValue[0] = newValue[1];
                    }
                    // Ensure max thumb doesn't go below min thumb
                    if (index === 1 && newValue[1] < newValue[0]) {
                        newValue[1] = newValue[0];
                    }
                    
                    return { ...prev, value: newValue };
                } else {
                    return { ...prev, value: min };
                }
            });
        },
        
        setToMax: (thumbIndex?: number) => {
            store.setState((prev: SliderState) => {
                const { value, max } = prev;
                
                if (Array.isArray(value)) {
                    const index = thumbIndex ?? 1;
                    const newValue = [...value] as [number, number];
                    newValue[index] = max;
                    
                    // Ensure min thumb doesn't exceed max thumb
                    if (index === 0 && newValue[0] > newValue[1]) {
                        newValue[0] = newValue[1];
                    }
                    // Ensure max thumb doesn't go below min thumb
                    if (index === 1 && newValue[1] < newValue[0]) {
                        newValue[1] = newValue[0];
                    }
                    
                    return { ...prev, value: newValue };
                } else {
                    return { ...prev, value: max };
                }
            });
        },
        
        // Computed properties
        isInteractive: () => {
            const state = store.getState();
            return !state.disabled;
        },
        
        getPercentage: (thumbIndex?: number) => {
            const state = store.getState();
            const { value, min, max } = state;
            
            if (Array.isArray(value)) {
                const index = thumbIndex ?? 0;
                return ((value[index] - min) / (max - min)) * 100;
            } else {
                return ((value - min) / (max - min)) * 100;
            }
        },
        
        getValueFromPercentage: (percentage: number) => {
            const state = store.getState();
            const { min, max } = state;
            const value = min + (percentage / 100) * (max - min);
            return normalizeValue(value, state);
        },
    };
    
    return extendedStore;
}