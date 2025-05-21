/**
 * Dialog State Module
 */

import { createStore } from '../../../core/src/state';
import { DialogState, DialogOptions } from './types';
import { generateId } from '../../../utils/src/dom';

/**
 * Creates the dialog state
 * @param options Dialog options
 * @returns Dialog state store
 */
export function createDialogState(options: DialogOptions = {}) {
    // Generate unique IDs for accessibility
    const titleId = options.id ? `${options.id}-title` : generateId('dialog-title');
    const descriptionId = options.id ? `${options.id}-description` : generateId('dialog-description');

    // Default values
    const initialState: DialogState = {
        isOpen: options.initialOpen || false,
        hasBackdrop: options.hasBackdrop !== false, // Default to true
        closeOnOutsideClick: options.closeOnOutsideClick !== false, // Default to true
        closeOnEsc: options.closeOnEsc !== false, // Default to true
        titleId,
        descriptionId,
        role: options.role || 'dialog',
        focused: false,
        hovered: false,
        disabled: options.disabled || false,
        dataAttributes: {},
    };

    // Create the store
    const store = createStore<DialogState>(initialState);

    return store;
} 