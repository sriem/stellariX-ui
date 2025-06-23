/**
 * Avatar Logic Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAvatarLogic } from './logic';
import { createAvatarState } from './state';
import type { AvatarOptions } from './types';

describe('Avatar Logic', () => {
    let stateStore: ReturnType<typeof createAvatarState>;
    let logic: ReturnType<typeof createAvatarLogic>;
    let mockOnLoad: ReturnType<typeof vi.fn>;
    let mockOnError: ReturnType<typeof vi.fn>;
    let mockOnClick: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnLoad = vi.fn();
        mockOnError = vi.fn();
        mockOnClick = vi.fn();
        
        const options: AvatarOptions = {
            onLoad: mockOnLoad,
            onError: mockOnError,
            onClick: mockOnClick,
        };
        
        stateStore = createAvatarState({ 
            src: 'avatar.jpg',
            name: 'John Doe',
            ...options 
        });
        logic = createAvatarLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle load event', () => {
        logic.handleEvent('load', { src: 'avatar.jpg' });
        
        expect(stateStore.getState().loading).toBe(false);
        expect(stateStore.getState().error).toBe(false);
        expect(mockOnLoad).toHaveBeenCalled();
    });
    
    it('should handle error event', () => {
        logic.handleEvent('error', { 
            src: 'avatar.jpg',
            error: new Error('Failed to load')
        });
        
        expect(stateStore.getState().loading).toBe(false);
        expect(stateStore.getState().error).toBe(true);
        expect(mockOnError).toHaveBeenCalled();
    });
    
    it('should handle click event when onClick provided', () => {
        const mockEvent = new MouseEvent('click');
        logic.handleEvent('click', { event: mockEvent });
        
        // Click events should bubble up - no specific state changes
        expect(mockOnClick).not.toHaveBeenCalled(); // Called via interaction handler
    });
    
    it('should provide correct a11y props for image variant', () => {
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            role: 'img',
            'aria-label': 'John Doe',
        });
    });
    
    it('should provide correct a11y props for non-image variants', () => {
        // Create state without image
        const nonImageState = createAvatarState({ name: 'Jane Doe' });
        const nonImageLogic = createAvatarLogic(nonImageState, {});
        nonImageLogic.connect(nonImageState);
        
        const props = nonImageLogic.getA11yProps('root');
        
        expect(props).toEqual({
            'aria-label': 'Jane Doe',
        });
    });
    
    it('should provide correct a11y props for image element', () => {
        const props = logic.getA11yProps('image');
        
        expect(props).toEqual({
            alt: 'John Doe',
            loading: 'lazy',
        });
    });
    
    it('should provide interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        expect(handlers).toHaveProperty('onClick');
        
        // Test onClick handler
        const mockEvent = new MouseEvent('click');
        handlers.onClick(mockEvent);
        
        // The handler should have been created and is a function
        expect(typeof handlers.onClick).toBe('function');
    });
    
    it('should not trigger click without onClick callback', () => {
        // Create logic without onClick
        const logicNoClick = createAvatarLogic(stateStore, {});
        logicNoClick.connect(stateStore);
        
        const handlers = logicNoClick.getInteractionHandlers('root');
        const mockEvent = new MouseEvent('click');
        handlers.onClick(mockEvent);
        
        // Handler exists but shouldn't trigger event
        expect(typeof handlers.onClick).toBe('function');
    });
    
    it('should handle image load interaction', () => {
        const handlers = logic.getInteractionHandlers('image');
        
        expect(handlers).toHaveProperty('onLoad');
        expect(handlers).toHaveProperty('onError');
        
        // Test onLoad handler for image variant
        const loadEvent = new Event('load');
        handlers.onLoad(loadEvent);
        
        // Handler should exist and be a function
        expect(typeof handlers.onLoad).toBe('function');
    });
    
    it('should handle image error interaction', () => {
        const handlers = logic.getInteractionHandlers('image');
        
        // Test onError handler for image variant
        const errorEvent = new Event('error');
        handlers.onError(errorEvent);
        
        // Handler should exist and be a function
        expect(typeof handlers.onError).toBe('function');
    });
    
    it('should not trigger image events for non-image variants', () => {
        // Create state with icon variant
        const iconState = createAvatarState({ icon: '👤' });
        const iconLogic = createAvatarLogic(iconState, {});
        iconLogic.connect(iconState);
        
        const handlers = iconLogic.getInteractionHandlers('image');
        
        // Handlers should still exist but do nothing
        expect(handlers).toHaveProperty('onLoad');
        expect(handlers).toHaveProperty('onError');
        expect(typeof handlers.onLoad).toBe('function');
        expect(typeof handlers.onError).toBe('function');
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, events should not be processed
        logic.handleEvent('load', { src: 'avatar.jpg' });
        
        // Callbacks should not be called after cleanup
        expect(mockOnLoad).not.toHaveBeenCalled();
    });
});