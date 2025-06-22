/**
 * Divider Component Logic
 * Business logic and event handling
 */

import type { LogicLayer } from '@stellarix/core';
import type { DividerState, DividerEvents, DividerOptions } from './types';
import type { DividerStateStore } from './state';

/**
 * Creates the divider component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createDividerLogic(
    state: DividerStateStore,
    options: DividerOptions = {}
): LogicLayer<DividerState, DividerEvents> {
    // Since we need to access the component-specific logic methods,
    // we'll create a custom implementation
    let connectedStore: DividerStateStore | null = null;
    let initialized = false;
    
    const logic: LogicLayer<DividerState, DividerEvents> = {
        handleEvent: () => {
            // Divider has no events
        },
        
        getA11yProps: (elementId: string) => {
            if (!connectedStore || !initialized) return {};
            
            const currentState = connectedStore.getState();
            
            if (elementId === 'root') {
                const a11yProps: Record<string, any> = {
                    'role': 'separator',
                    'aria-orientation': currentState.orientation,
                };
                
                // Add label if provided
                if (options.label) {
                    a11yProps['aria-label'] = options.label;
                }
                
                return a11yProps;
            }
            
            if (elementId === 'label') {
                return {
                    'aria-hidden': 'true',
                };
            }
            
            return {};
        },
        
        getInteractionHandlers: (elementId: string) => {
            if (!connectedStore || !initialized) return {};
            
            const currentState = connectedStore.getState();
            
            if (elementId === 'root') {
                const styles: Record<string, any> = {};
                
                // Apply orientation-specific styles
                if (currentState.orientation === 'horizontal') {
                    styles.width = '100%';
                    styles.height = options.thickness || '1px';
                    styles.marginTop = options.spacing || '1rem';
                    styles.marginBottom = options.spacing || '1rem';
                } else {
                    styles.height = '100%';
                    styles.width = options.thickness || '1px';
                    styles.marginLeft = options.spacing || '1rem';
                    styles.marginRight = options.spacing || '1rem';
                }
                
                // Apply variant styles
                if (currentState.variant === 'dashed') {
                    styles.borderStyle = 'dashed';
                } else if (currentState.variant === 'dotted') {
                    styles.borderStyle = 'dotted';
                }
                
                // Apply color if provided
                if (options.color) {
                    styles.backgroundColor = options.color;
                    styles.borderColor = options.color;
                }
                
                return {
                    style: styles,
                    'data-orientation': currentState.orientation,
                    'data-variant': currentState.variant,
                    'data-has-label': currentState.hasLabel,
                };
            }
            
            if (elementId === 'label') {
                return {
                    'data-position': currentState.labelPosition,
                };
            }
            
            return {};
        },
        
        initialize: () => {
            initialized = true;
        },
        
        cleanup: () => {
            initialized = false;
            connectedStore = null;
        },
        
        connect: (stateStore: any) => {
            connectedStore = stateStore as DividerStateStore;
        },
        
        // Additional properties for backward compatibility
        events: {},
    };
    
    return logic;
}