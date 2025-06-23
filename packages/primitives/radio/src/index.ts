/**
 * Radio Component - Public API
 * Framework-agnostic radio component for StellarIX UI
 */

// Export all types
export type {
    RadioState,
    RadioOptions,
    RadioEvents,
    RadioProps,
} from './types';

// Export state and logic factories
export { createRadioState } from './state';
export type { RadioStateStore } from './state';
export { createRadioLogic } from './logic';

// Export the main factory function
import { createRadioState } from './state';
import { createRadioLogic } from './logic';
import type { RadioOptions, RadioState, RadioEvents } from './types';
import type { RadioStateStore } from './state';
import type { LogicLayer } from '@stellarix/core';

/**
 * Component core interface for Radio
 */
export interface RadioCore {
    state: RadioStateStore;
    logic: LogicLayer<RadioState, RadioEvents>;
    options: RadioOptions;
}

/**
 * Creates a radio component core
 * @param options Configuration options
 * @returns Component core ready for framework adapter connection
 */
export function createRadio(options: RadioOptions): RadioCore {
    // Create state store
    const state = createRadioState(options);
    
    // Create logic layer
    const logic = createRadioLogic(state, options);
    
    return {
        state,
        logic,
        options,
    };
}

/**
 * Default export for convenience
 */
export default createRadio;