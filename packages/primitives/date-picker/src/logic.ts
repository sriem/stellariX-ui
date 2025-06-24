/**
 * DatePicker Component Logic
 * Handles interactions and business logic for the date picker component
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import { generateComponentId } from '@stellarix-ui/utils';
import type { DatePickerState, DatePickerEvents, DatePickerOptions, CalendarGrid, CalendarWeek, CalendarCell } from './types.js';
import type { DatePickerStateStore } from './state.js';

/**
 * Creates the logic layer for the date picker component
 */
export function createDatePickerLogic(
    state: DatePickerStateStore,
    options: DatePickerOptions = {}
) {
    const componentId = generateComponentId('date-picker');
    const calendarId = `${componentId}-calendar`;
    const inputId = `${componentId}-input`;

    return new LogicLayerBuilder<DatePickerState, DatePickerEvents>()
        .onEvent('change', (currentState, payload) => {
            const value = payload && 'value' in payload ? payload.value : payload;
            
            state.setValue(value);
            if (options.onChange) {
                options.onChange(value);
            }
            
            return null;
        })
        
        .onEvent('rangeChange', (currentState, payload) => {
            const startDate = payload && 'startDate' in payload ? payload.startDate : null;
            const endDate = payload && 'endDate' in payload ? payload.endDate : null;
            
            state.setDateRange(startDate, endDate);
            if (options.onRangeChange) {
                options.onRangeChange(startDate, endDate);
            }
            
            return null;
        })
        
        .onEvent('open', (currentState, payload) => {
            if (currentState.disabled || currentState.readonly) return null;
            
            state.setOpen(true);
            
            if (options.onOpen) {
                options.onOpen();
            }
            
            return null;
        })
        
        .onEvent('close', (currentState, payload) => {
            state.setOpen(false);
            
            if (options.onClose) {
                options.onClose();
            }
            
            return null;
        })
        
        .onEvent('focus', (currentState, payload) => {
            const event = payload && 'event' in payload ? payload.event : payload;
            
            state.setFocused(true);
            
            if (options.onFocus && event) {
                options.onFocus(event);
            }
            
            return null;
        })
        
        .onEvent('blur', (currentState, payload) => {
            const event = payload && 'event' in payload ? payload.event : payload;
            
            state.setFocused(false);
            
            if (options.onBlur && event) {
                options.onBlur(event);
            }
            
            return null;
        })
        
        .onEvent('viewChange', (currentState, payload) => {
            const view = payload && 'view' in payload ? payload.view : payload;
            
            state.setCurrentView(view);
            
            if (options.onViewChange) {
                options.onViewChange(view);
            }
            
            return null;
        })
        
        .onEvent('monthChange', (currentState, payload) => {
            const date = payload && 'date' in payload ? payload.date : payload;
            
            state.setViewDate(date);
            
            if (options.onMonthChange) {
                options.onMonthChange(date);
            }
            
            return null;
        })
        
        .onEvent('dateSelect', (currentState, payload) => {
            const date = payload && 'date' in payload ? payload.date : payload;
            
            state.selectDate(date);
            
            if (currentState.mode === 'single' && options.onChange) {
                options.onChange(date);
            } else if (currentState.mode === 'range' && options.onRangeChange) {
                // Let the selectDate method handle the range logic
                // and we'll check the updated state via subscription if needed
            }
            
            return null;
        })
        
        .onEvent('navigate', (currentState, payload) => {
            const direction = payload && 'direction' in payload ? payload.direction : payload;
            
            state.navigateDate(direction);
            
            return null;
        })
        
        .withA11y('input', (state) => ({
            role: 'combobox',
            'aria-expanded': state.open,
            'aria-haspopup': 'dialog',
            'aria-controls': state.open ? calendarId : undefined,
            'aria-disabled': state.disabled,
            'aria-readonly': state.readonly,
            'aria-required': options.required,
            'aria-invalid': options['aria-invalid'],
            'aria-describedby': options['aria-describedby'],
            tabIndex: state.disabled ? -1 : 0,
            id: inputId
        }))
        
        .withA11y('calendar', (state) => ({
            role: 'dialog',
            id: calendarId,
            'aria-labelledby': inputId,
            'aria-hidden': !state.open
        }))
        
        .withA11y('grid', (state) => ({
            role: 'grid',
            'aria-label': `Calendar for ${state.viewDate.toLocaleString(state.locale, { month: 'long', year: 'numeric' })}`
        }))
        
        .withA11y('cell', (state) => (cell: CalendarCell) => ({
            role: 'gridcell',
            'aria-selected': cell.isSelected,
            'aria-disabled': cell.isDisabled,
            'aria-current': cell.isToday ? 'date' : undefined,
            tabIndex: cell.isHighlighted ? 0 : -1
        }))
        
        .withInteraction('input', 'onClick', (currentState, event) => {
            if (currentState.disabled || currentState.readonly) {
                event.preventDefault();
                return null;
            }
            
            if (!currentState.open) {
                state.setOpen(true);
                return 'open';
            } else {
                state.setOpen(false);
                return 'close';
            }
        })
        
        .withInteraction('input', 'onKeyDown', (currentState, event) => {
            if (currentState.disabled || currentState.readonly) {
                return null;
            }
            
            switch (event.key) {
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    if (!currentState.open) {
                        state.setOpen(true);
                        return 'open';
                    } else if (currentState.highlightedDate) {
                        state.selectDate(currentState.highlightedDate);
                        
                        if (currentState.mode === 'single' && options.onChange) {
                            options.onChange(currentState.highlightedDate);
                        }
                        
                        return 'dateSelect';
                    }
                    break;
                    
                case 'ArrowDown':
                    event.preventDefault();
                    if (!currentState.open) {
                        state.setOpen(true);
                        return 'open';
                    } else {
                        state.navigateDate('down');
                        return 'navigate';
                    }
                    
                case 'ArrowUp':
                    event.preventDefault();
                    if (!currentState.open) {
                        state.setOpen(true);
                        return 'open';
                    } else {
                        state.navigateDate('up');
                        return 'navigate';
                    }
                    
                case 'ArrowLeft':
                    if (currentState.open) {
                        event.preventDefault();
                        state.navigateDate('prev');
                        return 'navigate';
                    }
                    break;
                    
                case 'ArrowRight':
                    if (currentState.open) {
                        event.preventDefault();
                        state.navigateDate('next');
                        return 'navigate';
                    }
                    break;
                    
                case 'PageUp':
                    if (currentState.open) {
                        event.preventDefault();
                        state.navigateDate('pageUp');
                        return 'navigate';
                    }
                    break;
                    
                case 'PageDown':
                    if (currentState.open) {
                        event.preventDefault();
                        state.navigateDate('pageDown');
                        return 'navigate';
                    }
                    break;
                    
                case 'Home':
                    if (currentState.open) {
                        event.preventDefault();
                        state.navigateDate('home');
                        return 'navigate';
                    }
                    break;
                    
                case 'End':
                    if (currentState.open) {
                        event.preventDefault();
                        state.navigateDate('end');
                        return 'navigate';
                    }
                    break;
                    
                case 'Escape':
                    if (currentState.open) {
                        event.preventDefault();
                        state.setOpen(false);
                        return 'close';
                    }
                    break;
                    
                case 'Tab':
                    if (currentState.open) {
                        state.setOpen(false);
                        return 'close';
                    }
                    break;
            }
            
            return null;
        })
        
        .withInteraction('input', 'onFocus', (currentState, event) => {
            state.setFocused(true);
            
            if (options.onFocus) {
                options.onFocus(event);
            }
            
            return 'focus';
        })
        
        .withInteraction('input', 'onBlur', (currentState, event) => {
            // Small delay to allow date selection
            setTimeout(() => {
                state.setFocused(false);
                if (!currentState.includeTime) {
                    state.setOpen(false);
                }
                
                if (options.onBlur) {
                    options.onBlur(event);
                }
            }, 100);
            
            return 'blur';
        })
        
        .withInteraction('clear', 'onClick', (currentState, event) => {
            if (!currentState.disabled && !currentState.readonly) {
                event.stopPropagation();
                state.clearSelection();
                
                if (currentState.mode === 'single' && options.onChange) {
                    options.onChange(null);
                } else if (currentState.mode === 'range' && options.onRangeChange) {
                    options.onRangeChange(null, null);
                }
                
                return currentState.mode === 'single' ? 'change' : 'rangeChange';
            }
            
            return null;
        })
        
        .withInteraction('prevMonth', 'onClick', (currentState, event) => {
            state.prevMonth();
            
            if (options.onMonthChange) {
                const newViewDate = new Date(currentState.viewDate);
                newViewDate.setMonth(newViewDate.getMonth() - 1);
                options.onMonthChange(newViewDate);
            }
            
            return 'monthChange';
        })
        
        .withInteraction('nextMonth', 'onClick', (currentState, event) => {
            state.nextMonth();
            
            if (options.onMonthChange) {
                const newViewDate = new Date(currentState.viewDate);
                newViewDate.setMonth(newViewDate.getMonth() + 1);
                options.onMonthChange(newViewDate);
            }
            
            return 'monthChange';
        })
        
        .withInteraction('monthYearButton', 'onClick', (currentState, event) => {
            const newView = currentState.currentView === 'day' ? 'month' : 
                           currentState.currentView === 'month' ? 'year' : 'day';
            
            state.setCurrentView(newView);
            
            if (options.onViewChange) {
                options.onViewChange(newView);
            }
            
            return 'viewChange';
        })
        
        .withInteraction('cell', 'onClick', (currentState, event) => {
            const date = (event as any).date;
            const isDisabled = state.isDateDisabled.get();
            if (!date || isDisabled(date)) {
                return null;
            }
            
            state.selectDate(date);
            
            if (currentState.mode === 'single' && options.onChange) {
                options.onChange(date);
            }
            
            return 'dateSelect';
        })
        
        .withInteraction('cell', 'onMouseEnter', (currentState, event) => {
            if (currentState.mode === 'range' && currentState.startDate && !currentState.endDate) {
                const date = (event as any).date;
                const isDisabled = state.isDateDisabled.get();
                if (date && !isDisabled(date)) {
                    state.setHoveredDate(date);
                }
            }
            
            return null;
        })
        
        .withInteraction('cell', 'onMouseLeave', (currentState, event) => {
            if (currentState.mode === 'range') {
                state.setHoveredDate(null);
            }
            
            return null;
        })
        
        .withInteraction('timeInput', 'onChange', (currentState, event) => {
            const target = event.target as HTMLInputElement;
            const isHour = (event as any).isHour;
            const value = parseInt(target.value, 10);
            
            if (!isNaN(value)) {
                if (isHour) {
                    state.setHour(value);
                } else {
                    state.setMinute(value);
                }
            }
            
            return null;
        })
        
        .build();
}

