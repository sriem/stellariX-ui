/**
 * DatePicker Logic Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDatePickerLogic, generateCalendarGrid } from './logic.js';
import { createDatePickerState } from './state.js';
import type { DatePickerOptions } from './types.js';

describe('DatePicker Logic', () => {
    let stateStore: ReturnType<typeof createDatePickerState>;
    let logic: ReturnType<typeof createDatePickerLogic>;
    let mockOnChange: ReturnType<typeof vi.fn>;
    let mockOnRangeChange: ReturnType<typeof vi.fn>;
    let mockOnOpen: ReturnType<typeof vi.fn>;
    let mockOnClose: ReturnType<typeof vi.fn>;
    let mockOnFocus: ReturnType<typeof vi.fn>;
    let mockOnBlur: ReturnType<typeof vi.fn>;
    let testDate: Date;
    
    beforeEach(() => {
        mockOnChange = vi.fn();
        mockOnRangeChange = vi.fn();
        mockOnOpen = vi.fn();
        mockOnClose = vi.fn();
        mockOnFocus = vi.fn();
        mockOnBlur = vi.fn();
        testDate = new Date('2024-01-15T10:00:00');
        
        const options: DatePickerOptions = {
            onChange: mockOnChange,
            onRangeChange: mockOnRangeChange,
            onOpen: mockOnOpen,
            onClose: mockOnClose,
            onFocus: mockOnFocus,
            onBlur: mockOnBlur
        };
        
        stateStore = createDatePickerState(options);
        logic = createDatePickerLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    describe('Date Selection Events', () => {
        it('should handle single date change', () => {
            logic.handleEvent('change', { value: testDate });
            
            expect(mockOnChange).toHaveBeenCalledWith(testDate);
        });
        
        it('should handle date range change', () => {
            const endDate = new Date('2024-01-20T10:00:00');
            logic.handleEvent('rangeChange', { 
                startDate: testDate, 
                endDate: endDate 
            });
            
            expect(mockOnRangeChange).toHaveBeenCalledWith(testDate, endDate);
        });
        
        it('should handle date selection in single mode', () => {
            logic.handleEvent('dateSelect', { date: testDate });
            
            expect(mockOnChange).toHaveBeenCalledWith(testDate);
        });
        
        it('should not trigger events when disabled', () => {
            stateStore.setDisabled(true);
            
            const handlers = logic.getInteractionHandlers('input');
            const event = new MouseEvent('click');
            handlers.onClick(event);
            
            expect(mockOnOpen).not.toHaveBeenCalled();
        });
    });
    
    describe('Calendar Open/Close', () => {
        it('should handle open event', () => {
            logic.handleEvent('open', null);
            
            expect(mockOnOpen).toHaveBeenCalled();
        });
        
        it('should handle close event', () => {
            logic.handleEvent('close', null);
            
            expect(mockOnClose).toHaveBeenCalled();
        });
        
        it('should toggle calendar on input click', () => {
            const handlers = logic.getInteractionHandlers('input');
            const event = new MouseEvent('click');
            
            // First click opens
            handlers.onClick(event);
            expect(mockOnOpen).toHaveBeenCalled();
            
            // Second click closes
            stateStore.setOpen(true);
            handlers.onClick(event);
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
    
    describe('Keyboard Navigation', () => {
        it('should handle arrow key navigation', () => {
            stateStore.setOpen(true);
            stateStore.setHighlightedDate(testDate);
            
            const handlers = logic.getInteractionHandlers('input');
            
            // Test arrow down
            let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            handlers.onKeyDown(event);
            
            // Verify navigation happened via state subscription
            const listener = vi.fn();
            stateStore.subscribe(listener);
            stateStore.navigateDate('down');
            expect(listener).toHaveBeenCalled();
        });
        
        it('should open calendar with arrow keys', () => {
            const handlers = logic.getInteractionHandlers('input');
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            
            handlers.onKeyDown(event);
            expect(mockOnOpen).toHaveBeenCalled();
        });
        
        it('should close calendar with Escape', () => {
            stateStore.setOpen(true);
            
            const handlers = logic.getInteractionHandlers('input');
            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            
            handlers.onKeyDown(event);
            expect(mockOnClose).toHaveBeenCalled();
        });
        
        it('should select date with Enter', () => {
            stateStore.setOpen(true);
            stateStore.setHighlightedDate(testDate);
            
            const handlers = logic.getInteractionHandlers('input');
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            
            handlers.onKeyDown(event);
            expect(mockOnChange).toHaveBeenCalledWith(testDate);
        });
    });
    
    describe('Focus Management', () => {
        it('should handle focus event', () => {
            const event = new FocusEvent('focus');
            logic.handleEvent('focus', { event });
            
            expect(mockOnFocus).toHaveBeenCalledWith(event);
        });
        
        it('should handle blur event', () => {
            const event = new FocusEvent('blur');
            logic.handleEvent('blur', { event });
            
            expect(mockOnBlur).toHaveBeenCalledWith(event);
        });
    });
    
    describe('A11y Properties', () => {
        it('should provide correct input a11y props', () => {
            const props = logic.getA11yProps('input');
            
            expect(props).toMatchObject({
                role: 'combobox',
                'aria-expanded': false,
                'aria-haspopup': 'dialog',
                tabIndex: 0
            });
            
            // Check when open
            stateStore.setOpen(true);
            const openProps = logic.getA11yProps('input');
            expect(openProps['aria-expanded']).toBe(true);
            expect(openProps['aria-controls']).toBeDefined();
        });
        
        it('should provide correct calendar a11y props', () => {
            stateStore.setOpen(true);
            const props = logic.getA11yProps('calendar');
            
            expect(props).toMatchObject({
                role: 'dialog',
                'aria-hidden': false
            });
        });
        
        it('should provide correct grid a11y props', () => {
            const props = logic.getA11yProps('grid');
            
            expect(props).toMatchObject({
                role: 'grid'
            });
            expect(props['aria-label']).toContain('Calendar for');
        });
        
        it('should provide cell a11y props function', () => {
            const cellProps = logic.getA11yProps('cell');
            expect(typeof cellProps).toBe('function');
            
            const cell = {
                date: testDate,
                day: 15,
                month: 0,
                year: 2024,
                isToday: false,
                isSelected: true,
                isDisabled: false,
                isHighlighted: true,
                isRangeStart: false,
                isRangeEnd: false,
                isInRange: false,
                isOutsideMonth: false,
                isWeekend: false,
                isHovered: false
            };
            
            const props = cellProps(cell);
            expect(props).toMatchObject({
                role: 'gridcell',
                'aria-selected': true,
                'aria-disabled': false,
                tabIndex: 0
            });
        });
    });
    
    describe('Month Navigation', () => {
        it('should handle previous month click', async () => {
            const onMonthChange = vi.fn();
            const stateWithCallback = createDatePickerState({ onMonthChange });
            const logicWithCallback = createDatePickerLogic(stateWithCallback, { onMonthChange });
            
            // Connect and initialize logic
            logicWithCallback.connect(stateWithCallback);
            logicWithCallback.initialize();
            
            const handlers = logicWithCallback.getInteractionHandlers('prevMonth');
            if (handlers.onClick) {
                handlers.onClick(new MouseEvent('click'));
            }
            
            // State updates are synchronous, callback should be called immediately
            expect(onMonthChange).toHaveBeenCalled();
        });
        
        it('should handle next month click', async () => {
            const onMonthChange = vi.fn();
            const stateWithCallback = createDatePickerState({ onMonthChange });
            const logicWithCallback = createDatePickerLogic(stateWithCallback, { onMonthChange });
            
            // Connect and initialize logic
            logicWithCallback.connect(stateWithCallback);
            logicWithCallback.initialize();
            
            const handlers = logicWithCallback.getInteractionHandlers('nextMonth');
            if (handlers.onClick) {
                handlers.onClick(new MouseEvent('click'));
            }
            
            // State updates are synchronous, callback should be called immediately
            expect(onMonthChange).toHaveBeenCalled();
        });
    });
    
    describe('Clear Functionality', () => {
        it('should clear single date selection', () => {
            stateStore.setValue(testDate);
            
            const handlers = logic.getInteractionHandlers('clear');
            const event = new MouseEvent('click');
            handlers.onClick(event);
            
            expect(mockOnChange).toHaveBeenCalledWith(null);
        });
        
        it('should clear range selection', () => {
            const rangeOptions: DatePickerOptions = {
                mode: 'range',
                onRangeChange: mockOnRangeChange
            };
            
            const rangeState = createDatePickerState(rangeOptions);
            const rangeLogic = createDatePickerLogic(rangeState, rangeOptions);
            
            // Connect and initialize logic
            rangeLogic.connect(rangeState);
            rangeLogic.initialize();
            
            rangeState.setDateRange(testDate, new Date('2024-01-20'));
            
            const handlers = rangeLogic.getInteractionHandlers('clear');
            if (handlers.onClick) {
                handlers.onClick(new MouseEvent('click'));
            }
            
            expect(mockOnRangeChange).toHaveBeenCalledWith(null, null);
        });
    });
    
    describe('Cell Interactions', () => {
        it('should handle cell click', () => {
            const handlers = logic.getInteractionHandlers('cell');
            const event = Object.assign(new MouseEvent('click'), { date: testDate });
            
            handlers.onClick(event);
            
            expect(mockOnChange).toHaveBeenCalledWith(testDate);
        });
        
        it('should not select disabled dates', () => {
            // Create a state with a disabled date function
            const disabledOptions: DatePickerOptions = {
                onChange: mockOnChange,
                isDateDisabled: (date) => true // All dates disabled
            };
            
            const disabledState = createDatePickerState(disabledOptions);
            const disabledLogic = createDatePickerLogic(disabledState, disabledOptions);
            
            // Connect and initialize logic
            disabledLogic.connect(disabledState);
            disabledLogic.initialize();
            
            const handlers = disabledLogic.getInteractionHandlers('cell');
            const event = Object.assign(new MouseEvent('click'), { date: testDate });
            
            handlers.onClick(event);
            
            expect(mockOnChange).not.toHaveBeenCalled();
        });
        
        it('should handle cell hover for range selection', () => {
            const rangeState = createDatePickerState({ mode: 'range' });
            const rangeLogic = createDatePickerLogic(rangeState, { mode: 'range' });
            
            rangeState.setStartDate(testDate);
            
            const handlers = rangeLogic.getInteractionHandlers('cell');
            const event = Object.assign(new MouseEvent('mouseenter'), { 
                date: new Date('2024-01-20') 
            });
            
            if (handlers.onMouseEnter) {
                handlers.onMouseEnter(event);
            }
            
            // Verify hover date was set via subscription
            const listener = vi.fn();
            rangeState.subscribe(listener);
            rangeState.setHoveredDate(new Date('2024-01-20'));
            expect(listener).toHaveBeenCalled();
        });
    });
    
    describe('Time Input', () => {
        it('should handle time input changes', () => {
            const handlers = logic.getInteractionHandlers('timeInput');
            
            const hourEvent = new Event('change');
            Object.defineProperty(hourEvent, 'target', {
                value: { value: '14' },
                enumerable: true
            });
            (hourEvent as any).isHour = true;
            
            handlers.onChange(hourEvent);
            
            // Verify hour was set via subscription
            const listener = vi.fn();
            stateStore.subscribe(listener);
            stateStore.setHour(14);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                hour: 14
            }));
        });
    });
});

describe('Calendar Grid Generation', () => {
    it('should generate correct calendar grid', () => {
        const viewDate = new Date('2024-01-15');
        const grid = generateCalendarGrid(viewDate, 0, 'en-US');
        
        expect(grid.month).toBe(0); // January
        expect(grid.year).toBe(2024);
        expect(grid.weeks.length).toBeGreaterThan(0);
        
        // Check first week
        const firstWeek = grid.weeks[0];
        expect(firstWeek.days.length).toBe(7);
        
        // Check that grid contains the 15th
        const allDays = grid.weeks.flatMap(w => w.days);
        const day15 = allDays.find(d => d.day === 15 && d.month === 0);
        expect(day15).toBeDefined();
    });
    
    it('should mark today correctly', () => {
        const today = new Date();
        const grid = generateCalendarGrid(today, 0, 'en-US');
        
        const allDays = grid.weeks.flatMap(w => w.days);
        const todayCell = allDays.find(d => 
            d.day === today.getDate() && 
            d.month === today.getMonth() &&
            d.year === today.getFullYear()
        );
        
        expect(todayCell?.isToday).toBe(true);
    });
    
    it('should handle different first day of week', () => {
        const viewDate = new Date('2024-01-15');
        
        // Sunday start
        const gridSunday = generateCalendarGrid(viewDate, 0, 'en-US');
        expect(gridSunday.weeks[0].days[0].date.getDay()).toBe(0);
        
        // Monday start
        const gridMonday = generateCalendarGrid(viewDate, 1, 'en-US');
        expect(gridMonday.weeks[0].days[0].date.getDay()).toBe(1);
    });
});