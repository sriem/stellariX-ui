/**
 * Divider Logic Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ✅ Test a11y props generation
 * ✅ Component styling should be handled by the component, not logic layer
 * ❌ Don't test for styles in interaction handlers
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createDividerLogic } from './logic';
import { createDividerState } from './state';
import type { DividerOptions } from './types';

describe('Divider Logic', () => {
    let stateStore: ReturnType<typeof createDividerState>;
    let logic: ReturnType<typeof createDividerLogic>;
    
    beforeEach(() => {
        const options: DividerOptions = {
            orientation: 'horizontal',
            variant: 'solid',
            label: 'Section',
            thickness: '2px',
            spacing: '2rem',
            color: '#ccc',
        };
        
        stateStore = createDividerState(options);
        logic = createDividerLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should provide correct a11y props for root', () => {
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            'role': 'separator',
            'aria-label': 'Section',
        });
    });
    
    it('should provide a11y props for label element', () => {
        const props = logic.getA11yProps('label');
        
        expect(props).toEqual({
            'aria-hidden': 'true',
        });
    });
    
    it('should provide a11y props without label', () => {
        // Create without label
        const stateWithoutLabel = createDividerState({ orientation: 'vertical' });
        const logicWithoutLabel = createDividerLogic(stateWithoutLabel, { orientation: 'vertical' });
        
        // Initialize the logic
        logicWithoutLabel.connect(stateWithoutLabel);
        logicWithoutLabel.initialize();
        
        const props = logicWithoutLabel.getA11yProps('root');
        
        expect(props).toEqual({
            'role': 'separator',
            'aria-orientation': 'vertical',
        });
        
        // Should not have aria-label
        expect(props['aria-label']).toBeUndefined();
    });
    
    it('should provide correct a11y props for vertical orientation', () => {
        // Create vertical divider
        const verticalState = createDividerState({ orientation: 'vertical', label: 'Vertical' });
        const verticalLogic = createDividerLogic(verticalState, { orientation: 'vertical', label: 'Vertical' });
        
        verticalLogic.connect(verticalState);
        verticalLogic.initialize();
        
        const props = verticalLogic.getA11yProps('root');
        
        expect(props).toEqual({
            'role': 'separator',
            'aria-orientation': 'vertical',
            'aria-label': 'Vertical',
        });
    });
    
    it('should have empty interaction handlers for root', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        // Divider is a purely visual component with no interactions
        expect(handlers).toEqual({});
    });
    
    it('should have empty interaction handlers for label', () => {
        const handlers = logic.getInteractionHandlers('label');
        
        // Label has no interactions
        expect(handlers).toEqual({});
    });
    
    it('should handle no events', () => {
        // Divider has no events, so handleEvent should do nothing
        expect(() => logic.handleEvent('anyEvent', {})).not.toThrow();
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, logic should still return basic a11y props
        const props = logic.getA11yProps('root');
        expect(props).toBeDefined();
    });
});

describe('Divider State Integration', () => {
    it('should reflect state changes in a11y props', () => {
        const options: DividerOptions = {
            orientation: 'horizontal',
        };
        
        const state = createDividerState(options);
        const logic = createDividerLogic(state, options);
        
        logic.connect(state);
        logic.initialize();
        
        // Initial props
        let props = logic.getA11yProps('root');
        expect(props['aria-orientation']).toBeUndefined();
        
        // Change to vertical
        state.setOrientation('vertical');
        props = logic.getA11yProps('root');
        expect(props['aria-orientation']).toBe('vertical');
    });
    
    it('should handle label in options', () => {
        const options: DividerOptions = {
            label: 'Test Label',
        };
        
        const state = createDividerState(options);
        const logic = createDividerLogic(state, options);
        
        logic.connect(state);
        logic.initialize();
        
        const props = logic.getA11yProps('root');
        expect(props['aria-label']).toBe('Test Label');
    });
});