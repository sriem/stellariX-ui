/**
 * Popover Component Logic
 * Business logic and event handling
 * 
 * 🚨 CRITICAL WARNING: NEVER call state.getState() in this file!
 * 
 * ❌ FORBIDDEN PATTERNS:
 * - const currentState = state.getState(); // CAUSES INFINITE LOOPS!
 * - state.getState() inside event handlers
 * - state.getState() inside getA11yProps()
 * - state.getState() inside getInteractionHandlers()
 * 
 * ✅ CORRECT PATTERNS:
 * - Use (currentState, handleEvent) parameters in interactions
 * - Use (state) parameter in a11y functions
 * - Call state setters directly: state.setOpen(), state.setPlacement()
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application.
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { PopoverState, PopoverEvents, PopoverOptions, PopoverPlacement, PopoverPosition } from './types';
import type { PopoverStateStore } from './state';

/**
 * Calculate popover position based on trigger element and placement
 */
function calculatePosition(
    triggerElement: HTMLElement,
    contentElement: HTMLElement,
    placement: PopoverPlacement,
    offset: number = 8
): PopoverPosition {
    const triggerRect = triggerElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    
    let top = 0;
    let left = 0;
    let actualPlacement = placement;
    
    // Handle auto placement
    if (placement.startsWith('auto')) {
        // Determine best placement based on available space
        const spaceTop = triggerRect.top;
        const spaceBottom = viewport.height - triggerRect.bottom;
        const spaceLeft = triggerRect.left;
        const spaceRight = viewport.width - triggerRect.right;
        
        if (placement === 'auto') {
            if (spaceBottom >= contentRect.height + offset) {
                actualPlacement = 'bottom';
            } else if (spaceTop >= contentRect.height + offset) {
                actualPlacement = 'top';
            } else if (spaceRight >= contentRect.width + offset) {
                actualPlacement = 'right';
            } else if (spaceLeft >= contentRect.width + offset) {
                actualPlacement = 'left';
            } else {
                actualPlacement = 'bottom'; // fallback
            }
        } else if (placement === 'auto-start') {
            if (spaceBottom >= contentRect.height + offset) {
                actualPlacement = 'bottom-start';
            } else if (spaceTop >= contentRect.height + offset) {
                actualPlacement = 'top-start';
            } else {
                actualPlacement = 'bottom-start'; // fallback
            }
        } else if (placement === 'auto-end') {
            if (spaceBottom >= contentRect.height + offset) {
                actualPlacement = 'bottom-end';
            } else if (spaceTop >= contentRect.height + offset) {
                actualPlacement = 'top-end';
            } else {
                actualPlacement = 'bottom-end'; // fallback
            }
        }
    }
    
    // Calculate position based on placement
    const placementToUse = actualPlacement || placement;
    
    switch (placementToUse) {
        case 'top':
            top = triggerRect.top - contentRect.height - offset;
            left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
            break;
        case 'top-start':
            top = triggerRect.top - contentRect.height - offset;
            left = triggerRect.left;
            break;
        case 'top-end':
            top = triggerRect.top - contentRect.height - offset;
            left = triggerRect.right - contentRect.width;
            break;
        case 'bottom':
            top = triggerRect.bottom + offset;
            left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
            break;
        case 'bottom-start':
            top = triggerRect.bottom + offset;
            left = triggerRect.left;
            break;
        case 'bottom-end':
            top = triggerRect.bottom + offset;
            left = triggerRect.right - contentRect.width;
            break;
        case 'left':
            top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
            left = triggerRect.left - contentRect.width - offset;
            break;
        case 'left-start':
            top = triggerRect.top;
            left = triggerRect.left - contentRect.width - offset;
            break;
        case 'left-end':
            top = triggerRect.bottom - contentRect.height;
            left = triggerRect.left - contentRect.width - offset;
            break;
        case 'right':
            top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
            left = triggerRect.right + offset;
            break;
        case 'right-start':
            top = triggerRect.top;
            left = triggerRect.right + offset;
            break;
        case 'right-end':
            top = triggerRect.bottom - contentRect.height;
            left = triggerRect.right + offset;
            break;
    }
    
    // Adjust position to keep within viewport
    top = Math.max(0, Math.min(top, viewport.height - contentRect.height));
    left = Math.max(0, Math.min(left, viewport.width - contentRect.width));
    
    return { top, left, actualPlacement: placementToUse };
}

