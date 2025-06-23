import { createComponentState } from '@stellarix-ui/core';
import type { ButtonState, ButtonOptions } from './types.js';

export function createButtonState(options: ButtonOptions) {
    const initialState: ButtonState = {
        pressed: false,
        focused: false,
        disabled: options.disabled || false,
        loading: options.loading || false,
        variant: options.variant || 'default',
        size: options.size || 'md'
    };

    const store = createComponentState('Button', initialState);

    // Extended API for button-specific state management
    return {
        ...store,
        
        // Button-specific state methods
        setPressed: (pressed: boolean) => {
            store.setState(prev => ({ ...prev, pressed }));
        },
        
        setFocused: (focused: boolean) => {
            store.setState(prev => ({ ...prev, focused }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState(prev => ({ ...prev, disabled }));
        },
        
        setLoading: (loading: boolean) => {
            store.setState(prev => ({ ...prev, loading }));
        },
        
        setVariant: (variant: ButtonState['variant']) => {
            store.setState(prev => ({ ...prev, variant }));
        },
        
        setSize: (size: ButtonState['size']) => {
            store.setState(prev => ({ ...prev, size }));
        },
        
        // Computed properties
        isInteractive: store.derive(state => !state.disabled && !state.loading),
        classes: store.derive(state => ({
            base: 'stellarix-button',
            variant: `stellarix-button--${state.variant}`,
            size: `stellarix-button--${state.size}`,
            disabled: state.disabled ? 'stellarix-button--disabled' : '',
            loading: state.loading ? 'stellarix-button--loading' : '',
            pressed: state.pressed ? 'stellarix-button--pressed' : '',
            focused: state.focused ? 'stellarix-button--focused' : ''
        }))
    };
}

export type ButtonStateStore = ReturnType<typeof createButtonState>;