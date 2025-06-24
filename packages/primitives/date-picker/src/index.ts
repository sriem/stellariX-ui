/**
 * DatePicker Component
 * Main entry point and public API
 */

import { createDatePickerState } from './state.js';
import { createDatePickerLogic, generateCalendarGrid } from './logic.js';
import type { DatePickerOptions, DatePickerState, DatePickerEvents } from './types.js';
import type { ComponentCore } from '@stellarix-ui/core';

/**
 * Creates a date picker component
 * @param options Component options
 * @returns Component instance
 */
export function createDatePicker(options: DatePickerOptions = {}): ComponentCore<DatePickerState, DatePickerEvents> {
    const state = createDatePickerState(options);
    const logic = createDatePickerLogic(state, options);
    
    // Connect logic to state
    logic.connect(state);
    logic.initialize();
    
    return {
        state,
        logic,
        metadata: {
            name: 'DatePicker',
            version: '1.0.0',
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
                    'dateSelect': { description: 'Fired when a date is selected' },
                    'rangeChange': { description: 'Fired when date range changes' },
                    'navigate': { description: 'Fired on keyboard navigation' },
                    'viewChange': { description: 'Fired when calendar view changes' },
                    'monthChange': { description: 'Fired when displayed month changes' }
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
        },
        connect: (adapter: any) => {
            return adapter.createComponent({
                state,
                logic,
                metadata: {
                    name: 'DatePicker',
                    version: '1.0.0'
                }
            });
        }
    };
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
export default createDatePicker;