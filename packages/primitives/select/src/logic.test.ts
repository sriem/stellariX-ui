/**
 * Select Logic Tests
 * Tests for the select component logic layer
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSelectState } from './state.js';
import { createSelectLogic } from './logic.js';
import type { SelectOption } from './types.js';

describe('Select Logic', () => {
    const mockOptions: SelectOption[] = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry', disabled: true },
        { value: 'date', label: 'Date' }
    ];

    let state: ReturnType<typeof createSelectState>;
    let options: any;
    let logic: ReturnType<typeof createSelectLogic>;

    beforeEach(() => {
        options = {
            onChange: vi.fn(),
            onFocus: vi.fn(),
            onBlur: vi.fn(),
            onOpen: vi.fn(),
            onClose: vi.fn(),
            onSearch: vi.fn()
        };
        state = createSelectState({ options: mockOptions });
        logic = createSelectLogic(state, options);
        logic.connect(state);
        logic.initialize();
    });

    describe('Event Handling', () => {
        it('should handle change event', () => {
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            logic.handleEvent('change', { value: 'banana' });

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ value: 'banana' })
            );
            expect(options.onChange).toHaveBeenCalledWith('banana');
        });

        it('should handle open event', () => {
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            logic.handleEvent('open');

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ 
                    open: true,
                    highlightedIndex: 0
                })
            );
            expect(options.onOpen).toHaveBeenCalled();
        });

        it('should not open when disabled', () => {
            state.setDisabled(true);
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            logic.handleEvent('open');

            expect(listener).not.toHaveBeenCalled();
        });

        it('should handle close event', () => {
            state.setOpen(true);
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            logic.handleEvent('close');

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ 
                    open: false,
                    highlightedIndex: -1
                })
            );
            expect(options.onClose).toHaveBeenCalled();
        });

        it('should handle focus event', () => {
            const mockEvent = new FocusEvent('focus');
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            logic.handleEvent('focus', { event: mockEvent });

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ focused: true })
            );
            expect(options.onFocus).toHaveBeenCalledWith(mockEvent);
        });

        it('should handle blur event', () => {
            const mockEvent = new FocusEvent('blur');
            state.setFocused(true);
            state.setOpen(true);
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            logic.handleEvent('blur', { event: mockEvent });

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ 
                    focused: false,
                    open: false
                })
            );
            expect(options.onBlur).toHaveBeenCalledWith(mockEvent);
        });

        it('should handle search event', () => {
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            logic.handleEvent('search', { query: 'ap' });

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ 
                    searchQuery: 'ap',
                    filteredOptions: [mockOptions[0]] // Only Apple matches
                })
            );
            expect(options.onSearch).toHaveBeenCalledWith('ap');
        });

        it('should handle option select event', () => {
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            logic.handleEvent('optionSelect', { option: mockOptions[1] });

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ 
                    value: 'banana',
                    open: false
                })
            );
            expect(options.onChange).toHaveBeenCalledWith('banana');
        });

        it('should not select disabled option', () => {
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            logic.handleEvent('optionSelect', { option: mockOptions[2] }); // Cherry is disabled

            expect(listener).not.toHaveBeenCalled();
            expect(options.onChange).not.toHaveBeenCalled();
        });

        it('should handle navigation events', () => {
            state.setHighlightedIndex(0);
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            logic.handleEvent('navigate', { direction: 'down' });
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 1 })
            );
        });
    });

    describe('Accessibility Props', () => {
        it('should provide correct trigger accessibility props', () => {
            const a11yProps = logic.getA11yProps('trigger');

            expect(a11yProps).toEqual(
                expect.objectContaining({
                    role: 'combobox',
                    'aria-expanded': false,
                    'aria-haspopup': 'listbox',
                    'aria-disabled': false,
                    'aria-readonly': false,
                    tabIndex: 0
                })
            );
        });

        it('should update trigger props when open', () => {
            state.setOpen(true);
            state.setHighlightedIndex(1);
            
            const a11yProps = logic.getA11yProps('trigger');

            expect(a11yProps).toEqual(
                expect.objectContaining({
                    'aria-expanded': true,
                    'aria-activedescendant': expect.stringMatching(/option-1$/)
                })
            );
        });

        it('should provide correct listbox accessibility props', () => {
            const a11yProps = logic.getA11yProps('listbox');

            expect(a11yProps).toEqual(
                expect.objectContaining({
                    role: 'listbox',
                    'aria-hidden': true
                })
            );
        });

        it('should update listbox props when open', () => {
            state.setOpen(true);
            
            const a11yProps = logic.getA11yProps('listbox');

            expect(a11yProps).toEqual(
                expect.objectContaining({
                    'aria-hidden': false
                })
            );
        });

        it('should provide correct option accessibility props', () => {
            state.setValue('banana');
            const optionA11y = logic.getA11yProps('option');
            const a11yProps = optionA11y(1); // Banana option

            expect(a11yProps).toEqual(
                expect.objectContaining({
                    role: 'option',
                    'aria-selected': true,
                    'aria-disabled': false
                })
            );
        });
    });

    describe('Interactions', () => {
        it('should handle trigger click to open', () => {
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { preventDefault: vi.fn() };
            
            // Subscribe before interaction
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onClick(mockEvent);

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ open: true })
            );
        });

        it('should handle trigger click to close when open', () => {
            state.setOpen(true);
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { preventDefault: vi.fn() };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onClick(mockEvent);

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ open: false })
            );
        });

        it('should prevent interaction when disabled', () => {
            state.setDisabled(true);
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { preventDefault: vi.fn() };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onClick(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(listener).not.toHaveBeenCalled();
        });

        it('should handle Enter key to open', () => {
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { 
                key: 'Enter', 
                preventDefault: vi.fn() 
            };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onKeyDown(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ open: true })
            );
        });

        it('should handle Enter key to select when open', () => {
            state.setOpen(true);
            state.setHighlightedIndex(1);
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { 
                key: 'Enter', 
                preventDefault: vi.fn() 
            };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onKeyDown(mockEvent);

            expect(options.onChange).toHaveBeenCalledWith('banana');
        });

        it('should handle Arrow Down to navigate', () => {
            state.setOpen(true);
            state.setHighlightedIndex(0);
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { 
                key: 'ArrowDown', 
                preventDefault: vi.fn() 
            };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onKeyDown(mockEvent);

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 1 })
            );
        });

        it('should handle Arrow Up to navigate', () => {
            state.setOpen(true);
            state.setHighlightedIndex(1);
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { 
                key: 'ArrowUp', 
                preventDefault: vi.fn() 
            };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onKeyDown(mockEvent);

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 0 })
            );
        });

        it('should handle Escape to close', () => {
            state.setOpen(true);
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { 
                key: 'Escape', 
                preventDefault: vi.fn() 
            };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onKeyDown(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ open: false })
            );
        });

        it('should handle Home key to navigate to first', () => {
            state.setOpen(true);
            state.setHighlightedIndex(2);
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { 
                key: 'Home', 
                preventDefault: vi.fn() 
            };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onKeyDown(mockEvent);

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 0 })
            );
        });

        it('should handle End key to navigate to last', () => {
            state.setOpen(true);
            state.setHighlightedIndex(0);
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { 
                key: 'End', 
                preventDefault: vi.fn() 
            };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onKeyDown(mockEvent);

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 3 })
            );
        });

        it('should handle searchable typing', () => {
            const searchableOptions = { ...options, searchable: true };
            const searchableLogic = createSelectLogic(state, searchableOptions);
            searchableLogic.connect(state);
            searchableLogic.initialize();

            const interactions = searchableLogic.getInteractionHandlers('trigger');
            const mockEvent = { key: 'a' };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onKeyDown(mockEvent);

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ 
                    searchQuery: 'a',
                    open: true
                })
            );
        });

        it('should handle option click', () => {
            const interactions = logic.getInteractionHandlers('option');
            const mockEvent = { optionIndex: 1 };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onClick(mockEvent); // Click banana

            expect(options.onChange).toHaveBeenCalledWith('banana');
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ value: 'banana' })
            );
        });

        it('should not select disabled option on click', () => {
            const interactions = logic.getInteractionHandlers('option');
            const mockEvent = { optionIndex: 2 };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onClick(mockEvent); // Click cherry (disabled)

            expect(options.onChange).not.toHaveBeenCalled();
            expect(listener).not.toHaveBeenCalled();
        });

        it('should handle option mouse enter', () => {
            const interactions = logic.getInteractionHandlers('option');
            const mockEvent = { optionIndex: 1 };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onMouseEnter(mockEvent);

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 1 })
            );
        });

        it('should not highlight disabled option on mouse enter', () => {
            state.setHighlightedIndex(0);
            const interactions = logic.getInteractionHandlers('option');
            const mockEvent = { optionIndex: 2 };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onMouseEnter(mockEvent); // Cherry is disabled

            expect(listener).not.toHaveBeenCalled();
        });

        it('should handle clear button click', () => {
            const clearableOptions = { ...options, clearable: true };
            const clearableLogic = createSelectLogic(state, clearableOptions);
            clearableLogic.connect(state);
            clearableLogic.initialize();

            state.setValue('banana');
            const interactions = clearableLogic.getInteractionHandlers('clear');
            const mockEvent = { stopPropagation: vi.fn() };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onClick(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(options.onChange).toHaveBeenCalledWith(null);
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ value: null })
            );
        });

        it('should not clear when disabled', () => {
            const clearableOptions = { ...options, clearable: true };
            const clearableLogic = createSelectLogic(state, clearableOptions);
            clearableLogic.connect(state);
            clearableLogic.initialize();

            state.setDisabled(true);
            state.setValue('banana');
            const interactions = clearableLogic.getInteractionHandlers('clear');
            const mockEvent = { stopPropagation: vi.fn() };
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onClick(mockEvent);

            expect(options.onChange).not.toHaveBeenCalled();
            expect(listener).not.toHaveBeenCalled();
        });

        it('should handle focus', () => {
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = new FocusEvent('focus');
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();

            interactions.onFocus(mockEvent);

            expect(options.onFocus).toHaveBeenCalledWith(mockEvent);
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ focused: true })
            );
        });

        it('should handle blur with delay', async () => {
            state.setFocused(true);
            state.setOpen(true);
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = new FocusEvent('blur');
            
            interactions.onBlur(mockEvent);

            // Wait for delay
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // Check state after delay
            expect(state.getState()).toMatchObject({ 
                focused: false,
                open: false
            });
            expect(options.onBlur).toHaveBeenCalledWith(mockEvent);
        });
    });
});