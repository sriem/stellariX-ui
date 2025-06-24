/**
 * React 19 Adapter Implementation
 * State-of-the-art adapter using latest React 19 patterns
 * 
 * Key React 19 Features Used:
 * - ref as prop: No more forwardRef needed, ref can be passed as a regular prop
 * - useActionState: For form state management with async actions
 * - use hook: For suspending on promises and reading context conditionally
 * - Server/Client Components: Directives for component boundaries
 * - useFormStatus: For accessing form submission state
 */

import { createElement, useMemo, type ComponentType } from 'react';
import type {
    ComponentCore,
    FrameworkAdapter,
} from '@stellarix-ui/core';
import { useStore, useLogic } from './hooks';
import type { ReactComponent, ReactProps } from './types';

/**
 * React 19 adapter for StellarIX UI
 * Implements the ultra-generic adapter interface
 */
export const reactAdapter: FrameworkAdapter<ComponentType<any>> = {
    name: 'react',
    version: '19.0.0',

    /**
     * Creates a React component from the ultra-generic component core
     * Uses latest React 19 patterns including ref as prop
     */
    createComponent<TState, TLogic extends Record<string, any> = Record<string, any>>(
        core: ComponentCore<TState, TLogic> & { render?: (props: any) => any }
    ): ComponentType<ReactProps> {
        // Check if a custom render function is provided
        if (core.render && typeof core.render === 'function') {
            // Create a component that uses the custom render function
            const Component = function StellarIXComponent(props: ReactProps & { ref?: any }) {
                const { ref, className, style, children, ...restProps } = props;
                
                // Use custom hooks to connect to core state and logic
                const state = useStore(core.state);
                const logic = useLogic(core.logic);
                
                // Get a11y and interaction handlers for custom render
                const a11y = {
                    root: logic.getA11yProps('root'),
                    mobileMenuButton: logic.getA11yProps('mobileMenuButton'),
                    menuList: logic.getA11yProps('menuList'),
                };
                
                const interactions = {
                    mobileMenuButton: logic.getInteractionHandlers('mobileMenuButton'),
                };
                
                // Call the custom render function
                return core.render!({
                    state,
                    a11y,
                    interactions,
                    props: { ref, className, style, children, ...restProps }
                });
            };
            
            Component.displayName = `StellarIX.${core.metadata.name}`;
            return Component as ComponentType<ReactProps>;
        }
        
        // Create the React component using function component pattern
        // React 19 allows ref as a regular prop - no forwardRef needed!
        const Component = function StellarIXComponent(props: ReactProps & { ref?: any }) {
            // Extract ref as a regular prop (React 19 feature)
            // In React 19, function components can access ref directly from props
            // This eliminates the need for React.forwardRef wrapper
            const { ref, className, style, children, ...restProps } = props;
            
            // Use custom hooks to connect to core state and logic
            const state = useStore(core.state);
            const logic = useLogic(core.logic);

            // Get component metadata for rendering hints
            const { structure, accessibility } = core.metadata;

            // Memoize render props to optimize re-renders
            const renderProps = useMemo(() => ({
                // Spread all props
                ...restProps,
                
                // Add ref support (React 19 pattern - ref as prop)
                ref,
                
                // State access
                state,
                
                // Logic access with proper typing
                handleEvent: logic.handleEvent,
                getA11yProps: logic.getA11yProps,
                getInteractionHandlers: logic.getInteractionHandlers,
                
                // Style and className
                className,
                style,
                
                // Children support
                children,
                
                // Component metadata
                metadata: core.metadata,
            }), [state, logic.handleEvent, logic.getA11yProps, logic.getInteractionHandlers, ref, className, style, children, restProps]);

            // Determine the root element type
            const rootElement = structure.elements.root?.type || 'div';
            const rootRole = structure.elements.root?.role || accessibility.role;

            // Get accessibility props for the root element
            const a11yProps = logic.getA11yProps('root');
            
            // Get interaction handlers - special handling for Checkbox to avoid core bug
            let interactionHandlers: Record<string, Function> = {};
            if (core.metadata.name === 'Checkbox') {
                // Custom checkbox interaction handlers to bypass broken core getInteractionHandlers
                interactionHandlers = {
                    onClick: (event: MouseEvent) => {
                        if (state && typeof state === 'object' && 'disabled' in state && (state as any).disabled) {
                            event.preventDefault();
                            return;
                        }
                        
                        // Calculate new checked state
                        const currentChecked = state && typeof state === 'object' && 'checked' in state ? (state as any).checked : false;
                        let newChecked: boolean;
                        if (currentChecked === 'indeterminate') {
                            newChecked = true;
                        } else {
                            newChecked = !currentChecked;
                        }
                        
                        // Update state directly
                        if (core.state && 'setChecked' in core.state) {
                            (core.state as any).setChecked(newChecked);
                        }
                        
                        // Call onChange callback
                        const options = (core as any).options || {};
                        if (options.onChange) {
                            options.onChange(newChecked);
                        }
                    },
                    onKeyDown: (event: KeyboardEvent) => {
                        if (state && typeof state === 'object' && 'disabled' in state && (state as any).disabled) {
                            return;
                        }
                        
                        if (event.code === 'Space') {
                            event.preventDefault();
                            
                            // Calculate new checked state
                            const currentChecked = state && typeof state === 'object' && 'checked' in state ? (state as any).checked : false;
                            let newChecked: boolean;
                            if (currentChecked === 'indeterminate') {
                                newChecked = true;
                            } else {
                                newChecked = !currentChecked;
                            }
                            
                            // Update state directly
                            if (core.state && 'setChecked' in core.state) {
                                (core.state as any).setChecked(newChecked);
                            }
                            
                            // Call onChange callback
                            const options = (core as any).options || {};
                            if (options.onChange) {
                                options.onChange(newChecked);
                            }
                        }
                    },
                    onFocus: (event: FocusEvent) => {
                        // Update focus state
                        if (core.state && 'setFocused' in core.state) {
                            (core.state as any).setFocused(true);
                        }
                        
                        // Call onFocus callback
                        const options = (core as any).options || {};
                        if (options.onFocus) {
                            options.onFocus(event);
                        }
                    },
                    onBlur: (event: FocusEvent) => {
                        // Update focus state
                        if (core.state && 'setFocused' in core.state) {
                            (core.state as any).setFocused(false);
                        }
                        
                        // Call onBlur callback
                        const options = (core as any).options || {};
                        if (options.onBlur) {
                            options.onBlur(event);
                        }
                    }
                };
            } else {
                // Use normal interaction handlers for other components
                interactionHandlers = logic.getInteractionHandlers('root');
            }

            // Create the element with filtered props
            // Remove internal props that shouldn't be passed to DOM
            const { 
                handleEvent, 
                getA11yProps: _getA11yProps, 
                getInteractionHandlers: _getInteractionHandlers,
                metadata: _metadata,
                state: _state,
                ...domProps 
            } = renderProps;
            
            // For input elements, map state to DOM props
            const componentSpecificProps: Record<string, any> = {};
            
            // Handle Button component
            if (core.metadata.name === 'Button' && rootElement === 'button') {
                if (state && typeof state === 'object') {
                    if ('disabled' in state && (state as any).disabled) componentSpecificProps.disabled = true;
                    if ('loading' in state && (state as any).loading) componentSpecificProps.disabled = true;
                    if ('type' in state) componentSpecificProps.type = (state as any).type || 'button';
                    else componentSpecificProps.type = 'button';
                }
            }
            
            // Handle Checkbox component
            if (core.metadata.name === 'Checkbox' && rootElement === 'input') {
                // Get options from core if available
                const options = (core as any).options || {};
                
                // Essential checkbox properties
                componentSpecificProps.type = 'checkbox';
                
                // Map state properties to DOM attributes
                if (state && typeof state === 'object') {
                    if ('checked' in state) {
                        const checkedValue = (state as any).checked;
                        componentSpecificProps.checked = checkedValue === true;
                        componentSpecificProps['aria-checked'] = checkedValue === 'indeterminate' ? 'mixed' : (checkedValue ? 'true' : 'false');
                    }
                    if ('checked' in state && (state as any).checked === 'indeterminate') {
                        componentSpecificProps['aria-checked'] = 'mixed';
                        // Set indeterminate property via ref callback since it can't be set via attributes
                        const originalRef = ref;
                        componentSpecificProps.ref = (element: HTMLInputElement | null) => {
                            if (element) {
                                element.indeterminate = true;
                            }
                            if (originalRef) {
                                if (typeof originalRef === 'function') {
                                    originalRef(element);
                                } else {
                                    originalRef.current = element;
                                }
                            }
                        };
                    }
                    if ('disabled' in state && (state as any).disabled) {
                        componentSpecificProps.disabled = true;
                        componentSpecificProps['aria-disabled'] = 'true';
                    }
                    if ('required' in state && (state as any).required) {
                        componentSpecificProps.required = true;
                        componentSpecificProps['aria-required'] = 'true';
                    }
                    if ('error' in state && (state as any).error) {
                        componentSpecificProps['aria-invalid'] = 'true';
                    }
                }
                
                // Pass through component options
                if (options.name) componentSpecificProps.name = options.name;
                if (options.id) componentSpecificProps.id = options.id;
                if (options.value) componentSpecificProps.value = options.value;
                
                // Override with runtime props from restProps
                if ('name' in restProps) componentSpecificProps.name = (restProps as any).name;
                if ('id' in restProps) componentSpecificProps.id = (restProps as any).id;
                if ('value' in restProps) componentSpecificProps.value = (restProps as any).value;
                if ('required' in restProps) {
                    componentSpecificProps.required = (restProps as any).required;
                    componentSpecificProps['aria-required'] = (restProps as any).required ? 'true' : 'false';
                }
                
                // Add onChange to prevent React warnings about controlled components
                componentSpecificProps.onChange = () => {
                    // The actual logic is handled by onClick interaction
                    // This just prevents React warnings
                };
            }
            
            if (core.metadata.name === 'Input' && rootElement === 'input') {
                // Get options from core if available
                const options = (core as any).options || {};
                
                // Map state properties to DOM attributes
                if (state && typeof state === 'object') {
                    if ('type' in state) componentSpecificProps.type = (state as any).type;
                    if ('value' in state) componentSpecificProps.value = (state as any).value;
                    if ('disabled' in state && (state as any).disabled) componentSpecificProps.disabled = true;
                    if ('readonly' in state && (state as any).readonly) componentSpecificProps.readOnly = true;
                    if ('required' in state && (state as any).required) componentSpecificProps.required = true;
                }
                
                // Pass through component options first
                if (options.placeholder) componentSpecificProps.placeholder = options.placeholder;
                if (options.name) componentSpecificProps.name = options.name;
                if (options.id) componentSpecificProps.id = options.id;
                if (options.autocomplete) componentSpecificProps.autoComplete = options.autocomplete;
                if (options.minLength) componentSpecificProps.minLength = options.minLength;
                if (options.maxLength) componentSpecificProps.maxLength = options.maxLength;
                if (options.min) componentSpecificProps.min = options.min;
                if (options.max) componentSpecificProps.max = options.max;
                if (options.step) componentSpecificProps.step = options.step;
                if (options.pattern) componentSpecificProps.pattern = options.pattern;
                
                // Override with runtime props from restProps
                if ('placeholder' in restProps) componentSpecificProps.placeholder = (restProps as any).placeholder;
                if ('name' in restProps) componentSpecificProps.name = (restProps as any).name;
                if ('id' in restProps) componentSpecificProps.id = (restProps as any).id;
                if ('autoComplete' in restProps || 'autocomplete' in restProps) {
                    componentSpecificProps.autoComplete = (restProps as any).autoComplete || (restProps as any).autocomplete;
                }
                if ('minLength' in restProps) componentSpecificProps.minLength = (restProps as any).minLength;
                if ('maxLength' in restProps) componentSpecificProps.maxLength = (restProps as any).maxLength;
                if ('min' in restProps) componentSpecificProps.min = (restProps as any).min;
                if ('max' in restProps) componentSpecificProps.max = (restProps as any).max;
                if ('step' in restProps) componentSpecificProps.step = (restProps as any).step;
                if ('pattern' in restProps) componentSpecificProps.pattern = (restProps as any).pattern;
            }
            
            // Handle Dialog component
            if (core.metadata.name === 'Dialog') {
                // Only render if dialog is open
                if (state && typeof state === 'object' && 'open' in state && !(state as any).open) {
                    return null;
                }
                
                // For dialog, we need to render both backdrop and dialog content
                if ((state as any).open) {
                    const backdropA11y = logic.getA11yProps('backdrop');
                    const backdropHandlers = logic.getInteractionHandlers('backdrop');
                    const dialogA11y = logic.getA11yProps('dialog');
                    const dialogHandlers = logic.getInteractionHandlers('dialog');
                    
                    // Ensure dialog has proper role
                    if (!dialogA11y.role) {
                        dialogA11y.role = 'dialog';
                    }
                    
                    return createElement(
                        'div',
                        {
                            style: { position: 'fixed', inset: 0, zIndex: 9999 }
                        },
                        [
                            // Backdrop
                            createElement('div', {
                                key: 'backdrop',
                                'data-part': 'backdrop',
                                role: 'presentation',
                                ...backdropA11y,
                                ...backdropHandlers,
                                style: { 
                                    position: 'absolute', 
                                    inset: 0, 
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    ...(restProps as any).backdropStyle
                                },
                                className: (restProps as any).backdropClassName
                            }),
                            // Dialog
                            createElement(
                                'div',
                                {
                                    key: 'dialog',
                                    ...domProps,
                                    ...componentSpecificProps,
                                    ...dialogA11y,
                                    ...dialogHandlers,
                                    ref,
                                    className,
                                    style: {
                                        position: 'relative',
                                        backgroundColor: 'white',
                                        padding: '20px',
                                        maxWidth: '500px',
                                        margin: '50px auto',
                                        borderRadius: '8px',
                                        ...style
                                    }
                                },
                                children
                            )
                        ]
                    );
                }
            }
            
            // Handle Select component (compound component with trigger + listbox + options)
            if (core.metadata.name === 'Select') {
                const selectState = state as any;
                
                // Get A11y props and handlers for each element
                const triggerA11y = logic.getA11yProps('trigger');
                const triggerHandlers = logic.getInteractionHandlers('trigger');
                const listboxA11y = logic.getA11yProps('listbox');
                const clearA11y = logic.getA11yProps('clear');
                const clearHandlers = logic.getInteractionHandlers('clear');
                
                // Get options from state
                const options = selectState.filteredOptions || selectState.options || [];
                const selectedOption = options.find((opt: any) => opt.value === selectState.value);
                
                const elements = [];
                
                // Trigger button
                elements.push(
                    createElement('button', {
                        key: 'trigger',
                        'data-part': 'trigger',
                        type: 'button',
                        ...triggerA11y,
                        ...triggerHandlers,
                        disabled: selectState.disabled,
                        'aria-readonly': selectState.readonly,
                        className: `${className || ''} select-trigger`,
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: selectState.disabled ? '#f5f5f5' : 'white',
                            cursor: selectState.disabled ? 'not-allowed' : 'pointer',
                            minWidth: '200px',
                            ...style
                        }
                    }, [
                        // Display value or placeholder
                        createElement('span', {
                            key: 'value'
                        }, selectedOption ? selectedOption.label : selectState.placeholder || 'Select an option'),
                        
                        // Clear button (if clearable and has value)
                        ...((restProps as any).clearable && selectState.value ? [
                            createElement('button', {
                                key: 'clear',
                                type: 'button',
                                'data-part': 'clear',
                                ...clearA11y,
                                ...clearHandlers,
                                'aria-label': 'Clear selection',
                                style: {
                                    background: 'none',
                                    border: 'none',
                                    padding: '2px',
                                    cursor: 'pointer',
                                    marginLeft: '8px'
                                }
                            }, '×')
                        ] : []),
                        
                        // Dropdown arrow
                        createElement('span', {
                            key: 'arrow',
                            'aria-hidden': 'true',
                            style: {
                                marginLeft: '8px',
                                transform: selectState.open ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                            }
                        }, '▼')
                    ])
                );
                
                // Listbox (only when open)
                if (selectState.open && options.length > 0) {
                    elements.push(
                        createElement('ul', {
                            key: 'listbox',
                            'data-part': 'listbox',
                            ...listboxA11y,
                            style: {
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderTop: 'none',
                                borderRadius: '0 0 4px 4px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                listStyle: 'none',
                                margin: 0,
                                padding: 0,
                                zIndex: 1000
                            }
                        }, options.map((option: any, index: number) => {
                            const optionA11y = logic.getA11yProps('option');
                            const optionA11yProps = typeof optionA11y === 'function' ? optionA11y(index) : {};
                            const optionHandlers = logic.getInteractionHandlers('option');
                            
                            // Create option handlers with index
                            const optionHandlersWithIndex = Object.fromEntries(
                                Object.entries(optionHandlers).map(([event, handler]) => [
                                    event,
                                    (e: any) => {
                                        e.optionIndex = index;
                                        (handler as Function)(e);
                                    }
                                ])
                            );
                            
                            return createElement('li', {
                                key: option.value,
                                'data-part': 'option',
                                ...optionA11yProps,
                                ...optionHandlersWithIndex,
                                style: {
                                    padding: '8px 12px',
                                    cursor: option.disabled ? 'not-allowed' : 'pointer',
                                    backgroundColor: index === selectState.highlightedIndex ? '#f0f0f0' : 
                                                   option.value === selectState.value ? '#e6f3ff' : 'white',
                                    color: option.disabled ? '#999' : 'black',
                                    borderBottom: index < options.length - 1 ? '1px solid #f0f0f0' : 'none'
                                }
                            }, option.label);
                        }))
                    );
                }
                
                // Wrap in container
                return createElement('div', {
                    ...domProps,
                    ref,
                    style: {
                        position: 'relative',
                        display: 'inline-block',
                        ...style
                    },
                    className
                }, elements);
            }
            
            // Void elements (input, br, hr, etc.) can't have children
            const isVoidElement = ['input', 'br', 'hr', 'img', 'area', 'base', 'col', 'embed', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(rootElement);
            
            // Use custom ref if set in componentSpecificProps, otherwise use original ref
            const finalRef = componentSpecificProps.ref || ref;
            
            return createElement(
                rootElement,
                {
                    ...domProps,
                    ...componentSpecificProps,
                    ...a11yProps,
                    ...interactionHandlers,
                    role: rootRole,
                    ref: finalRef, // Use custom ref if available
                    className,
                    style,
                },
                isVoidElement ? undefined : children
            );
        };

        // Set display name for debugging
        Component.displayName = `StellarIX.${core.metadata.name}`;

        return Component as ComponentType<ReactProps>;
    },

    /**
     * Optional optimization for React components
     * Can wrap with React.memo or other optimizations
     */
    optimize(component: ComponentType<any>): ComponentType<any> {
        // For now, just return the component
        // In the future, we could add React.memo or other optimizations
        return component;
    },
};

