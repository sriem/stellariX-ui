/**
 * ProgressBar Component Logic
 * Business logic and event handling
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { ProgressBarState, ProgressBarEvents, ProgressBarOptions } from './types';
import type { ProgressBarStateStore } from './state';

/**
 * Creates the progress bar component logic using proven LogicLayerBuilder pattern
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createProgressBarLogic(
    state: ProgressBarStateStore,
    options: ProgressBarOptions = {}
): LogicLayer<ProgressBarState, ProgressBarEvents> {
    return new LogicLayerBuilder<ProgressBarState, ProgressBarEvents>()
        .onEvent('change', (currentState, payload: any) => {
            let newValue = currentState.value;
            if (payload && typeof payload === 'object' && 'value' in payload) {
                newValue = payload.value;
            }
            
            state.setValue(newValue);
            return null;
        })
        .onEvent('complete', (currentState, payload: any) => {
            if (options.onComplete) {
                options.onComplete();
            }
            return null;
        })
        .onEvent('variantChange', (currentState, payload: any) => {
            let newVariant = currentState.variant;
            if (payload && typeof payload === 'object' && 'variant' in payload) {
                newVariant = payload.variant;
            }
            
            state.setVariant(newVariant);
            return null;
        })
        .withA11y('root', (state) => {
            const percentage = state.isIndeterminate ? undefined : Math.round((state.value / state.max) * 100);
            
            return {
                role: 'progressbar',
                'aria-valuenow': state.isIndeterminate ? undefined : state.value,
                'aria-valuemin': state.isIndeterminate ? undefined : 0,
                'aria-valuemax': state.isIndeterminate ? undefined : state.max,
                'aria-valuetext': state.isIndeterminate ? 'Loading...' : `${percentage}%`,
                'aria-busy': state.isIndeterminate ? 'true' : undefined,
                'aria-disabled': state.disabled ? 'true' : undefined,
            };
        })
        .build();
}