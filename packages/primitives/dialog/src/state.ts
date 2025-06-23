/**
 * Dialog State Management
 * Manages the dialog component state
 */

import { createStore } from '@stellarix-ui/core';
import type { DialogState, DialogOptions } from './types';

/**
 * Default state values
 */
const defaultState: DialogState = {
    open: false,
    previousFocus: null,
    loading: false,
    closeOnBackdropClick: true,
    closeOnEscape: true,
    focusTrap: true,
    preventScroll: true,
    role: 'dialog',
};

/**
 * Create dialog state store
 */
export function createDialogState(options: DialogOptions = {}) {
    const initialState: DialogState = {
        ...defaultState,
        open: options.open ?? defaultState.open,
        closeOnBackdropClick: options.closeOnBackdropClick ?? defaultState.closeOnBackdropClick,
        closeOnEscape: options.closeOnEscape ?? defaultState.closeOnEscape,
        focusTrap: options.focusTrap ?? defaultState.focusTrap,
        preventScroll: options.preventScroll ?? defaultState.preventScroll,
        role: options.role ?? defaultState.role,
    };

    const store = createStore(initialState);

    return {
        ...store,
        // Dialog-specific state setters
        setOpen: (open: boolean) => {
            store.setState((prev: DialogState) => ({ ...prev, open }));
        },
        setPreviousFocus: (element: HTMLElement | null) => {
            store.setState((prev: DialogState) => ({ ...prev, previousFocus: element }));
        },
        setLoading: (loading: boolean) => {
            store.setState((prev: DialogState) => ({ ...prev, loading }));
        },
        setCloseOnBackdropClick: (closeOnBackdropClick: boolean) => {
            store.setState((prev: DialogState) => ({ ...prev, closeOnBackdropClick }));
        },
        setCloseOnEscape: (closeOnEscape: boolean) => {
            store.setState((prev: DialogState) => ({ ...prev, closeOnEscape }));
        },
        setFocusTrap: (focusTrap: boolean) => {
            store.setState((prev: DialogState) => ({ ...prev, focusTrap }));
        },
        setPreventScroll: (preventScroll: boolean) => {
            store.setState((prev: DialogState) => ({ ...prev, preventScroll }));
        },
        setRole: (role: 'dialog' | 'alertdialog') => {
            store.setState((prev: DialogState) => ({ ...prev, role }));
        },
    };
}

export type DialogStore = ReturnType<typeof createDialogState>; 