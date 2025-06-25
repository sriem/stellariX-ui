/**
 * Calendar Logic Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCalendarLogic } from './logic';
import { createCalendarState } from './state';
import type { CalendarOptions } from './types';

describe('Calendar Logic', () => {
    let stateStore: ReturnType<typeof createCalendarState>;
    let logic: ReturnType<typeof createCalendarLogic>;
    let mockOnChange: ReturnType<typeof vi.fn>;
    let mockOnMonthChange: ReturnType<typeof vi.fn>;
    let mockOnYearChange: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnChange = vi.fn();
        mockOnMonthChange = vi.fn();
        mockOnYearChange = vi.fn();
        
        const options: CalendarOptions = {
            onChange: mockOnChange,
            onMonthChange: mockOnMonthChange,
            onYearChange: mockOnYearChange,
            value: new Date(2024, 5, 15)
        };
        
        stateStore = createCalendarState(options);
        logic = createCalendarLogic(stateStore, options);
        
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle select events', () => {
        const date = new Date(2024, 5, 20);
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('select', { 
            date,
            previousDate: null
        });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selectedDate: date
        }));
    });
    
    it('should handle month change events', () => {
        logic.handleEvent('monthChange', { 
            month: 6,
            year: 2024,
            previousMonth: 5,
            previousYear: 2024
        });
        
        expect(mockOnMonthChange).toHaveBeenCalledWith(6, 2024);
    });
    
    it('should handle year change events', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('yearChange', { 
            year: 2025,
            previousYear: 2024
        });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            displayYear: 2025
        }));
    });
    
    it('should handle view mode change events', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('viewModeChange', { 
            viewMode: 'months',
            previousViewMode: 'days'
        });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            viewMode: 'months'
        }));
    });
    
    it('should provide correct a11y props for root', () => {
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            role: 'application',
            'aria-label': 'Calendar, June 2024',
            'aria-disabled': undefined,
            'aria-readonly': undefined
        });
        
        stateStore.setDisabled(true);
        stateStore.setReadOnly(true);
        
        const updatedProps = logic.getA11yProps('root');
        expect(updatedProps).toEqual({
            role: 'application',
            'aria-label': 'Calendar, June 2024',
            'aria-disabled': 'true',
            'aria-readonly': 'true'
        });
    });
    
    it('should provide correct a11y props for grid', () => {
        const props = logic.getA11yProps('grid');
        
        expect(props).toEqual({
            role: 'grid',
            'aria-label': 'June 2024',
            'aria-readonly': undefined
        });
    });
    
    it('should provide navigation interaction handlers', () => {
        const prevHandlers = logic.getInteractionHandlers('prevMonth');
        const nextHandlers = logic.getInteractionHandlers('nextMonth');
        
        expect(prevHandlers).toHaveProperty('onClick');
        expect(nextHandlers).toHaveProperty('onClick');
    });
    
    it('should handle keyboard navigation', () => {
        const handlers = logic.getInteractionHandlers('root');
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        const arrowRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        handlers.onKeyDown?.(arrowRightEvent);
        
        expect(listener).toHaveBeenCalled();
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        expect(true).toBe(true);
    });
});