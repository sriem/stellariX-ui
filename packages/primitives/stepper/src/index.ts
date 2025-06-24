/**
 * Stepper Component
 * Ultra-generic stepper implementation that can be adapted to any framework
 */

import { createStepperState } from './state';
import { createStepperLogic } from './logic';
import type { ComponentCore } from '@stellarix-ui/core';
import type { 
    StepperState, 
    StepperEvents, 
    StepperOptions, 
    StepStatus,
    StepperHelpers
} from './types';

/**
 * Creates a stepper component with helper methods
 * @param options Configuration options for the stepper
 * @returns Component instance with helper methods
 */
export function createStepper(
    options: StepperOptions = {}
): ComponentCore<StepperState, StepperEvents> & StepperHelpers {
    // Create state store
    const state = createStepperState(options);
    
    // Create logic layer
    const logic = createStepperLogic(state, options);
    
    // Connect logic to state
    logic.connect(state);
    logic.initialize();
    
    // Helper methods
    const helpers: StepperHelpers = {
        /**
         * Go to next step
         */
        async next(): Promise<boolean> {
            const currentState = state.getState();
            const nextStep = currentState.activeStep + 1;
            
            if (nextStep >= currentState.steps.length) {
                // Already at last step
                if (options.onComplete) {
                    options.onComplete();
                }
                return false;
            }
            
            // Validate current step if validator provided
            if (options.onStepValidate) {
                state.setValidating(true);
                
                try {
                    const valid = await options.onStepValidate(currentState.activeStep, 'next');
                    state.setValidating(false);
                    
                    if (!valid) {
                        return false;
                    }
                } catch {
                    state.setValidating(false);
                    return false;
                }
            }
            
            // Mark current step as completed
            state.addCompletedStep(currentState.activeStep);
            
            // Move to next step
            const previousStep = currentState.activeStep;
            state.setActiveStep(nextStep);
            
            if (options.onStepChange) {
                options.onStepChange(nextStep, previousStep);
            }
            
            return true;
        },
        
        /**
         * Go to previous step
         */
        async prev(): Promise<boolean> {
            const currentState = state.getState();
            const prevStep = currentState.activeStep - 1;
            
            if (prevStep < 0) {
                // Already at first step
                return false;
            }
            
            // Validate if validator provided
            if (options.onStepValidate) {
                state.setValidating(true);
                
                try {
                    const valid = await options.onStepValidate(currentState.activeStep, 'prev');
                    state.setValidating(false);
                    
                    if (!valid) {
                        return false;
                    }
                } catch {
                    state.setValidating(false);
                    return false;
                }
            }
            
            // Move to previous step
            const previousStep = currentState.activeStep;
            state.setActiveStep(prevStep);
            
            if (options.onStepChange) {
                options.onStepChange(prevStep, previousStep);
            }
            
            return true;
        },
        
        /**
         * Go to specific step
         */
        async goToStep(step: number): Promise<boolean> {
            const currentState = state.getState();
            
            if (step === currentState.activeStep || step < 0 || step >= currentState.steps.length) {
                return false;
            }
            
            // Check if step is accessible
            if (!currentState.nonLinear) {
                // In linear mode, check if we can go to this step
                if (step > currentState.activeStep) {
                    // Check all steps between current and target are completed or optional
                    for (let i = currentState.activeStep; i < step; i++) {
                        if (!currentState.completedSteps.has(i) && !currentState.steps[i]?.optional) {
                            return false;
                        }
                    }
                }
            }
            
            const direction = step > currentState.activeStep ? 'next' : 'prev';
            
            // Validate if validator provided
            if (options.onStepValidate) {
                state.setValidating(true);
                
                try {
                    const valid = await options.onStepValidate(currentState.activeStep, direction);
                    state.setValidating(false);
                    
                    if (!valid) {
                        return false;
                    }
                } catch {
                    state.setValidating(false);
                    return false;
                }
            }
            
            // Move to step
            const previousStep = currentState.activeStep;
            state.setActiveStep(step);
            
            if (options.onStepChange) {
                options.onStepChange(step, previousStep);
            }
            
            return true;
        },
        
        /**
         * Reset the stepper
         */
        reset(): void {
            state.reset();
            
            if (options.onStepChange) {
                options.onStepChange(0, 0);
            }
        },
        
        /**
         * Mark step as completed
         */
        completeStep(step: number): void {
            state.addCompletedStep(step);
        },
        
        /**
         * Mark step as error
         */
        setStepError(step: number, error: boolean, errorMessage?: string): void {
            state.setStepError(step, error, errorMessage);
        },
        
        /**
         * Get step status
         */
        getStepStatus(step: number): StepStatus {
            const currentState = state.getState();
            const stepData = currentState.steps[step];
            
            if (stepData?.error) {
                return 'error';
            }
            
            if (currentState.activeStep === step) {
                return 'active';
            }
            
            if (currentState.completedSteps.has(step)) {
                return 'completed';
            }
            
            return 'upcoming';
        },
        
        /**
         * Check if step is accessible
         */
        isStepAccessible(step: number): boolean {
            const currentState = state.getState();
            
            if (currentState.disabled) {
                return false;
            }
            
            if (currentState.nonLinear) {
                return !currentState.steps[step]?.disabled;
            }
            
            if (step <= currentState.activeStep) {
                return !currentState.steps[step]?.disabled;
            }
            
            for (let i = 0; i < step; i++) {
                if (!currentState.completedSteps.has(i) && !currentState.steps[i]?.optional) {
                    return false;
                }
            }
            
            return !currentState.steps[step]?.disabled;
        }
    };
    
    // Create component core
    const component: ComponentCore<StepperState, StepperEvents> & StepperHelpers = {
        state,
        logic,
        metadata: {
            name: 'Stepper',
            version: '0.0.1',
            accessibility: {
                role: 'group',
                wcagLevel: 'AA',
                patterns: ['stepper'],
                keyboardShortcuts: ['Arrow keys', 'Home', 'End', 'Enter', 'Space'],
                ariaAttributes: ['aria-label', 'aria-current', 'aria-disabled', 'aria-invalid'],
            },
            events: {
                supported: ['stepChange', 'stepClick', 'validationStart', 'validationComplete', 'complete'],
                required: [],
                custom: {},
            },
            structure: {
                elements: {
                    root: { type: 'div', role: 'group', optional: false },
                    list: { type: 'ol', role: 'list', optional: false },
                    step: { type: 'li', role: 'listitem', optional: false },
                    stepButton: { type: 'button', role: 'button', optional: false },
                },
            },
        },
        connect: function <TFrameworkComponent>(adapter: any): TFrameworkComponent {
            return adapter.createComponent(this);
        },
        destroy: () => {
            logic.cleanup();
        },
        ...helpers
    };
    
    return component;
}

// Re-export types
export type {
    StepperState,
    StepperEvents,
    StepperOptions,
    StepperStep,
    StepperProps,
    StepStatus,
    StepperOrientation,
    StepperHelpers
} from './types';

// Re-export state and logic creators for advanced use cases
export { createStepperState } from './state';
export { createStepperLogic } from './logic';