/**
 * Container Logic Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createContainerLogic } from './logic';
import { createContainerState } from './state';
import type { ContainerOptions } from './types';

describe('Container Logic', () => {
    let stateStore: ReturnType<typeof createContainerState>;
    let logic: ReturnType<typeof createContainerLogic>;
    
    beforeEach(() => {
        const options: ContainerOptions = {
            size: 'md',
            variant: 'default',
        };
        
        stateStore = createContainerState(options);
        logic = createContainerLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should create logic layer', () => {
        expect(logic).toBeDefined();
        expect(logic.handleEvent).toBeDefined();
        expect(logic.getA11yProps).toBeDefined();
        expect(logic.getInteractionHandlers).toBeDefined();
    });
    
    it('should return empty a11y props', () => {
        const props = logic.getA11yProps('root');
        
        // Container has no semantic ARIA attributes
        expect(props).toEqual({});
    });
    
    it('should return empty interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        // Container has no interaction handlers
        expect(handlers).toEqual({});
    });
    
    it('should handle non-existent events gracefully', () => {
        // Container has no events, but logic should handle this gracefully
        expect(() => {
            logic.handleEvent('click', { event: new MouseEvent('click') });
        }).not.toThrow();
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, logic should still work (no-op)
        expect(() => {
            logic.handleEvent('any', {});
        }).not.toThrow();
    });
    
    it('should work with different container variants', () => {
        // Test with fluid variant
        const fluidState = createContainerState({ variant: 'fluid' });
        const fluidLogic = createContainerLogic(fluidState, { variant: 'fluid' });
        
        fluidLogic.connect(fluidState);
        fluidLogic.initialize();
        
        const props = fluidLogic.getA11yProps('root');
        expect(props).toEqual({});
        
        fluidLogic.cleanup();
    });
    
    it('should work with responsive variant', () => {
        // Test with responsive variant
        const responsiveState = createContainerState({ variant: 'responsive' });
        const responsiveLogic = createContainerLogic(responsiveState, { variant: 'responsive' });
        
        responsiveLogic.connect(responsiveState);
        responsiveLogic.initialize();
        
        const handlers = responsiveLogic.getInteractionHandlers('root');
        expect(handlers).toEqual({});
        
        responsiveLogic.cleanup();
    });
});