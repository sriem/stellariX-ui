/**
 * DatePicker Component Types
 * Define all TypeScript interfaces for the date picker component
 */

/**
 * Date picker selection mode
 */
export type DatePickerMode = 'single' | 'range';

/**
 * Date picker view type
 */
export type DatePickerView = 'day' | 'month' | 'year';

/**
 * Date picker component state
 * Represents the internal state of the component
 */
export interface DatePickerState {
    /**
     * Current selected date (single mode)
     */
    value: Date | null;
    
    /**
     * Start date (range mode)
     */
    startDate: Date | null;
    
    /**
     * End date (range mode)
     */
    endDate: Date | null;
    
    /**
     * Current date being hovered (for range selection)
     */
    hoveredDate: Date | null;
    
    /**
     * Currently displayed month/year in calendar view
     */
    viewDate: Date;
    
    /**
     * Current view type
     */
    currentView: DatePickerView;
    
    /**
     * Selection mode
     */
    mode: DatePickerMode;
    
    /**
     * Whether time selection is included
     */
    includeTime: boolean;
    
    /**
     * Selected hour (when includeTime is true)
     */
    hour: number;
    
    /**
     * Selected minute (when includeTime is true)
     */
    minute: number;
    
    /**
     * Whether the calendar dropdown is open
     */
    open: boolean;
    
    /**
     * Whether the component has focus
     */
    focused: boolean;
    
    /**
     * Whether the component is disabled
     */
    disabled: boolean;
    
    /**
     * Whether the component is readonly
     */
    readonly: boolean;
    
    /**
     * Minimum selectable date
     */
    minDate: Date | null;
    
    /**
     * Maximum selectable date
     */
    maxDate: Date | null;
    
    /**
     * Array of disabled dates
     */
    disabledDates: Date[];
    
    /**
     * First day of week (0 = Sunday, 1 = Monday, etc.)
     */
    firstDayOfWeek: number;
    
    /**
     * Currently highlighted date (keyboard navigation)
     */
    highlightedDate: Date | null;
    
    /**
     * Date format string
     */
    dateFormat: string;
    
    /**
     * Placeholder text
     */
    placeholder: string;
    
    /**
     * Locale for month/day names
     */
    locale: string;
}

/**
 * Date picker component options
 * Configuration passed when creating the component
 */
export interface DatePickerOptions {
    /**
     * Initial selected date (single mode)
     * @default null
     */
    value?: Date | null;
    
    /**
     * Initial start date (range mode)
     * @default null
     */
    startDate?: Date | null;
    
    /**
     * Initial end date (range mode)
     * @default null
     */
    endDate?: Date | null;
    
    /**
     * Selection mode
     * @default 'single'
     */
    mode?: DatePickerMode;
    
    /**
     * Whether to include time selection
     * @default false
     */
    includeTime?: boolean;
    
    /**
     * Minimum selectable date
     * @default null
     */
    minDate?: Date | null;
    
    /**
     * Maximum selectable date
     * @default null
     */
    maxDate?: Date | null;
    
    /**
     * Array of dates that should be disabled
     * @default []
     */
    disabledDates?: Date[];
    
    /**
     * Function to determine if a date should be disabled
     */
    isDateDisabled?: (date: Date) => boolean;
    
    /**
     * Whether the component is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Whether the component is readonly
     * @default false
     */
    readonly?: boolean;
    
    /**
     * First day of week (0 = Sunday, 1 = Monday, etc.)
     * @default 0
     */
    firstDayOfWeek?: number;
    
    /**
     * Date format string for display
     * @default 'MM/DD/YYYY'
     */
    dateFormat?: string;
    
    /**
     * Time format string for display (when includeTime is true)
     * @default 'HH:mm'
     */
    timeFormat?: string;
    
    /**
     * Placeholder text
     * @default 'Select date'
     */
    placeholder?: string;
    
    /**
     * Locale for month/day names
     * @default 'en-US'
     */
    locale?: string;
    
    /**
     * Whether to show week numbers
     * @default false
     */
    showWeekNumbers?: boolean;
    
    /**
     * Whether to close calendar on date selection (single mode)
     * @default true
     */
    closeOnSelect?: boolean;
    
    /**
     * Callback when date value changes (single mode)
     */
    onChange?: (value: Date | null) => void;
    
    /**
     * Callback when date range changes (range mode)
     */
    onRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
    
    /**
     * Callback when calendar opens
     */
    onOpen?: () => void;
    
    /**
     * Callback when calendar closes
     */
    onClose?: () => void;
    
    /**
     * Callback when component receives focus
     */
    onFocus?: (event: FocusEvent) => void;
    
    /**
     * Callback when component loses focus
     */
    onBlur?: (event: FocusEvent) => void;
    
    /**
     * Callback when view changes (day/month/year)
     */
    onViewChange?: (view: DatePickerView) => void;
    
    /**
     * Callback when displayed month changes
     */
    onMonthChange?: (date: Date) => void;
}

/**
 * Date picker component events
 * Events that can be triggered by the component
 */
export interface DatePickerEvents {
    /**
     * Fired when date value changes (single mode)
     */
    change: {
        value: Date | null;
        formattedValue: string;
    };
    
    /**
     * Fired when date range changes (range mode)
     */
    rangeChange: {
        startDate: Date | null;
        endDate: Date | null;
        formattedStartDate: string;
        formattedEndDate: string;
    };
    
    /**
     * Fired when calendar opens
     */
    open: null;
    
    /**
     * Fired when calendar closes
     */
    close: null;
    
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
    
    /**
     * Fired when view changes
     */
    viewChange: {
        view: DatePickerView;
        previousView: DatePickerView;
    };
    
    /**
     * Fired when displayed month changes
     */
    monthChange: {
        date: Date;
        month: number;
        year: number;
    };
    
    /**
     * Fired when a date is selected
     */
    dateSelect: {
        date: Date;
        isRangeStart: boolean;
        isRangeEnd: boolean;
    };
    
    /**
     * Fired on keyboard navigation
     */
    navigate: {
        direction: 'prev' | 'next' | 'up' | 'down' | 'pageUp' | 'pageDown' | 'home' | 'end';
        date: Date;
    };
}

/**
 * Date picker component props
 * Props that can be passed to the component
 */
export interface DatePickerProps extends DatePickerOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Component ID
     */
    id?: string;
    
    /**
     * Name attribute for form submission
     */
    name?: string;
    
    /**
     * Whether the field is required
     */
    required?: boolean;
    
    /**
     * ARIA label
     */
    'aria-label'?: string;
    
    /**
     * ARIA labelledby
     */
    'aria-labelledby'?: string;
    
    /**
     * ARIA describedby
     */
    'aria-describedby'?: string;
    
    /**
     * ARIA invalid
     */
    'aria-invalid'?: boolean;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}

/**
 * Calendar cell information
 */
export interface CalendarCell {
    date: Date;
    day: number;
    month: number;
    year: number;
    isToday: boolean;
    isSelected: boolean;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isInRange: boolean;
    isDisabled: boolean;
    isOutsideMonth: boolean;
    isWeekend: boolean;
    isHighlighted: boolean;
    isHovered: boolean;
}

/**
 * Calendar week information
 */
export interface CalendarWeek {
    weekNumber: number;
    days: CalendarCell[];
}

/**
 * Calendar grid information
 */
export interface CalendarGrid {
    month: number;
    year: number;
    weeks: CalendarWeek[];
}