/**
 * Generate calendar grid for display
 */
export function generateCalendarGrid(
    viewDate: Date,
    firstDayOfWeek: number,
    locale: string
): CalendarGrid {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Calculate start date (may be from previous month)
    const startDayOfWeek = firstDay.getDay();
    const daysFromPrevMonth = (startDayOfWeek - firstDayOfWeek + 7) % 7;
    const startDate = new Date(year, month, 1 - daysFromPrevMonth);
    
    const weeks: CalendarWeek[] = [];
    let currentDate = new Date(startDate);
    let weekNumber = 1;
    
    while (currentDate <= lastDay || currentDate.getDay() !== firstDayOfWeek) {
        const days: CalendarCell[] = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentDate);
            const isToday = isDateToday(date);
            const isOutsideMonth = date.getMonth() !== month;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            
            days.push({
                date,
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                isToday,
                isSelected: false, // Will be set by component
                isRangeStart: false, // Will be set by component
                isRangeEnd: false, // Will be set by component
                isInRange: false, // Will be set by component
                isDisabled: false, // Will be set by component
                isOutsideMonth,
                isWeekend,
                isHighlighted: false, // Will be set by component
                isHovered: false // Will be set by component
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        weeks.push({
            weekNumber,
            days
        });
        
        weekNumber++;
    }
    
    return {
        month,
        year,
        weeks
    };
}

/**
 * Check if date is today
 */
function isDateToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
}