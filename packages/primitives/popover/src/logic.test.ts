/**
 * Popover Logic Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPopoverState } from './state';
import { createPopoverLogic } from './logic';

// Mock event constructors
const mockMouseEvent = (options: Partial<MouseEvent> = {}): MouseEvent => {
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        ...options
    });
    Object.assign(event, options);
    return event;
};

const mockKeyboardEvent = (code: string, options: Partial<KeyboardEvent> = {}): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        code,
        ...options
    });
    return event;
};

const mockFocusEvent = (type: string = 'focus'): FocusEvent => {
    return new FocusEvent(type, {
        bubbles: true,
        cancelable: true
    });
};

describe('createPopoverLogic', () => {
    let documentClickListeners: Array<(e: MouseEvent) => void> = [];
    let documentKeydownListeners: Array<(e: KeyboardEvent) => void> = [];
    
    beforeEach(() => {
        // Mock document event listeners
        vi.spyOn(document, 'addEventListener').mockImplementation((event, handler) => {
            if (event === 'click') {
                documentClickListeners.push(handler as any);
            } else if (event === 'keydown') {
                documentKeydownListeners.push(handler as any);
            }
        });
        
        vi.spyOn(document, 'removeEventListener').mockImplementation((event, handler) => {
            if (event === 'click') {
                documentClickListeners = documentClickListeners.filter(h => h !== handler);
            } else if (event === 'keydown') {
                documentKeydownListeners = documentKeydownListeners.filter(h => h !== handler);
            }
        });
    });
    
    afterEach(() => {
        documentClickListeners = [];
        documentKeydownListeners = [];
        vi.restoreAllMocks();
    });
    
    describe('Event Handlers', () => {
        it('should handle openChange event', () => {
            const onOpenChange = vi.fn();
            const state = createPopoverState();
            const logic = createPopoverLogic(state, { onOpenChange });
            
            logic.connect(state);
            logic.initialize();
            
            // Manually trigger openChange event
            logic.handleEvent('openChange', { open: true, source: 'api' });
            
            expect(onOpenChange).toHaveBeenCalledWith(true);
        });
        
        it('should handle placementChange event', () => {
            const onPlacementChange = vi.fn();
            const state = createPopoverState();
            const logic = createPopoverLogic(state, { onPlacementChange });
            
            logic.connect(state);
            logic.initialize();
            
            // Manually trigger placementChange event
            logic.handleEvent('placementChange', { 
                placement: 'top',
                previousPlacement: 'bottom'
            });
            
            expect(onPlacementChange).toHaveBeenCalledWith('top');
        });
        
        it('should handle focus event', () => {
            const state = createPopoverState();
            const logic = createPopoverLogic(state);
            const listener = vi.fn();
            
            state.subscribe(listener);
            logic.connect(state);
            logic.initialize();
            
            logic.handleEvent('focus', { event: mockFocusEvent() });
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ focused: true })
            );
        });
        
        it('should handle blur event', () => {
            const state = createPopoverState({ open: true });
            state.setFocused(true); // Set initial focused state
            
            const logic = createPopoverLogic(state);
            const listener = vi.fn();
            
            state.subscribe(listener);
            logic.connect(state);
            logic.initialize();
            
            logic.handleEvent('blur', { event: mockFocusEvent('blur') });
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ focused: false })
            );
        });
        
        it('should handle escape event when closeOnEscape is true', () => {
            const onOpenChange = vi.fn();
            const state = createPopoverState({ open: true });
            const logic = createPopoverLogic(state, { 
                closeOnEscape: true,
                onOpenChange
            });
            
            logic.connect(state);
            logic.initialize();
            
            logic.handleEvent('escape', { event: mockKeyboardEvent('Escape') });
            
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
        
        it('should not close on escape when closeOnEscape is false', () => {
            const onOpenChange = vi.fn();
            const state = createPopoverState({ open: true });
            const logic = createPopoverLogic(state, { 
                closeOnEscape: false,
                onOpenChange
            });
            
            logic.connect(state);
            logic.initialize();
            
            logic.handleEvent('escape', { event: mockKeyboardEvent('Escape') });
            
            expect(onOpenChange).not.toHaveBeenCalled();
        });
        
        it('should handle outsideClick event when closeOnClickOutside is true', () => {
            const onOpenChange = vi.fn();
            const state = createPopoverState({ open: true });
            const logic = createPopoverLogic(state, { 
                closeOnClickOutside: true,
                onOpenChange
            });
            
            logic.connect(state);
            logic.initialize();
            
            logic.handleEvent('outsideClick', { event: mockMouseEvent() });
            
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
        
        it('should not close on outside click when closeOnClickOutside is false', () => {
            const onOpenChange = vi.fn();
            const state = createPopoverState({ open: true });
            const logic = createPopoverLogic(state, { 
                closeOnClickOutside: false,
                onOpenChange
            });
            
            logic.connect(state);
            logic.initialize();
            
            logic.handleEvent('outsideClick', { event: mockMouseEvent() });
            
            expect(onOpenChange).not.toHaveBeenCalled();
        });
    });
    
    describe('Trigger Interactions', () => {
        it('should toggle popover on trigger click', () => {
            const onOpenChange = vi.fn();
            const state = createPopoverState();
            const logic = createPopoverLogic(state, { onOpenChange });
            
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('trigger');
            interactions.onClick(mockMouseEvent());
            
            expect(onOpenChange).toHaveBeenCalledWith(true);
            
            // Click again to close
            interactions.onClick(mockMouseEvent());
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
        
        it('should not toggle when disabled', () => {
            const onOpenChange = vi.fn();
            const state = createPopoverState({ disabled: true });
            const logic = createPopoverLogic(state, { onOpenChange });
            
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('trigger');
            const event = mockMouseEvent();
            const preventDefault = vi.spyOn(event, 'preventDefault');
            
            interactions.onClick(event);
            
            expect(preventDefault).toHaveBeenCalled();
            expect(onOpenChange).not.toHaveBeenCalled();
        });
        
        it('should toggle on Enter key', () => {
            const onOpenChange = vi.fn();
            const state = createPopoverState();
            const logic = createPopoverLogic(state, { onOpenChange });
            
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('trigger');
            const event = mockKeyboardEvent('Enter');
            const preventDefault = vi.spyOn(event, 'preventDefault');
            
            interactions.onKeyDown(event);
            
            expect(preventDefault).toHaveBeenCalled();
            expect(onOpenChange).toHaveBeenCalledWith(true);
        });
        
        it('should toggle on Space key', () => {
            const onOpenChange = vi.fn();
            const state = createPopoverState();
            const logic = createPopoverLogic(state, { onOpenChange });
            
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('trigger');
            const event = mockKeyboardEvent('Space');
            const preventDefault = vi.spyOn(event, 'preventDefault');
            
            interactions.onKeyDown(event);
            
            expect(preventDefault).toHaveBeenCalled();
            expect(onOpenChange).toHaveBeenCalledWith(true);
        });
        
        it('should close on Escape key when open', () => {
            const state = createPopoverState({ open: true });
            const logic = createPopoverLogic(state);
            const listener = vi.fn();
            
            state.subscribe(listener);
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('trigger');
            const event = mockKeyboardEvent('Escape');
            const preventDefault = vi.spyOn(event, 'preventDefault');
            
            interactions.onKeyDown(event);
            
            expect(preventDefault).toHaveBeenCalled();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ open: false })
            );
        });
        
        it('should handle focus and blur events', () => {
            const state = createPopoverState();
            const logic = createPopoverLogic(state);
            const listener = vi.fn();
            
            state.subscribe(listener);
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('trigger');
            
            interactions.onFocus(mockFocusEvent());
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ focused: true })
            );
            
            interactions.onBlur(mockFocusEvent('blur'));
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ focused: false })
            );
        });
    });
    
    describe('Content Interactions', () => {
        it('should close on Escape key in content', () => {
            const state = createPopoverState({ open: true });
            const logic = createPopoverLogic(state);
            const listener = vi.fn();
            
            state.subscribe(listener);
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('content');
            const event = mockKeyboardEvent('Escape');
            const preventDefault = vi.spyOn(event, 'preventDefault');
            
            interactions.onKeyDown(event);
            
            expect(preventDefault).toHaveBeenCalled();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ open: false })
            );
        });
        
        it('should not respond to non-Escape keys in content', () => {
            const state = createPopoverState({ open: true });
            const logic = createPopoverLogic(state);
            const listener = vi.fn();
            
            state.subscribe(listener);
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('content');
            interactions.onKeyDown(mockKeyboardEvent('Enter'));
            
            expect(listener).not.toHaveBeenCalled();
        });
    });
    
    describe('A11y Properties', () => {
        it('should provide correct a11y props for trigger', () => {
            const state = createPopoverState({ open: true });
            const logic = createPopoverLogic(state, { id: 'my-popover' });
            
            logic.connect(state);
            logic.initialize();
            
            const a11yProps = logic.getA11yProps('trigger');
            
            expect(a11yProps).toEqual({
                'aria-expanded': 'true',
                'aria-haspopup': 'true',
                'aria-controls': 'my-popover-content',
                'aria-disabled': undefined,
                tabIndex: 0,
            });
        });
        
        it('should provide correct a11y props for trigger when closed', () => {
            const state = createPopoverState({ open: false });
            const logic = createPopoverLogic(state);
            
            logic.connect(state);
            logic.initialize();
            
            const a11yProps = logic.getA11yProps('trigger');
            
            expect(a11yProps).toEqual({
                'aria-expanded': 'false',
                'aria-haspopup': 'true',
                'aria-controls': undefined,
                'aria-disabled': undefined,
                tabIndex: 0,
            });
        });
        
        it('should provide correct a11y props for disabled trigger', () => {
            const state = createPopoverState({ disabled: true });
            const logic = createPopoverLogic(state);
            
            logic.connect(state);
            logic.initialize();
            
            const a11yProps = logic.getA11yProps('trigger');
            
            expect(a11yProps).toEqual({
                'aria-expanded': 'false',
                'aria-haspopup': 'true',
                'aria-controls': undefined,
                'aria-disabled': 'true',
                tabIndex: -1,
            });
        });
        
        it('should provide correct a11y props for content', () => {
            const state = createPopoverState({ open: true });
            const logic = createPopoverLogic(state, { id: 'my-popover' });
            
            logic.connect(state);
            logic.initialize();
            
            const a11yProps = logic.getA11yProps('content');
            
            expect(a11yProps).toEqual({
                role: 'dialog',
                'aria-hidden': undefined,
                id: 'my-popover-content',
                tabIndex: -1,
            });
        });
        
        it('should provide correct a11y props for hidden content', () => {
            const state = createPopoverState({ open: false });
            const logic = createPopoverLogic(state);
            
            logic.connect(state);
            logic.initialize();
            
            const a11yProps = logic.getA11yProps('content');
            
            expect(a11yProps).toEqual({
                role: 'dialog',
                'aria-hidden': 'true',
                id: 'popover-content',
                tabIndex: -1,
            });
        });
    });
    
    describe('Document Event Listeners', () => {
        it('should add and remove document event listeners', () => {
            const state = createPopoverState();
            const logic = createPopoverLogic(state);
            
            logic.connect(state);
            logic.initialize();
            
            expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
            expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
            
            logic.cleanup();
            
            expect(document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
            expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
        });
    });
});