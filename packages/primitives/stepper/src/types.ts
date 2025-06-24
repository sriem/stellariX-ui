/**
 * Stepper Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Individual step definition
 */
export interface StepperStep {
    /**
     * Unique identifier for the step
     */
    id: string;
    
    /**
     * Display label for the step
     */
    label: string;
    
    /**
     * Optional description for the step
     */
    description?: string;
    
    /**
     * Whether this step is optional
     * @default false
     */
    optional?: boolean;
    
    /**
     * Whether this step is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Whether this step has an error
     * @default false
     */
    error?: boolean;
    
    /**
     * Error message to display
     */
    errorMessage?: string;
    
    /**
     * Icon identifier for the step
     */
    icon?: string;
    
    /**
     * Additional metadata for the step
     */
    metadata?: Record<string, any>;
}

/**
 * Step status enumeration
 */
export type StepStatus = 'completed' | 'active' | 'upcoming' | 'error';

/**
 * Stepper orientation
 */
export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * Stepper component state
 * Represents the internal state of the component
 */
export interface StepperState {
    /**
     * List of steps
     */
    steps: StepperStep[];
    
    /**
     * Currently active step index
     */
    activeStep: number;
    
    /**
     * Completed steps indices
     */
    completedSteps: Set<number>;
    
    /**
     * Whether the stepper is disabled
     */
    disabled: boolean;
    
    /**
     * Orientation of the stepper
     */
    orientation: StepperOrientation;
    
    /**
     * Whether to allow jumping to any step (non-linear)
     * @default false
     */
    nonLinear: boolean;
    
    /**
     * Whether to show step numbers
     * @default true
     */
    showStepNumbers: boolean;
    
    /**
     * Whether to connect steps with lines
     * @default true
     */
    showConnectors: boolean;
    
    /**
     * Currently focused step index (for keyboard navigation)
     */
    focusedStep: number;
    
    /**
     * Whether the stepper is in validation mode
     */
    validating: boolean;
    
    /**
     * Alternative labels for navigation
     */
    alternativeLabel?: boolean;
}

/**
 * Stepper component options
 * Configuration passed when creating the component
 */
export interface StepperOptions {
    /**
     * Initial steps
     * @default []
     */
    steps?: StepperStep[];
    
    /**
     * Initial active step index
     * @default 0
     */
    activeStep?: number;
    
    /**
     * Whether the stepper is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Orientation of the stepper
     * @default 'horizontal'
     */
    orientation?: StepperOrientation;
    
    /**
     * Whether to allow jumping to any step (non-linear)
     * @default false
     */
    nonLinear?: boolean;
    
    /**
     * Whether to show step numbers
     * @default true
     */
    showStepNumbers?: boolean;
    
    /**
     * Whether to connect steps with lines
     * @default true
     */
    showConnectors?: boolean;
    
    /**
     * Whether to use alternative label placement
     * @default false
     */
    alternativeLabel?: boolean;
    
    /**
     * ID attribute for the stepper
     */
    id?: string;
    
    /**
     * Callback when step changes
     */
    onStepChange?: (step: number, previousStep: number) => void;
    
    /**
     * Callback for step validation
     * Return false or Promise<false> to prevent step change
     */
    onStepValidate?: (step: number, direction: 'next' | 'prev') => boolean | Promise<boolean>;
    
    /**
     * Callback when a step is clicked
     */
    onStepClick?: (step: number) => void;
    
    /**
     * Callback when stepper completes
     */
    onComplete?: () => void;
    
    /**
     * Additional CSS classes
     */
    className?: string;
    
    /**
     * ARIA label for the stepper
     * @default "Progress"
     */
    ariaLabel?: string;
}

/**
 * Stepper component events
 * Events that can be triggered by the component
 */
export interface StepperEvents {
    /**
     * Fired when active step changes
     */
    stepChange: {
        step: number;
        previousStep: number;
        stepData: StepperStep;
    };
    
    /**
     * Fired when a step is clicked
     */
    stepClick: {
        step: number;
        stepData: StepperStep;
    };
    
    /**
     * Fired when validation starts
     */
    validationStart: {
        step: number;
        direction: 'next' | 'prev';
    };
    
    /**
     * Fired when validation completes
     */
    validationComplete: {
        step: number;
        direction: 'next' | 'prev';
        success: boolean;
    };
    
    /**
     * Fired when stepper completes
     */
    complete: {
        completedSteps: number[];
    };
    
    /**
     * Fired when a step receives focus
     */
    stepFocus: {
        step: number;
        stepData: StepperStep;
    };
    
    /**
     * Fired when keyboard navigation occurs
     */
    keyNavigation: {
        key: string;
        fromStep: number;
        toStep: number;
    };
}

/**
 * Helper methods returned by createStepper
 */
export interface StepperHelpers {
    /**
     * Go to next step
     */
    next: () => Promise<boolean>;
    
    /**
     * Go to previous step
     */
    prev: () => Promise<boolean>;
    
    /**
     * Go to specific step
     */
    goToStep: (step: number) => Promise<boolean>;
    
    /**
     * Reset the stepper
     */
    reset: () => void;
    
    /**
     * Mark step as completed
     */
    completeStep: (step: number) => void;
    
    /**
     * Mark step as error
     */
    setStepError: (step: number, error: boolean, errorMessage?: string) => void;
    
    /**
     * Get step status
     */
    getStepStatus: (step: number) => StepStatus;
    
    /**
     * Check if step is accessible
     */
    isStepAccessible: (step: number) => boolean;
}

/**
 * Stepper component props
 * Props that can be passed to the component
 */
export interface StepperProps extends StepperOptions {
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}