/**
 * Spinner Logic Tests
 */

import { describe, it, expect } from 'vitest';
import { createSpinnerState } from './state';
import { createSpinnerLogic } from './logic';

describe('createSpinnerLogic', () => {
    it('should create logic layer with correct component type', () => {
        const state = createSpinnerState();
        const logic = createSpinnerLogic(state);
        
        expect(logic.componentType).toBe('Spinner');
    });
    
    it('should provide static accessibility props', () => {
        const state = createSpinnerState({ label: 'Processing data...' });
        const logic = createSpinnerLogic(state);
        
        const a11yProps = logic.getA11yProps('root');
        
        expect(a11yProps.role).toBe('status');
        expect(a11yProps['aria-live']).toBe('polite');
        // Dynamic props should be read directly from state by the component
        expect(a11yProps['aria-busy']).toBeUndefined();
        expect(a11yProps['aria-label']).toBeUndefined();
    });
    
    it('should provide static interaction handlers', () => {
        const state = createSpinnerState();
        const logic = createSpinnerLogic(state);
        
        const handlers = logic.getInteractionHandlers('root');
        
        expect(handlers.role).toBe('status');
        // Dynamic props should be read directly from state by the component
        expect(handlers['aria-busy']).toBeUndefined();
        expect(handlers['aria-label']).toBeUndefined();
    });
    
    it('should handle initialization and cleanup', () => {
        const state = createSpinnerState();
        const logic = createSpinnerLogic(state);
        
        // Initialize
        const cleanup = logic.initialize();
        expect(typeof cleanup).toBe('function');
        
        // Should not initialize twice
        const cleanup2 = logic.initialize();
        expect(cleanup2()).toBeUndefined();
        
        // Cleanup
        cleanup();
    });
    
    it('should handle connect and disconnect', () => {
        const state = createSpinnerState();
        const logic = createSpinnerLogic(state);
        
        // Connect
        logic.connect(state);
        
        // Disconnect
        logic.disconnect();
        
        // Should not throw
        expect(() => logic.getA11yProps('root')).not.toThrow();
    });
    
    it('should handle non-existent events gracefully', () => {
        const state = createSpinnerState();
        const logic = createSpinnerLogic(state);
        
        // Spinner has no events, this should not throw
        expect(() => logic.handleEvent('nonexistent' as any, {})).not.toThrow();
    });
    
    it('should provide element metadata', () => {
        const state = createSpinnerState();
        const logic = createSpinnerLogic(state);
        
        const metadata = logic.getElementMetadata();
        
        expect(metadata.root).toEqual({
            type: 'div',
            role: 'status',
            optional: false,
        });
    });
    
    it('should provide event metadata', () => {
        const state = createSpinnerState();
        const logic = createSpinnerLogic(state);
        
        const eventMetadata = logic.getEventMetadata();
        
        expect(eventMetadata.supported).toEqual([]);
        expect(eventMetadata.required).toEqual([]);
        expect(eventMetadata.custom).toEqual({});
    });
});