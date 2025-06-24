/**
 * Debug test to understand Select state synchronization
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { createSelect } from '../src';
import { reactAdapter } from '@stellarix-ui/react';
import type { SelectOption } from '../src/types';

const mockOptions: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' }
];

describe('Debug Select', () => {
    it('should debug Enter key behavior', async () => {
        const onChange = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            onChange
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        console.log('Initial state:', select.state.getState());
        
        // Open dropdown
        fireEvent.click(trigger);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('After open:', select.state.getState());
        
        // Navigate down
        fireEvent.keyDown(trigger, { key: 'ArrowDown', code: 'ArrowDown' });
        await new Promise(resolve => setTimeout(resolve, 50));
        
        console.log('After ArrowDown:', select.state.getState());
        
        // Try to select with Enter
        fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
        await new Promise(resolve => setTimeout(resolve, 50));
        
        console.log('After Enter:', select.state.getState());
        console.log('onChange calls:', onChange.mock.calls);
        console.log('Dropdown still open?', select.state.getState().open);
    });
    
    it('should debug highlighting', async () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        // Open dropdown
        await act(async () => {
            fireEvent.click(trigger);
        });
        
        // Navigate down
        await act(async () => {
            fireEvent.keyDown(trigger, { key: 'ArrowDown', code: 'ArrowDown' });
        });
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const secondOption = screen.getByText('Banana');
        const secondOptionElement = secondOption.closest('li');
        const style = window.getComputedStyle(secondOptionElement!);
        
        console.log('Background color:', style.backgroundColor);
        console.log('Highlighted index:', select.state.getState().highlightedIndex);
        console.log('Second option index:', 1);
    });
    
    it('should debug Enter key selection', async () => {
        const onChange = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            onChange
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        // Open dropdown
        fireEvent.click(trigger);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('Before navigation, state:', select.state.getState());
        
        // Navigate to second option
        fireEvent.keyDown(trigger, { key: 'ArrowDown', code: 'ArrowDown' });
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('After first ArrowDown, state:', select.state.getState());
        
        fireEvent.keyDown(trigger, { key: 'ArrowDown', code: 'ArrowDown' });
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('After second ArrowDown, state:', select.state.getState());
        
        // Select with Enter
        fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('After Enter, state:', select.state.getState());
        console.log('onChange calls:', onChange.mock.calls);
    });

    it('should debug state synchronization', async () => {
        console.log('=== Starting Debug Test ===');
        
        const onChange = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            onChange
        });
        
        // Subscribe to state changes
        const stateListener = vi.fn();
        select.state.subscribe(stateListener);
        
        console.log('Initial state:', select.state.getState());
        
        const SelectComponent = select.connect(reactAdapter);
        
        // Create a wrapper to track React re-renders
        let renderCount = 0;
        const DebugWrapper = (props: any) => {
            renderCount++;
            console.log(`React render #${renderCount}, props:`, props);
            return <SelectComponent {...props} />;
        };
        
        const { rerender } = render(<DebugWrapper />);
        const trigger = screen.getByRole('combobox');
        
        console.log('After render, state:', select.state.getState());
        console.log('Initial trigger text:', trigger.textContent);
        
        // Open dropdown
        await act(async () => {
            fireEvent.click(trigger);
        });
        
        console.log('After open, state:', select.state.getState());
        
        // Click on an option
        const appleOption = screen.getByText('Apple');
        await act(async () => {
            fireEvent.click(appleOption);
        });
        
        console.log('After selection, state:', select.state.getState());
        console.log('State listener calls:', stateListener.mock.calls.length);
        console.log('State changes:', stateListener.mock.calls.map(call => call[0]));
        console.log('onChange calls:', onChange.mock.calls);
        console.log('Final trigger text:', trigger.textContent);
        console.log('Total React renders:', renderCount);
        
        // Force a re-render to see if that helps
        rerender(<DebugWrapper />);
        console.log('After force rerender, trigger text:', trigger.textContent);
        
        // Wait a bit more
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('After wait, trigger text:', trigger.textContent);
        
        // The display should update
        expect(trigger).toHaveTextContent('Apple');
    });
});