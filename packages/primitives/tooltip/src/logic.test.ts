/**
 * Tooltip Logic Tests
 * 
 * CRITICAL: Follow the proven testing patterns from checkbox/radio
 * - Test interactions via callbacks, NOT state.getState()
 * - Use subscription pattern to verify state changes
 * - Test event handling through interaction handlers
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTooltipState } from './state';
import { createTooltipLogic } from './logic';
import type { TooltipOptions } from './types';

describe('createTooltipLogic', () => {
    let state: ReturnType<typeof createTooltipState>;
    let logic: ReturnType<typeof createTooltipLogic>;
    let options: TooltipOptions;
    
    // Mock timers for testing delays
    beforeEach(() => {
        vi.useFakeTimers();
    });
    
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    
    describe('basic setup', () => {
        it('should create logic layer and connect to state', () => {
            state = createTooltipState();
            logic = createTooltipLogic(state);
            
            expect(logic).toBeDefined();
            expect(logic.connect).toBeDefined();
            expect(logic.getInteractionHandlers).toBeDefined();
            expect(logic.getA11yProps).toBeDefined();
        });
    });
    
    describe('event handling', () => {
        it('should handle visibilityChange event with callback', () => {
            const onVisibilityChange = vi.fn();
            state = createTooltipState();
            logic = createTooltipLogic(state, { onVisibilityChange });
            
            logic.connect(state);
            logic.initialize();
            
            // Trigger visibility change event
            logic.handleEvent('visibilityChange', { visible: true });
            
            expect(onVisibilityChange).toHaveBeenCalledWith(true);
        });
        
        it('should handle focus event to show tooltip', () => {
            state = createTooltipState();
            logic = createTooltipLogic(state, { showDelay: 100 });
            
            const listener = vi.fn();
            state.subscribe(listener);
            
            logic.connect(state);
            logic.initialize();
            
            // Trigger focus event
            logic.handleEvent('focus', { event: new FocusEvent('focus') });
            
            // Fast-forward time to trigger show
            vi.advanceTimersByTime(100);
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: true,
                focused: true
            }));
        });
        
        it('should handle blur event to hide tooltip', () => {
            state = createTooltipState({ visible: true });
            logic = createTooltipLogic(state, { hideDelay: 50 });
            
            const listener = vi.fn();
            state.subscribe(listener);
            
            logic.connect(state);
            logic.initialize();
            
            // Trigger blur event
            logic.handleEvent('blur', { event: new FocusEvent('blur') });
            
            // Fast-forward time to trigger hide
            vi.advanceTimersByTime(50);
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: false,
                focused: false
            }));
        });
        
        it('should not show tooltip when disabled', () => {
            state = createTooltipState({ disabled: true });
            logic = createTooltipLogic(state);
            
            const listener = vi.fn();
            state.subscribe(listener);
            
            logic.connect(state);
            logic.initialize();
            
            // Clear initial calls
            listener.mockClear();
            
            // Trigger focus event
            logic.handleEvent('focus', { event: new FocusEvent('focus') });
            
            // No delay, check immediately
            expect(listener).not.toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
        });
        
        it('should handle controlled mode', () => {
            state = createTooltipState({ controlled: true, visible: false });
            logic = createTooltipLogic(state, { controlled: true });
            
            const listener = vi.fn();
            state.subscribe(listener);
            
            logic.connect(state);
            logic.initialize();
            
            // Clear initial calls
            listener.mockClear();
            
            // Trigger focus event - should not change visibility in controlled mode
            logic.handleEvent('focus', { event: new FocusEvent('focus') });
            
            expect(listener).not.toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
        });
    });
    
    describe('interaction handlers', () => {
        it('should handle mouse enter interaction', () => {
            state = createTooltipState();
            logic = createTooltipLogic(state, { showDelay: 0 });
            
            logic.connect(state);
            logic.initialize();
            
            const handlers = logic.getInteractionHandlers('trigger');
            const mockEvent = new MouseEvent('mouseenter');
            
            const listener = vi.fn();
            state.subscribe(listener);
            
            handlers.onMouseEnter?.(mockEvent);
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
        });
        
        it('should handle mouse leave interaction', () => {
            state = createTooltipState({ visible: true });
            logic = createTooltipLogic(state, { hideDelay: 0 });
            
            logic.connect(state);
            logic.initialize();
            
            const handlers = logic.getInteractionHandlers('trigger');
            const mockEvent = new MouseEvent('mouseleave');
            
            const listener = vi.fn();
            state.subscribe(listener);
            
            handlers.onMouseLeave?.(mockEvent);
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: false
            }));
        });
        
        it('should not trigger interactions when disabled', () => {
            state = createTooltipState({ disabled: true });
            logic = createTooltipLogic(state);
            
            logic.connect(state);
            logic.initialize();
            
            const handlers = logic.getInteractionHandlers('trigger');
            const listener = vi.fn();
            state.subscribe(listener);
            
            // Clear initial calls
            listener.mockClear();
            
            handlers.onMouseEnter?.(new MouseEvent('mouseenter'));
            handlers.onFocus?.(new FocusEvent('focus'));
            
            // Should not trigger any visibility changes
            expect(listener).not.toHaveBeenCalled();
        });
        
        it('should handle focus/blur interactions', () => {
            state = createTooltipState();
            logic = createTooltipLogic(state, { showDelay: 0, hideDelay: 0 });
            
            logic.connect(state);
            logic.initialize();
            
            const handlers = logic.getInteractionHandlers('trigger');
            const listener = vi.fn();
            state.subscribe(listener);
            
            // Focus should show tooltip
            handlers.onFocus?.(new FocusEvent('focus'));
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
            
            // Blur should hide tooltip
            handlers.onBlur?.(new FocusEvent('blur'));
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: false
            }));
        });
    });
    
    describe('accessibility', () => {
        it('should provide correct a11y props for trigger', () => {
            state = createTooltipState({ content: 'Help text', visible: true });
            logic = createTooltipLogic(state, { id: 'my-tooltip' });
            
            logic.connect(state);
            logic.initialize();
            
            const a11yProps = logic.getA11yProps('trigger');
            
            expect(a11yProps).toEqual({
                'aria-describedby': 'my-tooltip-content',
                tabIndex: 0
            });
        });
        
        it('should not set aria-describedby when tooltip is hidden', () => {
            state = createTooltipState({ content: 'Help text', visible: false });
            logic = createTooltipLogic(state);
            
            logic.connect(state);
            
            const a11yProps = logic.getA11yProps('trigger');
            
            expect(a11yProps).toEqual({
                'aria-describedby': undefined,
                tabIndex: 0
            });
        });
        
        it('should provide correct a11y props for content', () => {
            state = createTooltipState({ content: 'Help text', visible: true });
            logic = createTooltipLogic(state, { id: 'my-tooltip' });
            
            logic.connect(state);
            logic.initialize();
            
            const a11yProps = logic.getA11yProps('content');
            
            expect(a11yProps).toEqual({
                role: 'tooltip',
                id: 'my-tooltip-content',
                'aria-hidden': undefined
            });
        });
        
        it('should hide tooltip content with aria-hidden when not visible', () => {
            state = createTooltipState({ content: 'Help text', visible: false });
            logic = createTooltipLogic(state);
            
            logic.connect(state);
            
            const a11yProps = logic.getA11yProps('content');
            
            expect(a11yProps).toEqual({
                role: 'tooltip',
                id: 'tooltip-content',
                'aria-hidden': 'true'
            });
        });
        
        it('should set negative tabIndex when disabled', () => {
            state = createTooltipState({ disabled: true });
            logic = createTooltipLogic(state);
            
            logic.connect(state);
            
            const a11yProps = logic.getA11yProps('trigger');
            
            expect(a11yProps.tabIndex).toBe(-1);
        });
    });
    
    describe('timer management', () => {
        it('should respect show delay', () => {
            state = createTooltipState();
            logic = createTooltipLogic(state, { showDelay: 200 });
            
            const listener = vi.fn();
            state.subscribe(listener);
            
            logic.connect(state);
            logic.initialize();
            
            const handlers = logic.getInteractionHandlers('trigger');
            handlers.onMouseEnter?.(new MouseEvent('mouseenter'));
            
            // Should not show immediately
            expect(listener).not.toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
            
            // Advance time by half the delay
            vi.advanceTimersByTime(100);
            expect(listener).not.toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
            
            // Advance time to complete the delay
            vi.advanceTimersByTime(100);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
        });
        
        it('should respect hide delay', () => {
            state = createTooltipState({ visible: true });
            logic = createTooltipLogic(state, { hideDelay: 300 });
            
            const listener = vi.fn();
            state.subscribe(listener);
            
            logic.connect(state);
            logic.initialize();
            
            const handlers = logic.getInteractionHandlers('trigger');
            handlers.onMouseLeave?.(new MouseEvent('mouseleave'));
            
            // Should not hide immediately
            expect(listener).not.toHaveBeenCalledWith(expect.objectContaining({
                visible: false
            }));
            
            // Advance time to complete the delay
            vi.advanceTimersByTime(300);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: false
            }));
        });
        
        it('should cancel pending timers when interaction changes', () => {
            state = createTooltipState();
            logic = createTooltipLogic(state, { showDelay: 200, hideDelay: 200 });
            
            const listener = vi.fn();
            state.subscribe(listener);
            
            logic.connect(state);
            logic.initialize();
            
            const handlers = logic.getInteractionHandlers('trigger');
            
            // Start showing
            handlers.onMouseEnter?.(new MouseEvent('mouseenter'));
            vi.advanceTimersByTime(100);
            
            // Leave before show completes - should cancel show
            handlers.onMouseLeave?.(new MouseEvent('mouseleave'));
            vi.advanceTimersByTime(200);
            
            // Should never have shown
            expect(listener).not.toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
        });
        
    });
});