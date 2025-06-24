/**
 * DatePicker Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix/core';
import { createDatePickerState } from './state.js';
import { createDatePickerLogic, generateCalendarGrid } from './logic.js';
import type { DatePickerOptions, DatePickerState, DatePickerEvents } from './types.js';

/**
 * Creates a date picker component factory
 * @param options Component options
 * @returns Component factory
 */
export function createDatePicker(options: DatePickerOptions = {}) {
    return createPrimitive<DatePickerState, DatePickerEvents, DatePickerOptions>('DatePicker', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'combobox',
                keyboardShortcuts: [
                    'Enter', 'Space', 'Escape', 'Tab',
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'PageUp', 'PageDown', 'Home', 'End'
                ],
                ariaAttributes: [
                    'aria-expanded', 'aria-haspopup', 'aria-controls',
                    'aria-disabled', 'aria-readonly', 'aria-required',
                    'aria-invalid', 'aria-describedby', 'aria-label',
                    'aria-labelledby', 'aria-selected', 'aria-current'
                ],
                wcagLevel: 'AA',
                patterns: ['date-picker', 'calendar-grid']
            },
            events: {
                supported: [
                    'change', 'rangeChange', 'open', 'close',
                    'focus', 'blur', 'viewChange', 'monthChange',
                    'dateSelect', 'navigate'
                ],
                required: [],
                custom: {
                    'dateSelect': 'Fired when a date is selected',
                    'rangeChange': 'Fired when date range changes',
                    'navigate': 'Fired on keyboard navigation',
                    'viewChange': 'Fired when calendar view changes',
                    'monthChange': 'Fired when displayed month changes'
                }
            },
            structure: {
                elements: {
                    'input': {
                        type: 'input',
                        role: 'combobox',
                        optional: false
                    },
                    'calendar': {
                        type: 'div',
                        role: 'dialog',
                        optional: false
                    },
                    'grid': {
                        type: 'table',
                        role: 'grid',
                        optional: false
                    },
                    'cell': {
                        type: 'button',
                        role: 'gridcell',
                        optional: false
                    },
                    'prevMonth': {
                        type: 'button',
                        role: 'button',
                        optional: false
                    },
                    'nextMonth': {
                        type: 'button',
                        role: 'button',
                        optional: false
                    },
                    'monthYearButton': {
                        type: 'button',
                        role: 'button',
                        optional: false
                    },
                    'clear': {
                        type: 'button',
                        role: 'button',
                        optional: true
                    },
                    'timeInput': {
                        type: 'input',
                        role: 'spinbutton',
                        optional: true
                    }
                }
            }
        }
    });
}

/**
 * Create the component with actual implementation
 * This connects the state and logic layers
 */
export function createDatePickerWithImplementation(options: DatePickerOptions = {}) {
    const core = createDatePicker(options);
    
    // Attach the actual implementation
    core.state = createDatePickerState(options);
    core.logic = createDatePickerLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    DatePickerOptions, 
    DatePickerState, 
    DatePickerEvents, 
    DatePickerProps,
    DatePickerMode,
    DatePickerView,
    CalendarCell,
    CalendarWeek,
    CalendarGrid
} from './types.js';

export type { DatePickerStateStore } from './state.js';

// Export utilities
export { generateCalendarGrid } from './logic.js';

// Default export for convenience
export default createDatePickerWithImplementation;