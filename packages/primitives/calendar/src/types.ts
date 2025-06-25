/**
 * Calendar Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Day information
 */
export interface CalendarDay {
    date: Date;
    day: number;
    month: number;
    year: number;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
    isOutsideMonth: boolean;
    isWeekend: boolean;
}

/**
 * Calendar component state
 * Represents the internal state of the component
 */
export interface CalendarState {
    /**
     * Currently selected date
     */
    selectedDate: Date | null;
    
    /**
     * Currently focused date (for keyboard navigation)
     */
    focusedDate: Date;
    
    /**
     * Currently displayed month
     */
    displayMonth: number;
    
    /**
     * Currently displayed year
     */
    displayYear: number;
    
    /**
     * Calendar view mode
     */
    viewMode: 'days' | 'months' | 'years';
    
    /**
     * Whether the calendar is disabled
     */
    disabled: boolean;
    
    /**
     * Whether the calendar is read-only
     */
    readOnly: boolean;
    
    /**
     * Days in the current month view
     */
    days: CalendarDay[];
}

/**
 * Calendar component options
 * Configuration passed when creating the component
 */
export interface CalendarOptions {
    /**
     * Initial selected date
     */
    value?: Date | null;
    
    /**
     * Minimum selectable date
     */
    minDate?: Date;
    
    /**
     * Maximum selectable date
     */
    maxDate?: Date;
    
    /**
     * First day of week (0 = Sunday, 1 = Monday, etc.)
     * @default 0
     */
    firstDayOfWeek?: number;
    
    /**
     * Locale for date formatting
     * @default 'en-US'
     */
    locale?: string;
    
    /**
     * Whether to show week numbers
     * @default false
     */
    showWeekNumbers?: boolean;
    
    /**
     * Whether the component is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Whether the component is read-only
     * @default false
     */
    readOnly?: boolean;
    
    /**
     * Callback when date is selected
     */
    onChange?: (date: Date | null) => void;
    
    /**
     * Callback when month changes
     */
    onMonthChange?: (month: number, year: number) => void;
    
    /**
     * Callback when year changes
     */
    onYearChange?: (year: number) => void;
    
    /**
     * Custom function to determine if a date is disabled
     */
    isDateDisabled?: (date: Date) => boolean;
    
    /**
     * Custom function to format day labels
     */
    formatDay?: (date: Date) => string;
    
    /**
     * Custom function to format month labels
     */
    formatMonth?: (month: number, year: number) => string;
}

/**
 * Calendar component events
 * Events that can be triggered by the component
 */
export interface CalendarEvents {
    /**
     * Fired when a date is selected
     */
    select: {
        date: Date | null;
        previousDate: Date | null;
    };
    
    /**
     * Fired when the displayed month changes
     */
    monthChange: {
        month: number;
        year: number;
        previousMonth: number;
        previousYear: number;
    };
    
    /**
     * Fired when the displayed year changes
     */
    yearChange: {
        year: number;
        previousYear: number;
    };
    
    /**
     * Fired when view mode changes
     */
    viewModeChange: {
        viewMode: 'days' | 'months' | 'years';
        previousViewMode: 'days' | 'months' | 'years';
    };
    
    /**
     * Fired when component receives focus
     */
    focus: {
        event: FocusEvent;
    };
    
    /**
     * Fired when component loses focus
     */
    blur: {
        event: FocusEvent;
    };
}

/**
 * Calendar component props
 * Props that can be passed to the component
 */
export interface CalendarProps extends CalendarOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
    
    /**
     * Custom aria-label
     */
    'aria-label'?: string;
}