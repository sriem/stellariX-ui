/**
 * Calendar State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createCalendarState } from './state';
import type { CalendarOptions } from './types';

describe('Calendar State', () => {
    it('should create state with default values', () => {
        const state = createCalendarState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setDisabled(false);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selectedDate: null,
            viewMode: 'days',
            disabled: false,
            readOnly: false
        }));
    });
    
    it('should create state with initial date', () => {
        const initialDate = new Date(2024, 5, 15);
        const state = createCalendarState({ value: initialDate });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.selectDate(initialDate);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selectedDate: initialDate,
            displayMonth: 5,
            displayYear: 2024
        }));
    });
    
    it('should select a date', () => {
        const state = createCalendarState();
        const listener = vi.fn();
        const date = new Date(2024, 5, 20);
        
        state.subscribe(listener);
        state.selectDate(date);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selectedDate: date
        }));
    });
    
    it('should navigate months', () => {
        const state = createCalendarState({ value: new Date(2024, 5, 15) });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.nextMonth();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            displayMonth: 6,
            displayYear: 2024
        }));
        
        listener.mockClear();
        state.previousMonth();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            displayMonth: 5,
            displayYear: 2024
        }));
    });
    
    it('should navigate years', () => {
        const state = createCalendarState({ value: new Date(2024, 5, 15) });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.nextYear();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            displayMonth: 5,
            displayYear: 2025
        }));
        
        listener.mockClear();
        state.previousYear();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            displayMonth: 5,
            displayYear: 2024
        }));
    });
    
    it('should go to today', () => {
        const state = createCalendarState({ value: new Date(2020, 0, 1) });
        const listener = vi.fn();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        state.subscribe(listener);
        state.goToToday();
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            displayMonth: today.getMonth(),
            displayYear: today.getFullYear(),
            focusedDate: today
        }));
    });
    
    it('should check if date is selected', () => {
        const date = new Date(2024, 5, 15);
        const state = createCalendarState({ value: date });
        
        expect(state.isDateSelected(date)).toBe(true);
        expect(state.isDateSelected(new Date(2024, 5, 16))).toBe(false);
    });
    
    it('should check if date is today', () => {
        const state = createCalendarState();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        expect(state.isDateToday(today)).toBe(true);
        expect(state.isDateToday(tomorrow)).toBe(false);
    });
});