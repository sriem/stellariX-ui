/**
 * Calendar Component Logic
 * Business logic and event handling for date selection
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { CalendarState, CalendarEvents, CalendarOptions } from './types';
import type { CalendarStateStore } from './state';

/**
 * Creates the calendar component logic using proven LogicLayerBuilder pattern
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createCalendarLogic(
    state: CalendarStateStore,
    options: CalendarOptions = {}
): LogicLayer<CalendarState, CalendarEvents> {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayAbbreviations = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    return new LogicLayerBuilder<CalendarState, CalendarEvents>()
        .onEvent('select', (currentState, payload: any) => {
            let date = null;
            if (payload && typeof payload === 'object' && 'date' in payload) {
                date = payload.date;
            }
            
            state.selectDate(date);
            return null;
        })
        .onEvent('monthChange', (currentState, payload: any) => {
            if (payload && typeof payload === 'object' && 'month' in payload && 'year' in payload) {
                state.setDisplayMonth(payload.month, payload.year);
            }
            return null;
        })
        .onEvent('yearChange', (currentState, payload: any) => {
            if (payload && typeof payload === 'object' && 'year' in payload) {
                state.setDisplayMonth(currentState.displayMonth, payload.year);
            }
            return null;
        })
        .onEvent('viewModeChange', (currentState, payload: any) => {
            if (payload && typeof payload === 'object' && 'viewMode' in payload) {
                state.setViewMode(payload.viewMode);
            }
            return null;
        })
        .onEvent('focus', (currentState, payload: any) => {
            return null;
        })
        .onEvent('blur', (currentState, payload: any) => {
            return null;
        })
        .withA11y('root', (state) => ({
            role: 'application',
            'aria-label': options['aria-label'] || `Calendar, ${monthNames[state.displayMonth]} ${state.displayYear}`,
            'aria-disabled': state.disabled ? 'true' : undefined,
            'aria-readonly': state.readOnly ? 'true' : undefined,
        }))
        .withA11y('grid', (state) => ({
            role: 'grid',
            'aria-label': `${monthNames[state.displayMonth]} ${state.displayYear}`,
            'aria-readonly': state.readOnly ? 'true' : undefined,
        }))
        .withA11y('day', (state, element: any) => {
            const day = element?.dataset?.day;
            if (!day) return {};
            
            const date = new Date(state.displayYear, state.displayMonth, parseInt(day));
            const isSelected = state.selectedDate && 
                date.getTime() === state.selectedDate.getTime();
            const isFocused = date.getTime() === state.focusedDate.getTime();
            
            return {
                role: 'gridcell',
                'aria-selected': isSelected ? 'true' : 'false',
                'aria-current': isFocused ? 'date' : undefined,
                'aria-label': date.toLocaleDateString(options.locale || 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                tabIndex: isFocused ? 0 : -1,
            };
        })
        .withInteraction('day', 'onClick', (currentState, event: MouseEvent) => {
            if (currentState.disabled || currentState.readOnly) {
                event.preventDefault();
                return null;
            }
            
            const target = event.target as HTMLElement;
            const day = target.dataset?.day;
            if (!day) return null;
            
            const date = new Date(currentState.displayYear, currentState.displayMonth, parseInt(day));
            
            if (state.isDateDisabled(date)) {
                event.preventDefault();
                return null;
            }
            
            state.selectDate(date);
            return 'select';
        })
        .withInteraction('root', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            if (currentState.disabled) return null;
            
            const focusedDate = new Date(currentState.focusedDate);
            let handled = true;
            
            switch (event.key) {
                case 'ArrowLeft':
                    focusedDate.setDate(focusedDate.getDate() - 1);
                    break;
                case 'ArrowRight':
                    focusedDate.setDate(focusedDate.getDate() + 1);
                    break;
                case 'ArrowUp':
                    focusedDate.setDate(focusedDate.getDate() - 7);
                    break;
                case 'ArrowDown':
                    focusedDate.setDate(focusedDate.getDate() + 7);
                    break;
                case 'Home':
                    focusedDate.setDate(1);
                    break;
                case 'End':
                    const lastDay = new Date(focusedDate.getFullYear(), focusedDate.getMonth() + 1, 0).getDate();
                    focusedDate.setDate(lastDay);
                    break;
                case 'PageUp':
                    if (event.shiftKey) {
                        focusedDate.setFullYear(focusedDate.getFullYear() - 1);
                    } else {
                        focusedDate.setMonth(focusedDate.getMonth() - 1);
                    }
                    break;
                case 'PageDown':
                    if (event.shiftKey) {
                        focusedDate.setFullYear(focusedDate.getFullYear() + 1);
                    } else {
                        focusedDate.setMonth(focusedDate.getMonth() + 1);
                    }
                    break;
                case 'Enter':
                case ' ':
                    if (!currentState.readOnly && !state.isDateDisabled(currentState.focusedDate)) {
                        state.selectDate(currentState.focusedDate);
                        return 'select';
                    }
                    break;
                default:
                    handled = false;
            }
            
            if (handled) {
                event.preventDefault();
                state.setFocusedDate(focusedDate);
                
                if (focusedDate.getMonth() !== currentState.displayMonth || 
                    focusedDate.getFullYear() !== currentState.displayYear) {
                    state.setDisplayMonth(focusedDate.getMonth(), focusedDate.getFullYear());
                }
            }
            
            return null;
        })
        .withInteraction('prevMonth', 'onClick', (currentState, event: MouseEvent) => {
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            state.previousMonth();
            return 'monthChange';
        })
        .withInteraction('nextMonth', 'onClick', (currentState, event: MouseEvent) => {
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            state.nextMonth();
            return 'monthChange';
        })
        .withInteraction('monthYearButton', 'onClick', (currentState, event: MouseEvent) => {
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            const newMode = currentState.viewMode === 'days' ? 'months' : 'days';
            state.setViewMode(newMode);
            return 'viewModeChange';
        })
        .build();
}