/**
 * Creates the popover component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createPopoverLogic(
    state: PopoverStateStore,
    options: PopoverOptions = {}
): LogicLayer<PopoverState, PopoverEvents> {
    const offset = options.offset ?? 8;
    const closeOnClickOutside = options.closeOnClickOutside ?? true;
    const closeOnEscape = options.closeOnEscape ?? true;
    
    // Track document event listeners
    let documentClickHandler: ((e: MouseEvent) => void) | null = null;
    let documentKeydownHandler: ((e: KeyboardEvent) => void) | null = null;
    
    // Create the logic layer using the builder
    const logic = new LogicLayerBuilder<PopoverState, PopoverEvents>()
        .onEvent('openChange', (currentState, payload: any) => {
            // The payload might be a DOM event (from interaction handlers) or the actual payload
            let open = currentState.open;
            
            if (payload && typeof payload === 'object') {
                if ('open' in payload) {
                    open = payload.open;
                }
            }
            
            // Call user callback if provided
            if (options.onOpenChange) {
                options.onOpenChange(open);
            }
            
            // Update position if opening
            if (open && currentState.triggerElement && currentState.contentElement) {
                const position = calculatePosition(
                    currentState.triggerElement,
                    currentState.contentElement,
                    currentState.placement,
                    offset
                );
                
                // Update placement if it changed
                if (position.actualPlacement !== currentState.placement) {
                    state.setPlacement(position.actualPlacement);
                }
            }
            
            return null;
        })
        .onEvent('placementChange', (currentState, payload: any) => {
            const placement = payload && typeof payload === 'object' && 'placement' in payload ? 
                payload.placement : currentState.placement;
            
            // Call user callback if provided
            if (options.onPlacementChange) {
                options.onPlacementChange(placement);
            }
            return null;
        })
        .onEvent('focus', () => {
            state.setFocused(true);
            return null;
        })
        .onEvent('blur', () => {
            state.setFocused(false);
            return null;
        })
        .onEvent('escape', (currentState) => {
            if (closeOnEscape && currentState.open) {
                state.setOpen(false);
                // Call the callback directly since we're handling the event
                if (options.onOpenChange) {
                    options.onOpenChange(false);
                }
            }
            return null;
        })
        .onEvent('outsideClick', (currentState) => {
            if (closeOnClickOutside && currentState.open) {
                state.setOpen(false);
                // Call the callback directly since we're handling the event
                if (options.onOpenChange) {
                    options.onOpenChange(false);
                }
            }
            return null;
        })
        .withA11y('trigger', (state) => ({
            'aria-expanded': state.open ? 'true' : 'false',
            'aria-haspopup': 'true',
            'aria-controls': state.open ? (options.id || 'popover') + '-content' : undefined,
            'aria-disabled': state.disabled ? 'true' : undefined,
            tabIndex: state.disabled ? -1 : 0,
        }))
        .withA11y('content', (state) => ({
            role: 'dialog',
            'aria-hidden': !state.open ? 'true' : undefined,
            id: (options.id || 'popover') + '-content',
            tabIndex: -1,
        }))
        .withInteraction('trigger', 'onClick', (currentState, event: MouseEvent) => {
            // Prevent interaction if disabled
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            // Toggle open state
            state.setOpen(!currentState.open);
            
            // Return the event type to trigger
            return 'openChange';
        })
        .withInteraction('trigger', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            // Prevent interaction if disabled
            if (currentState.disabled) {
                return null;
            }
            
            // Handle Enter or Space to toggle
            if (event.code === 'Enter' || event.code === 'Space') {
                event.preventDefault();
                state.setOpen(!currentState.open);
                return 'openChange';
            }
            
            // Handle Escape to close
            if (event.code === 'Escape' && currentState.open) {
                event.preventDefault();
                return 'escape';
            }
            
            return null;
        })
        .withInteraction('trigger', 'onFocus', () => {
            return 'focus';
        })
        .withInteraction('trigger', 'onBlur', () => {
            return 'blur';
        })
        .withInteraction('content', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            // Handle Escape to close
            if (event.code === 'Escape' && currentState.open) {
                event.preventDefault();
                return 'escape';
            }
            return null;
        })
        .build();
    
    // Store cleanup function for later use
    let cleanupFn: (() => void) | null = null;
    
    // Override initialize to set up document event listeners
    const originalInitialize = logic.initialize;
    logic.initialize = (): void => {
        originalInitialize();
        
        // Set up document click handler
        documentClickHandler = (event: MouseEvent) => {
            const currentState = state.getState();
            if (!currentState.open || !currentState.triggerElement || !currentState.contentElement) {
                return;
            }
            
            const target = event.target as Node;
            if (!currentState.triggerElement.contains(target) && 
                !currentState.contentElement.contains(target)) {
                logic.handleEvent('outsideClick', { event });
            }
        };
        
        // Set up document keydown handler
        documentKeydownHandler = (event: KeyboardEvent) => {
            const currentState = state.getState();
            if (!currentState.open) {
                return;
            }
            
            if (event.code === 'Escape') {
                logic.handleEvent('escape', { event });
            }
        };
        
        // Add event listeners
        document.addEventListener('click', documentClickHandler);
        document.addEventListener('keydown', documentKeydownHandler);
        
        // Store cleanup function
        cleanupFn = () => {
            if (documentClickHandler) {
                document.removeEventListener('click', documentClickHandler);
            }
            if (documentKeydownHandler) {
                document.removeEventListener('keydown', documentKeydownHandler);
            }
        };
    };
    
    // Override cleanup to remove document event listeners
    const originalCleanup = logic.cleanup;
    logic.cleanup = (): void => {
        originalCleanup();
        if (cleanupFn) {
            cleanupFn();
        }
    };
    
    return logic;
}

/**
 * Helper function to update popover position
 * Can be called when trigger or content elements change
 */
export function updatePopoverPosition(
    state: PopoverStateStore,
    offset: number = 8
): void {
    const currentState = state.getState();
    if (!currentState.open || !currentState.triggerElement || !currentState.contentElement) {
        return;
    }
    
    const position = calculatePosition(
        currentState.triggerElement,
        currentState.contentElement,
        currentState.placement,
        offset
    );
    
    // Apply position to content element
    Object.assign(currentState.contentElement.style, {
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: '1000'
    });
    
    // Update placement if it changed
    if (position.actualPlacement !== currentState.placement) {
        state.setPlacement(position.actualPlacement);
    }
}