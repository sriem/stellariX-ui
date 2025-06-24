/**
 * DatePicker State Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDatePickerState } from './state.js';
import type { DatePickerOptions } from './types.js';

describe('DatePicker State', () => {
    let testDate: Date;
    let testDate2: Date;
    let testDate3: Date;
    
    beforeEach(() => {
        // Use fixed dates for consistent testing
        testDate = new Date('2024-01-15T10:00:00');
        testDate2 = new Date('2024-01-20T10:00:00');
        testDate3 = new Date('2024-01-25T10:00:00');
    });
    
    describe('Initialization', () => {
        it('should create state with default values', () => {
            const state = createDatePickerState({});
            const listener = vi.fn();
            
            state.subscribe(listener);
            state.setValue(null); // Trigger to see current state
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                value: null,
                startDate: null,
                endDate: null,
                mode: 'single',
                includeTime: false,
                open: false,
                focused: false,
                disabled: false,
                readonly: false
            }));
        });
        
        it('should create state with custom options', () => {
            const options: DatePickerOptions = {
                value: testDate,
                mode: 'range',
                includeTime: true,
                disabled: true,
                minDate: testDate,
                maxDate: testDate3,
                firstDayOfWeek: 1,
                locale: 'fr-FR',
                dateFormat: 'DD/MM/YYYY'
            };
            
            const state = createDatePickerState(options);
            const listener = vi.fn();
            
            state.subscribe(listener);
            state.setFocused(false); // Trigger to see current state
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                value: testDate,
                mode: 'range',
                includeTime: true,
                disabled: true,
                minDate: testDate,
                maxDate: testDate3,
                firstDayOfWeek: 1,
                locale: 'fr-FR',
                dateFormat: 'DD/MM/YYYY'
            }));
        });
    });
    
    describe('Date Selection', () => {
        it('should set single date value', () => {
            const state = createDatePickerState({});
            const listener = vi.fn();
            
            state.subscribe(listener);
            state.setValue(testDate);
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                value: testDate,
                viewDate: testDate
            }));
        });
        
        it('should handle date range selection', () => {
            const state = createDatePickerState({ mode: 'range' });
            const listener = vi.fn();
            
            state.subscribe(listener);
            
            // Select start date
            state.selectDate(testDate);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                startDate: testDate,
                endDate: null
            }));
            
            // Select end date
            listener.mockClear();
            state.selectDate(testDate2);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                startDate: testDate,
                endDate: testDate2
            }));
        });
        
        it('should swap dates if end is before start in range mode', () => {
            const state = createDatePickerState({ mode: 'range' });
            const onRangeChange = vi.fn();
            const stateWithCallback = createDatePickerState({ 
                mode: 'range',
                onRangeChange 
            });
            
            // Select later date first
            stateWithCallback.selectDate(testDate2);
            // Select earlier date second
            stateWithCallback.selectDate(testDate);
            
            // Should swap so start is before end
            setTimeout(() => {
                expect(onRangeChange).toHaveBeenCalledWith(testDate, testDate2);
            }, 10);
        });
        
        it('should clear all selections', () => {
            const state = createDatePickerState({ 
                value: testDate,
                mode: 'range',
                startDate: testDate,
                endDate: testDate2 
            });
            const listener = vi.fn();
            
            state.subscribe(listener);
            state.clearSelection();
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                value: null,
                startDate: null,
                endDate: null,
                hoveredDate: null
            }));
        });
    });
    
    describe('View Management', () => {
        it('should navigate months', () => {
            const initialDate = new Date('2024-01-15T10:00:00');
            const state = createDatePickerState({ viewDate: initialDate });
            const listener = vi.fn();
            
            state.subscribe(listener);
            
            state.nextMonth();
            const firstCall = listener.mock.calls[0][0];
            expect(firstCall.viewDate.getMonth()).toBe(1); // February
            expect(firstCall.viewDate.getFullYear()).toBe(2024);
            
            listener.mockClear();
            state.prevMonth();
            const secondCall = listener.mock.calls[0][0];
            expect(secondCall.viewDate.getMonth()).toBe(0); // January
            expect(secondCall.viewDate.getFullYear()).toBe(2024);
        });
        
        it('should navigate years', () => {
            const initialDate = new Date('2024-01-15T10:00:00');
            const state = createDatePickerState({ viewDate: initialDate });
            const listener = vi.fn();
            
            state.subscribe(listener);
            
            state.nextYear();
            const firstCall = listener.mock.calls[0][0];
            expect(firstCall.viewDate.getFullYear()).toBe(2025);
            
            listener.mockClear();
            state.prevYear();
            const secondCall = listener.mock.calls[0][0];
            expect(secondCall.viewDate.getFullYear()).toBe(2024);
        });
        
        it('should change view type', () => {
            const state = createDatePickerState({});
            const listener = vi.fn();
            
            state.subscribe(listener);
            
            state.setCurrentView('month');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                currentView: 'month'
            }));
            
            listener.mockClear();
            state.setCurrentView('year');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                currentView: 'year'
            }));
        });
    });
    
    describe('Keyboard Navigation', () => {
        it('should navigate dates with arrow keys', () => {
            const state = createDatePickerState({});
            const initialDate = new Date('2024-01-15T10:00:00');
            const listener = vi.fn();
            
            state.setOpen(true);
            state.setHighlightedDate(initialDate);
            
            state.subscribe(listener);
            
            // Test each navigation direction
            state.navigateDate('next');
            let call = listener.mock.calls[0][0];
            expect(call.highlightedDate.getDate()).toBe(16);
            
            listener.mockClear();
            state.navigateDate('prev');
            call = listener.mock.calls[0][0];
            expect(call.highlightedDate.getDate()).toBe(15);
            
            listener.mockClear();
            state.navigateDate('down');
            call = listener.mock.calls[0][0];
            expect(call.highlightedDate.getDate()).toBe(22);
            
            listener.mockClear();
            state.navigateDate('up');
            call = listener.mock.calls[0][0];
            expect(call.highlightedDate.getDate()).toBe(15);
        });
    });
    
    describe('Time Selection', () => {
        it('should set time values', () => {
            const state = createDatePickerState({ includeTime: true });
            const listener = vi.fn();
            
            state.subscribe(listener);
            
            state.setTime(14, 30);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                hour: 14,
                minute: 30
            }));
            
            listener.mockClear();
            state.setHour(9);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                hour: 9
            }));
            
            listener.mockClear();
            state.setMinute(45);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                minute: 45
            }));
        });
    });
    
    describe('State Toggles', () => {
        it('should toggle open state', () => {
            const state = createDatePickerState({});
            const listener = vi.fn();
            
            state.subscribe(listener);
            
            state.setOpen(true);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                open: true
            }));
            
            listener.mockClear();
            state.setOpen(false);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                open: false,
                highlightedDate: null
            }));
        });
        
        it('should toggle disabled/readonly states', () => {
            const state = createDatePickerState({});
            const listener = vi.fn();
            
            state.subscribe(listener);
            
            state.setDisabled(true);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                disabled: true
            }));
            
            listener.mockClear();
            state.setReadonly(true);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                readonly: true
            }));
        });
    });
    
    describe('Computed Properties', () => {
        it('should compute isInteractive', () => {
            const state = createDatePickerState({});
            
            expect(state.isInteractive.get()).toBe(true);
            
            state.setDisabled(true);
            expect(state.isInteractive.get()).toBe(false);
            
            state.setDisabled(false);
            state.setReadonly(true);
            expect(state.isInteractive.get()).toBe(false);
        });
        
        it('should compute hasValue', () => {
            const state = createDatePickerState({});
            
            expect(state.hasValue.get()).toBe(false);
            
            state.setValue(testDate);
            expect(state.hasValue.get()).toBe(true);
            
            // Test range mode
            const rangeState = createDatePickerState({ mode: 'range' });
            expect(rangeState.hasValue.get()).toBe(false);
            
            rangeState.setStartDate(testDate);
            expect(rangeState.hasValue.get()).toBe(true);
        });
        
        it('should compute displayValue', () => {
            const state = createDatePickerState({ dateFormat: 'MM/DD/YYYY' });
            
            expect(state.displayValue.get()).toBe('');
            
            state.setValue(new Date('2024-01-15'));
            expect(state.displayValue.get()).toBe('01/15/2024');
            
            // Test range mode
            const rangeState = createDatePickerState({ 
                mode: 'range',
                dateFormat: 'MM/DD/YYYY'
            });
            
            rangeState.setStartDate(new Date('2024-01-15'));
            expect(rangeState.displayValue.get()).toBe('01/15/2024');
            
            rangeState.setEndDate(new Date('2024-01-20'));
            expect(rangeState.displayValue.get()).toBe('01/15/2024 - 01/20/2024');
        });
        
        it('should compute isDateDisabled', () => {
            const state = createDatePickerState({
                minDate: new Date('2024-01-10'),
                maxDate: new Date('2024-01-20'),
                disabledDates: [new Date('2024-01-15')],
                isDateDisabled: (date) => date.getDay() === 0 // Disable Sundays
            });
            
            const isDisabled = state.isDateDisabled.get();
            
            // Before min date
            expect(isDisabled(new Date('2024-01-05'))).toBe(true);
            
            // After max date
            expect(isDisabled(new Date('2024-01-25'))).toBe(true);
            
            // In disabled dates array
            expect(isDisabled(new Date('2024-01-15'))).toBe(true);
            
            // Sunday (custom function)
            expect(isDisabled(new Date('2024-01-14'))).toBe(true);
            
            // Valid date
            expect(isDisabled(new Date('2024-01-16'))).toBe(false);
        });
        
        it('should compute isDateInRange', () => {
            const state = createDatePickerState({ mode: 'range' });
            const isInRange = state.isDateInRange.get();
            
            // No range selected
            expect(isInRange(testDate)).toBe(false);
            
            // Only start date selected
            state.setStartDate(new Date('2024-01-15'));
            expect(isInRange(new Date('2024-01-20'))).toBe(false);
            
            // Full range selected
            state.setEndDate(new Date('2024-01-25'));
            expect(isInRange(new Date('2024-01-20'))).toBe(true);
            expect(isInRange(new Date('2024-01-10'))).toBe(false);
            expect(isInRange(new Date('2024-01-30'))).toBe(false);
            
            // Test with hover
            const hoverState = createDatePickerState({ mode: 'range' });
            hoverState.setStartDate(new Date('2024-01-15'));
            hoverState.setHoveredDate(new Date('2024-01-20'));
            
            const hoverInRange = hoverState.isDateInRange.get();
            expect(hoverInRange(new Date('2024-01-17'))).toBe(true);
        });
    });
    
    describe('Hover State', () => {
        it('should manage hover state for range selection', () => {
            const state = createDatePickerState({ mode: 'range' });
            const listener = vi.fn();
            
            state.subscribe(listener);
            state.setHoveredDate(testDate);
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                hoveredDate: testDate
            }));
        });
    });
});