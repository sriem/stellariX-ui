/**
 * Avatar Component Logic
 * Event handling and business logic
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { AvatarState, AvatarEvents, AvatarOptions } from './types';
import type { AvatarStateStore } from './state';

/**
 * Creates the avatar component logic
 * @param state The avatar state store
 * @param options Component options
 * @returns Logic layer instance
 */
export function createAvatarLogic(
    state: AvatarStateStore,
    options: AvatarOptions = {}
): LogicLayer<AvatarState, AvatarEvents> {
    return new LogicLayerBuilder<AvatarState, AvatarEvents>()
        // Handle image load success
        .onEvent('load', (currentState, payload: any) => {
            const src = payload && payload.src ? payload.src : payload;
            
            // Update state to reflect successful load
            state.setLoading(false);
            state.setError(false);
            
            // Call user callback if provided
            if (options.onLoad) {
                options.onLoad();
            }
            
            return null;
        })
        
        // Handle image load error
        .onEvent('error', (currentState, payload: any) => {
            const src = payload && payload.src ? payload.src : payload;
            const error = payload && payload.error ? payload.error : new Error('Failed to load image');
            
            // Update state to reflect error
            state.setLoading(false);
            state.setError(true);
            
            // Call user callback if provided
            if (options.onError) {
                options.onError();
            }
            
            return null;
        })
        
        // Handle click event
        .onEvent('click', (currentState, payload: any) => {
            const event = payload && payload.event ? payload.event : payload;
            
            // Let click bubble up - avatars are often wrapped in clickable containers
            // Don't prevent default unless explicitly needed
            
            return null;
        })
        
        // Root element accessibility props
        .withA11y('root', (state) => {
            const variant = state.variant;
            const alt = state.alt || state.name || 'Avatar';
            
            // Only add img role and alt for image variants
            if (variant === 'image' && state.src) {
                return {
                    role: 'img',
                    'aria-label': alt,
                };
            }
            
            // For other variants, use appropriate semantics
            return {
                'aria-label': alt,
            };
        })
        
        // Image element accessibility (when applicable)
        .withA11y('image', (state) => ({
            alt: state.alt || state.name || 'Avatar image',
            loading: 'lazy' as const,
        }))
        
        // Root click interaction
        .withInteraction('root', 'onClick', (currentState, event) => {
            // Only handle clicks if there's a click handler
            if (options.onClick) {
                return 'click';
            }
            return null;
        })
        
        // Image load interaction
        .withInteraction('image', 'onLoad', (currentState, event) => {
            if (currentState.variant === 'image' && currentState.src) {
                return 'load';
            }
            return null;
        })
        
        // Image error interaction
        .withInteraction('image', 'onError', (currentState, event) => {
            if (currentState.variant === 'image' && currentState.src) {
                return 'error';
            }
            return null;
        })
        
        .build();
}