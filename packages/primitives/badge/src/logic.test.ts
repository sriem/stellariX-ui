/**
 * Badge Logic Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS test via callbacks: onContentChange, onVisibilityChange, etc.
 * ✅ ALWAYS verify behavior through callback invocations
 * ✅ For a11y props, call logic.getA11yProps() directly
 * 
 * This prevents infinite loops and ensures proper behavior testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBadgeLogic } from './logic';
import { createBadgeState } from './state';
import type { BadgeOptions } from './types';

describe('Badge Logic', () => {
    let stateStore: ReturnType<typeof createBadgeState>;
    let logic: ReturnType<typeof createBadgeLogic>;
    let mockOnContentChange: ReturnType<typeof vi.fn>;
    let mockOnVisibilityChange: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnContentChange = vi.fn();
        mockOnVisibilityChange = vi.fn();
        
        const options: BadgeOptions = {
            onContentChange: mockOnContentChange,
            onVisibilityChange: mockOnVisibilityChange,
        };
        
        stateStore = createBadgeState(options);
        logic = createBadgeLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle contentChange events', () => {
        logic.handleEvent('contentChange', { 
            content: 42,
            previousContent: ''
        });
        
        expect(stateStore.getState().content).toBe(42);
        expect(mockOnContentChange).toHaveBeenCalledWith(42);
    });
    
    it('should handle visibilityChange events', () => {
        logic.handleEvent('visibilityChange', { visible: false });
        
        expect(stateStore.getState().visible).toBe(false);
        expect(mockOnVisibilityChange).toHaveBeenCalledWith(false);
    });
    
    it('should handle event payloads correctly', () => {
        // Test with direct content
        logic.handleEvent('contentChange', { content: 'New' });
        expect(mockOnContentChange).toHaveBeenCalledWith('New');
        
        // Test without proper payload structure
        mockOnContentChange.mockClear();
        logic.handleEvent('contentChange', null);
        expect(mockOnContentChange).toHaveBeenCalledWith('');
    });
    
    it('should provide correct a11y props for numeric badge', () => {
        stateStore.setType('numeric');
        stateStore.setContent(5);
        
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            'aria-label': 'Badge: 5'
        });
        
        // Test with content exceeding max
        stateStore.setContent(150);
        const propsWithMax = logic.getA11yProps('root');
        expect(propsWithMax['aria-label']).toBe('Badge: 99+');
    });
    
    it('should provide correct a11y props for dot badge', () => {
        stateStore.setType('dot');
        
        const props = logic.getA11yProps('root');
        
        // Dot badges should not have aria-label
        expect(props['aria-label']).toBeUndefined();
    });
    
    it('should provide correct a11y props for status badge', () => {
        stateStore.setType('status');
        stateStore.setContent('Active');
        
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            'aria-label': 'Badge: Active',
            role: 'status'
        });
    });
    
    it('should hide badge from screen readers when not visible', () => {
        stateStore.setVisible(false);
        
        const props = logic.getA11yProps('root');
        expect(props['aria-hidden']).toBe('true');
    });
    
    it('should hide badge from screen readers when content is 0 and showZero is false', () => {
        stateStore.setContent(0);
        stateStore.setShowZero(false);
        
        const props = logic.getA11yProps('root');
        expect(props['aria-hidden']).toBe('true');
    });
    
    it('should not provide interaction handlers for badge', () => {
        // Badge is not interactive, so it should not have handlers
        const handlers = logic.getInteractionHandlers('root');
        
        // LogicLayerBuilder will return an empty object for elements without interactions
        expect(handlers).toEqual({});
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, events should not be processed
        logic.handleEvent('contentChange', { content: 100 });
        
        // Callbacks should not be called after cleanup
        expect(mockOnContentChange).not.toHaveBeenCalled();
        expect(stateStore.getState().content).toBe('');
    });
});