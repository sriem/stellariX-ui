/**
 * Card Component Logic
 * Event handling and business logic
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { CardState, CardEvents, CardOptions } from './types';
import type { CardStateStore } from './state';

/**
 * Creates the card component logic
 * @param state The card state store
 * @param options Component options
 * @returns Logic layer instance
 */
export function createCardLogic(
    state: CardStateStore,
    options: CardOptions = {}
): LogicLayer<CardState, CardEvents> {
    return new LogicLayerBuilder<CardState, CardEvents>()
        // Handle click event
        .onEvent('click', (currentState, payload: any) => {
            const event = payload && payload.event ? payload.event : payload;
            
            // Prevent action if disabled
            if (currentState.disabled) {
                if (event && typeof event.preventDefault === 'function') {
                    event.preventDefault();
                }
                return null;
            }
            
            // Toggle selection if interactive
            if (currentState.interactive) {
                const newSelected = !currentState.selected;
                state.setSelected(newSelected);
                
                // Call selection change callback
                if (options.onSelectionChange) {
                    options.onSelectionChange(newSelected);
                }
            }
            
            // Call click callback
            if (options.onClick) {
                options.onClick(event);
            }
            
            return null;
        })
        
        // Handle selection change event
        .onEvent('selectionChange', (currentState, payload: any) => {
            const selected = payload && typeof payload === 'object' && 'selected' in payload 
                ? payload.selected 
                : currentState.selected;
            
            state.setSelected(selected);
            
            if (options.onSelectionChange) {
                options.onSelectionChange(selected);
            }
            
            return null;
        })
        
        // Handle focus event
        .onEvent('focus', (currentState, payload: any) => {
            const event = payload && payload.event ? payload.event : payload;
            
            state.setFocused(true);
            
            if (options.onFocus) {
                options.onFocus(event);
            }
            
            return null;
        })
        
        // Handle blur event
        .onEvent('blur', (currentState, payload: any) => {
            const event = payload && payload.event ? payload.event : payload;
            
            state.setFocused(false);
            
            if (options.onBlur) {
                options.onBlur(event);
            }
            
            return null;
        })
        
        // Handle hover state change
        .onEvent('hover', (currentState, payload: any) => {
            const hovered = payload && typeof payload === 'object' && 'hovered' in payload 
                ? payload.hovered 
                : false;
            
            state.setHovered(hovered);
            
            return null;
        })
        
        // Root element accessibility props
        .withA11y('root', (state) => {
            const a11yProps: Record<string, any> = {};
            
            // Interactive cards need proper roles and keyboard support
            if (state.interactive) {
                a11yProps.role = state.selected !== undefined ? 'checkbox' : 'button';
                a11yProps.tabIndex = state.disabled ? -1 : 0;
                
                if (state.selected !== undefined) {
                    a11yProps['aria-checked'] = state.selected ? 'true' : 'false';
                }
            }
            
            // Add disabled state
            if (state.disabled) {
                a11yProps['aria-disabled'] = 'true';
            }
            
            // Add selected state for non-checkbox interactive cards
            if (state.interactive && state.selected && !a11yProps['aria-checked']) {
                a11yProps['aria-pressed'] = 'true';
            }
            
            return a11yProps;
        })
        
        // Header element accessibility
        .withA11y('header', (state) => ({
            role: 'heading',
            'aria-level': '3',
        }))
        
        // Root click interaction
        .withInteraction('root', 'onClick', (currentState, event) => {
            if (currentState.interactive && !currentState.disabled) {
                return 'click';
            }
            return null;
        })
        
        // Root focus interaction
        .withInteraction('root', 'onFocus', (currentState, event) => {
            if (currentState.interactive) {
                return 'focus';
            }
            return null;
        })
        
        // Root blur interaction
        .withInteraction('root', 'onBlur', (currentState, event) => {
            if (currentState.interactive) {
                return 'blur';
            }
            return null;
        })
        
        // Root mouse enter interaction
        .withInteraction('root', 'onMouseEnter', (currentState, event) => {
            if (currentState.interactive && !currentState.disabled) {
                state.setHovered(true);
                return null; // Don't trigger event since we're updating directly
            }
            return null;
        })
        
        // Root mouse leave interaction
        .withInteraction('root', 'onMouseLeave', (currentState, event) => {
            if (currentState.interactive) {
                state.setHovered(false);
                return null; // Don't trigger event since we're updating directly
            }
            return null;
        })
        
        // Keyboard interaction for interactive cards
        .withInteraction('root', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            if (!currentState.interactive || currentState.disabled) {
                return null;
            }
            
            // Handle Enter and Space for activation
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                return 'click';
            }
            
            return null;
        })
        
        .build();
}