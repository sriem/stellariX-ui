/**
 * Stepper Component Logic
 * Business logic and event handling
 * 
 * 🚨 CRITICAL WARNING: NEVER call state.getState() in this file!
 * 
 * ❌ FORBIDDEN PATTERNS:
 * - const currentState = state.getState(); // CAUSES INFINITE LOOPS!
 * - state.getState() inside event handlers
 * - state.getState() inside getA11yProps()
 * - state.getState() inside getInteractionHandlers()
 * 
 * ✅ CORRECT PATTERNS:
 * - Use (currentState, handleEvent) parameters in interactions
 * - Use (state) parameter in a11y functions
 * - Call state setters directly: state.setActiveStep(), state.addCompletedStep()
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application.
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { StepperState, StepperEvents, StepperOptions, StepStatus } from './types';
import type { StepperStateStore } from './state';

/**
 * Get the status of a step
 */
function getStepStatus(state: StepperState, index: number): StepStatus {
    const step = state.steps[index];
    
    if (step?.error) {
        return 'error';
    }
    
    if (state.activeStep === index) {
        return 'active';
    }
    
    if (state.completedSteps.has(index)) {
        return 'completed';
    }
    
    return 'upcoming';
}

/**
 * Check if a step is accessible (can be navigated to)
 */
function isStepAccessible(state: StepperState, index: number): boolean {
    // If disabled, no steps are accessible
    if (state.disabled) {
        return false;
    }
    
    // If non-linear, all non-disabled steps are accessible
    if (state.nonLinear) {
        return !state.steps[index]?.disabled;
    }
    
    // In linear mode, only completed steps and the next step are accessible
    if (index <= state.activeStep) {
        return !state.steps[index]?.disabled;
    }
    
    // Check if all previous steps are completed
    for (let i = 0; i < index; i++) {
        if (!state.completedSteps.has(i) && !state.steps[i]?.optional) {
            return false;
        }
    }
    
    return !state.steps[index]?.disabled;
}

