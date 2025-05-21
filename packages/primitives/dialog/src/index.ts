/**
 * Dialog Component
 * A framework-agnostic dialog component
 */

import { ComponentFactory } from '../../../core/src/types';
import { createDialogState } from './state';
import { createDialogLogic } from './logic';
import { DialogState, DialogEvents, DialogOptions } from './types';

export * from './types';

/**
 * Creates a dialog component
 * @param options Dialog options
 * @returns Dialog component factory
 */
export function createDialog(options: DialogOptions = {}): ComponentFactory<DialogState, DialogEvents, DialogOptions> {
    // Create state
    const state = createDialogState(options);

    // Create logic
    const logic = createDialogLogic(state, options);

    // Return component factory
    return {
        state,
        logic,
        options,
        connect: (adapter: any) => adapter.createComponent(state, logic, (props: { state: DialogState }) => {
            const { state } = props;

            // Return component implementation with compound components
            return {
                // Main component properties
                isOpen: state.isOpen,
                role: state.role,
                titleId: state.titleId,
                descriptionId: state.descriptionId,

                // Define how to render each part
                parts: {
                    // Root dialog wrapper
                    root: {
                        type: 'div',
                        props: {
                            'data-state': state.isOpen ? 'open' : 'closed',
                            style: {
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                zIndex: 50,
                                display: state.isOpen ? 'flex' : 'none',
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        },
                    },
                    // Backdrop
                    backdrop: {
                        type: 'div',
                        props: {
                            'data-state': state.isOpen ? 'open' : 'closed',
                            style: {
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                zIndex: -1,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },
                    // Dialog panel
                    panel: {
                        type: 'div',
                        props: {
                            role: state.role,
                            'aria-modal': 'true',
                            'aria-labelledby': state.titleId,
                            'aria-describedby': state.descriptionId,
                            'data-state': state.isOpen ? 'open' : 'closed',
                            style: {
                                position: 'relative',
                                zIndex: 1,
                                backgroundColor: 'white',
                                borderRadius: '0.375rem',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                width: '100%',
                                maxWidth: '28rem',
                                maxHeight: 'calc(100vh - 2rem)',
                                margin: '1rem',
                                overflow: 'auto',
                            },
                        },
                    },
                    // Title
                    title: {
                        type: 'h2',
                        props: {
                            id: state.titleId,
                            style: {
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: 'rgba(17, 24, 39, 1)',
                                padding: '1rem 1rem 0.5rem 1rem',
                            },
                        },
                    },
                    // Description
                    description: {
                        type: 'p',
                        props: {
                            id: state.descriptionId,
                            style: {
                                fontSize: '0.875rem',
                                color: 'rgba(75, 85, 99, 1)',
                                padding: '0 1rem 1rem 1rem',
                            },
                        },
                    },
                    // Close button
                    closeButton: {
                        type: 'button',
                        props: {
                            type: 'button',
                            'aria-label': 'Close dialog',
                            style: {
                                position: 'absolute',
                                top: '0.75rem',
                                right: '0.75rem',
                                padding: '0.25rem',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                            },
                        },
                    },
                },
            };
        }),
    };
} 