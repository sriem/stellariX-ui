/**
 * Card State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createCardState } from './state';
import type { CardOptions } from './types';

describe('Card State', () => {
    it('should create state with default values', () => {
        const state = createCardState();
        const initialState = state.getState();
        
        expect(initialState.variant).toBe('simple');
        expect(initialState.interactive).toBe(false);
        expect(initialState.hovered).toBe(false);
        expect(initialState.focused).toBe(false);
        expect(initialState.selected).toBe(false);
        expect(initialState.disabled).toBe(false);
        expect(initialState.padding).toBe('md');
        expect(initialState.hasHeader).toBe(false);
        expect(initialState.hasFooter).toBe(false);
        expect(initialState.hasMedia).toBe(false);
    });
    
    it('should create state with initial options', () => {
        const options: CardOptions = {
            variant: 'elevated',
            interactive: true,
            selected: true,
            disabled: true,
            padding: 'lg',
            hasHeader: true,
            hasFooter: true,
            hasMedia: true,
        };
        
        const state = createCardState(options);
        const initialState = state.getState();
        
        expect(initialState.variant).toBe('elevated');
        expect(initialState.interactive).toBe(true);
        expect(initialState.selected).toBe(true);
        expect(initialState.disabled).toBe(true);
        expect(initialState.padding).toBe('lg');
        expect(initialState.hasHeader).toBe(true);
        expect(initialState.hasFooter).toBe(true);
        expect(initialState.hasMedia).toBe(true);
    });
    
    it('should update variant', () => {
        const state = createCardState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setVariant('outlined');
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            variant: 'outlined'
        }));
    });
    
    it('should update interactive state', () => {
        const state = createCardState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setInteractive(true);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            interactive: true
        }));
    });
    
    it('should update hover state', () => {
        const state = createCardState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setHovered(true);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            hovered: true
        }));
    });
    
    it('should update focus state', () => {
        const state = createCardState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setFocused(true);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focused: true
        }));
    });
    
    it('should toggle selection state', () => {
        const state = createCardState({ selected: false });
        
        state.toggleSelection();
        expect(state.getState().selected).toBe(true);
        
        state.toggleSelection();
        expect(state.getState().selected).toBe(false);
    });
    
    it('should compute isClickable correctly', () => {
        const state = createCardState();
        
        // Not clickable by default (not interactive)
        expect(state.isClickable()).toBe(false);
        
        // Clickable when interactive
        state.setInteractive(true);
        expect(state.isClickable()).toBe(true);
        
        // Not clickable when disabled
        state.setDisabled(true);
        expect(state.isClickable()).toBe(false);
        
        // Not clickable even when not disabled if not interactive
        state.setDisabled(false);
        state.setInteractive(false);
        expect(state.isClickable()).toBe(false);
    });
    
    it('should compute isHighlighted correctly', () => {
        const state = createCardState();
        
        // Not highlighted by default
        expect(state.isHighlighted()).toBe(false);
        
        // Highlighted when selected
        state.setSelected(true);
        expect(state.isHighlighted()).toBe(true);
        
        // Highlighted when hovered
        state.setSelected(false);
        state.setHovered(true);
        expect(state.isHighlighted()).toBe(true);
        
        // Highlighted when focused
        state.setHovered(false);
        state.setFocused(true);
        expect(state.isHighlighted()).toBe(true);
    });
    
    it('should update padding', () => {
        const state = createCardState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setPadding('xl');
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            padding: 'xl'
        }));
    });
    
    it('should update header/footer/media flags', () => {
        const state = createCardState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setHasHeader(true);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            hasHeader: true
        }));
        
        listener.mockClear();
        state.setHasFooter(true);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            hasFooter: true
        }));
        
        listener.mockClear();
        state.setHasMedia(true);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            hasMedia: true
        }));
    });
    
    it('should reset to initial state', () => {
        const state = createCardState({ 
            variant: 'elevated',
            padding: 'lg',
            selected: true
        });
        
        // Change state
        state.setVariant('outlined');
        state.setPadding('sm');
        state.setSelected(false);
        state.setHovered(true);
        
        // Reset
        state.reset();
        const resetState = state.getState();
        
        expect(resetState.variant).toBe('elevated');
        expect(resetState.padding).toBe('lg');
        expect(resetState.selected).toBe(true);
        expect(resetState.hovered).toBe(false);
    });
    
    it('should support derived state', () => {
        const state = createCardState({ padding: 'md' });
        const derivedPadding = state.derive(s => {
            const paddingMap = { none: 0, sm: 8, md: 16, lg: 24, xl: 32 };
            return paddingMap[s.padding];
        });
        
        expect(derivedPadding.get()).toBe(16);
        
        const listener = vi.fn();
        derivedPadding.subscribe(listener);
        
        state.setPadding('xl');
        expect(listener).toHaveBeenCalledWith(32);
    });
});