/**
 * Creates the stepper component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createStepperLogic(
    state: StepperStateStore,
    options: StepperOptions = {}
): LogicLayer<StepperState, StepperEvents> {
    return new LogicLayerBuilder<StepperState, StepperEvents>()
        // Root element
        .withA11y('root', (currentState) => ({
            role: 'group',
            'aria-label': options.ariaLabel || 'Progress',
            'aria-orientation': currentState.orientation,
            'aria-disabled': currentState.disabled ? 'true' : undefined,
        }))
        
        // Step list container
        .withA11y('list', () => ({
            role: 'list',
        }))
        
        // Individual step
        .withA11y('step', (currentState, { index }: { index: number }) => {
            const step = currentState.steps[index];
            const status = getStepStatus(currentState, index);
            const accessible = isStepAccessible(currentState, index);
            
            return {
                role: 'listitem',
                'aria-current': status === 'active' ? 'step' : undefined,
                'aria-disabled': !accessible || step?.disabled ? 'true' : undefined,
            };
        })
        
        // Step button/link
        .withA11y('stepButton', (currentState, { index }: { index: number }) => {
            const step = currentState.steps[index];
            const status = getStepStatus(currentState, index);
            const accessible = isStepAccessible(currentState, index);
            const stepNumber = index + 1;
            
            return {
                role: 'button',
                tabIndex: accessible && !step?.disabled ? 0 : -1,
                'aria-label': `Step ${stepNumber}: ${step?.label}`,
                'aria-describedby': step?.description ? `step-${index}-description` : undefined,
                'aria-invalid': step?.error ? 'true' : undefined,
                'aria-disabled': !accessible || step?.disabled ? 'true' : undefined,
                'data-status': status,
                'data-optional': step?.optional ? 'true' : undefined,
            };
        })
        
        // Step label
        .withA11y('stepLabel', (currentState, { index }: { index: number }) => {
            const step = currentState.steps[index];
            
            return {
                id: `step-${index}-label`,
                'aria-hidden': 'true', // Label is included in button aria-label
            };
        })
        
        // Step description
        .withA11y('stepDescription', (currentState, { index }: { index: number }) => ({
            id: `step-${index}-description`,
        }))
        
        // Connector between steps
        .withA11y('connector', () => ({
            'aria-hidden': 'true',
            role: 'presentation',
        }))
        
        // Handle step click
        .withInteraction('stepButton', 'onClick', (currentState, event: MouseEvent & { index: number }) => {
            const { index } = event;
            const accessible = isStepAccessible(currentState, index);
            
            // Prevent interaction if not accessible
            if (!accessible || currentState.disabled || currentState.validating) {
                event.preventDefault();
                return null;
            }
            
            // Call user callback
            if (options.onStepClick) {
                options.onStepClick(index);
            }
            
            // If different from active step, initiate change
            if (index !== currentState.activeStep) {
                const direction = index > currentState.activeStep ? 'next' : 'prev';
                
                // Start validation if validator provided
                if (options.onStepValidate) {
                    state.setValidating(true);
                    
                    Promise.resolve(options.onStepValidate(currentState.activeStep, direction))
                        .then((valid) => {
                            state.setValidating(false);
                            
                            if (valid) {
                                const previousStep = currentState.activeStep;
                                state.setActiveStep(index);
                                
                                if (options.onStepChange) {
                                    options.onStepChange(index, previousStep);
                                }
                            }
                        })
                        .catch(() => {
                            state.setValidating(false);
                        });
                } else {
                    // No validation, just change step
                    const previousStep = currentState.activeStep;
                    state.setActiveStep(index);
                    
                    if (options.onStepChange) {
                        options.onStepChange(index, previousStep);
                    }
                }
            }
            
            return null;
        })
        
        // Handle keyboard navigation
        .withInteraction('stepButton', 'onKeyDown', (currentState, event: KeyboardEvent & { index: number }) => {
            const { index } = event;
            
            // Prevent interaction if disabled
            if (currentState.disabled || currentState.validating) {
                return null;
            }
            
            let newFocusIndex = index;
            
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    // Find previous accessible step
                    for (let i = index - 1; i >= 0; i--) {
                        if (isStepAccessible(currentState, i)) {
                            newFocusIndex = i;
                            break;
                        }
                    }
                    break;
                    
                case 'ArrowRight':
                case 'ArrowDown':
                    event.preventDefault();
                    // Find next accessible step
                    for (let i = index + 1; i < currentState.steps.length; i++) {
                        if (isStepAccessible(currentState, i)) {
                            newFocusIndex = i;
                            break;
                        }
                    }
                    break;
                    
                case 'Home':
                    event.preventDefault();
                    // Find first accessible step
                    for (let i = 0; i < currentState.steps.length; i++) {
                        if (isStepAccessible(currentState, i)) {
                            newFocusIndex = i;
                            break;
                        }
                    }
                    break;
                    
                case 'End':
                    event.preventDefault();
                    // Find last accessible step
                    for (let i = currentState.steps.length - 1; i >= 0; i--) {
                        if (isStepAccessible(currentState, i)) {
                            newFocusIndex = i;
                            break;
                        }
                    }
                    break;
                    
                case 'Enter':
                case ' ':
                    // Activate step
                    event.preventDefault();
                    const stepButton = event.target as HTMLElement;
                    stepButton.click();
                    break;
                    
                default:
                    return null;
            }
            
            // Update focus if changed
            if (newFocusIndex !== index) {
                state.setFocusedStep(newFocusIndex);
                
                // Focus the element at the new index
                const stepButtons = (event.target as HTMLElement)
                    .closest('[role="group"]')
                    ?.querySelectorAll('[role="button"][data-testid*="step-button"]');
                    
                if (stepButtons && stepButtons[newFocusIndex]) {
                    (stepButtons[newFocusIndex] as HTMLElement).focus();
                }
            }
            
            return null;
        })
        
        // Handle focus
        .withInteraction('stepButton', 'onFocus', (currentState, event: FocusEvent & { index: number }) => {
            state.setFocusedStep(event.index);
            return null;
        })
        
        // Handle blur
        .withInteraction('stepButton', 'onBlur', (currentState, event: FocusEvent) => {
            // Only clear focus if we're leaving the stepper entirely
            const relatedTarget = event.relatedTarget as HTMLElement;
            const stepperRoot = (event.target as HTMLElement).closest('[role="group"]');
            
            if (!stepperRoot?.contains(relatedTarget)) {
                state.setFocusedStep(-1);
            }
            
            return null;
        })
        
        .build();
}