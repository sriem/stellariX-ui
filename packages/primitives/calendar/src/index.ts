/**
 * Calendar Component
 * Main entry point and public API
 */

import { createCalendarState } from './state';
import { createCalendarLogic } from './logic';
import type { CalendarOptions, CalendarState, CalendarEvents } from './types';
import type { ComponentCore } from '@stellarix-ui/core';
import type { CalendarStateStore } from './state';

/**
 * Helper methods for Calendar component
 */
export interface CalendarHelpers {
    selectDate: (date: Date | null) => void;
    goToToday: () => void;
    goToDate: (date: Date) => void;
    nextMonth: () => void;
    previousMonth: () => void;
    nextYear: () => void;
    previousYear: () => void;
    isDateSelected: (date: Date) => boolean;
    isDateDisabled: (date: Date) => boolean;
    isDateToday: (date: Date) => boolean;
}

/**
 * Creates a calendar component
 * @param options Component options
 * @returns Component instance with helper methods
 */
export function createCalendar(
    options: CalendarOptions = {}
): ComponentCore<CalendarState, CalendarEvents> & CalendarHelpers {
    const state = createCalendarState(options);
    const logic = createCalendarLogic(state, options);
    
    // Connect logic to state
    logic.connect(state);
    logic.initialize();
    
    const helpers: CalendarHelpers = {
        selectDate: (date: Date | null) => state.selectDate(date),
        goToToday: () => state.goToToday(),
        goToDate: (date: Date) => state.goToDate(date),
        nextMonth: () => state.nextMonth(),
        previousMonth: () => state.previousMonth(),
        nextYear: () => state.nextYear(),
        previousYear: () => state.previousYear(),
        isDateSelected: (date: Date) => state.isDateSelected(date),
        isDateDisabled: (date: Date) => state.isDateDisabled(date),
        isDateToday: (date: Date) => state.isDateToday(date),
    };
    
    return {
        state,
        logic,
        metadata: {
            name: 'Calendar',
            version: '1.0.0',
            accessibility: {
                role: 'application',
                keyboardShortcuts: [
                    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                    'Home', 'End', 'PageUp', 'PageDown',
                    'Enter', 'Space'
                ],
                ariaAttributes: [
                    'aria-label', 'aria-disabled', 'aria-readonly',
                    'aria-selected', 'aria-current'
                ],
                wcagLevel: 'AA',
                patterns: ['Date Picker', 'Grid Navigation']
            },
            events: {
                supported: ['select', 'monthChange', 'yearChange', 'viewModeChange', 'focus', 'blur'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'div',
                        role: 'application',
                        optional: false
                    },
                    'header': {
                        type: 'div',
                        role: 'none',
                        optional: false
                    },
                    'grid': {
                        type: 'table',
                        role: 'grid',
                        optional: false
                    },
                    'day': {
                        type: 'td',
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
                    }
                }
            }
        },
        connect: (adapter: any) => {
            return adapter.createComponent({
                state,
                logic,
                metadata: {
                    name: 'Calendar',
                    version: '1.0.0'
                }
            });
        },
        destroy: () => {
            logic.cleanup();
        },
        ...helpers
    };
}

// Re-export types
export type { 
    CalendarOptions, 
    CalendarState, 
    CalendarEvents, 
    CalendarProps,
    CalendarDay 
} from './types';

export type { CalendarStateStore } from './state';

// Default export for convenience
export default createCalendar;