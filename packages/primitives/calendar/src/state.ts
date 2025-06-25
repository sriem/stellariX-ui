/**
 * Calendar Component State Management
 * Manages calendar date selection and navigation
 */

import { createComponentState } from '@stellarix-ui/core';
import type { CalendarState, CalendarOptions, CalendarDay } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface CalendarStateStore {
    // Core state methods
    getState: () => CalendarState;
    setState: (updater: (prev: CalendarState) => CalendarState) => void;
    subscribe: (listener: (state: CalendarState) => void) => () => void;
    derive: <U>(selector: (state: CalendarState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    selectDate: (date: Date | null) => void;
    setFocusedDate: (date: Date) => void;
    setDisplayMonth: (month: number, year: number) => void;
    setViewMode: (mode: 'days' | 'months' | 'years') => void;
    setDisabled: (disabled: boolean) => void;
    setReadOnly: (readOnly: boolean) => void;
    
    // Navigation methods
    goToToday: () => void;
    goToDate: (date: Date) => void;
    nextMonth: () => void;
    previousMonth: () => void;
    nextYear: () => void;
    previousYear: () => void;
    
    // Computed properties
    isDateSelected: (date: Date) => boolean;
    isDateDisabled: (date: Date) => boolean;
    isDateToday: (date: Date) => boolean;
    getDaysInMonth: () => CalendarDay[];
}

/**
 * Creates the calendar component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createCalendarState(options: CalendarOptions = {}): CalendarStateStore {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const initialDate = options.value || today;
    
    // Helper functions
    const getDaysInMonth = (month: number, year: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };
    
    const getFirstDayOfMonth = (month: number, year: number): number => {
        return new Date(year, month, 1).getDay();
    };
    
    const generateDays = (month: number, year: number, selectedDate: Date | null, focusedDate: Date): CalendarDay[] => {
        const days: CalendarDay[] = [];
        const firstDay = getFirstDayOfMonth(month, year);
        const daysInMonth = getDaysInMonth(month, year);
        const daysInPrevMonth = getDaysInMonth(month - 1, year);
        
        // Previous month days
        const startDay = (firstDay - (options.firstDayOfWeek ?? 0) + 7) % 7;
        for (let i = startDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const date = new Date(year, month - 1, day);
            date.setHours(0, 0, 0, 0);
            days.push({
                date,
                day,
                month: month - 1,
                year,
                isToday: date.getTime() === today.getTime(),
                isSelected: selectedDate ? date.getTime() === selectedDate.getTime() : false,
                isDisabled: isDateDisabledHelper(date, options),
                isOutsideMonth: true,
                isWeekend: date.getDay() === 0 || date.getDay() === 6
            });
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            days.push({
                date,
                day,
                month,
                year,
                isToday: date.getTime() === today.getTime(),
                isSelected: selectedDate ? date.getTime() === selectedDate.getTime() : false,
                isDisabled: isDateDisabledHelper(date, options),
                isOutsideMonth: false,
                isWeekend: date.getDay() === 0 || date.getDay() === 6
            });
        }
        
        // Next month days to fill the grid
        const remainingDays = 42 - days.length; // 6 weeks * 7 days
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            date.setHours(0, 0, 0, 0);
            days.push({
                date,
                day,
                month: month + 1,
                year,
                isToday: date.getTime() === today.getTime(),
                isSelected: selectedDate ? date.getTime() === selectedDate.getTime() : false,
                isDisabled: isDateDisabledHelper(date, options),
                isOutsideMonth: true,
                isWeekend: date.getDay() === 0 || date.getDay() === 6
            });
        }
        
        return days;
    };
    
    const isDateDisabledHelper = (date: Date, options: CalendarOptions): boolean => {
        if (options.minDate && date < options.minDate) return true;
        if (options.maxDate && date > options.maxDate) return true;
        if (options.isDateDisabled) return options.isDateDisabled(date);
        return false;
    };
    
    // Define initial state
    const initialState: CalendarState = {
        selectedDate: options.value || null,
        focusedDate: initialDate,
        displayMonth: initialDate.getMonth(),
        displayYear: initialDate.getFullYear(),
        viewMode: 'days',
        disabled: options.disabled ?? false,
        readOnly: options.readOnly ?? false,
        days: generateDays(initialDate.getMonth(), initialDate.getFullYear(), options.value || null, initialDate)
    };
    
    // Create the core state store
    const store = createComponentState('Calendar', initialState);
    
    // Extend with component-specific methods
    const extendedStore: CalendarStateStore = {
        ...store,
        
        selectDate: (date: Date | null) => {
            store.setState((prev) => {
                const newState = { 
                    ...prev, 
                    selectedDate: date,
                    days: generateDays(prev.displayMonth, prev.displayYear, date, prev.focusedDate)
                };
                
                if (options.onChange && date !== prev.selectedDate) {
                    options.onChange(date);
                }
                
                return newState;
            });
        },
        
        setFocusedDate: (date: Date) => {
            store.setState((prev) => ({ ...prev, focusedDate: date }));
        },
        
        setDisplayMonth: (month: number, year: number) => {
            store.setState((prev) => {
                const newState = {
                    ...prev,
                    displayMonth: month,
                    displayYear: year,
                    days: generateDays(month, year, prev.selectedDate, prev.focusedDate)
                };
                
                if (options.onMonthChange && (month !== prev.displayMonth || year !== prev.displayYear)) {
                    options.onMonthChange(month, year);
                }
                
                return newState;
            });
        },
        
        setViewMode: (mode: 'days' | 'months' | 'years') => {
            store.setState((prev) => ({ ...prev, viewMode: mode }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState((prev) => ({ ...prev, disabled }));
        },
        
        setReadOnly: (readOnly: boolean) => {
            store.setState((prev) => ({ ...prev, readOnly }));
        },
        
        goToToday: () => {
            extendedStore.setDisplayMonth(today.getMonth(), today.getFullYear());
            extendedStore.setFocusedDate(today);
        },
        
        goToDate: (date: Date) => {
            extendedStore.setDisplayMonth(date.getMonth(), date.getFullYear());
            extendedStore.setFocusedDate(date);
        },
        
        nextMonth: () => {
            const state = store.getState();
            let newMonth = state.displayMonth + 1;
            let newYear = state.displayYear;
            
            if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }
            
            extendedStore.setDisplayMonth(newMonth, newYear);
        },
        
        previousMonth: () => {
            const state = store.getState();
            let newMonth = state.displayMonth - 1;
            let newYear = state.displayYear;
            
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            }
            
            extendedStore.setDisplayMonth(newMonth, newYear);
        },
        
        nextYear: () => {
            const state = store.getState();
            const newYear = state.displayYear + 1;
            
            extendedStore.setDisplayMonth(state.displayMonth, newYear);
            
            if (options.onYearChange) {
                options.onYearChange(newYear);
            }
        },
        
        previousYear: () => {
            const state = store.getState();
            const newYear = state.displayYear - 1;
            
            extendedStore.setDisplayMonth(state.displayMonth, newYear);
            
            if (options.onYearChange) {
                options.onYearChange(newYear);
            }
        },
        
        isDateSelected: (date: Date) => {
            const state = store.getState();
            if (!state.selectedDate) return false;
            return date.getTime() === state.selectedDate.getTime();
        },
        
        isDateDisabled: (date: Date) => {
            return isDateDisabledHelper(date, options);
        },
        
        isDateToday: (date: Date) => {
            return date.getTime() === today.getTime();
        },
        
        getDaysInMonth: () => {
            const state = store.getState();
            return state.days;
        }
    };
    
    return extendedStore;
}