/**
 * Dialog Logic
 * Business logic for the dialog component
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
 * - Call state setters directly: state.setOpen(), state.setPreviousFocus()
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application.
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { DialogState, DialogEvents, DialogOptions } from './types';
import type { DialogStore } from './state';

/**
 * Focus management utilities
 */
const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(focusableSelectors));
}

function trapFocus(container: HTMLElement) {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) return null;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
}

/**
 * Creates the dialog component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createDialogLogic(
    state: DialogStore,
    options: DialogOptions = {}
): LogicLayer<DialogState, DialogEvents> {
    let cleanupFocusTrap: (() => void) | null = null;
    let scrollPosition = 0;

    return new LogicLayerBuilder<DialogState, DialogEvents>()
        // Handle open/close events
        .onEvent('openChange', (currentState, payload: any) => {
            const open = payload?.open ?? false;
            
            if (open && !currentState.open) {
                // Opening dialog
                // Store current focus
                state.setPreviousFocus(document.activeElement as HTMLElement);
                
                // Store scroll position and prevent scroll if enabled
                if (currentState.preventScroll) {
                    scrollPosition = window.scrollY;
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${scrollPosition}px`;
                    document.body.style.width = '100%';
                }
                
                // Set open state
                state.setOpen(true);
                
                // Set up focus trap (will be done in a setTimeout in the actual implementation)
                setTimeout(() => {
                    const dialogElement = document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement;
                    if (dialogElement && currentState.focusTrap) {
                        dialogElement.focus();
                        if (cleanupFocusTrap) {
                            cleanupFocusTrap();
                        }
                        cleanupFocusTrap = trapFocus(dialogElement);
                    }
                }, 0);
            } else if (!open && currentState.open) {
                // Closing dialog
                // Set closed state first
                state.setOpen(false);
                
                // Restore focus
                if (currentState.previousFocus) {
                    currentState.previousFocus.focus();
                    state.setPreviousFocus(null);
                }
                
                // Restore scroll if it was prevented
                if (currentState.preventScroll) {
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    window.scrollTo(0, scrollPosition);
                }
                
                // Cleanup focus trap
                if (cleanupFocusTrap) {
                    cleanupFocusTrap();
                    cleanupFocusTrap = null;
                }
            }
            
            // Call user callback
            if (options.onOpenChange) {
                options.onOpenChange(open);
            }
            
            return null;
        })
        
        // Handle escape key
        .onEvent('escapeKeyDown', (currentState, payload: any) => {
            const event = payload?.event ? payload.event : payload;
            if (!event || !currentState.open || !currentState.closeOnEscape) {
                return null;
            }
            
            event.preventDefault();
            event.stopPropagation();
            
            // Call user callback
            if (options.onEscapeKeyDown) {
                options.onEscapeKeyDown(event);
            }
            
            // Close the dialog by calling setOpen directly
            state.setOpen(false);
            
            // Trigger openChange event
            return { type: 'openChange', payload: { open: false } };
        })
        
        // Handle backdrop click
        .onEvent('backdropClick', (currentState, payload: any) => {
            const event = payload?.event ? payload.event : payload;
            if (!event || !currentState.open || !currentState.closeOnBackdropClick) {
                return null;
            }
            
            // Call user callback
            if (options.onBackdropClick) {
                options.onBackdropClick(event);
            }
            
            // Close the dialog by calling setOpen directly
            state.setOpen(false);
            
            // Trigger openChange event
            return { type: 'openChange', payload: { open: false } };
        })
        
        // Dialog accessibility props
        .withA11y('dialog', (state) => ({
            role: state.role,
            'aria-modal': 'true',
            'aria-label': options.ariaLabel,
            'aria-labelledby': options.ariaLabelledBy,
            'aria-describedby': options.ariaDescribedBy,
            'data-state': state.open ? 'open' : 'closed',
            tabIndex: -1,
        }))
        
        // Backdrop accessibility props
        .withA11y('backdrop', (state) => ({
            'aria-hidden': 'true',
            'data-state': state.open ? 'open' : 'closed',
        }))
        
        // Backdrop click interaction
        .withInteraction('backdrop', 'onClick', (currentState, event: MouseEvent) => {
            // Only handle clicks directly on backdrop
            if (!currentState.open || 
                !currentState.closeOnBackdropClick || 
                event.target !== event.currentTarget) {
                return null;
            }
            return 'backdropClick';
        })
        
        // Dialog keyboard interaction
        .withInteraction('dialog', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            if (!currentState.open || event.key !== 'Escape' || !currentState.closeOnEscape) {
                return null;
            }
            return 'escapeKeyDown';
        })
        
        // Build the logic layer
        .build();
}

// Cleanup function for when component unmounts
export function cleanupDialogLogic() {
    // Remove any global event listeners if needed
    // This would be called by the framework adapter
} 