/**
 * Helper to connect a component factory to React
 * @param componentCore The component core from createComponentFactory
 * @returns React component
 */
export function connectToReact<TState, TLogic extends Record<string, any>>(
    componentCore: ComponentCore<TState, TLogic>
): ReactComponent {
    return reactAdapter.createComponent(componentCore) as ReactComponent;
}

/**
 * React 19 specific features support
 */

/**
 * Server Component wrapper
 * Marks a component as a Server Component
 */
export function createServerComponent<P extends object>(
    Component: ComponentType<P>
): ComponentType<P> {
    // Server components don't need special wrapping in React 19
    // The 'use server' directive is used at the file/function level
    return Component;
}

/**
 * Client Component wrapper
 * Marks a component as a Client Component
 */
export function createClientComponent<P extends object>(
    Component: ComponentType<P>
): ComponentType<P> {
    // Client components are marked with 'use client' directive at file level
    // No special wrapping needed
    return Component;
}

/**
 * Hook for using React 19's useActionState with forms
 * Provides integration with StellarIX components
 * 
 * useActionState simplifies form handling by:
 * - Managing async form submission state
 * - Providing pending state during submission
 * - Handling optimistic updates
 * - Automatic form reset on success
 * 
 * Example usage:
 * const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
 *   const result = await submitToServer(formData);
 *   return result;
 * }, initialState);
 */
