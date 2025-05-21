/**
 * Dialog Logic Module
 */

import { createLogicLayer } from '../../../core/src/logic';
import { Store } from '../../../core/src/state';
import { createFocusTrap } from '../../../utils/src/accessibility';
import { DialogState, DialogEvents, DialogOptions } from './types';

/**
 * Creates the dialog logic
 * @param store Dialog state store
 * @param options Dialog options
 * @returns Dialog logic layer
 */
export function createDialogLogic(
    store: Store<DialogState>,
    options: DialogOptions = {}
) {
    // Event handlers
    const handlers = {
        OPEN: () => {
            if (options.onOpen) {
                options.onOpen();
            }

            return { isOpen: true };
        },

        CLOSE: () => {
            if (options.onClose) {
                options.onClose();
            }

            return { isOpen: false };
        },

        ESCAPE_KEY_DOWN: (state: DialogState, payload: DialogEvents['ESCAPE_KEY_DOWN']) => {
            if (!state.closeOnEsc) {
                return null;
            }

            if (options.onEscapeKeyDown) {
                options.onEscapeKeyDown(payload.originalEvent);
            }

            return { isOpen: false };
        },

        OUTSIDE_CLICK: (state: DialogState, payload: DialogEvents['OUTSIDE_CLICK']) => {
            if (!state.closeOnOutsideClick) {
                return null;
            }

            if (options.onOutsideClick) {
                options.onOutsideClick(payload.originalEvent);
            }

            return { isOpen: false };
        },
    };

    // A11y configuration
    const a11yConfig = {
        dialog: (state: DialogState) => {
            const props: Record<string, any> = {
                role: state.role,
                'aria-modal': 'true',
            };

            // Add optional attributes only if they exist
            if (state.titleId) {
                props['aria-labelledby'] = state.titleId;
            }

            if (state.descriptionId) {
                props['aria-describedby'] = state.descriptionId;
            }

            return props;
        },
        title: (state: DialogState) => ({
            id: state.titleId,
        }),
        description: (state: DialogState) => ({
            id: state.descriptionId,
        }),
    };

    // Interaction configuration
    const interactionConfig = {
        dialog: {
            onKeyDown: (state: DialogState, event: KeyboardEvent) => {
                if (event.key === 'Escape' && state.isOpen) {
                    event.preventDefault();
                    return 'ESCAPE_KEY_DOWN' as keyof DialogEvents;
                }
                return null;
            },
        },
        backdrop: {
            onClick: (state: DialogState, event: MouseEvent) => {
                if (state.isOpen) {
                    // Only handle clicks directly on the backdrop, not its children
                    if (event.target === event.currentTarget) {
                        return 'OUTSIDE_CLICK' as keyof DialogEvents;
                    }
                }
                return null;
            },
        },
        trigger: {
            onClick: (state: DialogState) => 'OPEN' as keyof DialogEvents,
        },
        closeButton: {
            onClick: (state: DialogState) => 'CLOSE' as keyof DialogEvents,
        },
    };

    // Create the logic layer
    return createLogicLayer<DialogState, DialogEvents>(
        store,
        handlers,
        a11yConfig,
        interactionConfig
    );
} 