/**
 * Stepper Component State
 * State management for the stepper component
 * 
 * 🚨 CRITICAL WARNING: setState PARTIAL UPDATE PREVENTION
 * 
 * ❌ FORBIDDEN PATTERNS:
 * - state.setState({ field: value }) // WILL NOT WORK!
 * - store.setState({ field: value }) // CAUSES undefined errors!
 * 
 * ✅ ONLY CORRECT PATTERN:
 * - store.setState((prev) => ({ ...prev, field: value }))
 * 
 * WHY: The core setState expects either a full state object or a function updater.
 * Partial objects cause the state to lose all other fields.
 */

import { createComponentState } from '@stellarix-ui/core';
import type { StepperState, StepperOptions, StepperStep } from './types';

/**
 * Default stepper state
 */
const DEFAULT_STATE: StepperState = {
    steps: [],
    activeStep: 0,
    completedSteps: new Set<number>(),
    disabled: false,
    orientation: 'horizontal',
    nonLinear: false,
    showStepNumbers: true,
    showConnectors: true,
    focusedStep: -1,
    validating: false,
    alternativeLabel: false,
};

/**
 * Creates a reactive state store for the stepper component
 * @param options Initial options for the component
 * @returns State store with getter and update methods
 */
export function createStepperState(options: StepperOptions = {}) {
    // Initialize state with options
    const initialState: StepperState = {
        ...DEFAULT_STATE,
        steps: options.steps || DEFAULT_STATE.steps,
        activeStep: options.activeStep || DEFAULT_STATE.activeStep,
        disabled: options.disabled || DEFAULT_STATE.disabled,
        orientation: options.orientation || DEFAULT_STATE.orientation,
        nonLinear: options.nonLinear || DEFAULT_STATE.nonLinear,
        showStepNumbers: options.showStepNumbers ?? DEFAULT_STATE.showStepNumbers,
        showConnectors: options.showConnectors ?? DEFAULT_STATE.showConnectors,
        alternativeLabel: options.alternativeLabel || DEFAULT_STATE.alternativeLabel,
    };
    
    const store = createComponentState('Stepper', initialState);
    
    return {
        ...store,
        
        // Convenience methods for state updates
        // ALWAYS use function updater pattern to preserve other state fields
        
        /**
         * Set the steps
         */
        setSteps: (steps: StepperStep[]) => {
            store.setState((prev: StepperState) => ({ ...prev, steps }));
        },
        
        /**
         * Set the active step
         */
        setActiveStep: (activeStep: number) => {
            store.setState((prev: StepperState) => ({ ...prev, activeStep }));
        },
        
        /**
         * Add a completed step
         */
        addCompletedStep: (step: number) => {
            store.setState((prev: StepperState) => ({
                ...prev,
                completedSteps: new Set([...prev.completedSteps, step])
            }));
        },
        
        /**
         * Remove a completed step
         */
        removeCompletedStep: (step: number) => {
            store.setState((prev: StepperState) => {
                const newCompleted = new Set(prev.completedSteps);
                newCompleted.delete(step);
                return { ...prev, completedSteps: newCompleted };
            });
        },
        
        /**
         * Set all completed steps
         */
        setCompletedSteps: (steps: number[]) => {
            store.setState((prev: StepperState) => ({
                ...prev,
                completedSteps: new Set(steps)
            }));
        },
        
        /**
         * Clear all completed steps
         */
        clearCompletedSteps: () => {
            store.setState((prev: StepperState) => ({
                ...prev,
                completedSteps: new Set<number>()
            }));
        },
        
        /**
         * Set disabled state
         */
        setDisabled: (disabled: boolean) => {
            store.setState((prev: StepperState) => ({ ...prev, disabled }));
        },
        
        /**
         * Set focused step
         */
        setFocusedStep: (focusedStep: number) => {
            store.setState((prev: StepperState) => ({ ...prev, focusedStep }));
        },
        
        /**
         * Set validating state
         */
        setValidating: (validating: boolean) => {
            store.setState((prev: StepperState) => ({ ...prev, validating }));
        },
        
        /**
         * Update a step by index
         */
        updateStep: (index: number, updates: Partial<StepperStep>) => {
            store.setState((prev: StepperState) => ({
                ...prev,
                steps: prev.steps.map((step, i) => 
                    i === index ? { ...step, ...updates } : step
                )
            }));
        },
        
        /**
         * Set step error
         */
        setStepError: (index: number, error: boolean, errorMessage?: string) => {
            store.setState((prev: StepperState) => ({
                ...prev,
                steps: prev.steps.map((step, i) => 
                    i === index ? { ...step, error, errorMessage } : step
                )
            }));
        },
        
        /**
         * Set orientation
         */
        setOrientation: (orientation: 'horizontal' | 'vertical') => {
            store.setState((prev: StepperState) => ({ ...prev, orientation }));
        },
        
        /**
         * Set non-linear mode
         */
        setNonLinear: (nonLinear: boolean) => {
            store.setState((prev: StepperState) => ({ ...prev, nonLinear }));
        },
        
        /**
         * Reset to initial state
         */
        reset: () => {
            store.setState((prev: StepperState) => ({
                ...prev,
                activeStep: 0,
                completedSteps: new Set<number>(),
                focusedStep: -1,
                validating: false,
                steps: prev.steps.map(step => ({ ...step, error: false, errorMessage: undefined }))
            }));
        }
    };
}

/**
 * Type for the stepper state store
 */
export type StepperStateStore = ReturnType<typeof createStepperState>;