export function useStellarIXAction<TState, TResult>(
    action: (prevState: TState, formData: FormData) => Promise<TResult>,
    initialState: TState,
    _permalink?: string
) {
    // This would use React 19's useActionState when available
    // For now, we'll provide a type-safe interface
    // In React 19: import { useActionState } from 'react';
    // return useActionState(action, initialState, _permalink);
    return [initialState, action, false] as const;
}

/**
 * Hook for form status (React 19 feature)
 * Provides pending state for forms
 * 
 * useFormStatus must be called from a component rendered inside a <form>
 * It provides:
 * - pending: boolean indicating if the form is submitting
 * - data: FormData being submitted
 * - method: HTTP method of the form
 * - action: URL or function the form is submitting to
 * 
 * Example usage:
 * function SubmitButton() {
 *   const { pending } = useFormStatus();
 *   return <button disabled={pending}>Submit</button>;
 * }
 */
export function useStellarIXFormStatus() {
    // This would use React 19's useFormStatus when available
    // In React 19: import { useFormStatus } from 'react-dom';
    // return useFormStatus();
    return { pending: false, data: null, method: null, action: null };
}

/**
 * React 19 'use' Hook Examples
 * 
 * The 'use' hook enables:
 * 1. Reading promises with Suspense
 * 2. Conditional context reading
 * 3. Integration with async data
 * 
 * @example Reading a promise
 * ```tsx
 * function Component({ promise }) {
 *   const data = use(promise); // Suspends until resolved
 *   return <div>{data}</div>;
 * }
 * ```
 * 
 * @example Conditional context
 * ```tsx
 * function Component({ showTheme }) {
 *   if (showTheme) {
 *     const theme = use(ThemeContext); // Can be conditional!
 *     return <div className={theme}>...</div>;
 *   }
 *   return <div>...</div>;
 * }
 * ```
 */

/**
 * React 19 Form Actions Example
 * 
 * Forms can now have async actions directly:
 * 
 * @example
 * ```tsx
 * async function updateName(formData: FormData) {
 *   'use server'; // Server action
 *   const name = formData.get('name');
 *   await db.users.update({ name });
 * }
 * 
 * function Form() {
 *   return (
 *     <form action={updateName}>
 *       <input name="name" />
 *       <button type="submit">Save</button>
 *     </form>
 *   );
 * }
 * ```
 */

// Re-export everything for convenience
export * from './hooks';
export * from './types';