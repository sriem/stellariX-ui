/**
 * Avatar Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix-ui/core';
import type { AvatarState, AvatarOptions, AvatarVariant, AvatarSize, AvatarShape } from './types';

/**
 * Extended state store with avatar-specific methods
 */
export interface AvatarStateStore {
    // Core state methods
    getState: () => AvatarState;
    setState: (updates: Partial<AvatarState>) => void;
    subscribe: (listener: (state: AvatarState) => void) => () => void;
    derive: <U>(selector: (state: AvatarState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Avatar-specific methods
    setVariant: (variant: AvatarVariant) => void;
    setSrc: (src: string | undefined) => void;
    setAlt: (alt: string) => void;
    setName: (name: string | undefined) => void;
    setInitials: (initials: string | undefined) => void;
    setIcon: (icon: string | undefined) => void;
    setSize: (size: AvatarSize) => void;
    setShape: (shape: AvatarShape) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: boolean) => void;
    setShowBadge: (showBadge: boolean) => void;
    reset: () => void;
    
    // Computed properties
    getDisplayInitials: () => string;
    getCurrentVariant: () => AvatarVariant;
    shouldShowImage: () => boolean;
}

/**
 * Creates the avatar component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createAvatarState(options: AvatarOptions = {}): AvatarStateStore {
    // Helper to generate initials from name
    const generateInitials = (name: string): string => {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 0) return '';
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };
    
    // Determine initial variant
    const determineVariant = (): AvatarVariant => {
        if (options.variant) return options.variant;
        if (options.src) return 'image';
        if (options.initials || options.name) return 'initials';
        if (options.icon) return 'icon';
        return 'placeholder';
    };
    
    // Define initial state
    const initialState: AvatarState = {
        variant: determineVariant(),
        src: options.src,
        alt: options.alt ?? '',
        name: options.name,
        initials: options.initials,
        icon: options.icon,
        size: options.size ?? 'md',
        shape: options.shape ?? 'circle',
        loading: false,
        error: false,
        showBadge: options.showBadge ?? false,
    };
    
    // Create the core state store
    const store = createComponentState('Avatar', initialState);
    
    // Extend with avatar-specific methods
    const extendedStore: AvatarStateStore = {
        ...store,
        
        // Convenience setters
        setVariant: (variant: AvatarVariant) => {
            store.setState(prev => ({ ...prev, variant }));
        },
        
        setSrc: (src: string | undefined) => {
            store.setState(prev => ({ 
                ...prev, 
                src,
                error: false, // Reset error when src changes
                loading: !!src // Start loading if src provided
            }));
        },
        
        setAlt: (alt: string) => {
            store.setState(prev => ({ ...prev, alt }));
        },
        
        setName: (name: string | undefined) => {
            store.setState(prev => ({ ...prev, name }));
        },
        
        setInitials: (initials: string | undefined) => {
            store.setState(prev => ({ ...prev, initials }));
        },
        
        setIcon: (icon: string | undefined) => {
            store.setState(prev => ({ ...prev, icon }));
        },
        
        setSize: (size: AvatarSize) => {
            store.setState(prev => ({ ...prev, size }));
        },
        
        setShape: (shape: AvatarShape) => {
            store.setState(prev => ({ ...prev, shape }));
        },
        
        setLoading: (loading: boolean) => {
            store.setState(prev => ({ ...prev, loading }));
        },
        
        setError: (error: boolean) => {
            store.setState(prev => ({ ...prev, error }));
        },
        
        setShowBadge: (showBadge: boolean) => {
            store.setState(prev => ({ ...prev, showBadge }));
        },
        
        // Reset to initial state
        reset: () => {
            store.setState(initialState);
        },
        
        // Computed properties
        getDisplayInitials: () => {
            const state = store.getState();
            if (state.initials) return state.initials;
            if (state.name) return generateInitials(state.name);
            return '';
        },
        
        getCurrentVariant: () => {
            const state = store.getState();
            
            // If image variant but failed to load, fallback to initials or placeholder
            if (state.variant === 'image' && state.error) {
                if (state.initials || state.name) return 'initials';
                return 'placeholder';
            }
            
            return state.variant;
        },
        
        shouldShowImage: () => {
            const state = store.getState();
            return state.variant === 'image' && state.src && !state.error;
        },
    };
    
    return extendedStore;
}