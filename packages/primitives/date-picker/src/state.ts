/**
 * DatePicker Component State Management
 * Manages the state for the date picker component
 */

import { createComponentState } from '@stellarix-ui/core';
import type { DatePickerState, DatePickerOptions } from './types.js';

/**
 * Creates a date picker state store
 */
export function createDatePickerState(options: DatePickerOptions) {
    const now = new Date();
    const initialState: DatePickerState = {
        value: options.value || null,
        startDate: options.startDate || null,
        endDate: options.endDate || null,
        hoveredDate: null,
        viewDate: options.value || options.startDate || new Date(),
        currentView: 'day',
        mode: options.mode || 'single',
        includeTime: options.includeTime || false,
        hour: 0,
        minute: 0,
        open: false,
        focused: false,
        disabled: options.disabled || false,
        readonly: options.readonly || false,
        minDate: options.minDate || null,
        maxDate: options.maxDate || null,
        disabledDates: options.disabledDates || [],
        firstDayOfWeek: options.firstDayOfWeek || 0,
        highlightedDate: null,
        dateFormat: options.dateFormat || 'MM/DD/YYYY',
        placeholder: options.placeholder || 'Select date',
        locale: options.locale || 'en-US'
    };

    const store = createComponentState('DatePicker', initialState);

    // Extended API for date picker-specific state management
    return {
        ...store,
        
        // Date selection methods
        setValue: (value: Date | null) => {
            store.setState((prev) => ({ 
                ...prev, 
                value,
                viewDate: value || prev.viewDate
            }));
        },
        
        setDateRange: (startDate: Date | null, endDate: Date | null) => {
            store.setState((prev) => ({ 
                ...prev, 
                startDate,
                endDate,
                viewDate: startDate || prev.viewDate
            }));
        },
        
        setStartDate: (startDate: Date | null) => {
            store.setState((prev) => ({ 
                ...prev, 
                startDate,
                viewDate: startDate || prev.viewDate
            }));
        },
        
        setEndDate: (endDate: Date | null) => {
            store.setState((prev) => ({ ...prev, endDate }));
        },
        
        setHoveredDate: (hoveredDate: Date | null) => {
            store.setState((prev) => ({ ...prev, hoveredDate }));
        },
        
        // View management
        setViewDate: (viewDate: Date) => {
            store.setState((prev) => ({ ...prev, viewDate }));
        },
        
        setCurrentView: (currentView: 'day' | 'month' | 'year') => {
            store.setState((prev) => ({ ...prev, currentView }));
        },
        
        nextMonth: () => {
            store.setState((prev) => {
                const newDate = new Date(prev.viewDate);
                newDate.setMonth(newDate.getMonth() + 1);
                return { ...prev, viewDate: newDate };
            });
        },
        
        prevMonth: () => {
            store.setState((prev) => {
                const newDate = new Date(prev.viewDate);
                newDate.setMonth(newDate.getMonth() - 1);
                return { ...prev, viewDate: newDate };
            });
        },
        
        nextYear: () => {
            store.setState((prev) => {
                const newDate = new Date(prev.viewDate);
                newDate.setFullYear(newDate.getFullYear() + 1);
                return { ...prev, viewDate: newDate };
            });
        },
        
        prevYear: () => {
            store.setState((prev) => {
                const newDate = new Date(prev.viewDate);
                newDate.setFullYear(newDate.getFullYear() - 1);
                return { ...prev, viewDate: newDate };
            });
        },
        
        // Time management
        setTime: (hour: number, minute: number) => {
            store.setState((prev) => ({ ...prev, hour, minute }));
        },
        
        setHour: (hour: number) => {
            store.setState((prev) => ({ ...prev, hour }));
        },
        
        setMinute: (minute: number) => {
            store.setState((prev) => ({ ...prev, minute }));
        },
        
        // State toggles
        setOpen: (open: boolean) => {
            store.setState((prev) => ({ 
                ...prev, 
                open,
                highlightedDate: open ? (prev.value || prev.viewDate) : null
            }));
        },
        
        setFocused: (focused: boolean) => {
            store.setState((prev) => ({ ...prev, focused }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState((prev) => ({ ...prev, disabled }));
        },
        
        setReadonly: (readonly: boolean) => {
            store.setState((prev) => ({ ...prev, readonly }));
        },
        
        // Highlighted date management
        setHighlightedDate: (highlightedDate: Date | null) => {
            store.setState((prev) => ({ ...prev, highlightedDate }));
        },
        
        // Navigation methods
        navigateDate: (direction: 'prev' | 'next' | 'up' | 'down' | 'pageUp' | 'pageDown' | 'home' | 'end') => {
            store.setState((prev) => {
                if (!prev.highlightedDate) return prev;
                
                const newDate = new Date(prev.highlightedDate);
                const dayOfWeek = newDate.getDay();
                const daysInMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
                
                switch (direction) {
                    case 'prev':
                        newDate.setDate(newDate.getDate() - 1);
                        break;
                    case 'next':
                        newDate.setDate(newDate.getDate() + 1);
                        break;
                    case 'up':
                        newDate.setDate(newDate.getDate() - 7);
                        break;
                    case 'down':
                        newDate.setDate(newDate.getDate() + 7);
                        break;
                    case 'pageUp':
                        newDate.setMonth(newDate.getMonth() - 1);
                        break;
                    case 'pageDown':
                        newDate.setMonth(newDate.getMonth() + 1);
                        break;
                    case 'home':
                        newDate.setDate(newDate.getDate() - dayOfWeek + prev.firstDayOfWeek);
                        if (newDate.getDay() > dayOfWeek) {
                            newDate.setDate(newDate.getDate() - 7);
                        }
                        break;
                    case 'end':
                        newDate.setDate(newDate.getDate() + (6 - dayOfWeek) + prev.firstDayOfWeek);
                        if (newDate.getDay() < dayOfWeek) {
                            newDate.setDate(newDate.getDate() + 7);
                        }
                        break;
                }
                
                // Update view date if highlighted date moves to different month
                let newViewDate = prev.viewDate;
                if (newDate.getMonth() !== prev.viewDate.getMonth() || 
                    newDate.getFullYear() !== prev.viewDate.getFullYear()) {
                    newViewDate = new Date(newDate);
                }
                
                return { 
                    ...prev, 
                    highlightedDate: newDate,
                    viewDate: newViewDate
                };
            });
        },
        
        // Selection methods
        selectDate: (date: Date) => {
            store.setState((prev) => {
                if (prev.mode === 'single') {
                    return { 
                        ...prev, 
                        value: date,
                        viewDate: date,
                        open: prev.includeTime ? true : (options.closeOnSelect !== false ? false : prev.open)
                    };
                } else {
                    // Range mode
                    if (!prev.startDate || (prev.startDate && prev.endDate)) {
                        // Start new range
                        return { 
                            ...prev, 
                            startDate: date,
                            endDate: null,
                            viewDate: date
                        };
                    } else {
                        // Complete range
                        const start = prev.startDate;
                        const end = date;
                        
                        // Ensure start is before end
                        if (start > end) {
                            // Call range change callback after state update
                            if (options.onRangeChange) {
                                setTimeout(() => options.onRangeChange(end, start), 0);
                            }
                            return { 
                                ...prev, 
                                startDate: end,
                                endDate: start,
                                open: prev.includeTime ? true : false
                            };
                        } else {
                            // Call range change callback after state update
                            if (options.onRangeChange) {
                                setTimeout(() => options.onRangeChange(start, end), 0);
                            }
                            return { 
                                ...prev, 
                                endDate: end,
                                open: prev.includeTime ? true : false
                            };
                        }
                    }
                }
            });
        },
        
        clearSelection: () => {
            store.setState((prev) => ({ 
                ...prev, 
                value: null,
                startDate: null,
                endDate: null,
                hoveredDate: null
            }));
        },
        
        // Computed properties
        isInteractive: store.derive(state => !state.disabled && !state.readonly),
        
        hasValue: store.derive(state => 
            state.mode === 'single' ? state.value !== null : (state.startDate !== null || state.endDate !== null)
        ),
        
        displayValue: store.derive(state => {
            if (state.mode === 'single' && state.value) {
                return formatDate(state.value, state.dateFormat, state.locale);
            } else if (state.mode === 'range') {
                if (state.startDate && state.endDate) {
                    return `${formatDate(state.startDate, state.dateFormat, state.locale)} - ${formatDate(state.endDate, state.dateFormat, state.locale)}`;
                } else if (state.startDate) {
                    return formatDate(state.startDate, state.dateFormat, state.locale);
                }
            }
            return '';
        }),
        
        isDateDisabled: store.derive(state => (date: Date) => {
            // Check min/max dates
            if (state.minDate && date < state.minDate) return true;
            if (state.maxDate && date > state.maxDate) return true;
            
            // Check disabled dates array
            const dateStr = date.toDateString();
            if (state.disabledDates.some(d => d.toDateString() === dateStr)) return true;
            
            // Check custom disabled function
            if (options.isDateDisabled) {
                return options.isDateDisabled(date);
            }
            
            return false;
        }),
        
        isDateInRange: store.derive(state => (date: Date) => {
            if (state.mode !== 'range' || !state.startDate) return false;
            
            const dateTime = date.getTime();
            const startTime = state.startDate.getTime();
            
            if (state.endDate) {
                const endTime = state.endDate.getTime();
                return dateTime >= startTime && dateTime <= endTime;
            } else if (state.hoveredDate) {
                const hoverTime = state.hoveredDate.getTime();
                
                if (startTime <= hoverTime) {
                    return dateTime >= startTime && dateTime <= hoverTime;
                } else {
                    return dateTime >= hoverTime && dateTime <= startTime;
                }
            }
            
            return false;
        })
    };
}

/**
 * Format date according to format string
 */
function formatDate(date: Date, format: string, locale: string): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return '';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
        .replace('YYYY', String(year))
        .replace('YY', String(year).slice(-2))
        .replace('MM', month)
        .replace('M', String(date.getMonth() + 1))
        .replace('DD', day)
        .replace('D', String(date.getDate()));
}

export type DatePickerStateStore = ReturnType<typeof createDatePickerState>;