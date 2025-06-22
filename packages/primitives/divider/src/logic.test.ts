/**
 * Divider Logic Tests
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
    
    it('should have no event handlers', () => {
        // Divider is presentational and has no events
        expect(Object.keys(logic.events || {})).toHaveLength(0);
    });
    
    it('should provide correct a11y props for root', () => {
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            'role': 'separator',
            'aria-orientation': 'horizontal',
            'aria-label': 'Section',
        });
    });
    
    it('should provide correct a11y props for label', () => {
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
    
    it('should provide horizontal interaction styles', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        expect(handlers.style).toMatchObject({
            width: '100%',
            height: '2px',
            marginTop: '2rem',
            marginBottom: '2rem',
            backgroundColor: '#ccc',
            borderColor: '#ccc',
        });
        
        expect(handlers['data-orientation']).toBe('horizontal');
        expect(handlers['data-variant']).toBe('solid');
        expect(handlers['data-has-label']).toBe(true);
    });
    
    it('should provide vertical interaction styles', () => {
        stateStore.setOrientation('vertical');
        const handlers = logic.getInteractionHandlers('root');
        
        expect(handlers.style).toMatchObject({
            height: '100%',
            width: '2px',
            marginLeft: '2rem',
            marginRight: '2rem',
            backgroundColor: '#ccc',
            borderColor: '#ccc',
        });
        
        expect(handlers['data-orientation']).toBe('vertical');
    });
    
    it('should apply variant styles', () => {
        stateStore.setVariant('dashed');
        let handlers = logic.getInteractionHandlers('root');
        expect(handlers.style.borderStyle).toBe('dashed');
        
        stateStore.setVariant('dotted');
        handlers = logic.getInteractionHandlers('root');
        expect(handlers.style.borderStyle).toBe('dotted');
        
        stateStore.setVariant('solid');
        handlers = logic.getInteractionHandlers('root');
        expect(handlers.style.borderStyle).toBeUndefined();
    });
    
    it('should provide label interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('label');
        
        expect(handlers).toEqual({
            'data-position': 'center',
        });
        
        stateStore.setLabelPosition('start');
        const updatedHandlers = logic.getInteractionHandlers('label');
        expect(updatedHandlers['data-position']).toBe('start');
    });
    
    it('should use default values when options not provided', () => {
        const minimalState = createDividerState();
        const minimalLogic = createDividerLogic(minimalState);
        
        // Initialize the logic
        minimalLogic.connect(minimalState);
        minimalLogic.initialize();
        
        const handlers = minimalLogic.getInteractionHandlers('root');
        
        expect(handlers.style).toMatchObject({
            width: '100%',
            height: '1px', // default thickness
            marginTop: '1rem', // default spacing
            marginBottom: '1rem',
        });
        
        // Should not have color styles when not provided
        expect(handlers.style.backgroundColor).toBeUndefined();
        expect(handlers.style.borderColor).toBeUndefined();
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, should return empty objects
        expect(logic.getA11yProps('root')).toEqual({});
        expect(logic.getInteractionHandlers('root')).toEqual({});
    });
});