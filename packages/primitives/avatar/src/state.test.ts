/**
 * Avatar State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createAvatarState } from './state';
import type { AvatarOptions } from './types';

describe('Avatar State', () => {
    it('should create state with default values', () => {
        const state = createAvatarState();
        const initialState = state.getState();
        
        expect(initialState.variant).toBe('placeholder');
        expect(initialState.src).toBeUndefined();
        expect(initialState.alt).toBe('');
        expect(initialState.name).toBeUndefined();
        expect(initialState.initials).toBeUndefined();
        expect(initialState.icon).toBeUndefined();
        expect(initialState.size).toBe('md');
        expect(initialState.shape).toBe('circle');
        expect(initialState.loading).toBe(false);
        expect(initialState.error).toBe(false);
        expect(initialState.showBadge).toBe(false);
    });
    
    it('should determine variant based on provided options', () => {
        // With src - should be image variant
        const imageState = createAvatarState({ src: 'avatar.jpg' });
        expect(imageState.getState().variant).toBe('image');
        
        // With name - should be initials variant
        const nameState = createAvatarState({ name: 'John Doe' });
        expect(nameState.getState().variant).toBe('initials');
        
        // With initials - should be initials variant
        const initialsState = createAvatarState({ initials: 'JD' });
        expect(initialsState.getState().variant).toBe('initials');
        
        // With icon - should be icon variant
        const iconState = createAvatarState({ icon: '👤' });
        expect(iconState.getState().variant).toBe('icon');
        
        // With explicit variant - should use that
        const explicitState = createAvatarState({ variant: 'placeholder' });
        expect(explicitState.getState().variant).toBe('placeholder');
    });
    
    it('should generate initials from name', () => {
        const state = createAvatarState({ name: 'John Doe' });
        expect(state.getDisplayInitials()).toBe('JD');
        
        // Single name
        const singleNameState = createAvatarState({ name: 'John' });
        expect(singleNameState.getDisplayInitials()).toBe('J');
        
        // Multiple names
        const multipleNamesState = createAvatarState({ name: 'John Michael Doe' });
        expect(multipleNamesState.getDisplayInitials()).toBe('JD');
        
        // Empty name
        const emptyNameState = createAvatarState({ name: '' });
        expect(emptyNameState.getDisplayInitials()).toBe('');
    });
    
    it('should use custom initials over generated ones', () => {
        const state = createAvatarState({ 
            name: 'John Doe',
            initials: 'XY' 
        });
        expect(state.getDisplayInitials()).toBe('XY');
    });
    
    it('should update src and handle loading state', () => {
        const state = createAvatarState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setSrc('avatar.jpg');
        
        // Should set loading to true and reset error
        const lastCall = listener.mock.lastCall![0];
        expect(lastCall.src).toBe('avatar.jpg');
        expect(lastCall.error).toBe(false);
        expect(lastCall.loading).toBe(true);
    });
    
    it('should handle error state correctly', () => {
        const state = createAvatarState({ src: 'avatar.jpg' });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setError(true);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            error: true
        }));
        
        // Should fallback variant when image errors
        expect(state.getCurrentVariant()).toBe('placeholder');
    });
    
    it('should fallback to initials when image errors and name is available', () => {
        const state = createAvatarState({ 
            src: 'avatar.jpg',
            name: 'John Doe'
        });
        
        state.setError(true);
        expect(state.getCurrentVariant()).toBe('initials');
    });
    
    it('should determine if image should be shown', () => {
        const state = createAvatarState({ src: 'avatar.jpg' });
        expect(state.shouldShowImage()).toBe(true);
        
        // No src
        const noSrcState = createAvatarState();
        expect(noSrcState.shouldShowImage()).toBe(false);
        
        // Error state
        state.setError(true);
        expect(state.shouldShowImage()).toBe(false);
    });
    
    it('should reset to initial state', () => {
        const state = createAvatarState({ 
            src: 'avatar.jpg',
            size: 'lg'
        });
        
        // Change state
        state.setSrc('new-avatar.jpg');
        state.setSize('sm');
        state.setError(true);
        
        // Reset
        state.reset();
        const resetState = state.getState();
        
        expect(resetState.src).toBe('avatar.jpg');
        expect(resetState.size).toBe('lg');
        expect(resetState.error).toBe(false);
    });
    
    it('should support derived state', () => {
        const state = createAvatarState({ size: 'md' });
        const derivedSize = state.derive(s => {
            const sizes = { xs: 24, sm: 32, md: 40, lg: 48, xl: 56 };
            return sizes[s.size];
        });
        
        expect(derivedSize.get()).toBe(40);
        
        const listener = vi.fn();
        derivedSize.subscribe(listener);
        
        state.setSize('xl');
        expect(listener).toHaveBeenCalledWith(56);
    });
});