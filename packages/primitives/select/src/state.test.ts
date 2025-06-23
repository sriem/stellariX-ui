/**
 * Select State Tests
 * Tests for the select component state management
 */

import { describe, it, expect, vi } from 'vitest';
import { createSelectState } from './state.js';
import type { SelectOption } from './types.js';

describe('Select State', () => {
    const mockOptions: SelectOption[] = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'date', label: 'Date' }
    ];

    describe('Initialization', () => {
        it('should create state with default values', () => {
            const state = createSelectState({});
            
            expect(state.getState()).toEqual({
                value: null,
                open: false,
                focused: false,
                disabled: false,
                readonly: false,
                placeholder: 'Select an option',
                options: [],
                highlightedIndex: -1,
                searchQuery: '',
                filteredOptions: []
            });
        });

        it('should initialize with provided options', () => {
            const state = createSelectState({
                value: 'apple',
                options: mockOptions,
                placeholder: 'Choose fruit',
                disabled: true,
                readonly: true
            });
            
            expect(state.getState()).toMatchObject({
                value: 'apple',
                options: mockOptions,
                placeholder: 'Choose fruit',
                disabled: true,
                readonly: true,
                filteredOptions: mockOptions
            });
        });
    });

    describe('Value Management', () => {
        it('should set value', () => {
            const state = createSelectState({ options: mockOptions });
            const listener = vi.fn();
            
            state.subscribe(listener);
            listener.mockClear();
            
            state.setValue('banana');
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ value: 'banana' })
            );
        });

        it('should clear selection', () => {
            const state = createSelectState({ 
                value: 'apple',
                options: mockOptions 
            });
            const listener = vi.fn();
            
            state.subscribe(listener);
            listener.mockClear();
            
            state.clearSelection();
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ value: null })
            );
        });
    });

    describe('Open/Close State', () => {
        it('should set open state', () => {
            const state = createSelectState({});
            const listener = vi.fn();
            
            state.subscribe(listener);
            listener.mockClear();
            
            state.setOpen(true);
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ open: true })
            );
        });

        it('should set focused state', () => {
            const state = createSelectState({});
            const listener = vi.fn();
            
            state.subscribe(listener);
            listener.mockClear();
            
            state.setFocused(true);
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ focused: true })
            );
        });
    });

    describe('Search Functionality', () => {
        it('should filter options based on search query', () => {
            const state = createSelectState({ options: mockOptions });
            const listener = vi.fn();
            
            state.subscribe(listener);
            listener.mockClear();
            
            state.setSearchQuery('a');
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({
                    searchQuery: 'a',
                    filteredOptions: [
                        { value: 'apple', label: 'Apple' },
                        { value: 'banana', label: 'Banana' },
                        { value: 'date', label: 'Date' }
                    ],
                    highlightedIndex: 0
                })
            );
        });

        it('should reset highlighted index when no matches found', () => {
            const state = createSelectState({ options: mockOptions });
            const listener = vi.fn();
            
            state.subscribe(listener);
            listener.mockClear();
            
            state.setSearchQuery('xyz');
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({
                    searchQuery: 'xyz',
                    filteredOptions: [],
                    highlightedIndex: -1
                })
            );
        });

        it('should show all options when search is cleared', () => {
            const state = createSelectState({ options: mockOptions });
            
            // First set a search query
            state.setSearchQuery('a');
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            // Then clear it
            state.setSearchQuery('');
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({
                    searchQuery: '',
                    filteredOptions: mockOptions
                })
            );
        });
    });

    describe('Navigation', () => {
        it('should navigate down through options', () => {
            const state = createSelectState({ options: mockOptions });
            state.setHighlightedIndex(0);
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            state.navigateDown();
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 1 })
            );
        });

        it('should wrap to first option when navigating down from last', () => {
            const state = createSelectState({ options: mockOptions });
            state.setHighlightedIndex(3); // Last option
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            state.navigateDown();
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 0 })
            );
        });

        it('should navigate up through options', () => {
            const state = createSelectState({ options: mockOptions });
            state.setHighlightedIndex(1);
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            state.navigateUp();
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 0 })
            );
        });

        it('should wrap to last option when navigating up from first', () => {
            const state = createSelectState({ options: mockOptions });
            state.setHighlightedIndex(0);
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            state.navigateUp();
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 3 })
            );
        });

        it('should navigate to first option', () => {
            const state = createSelectState({ options: mockOptions });
            state.setHighlightedIndex(2);
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            state.navigateToFirst();
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 0 })
            );
        });

        it('should navigate to last option', () => {
            const state = createSelectState({ options: mockOptions });
            state.setHighlightedIndex(0);
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            state.navigateToLast();
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ highlightedIndex: 3 })
            );
        });
    });

    describe('Option Selection', () => {
        it('should select option and close dropdown', () => {
            const state = createSelectState({ options: mockOptions });
            const listener = vi.fn();
            
            state.subscribe(listener);
            listener.mockClear();
            
            state.selectOption(mockOptions[1]);
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({
                    value: 'banana',
                    open: false,
                    highlightedIndex: -1,
                    searchQuery: '',
                    filteredOptions: mockOptions
                })
            );
        });

        it('should select highlighted option', () => {
            const state = createSelectState({ options: mockOptions });
            state.setHighlightedIndex(2);
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            const selectedOption = state.selectHighlighted();
            
            expect(selectedOption).toEqual(mockOptions[2]);
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({
                    value: 'cherry',
                    open: false
                })
            );
        });

        it('should return null when no option is highlighted', () => {
            const state = createSelectState({ options: mockOptions });
            state.setHighlightedIndex(-1);
            
            const selectedOption = state.selectHighlighted();
            
            expect(selectedOption).toBeNull();
        });
    });

    describe('State Updates', () => {
        it('should set disabled state', () => {
            const state = createSelectState({});
            const listener = vi.fn();
            
            state.subscribe(listener);
            listener.mockClear();
            
            state.setDisabled(true);
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ disabled: true })
            );
        });

        it('should set readonly state', () => {
            const state = createSelectState({});
            const listener = vi.fn();
            
            state.subscribe(listener);
            listener.mockClear();
            
            state.setReadonly(true);
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ readonly: true })
            );
        });

        it('should update options', () => {
            const state = createSelectState({});
            const newOptions = [{ value: 'new', label: 'New Option' }];
            const listener = vi.fn();
            
            state.subscribe(listener);
            listener.mockClear();
            
            state.setOptions(newOptions);
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({
                    options: newOptions,
                    filteredOptions: newOptions
                })
            );
        });
    });

    describe('Computed Properties', () => {
        it('should compute isInteractive correctly', () => {
            const state = createSelectState({});
            
            expect(state.isInteractive.get()).toBe(true);
            
            state.setDisabled(true);
            expect(state.isInteractive.get()).toBe(false);
            
            state.setDisabled(false);
            state.setReadonly(true);
            expect(state.isInteractive.get()).toBe(false);
        });

        it('should compute selectedOption correctly', () => {
            const state = createSelectState({ 
                value: 'banana',
                options: mockOptions 
            });
            
            expect(state.selectedOption.get()).toEqual(mockOptions[1]);
        });

        it('should compute hasValue correctly', () => {
            const state = createSelectState({});
            
            expect(state.hasValue.get()).toBe(false);
            
            state.setValue('test');
            expect(state.hasValue.get()).toBe(true);
        });

        it('should compute displayValue correctly', () => {
            const state = createSelectState({ options: mockOptions });
            
            // No value selected
            expect(state.displayValue.get()).toBe('');
            
            // Value selected
            state.setValue('apple');
            expect(state.displayValue.get()).toBe('Apple');
            
            // Search query when no value
            state.setValue(null);
            state.setSearchQuery('ban');
            expect(state.displayValue.get()).toBe('ban');
        });

        it('should compute highlightedOption correctly', () => {
            const state = createSelectState({ options: mockOptions });
            
            expect(state.highlightedOption.get()).toBeNull();
            
            state.setHighlightedIndex(1);
            expect(state.highlightedOption.get()).toEqual(mockOptions[1]);
        });
    });
});