/**
 * React 19 Adapter Implementation
 * State-of-the-art adapter using latest React 19 patterns
 */

import { createElement, useMemo, type ComponentType } from 'react';
import type {
    ComponentCore,
    FrameworkAdapter,
} from '@stellarix/core';
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
        core: ComponentCore<TState, TLogic>
    ): ComponentType<ReactProps> {
        // Create the React component using function component pattern
        // React 19 allows ref as a regular prop - no forwardRef needed!
        const Component = function StellarIXComponent(props: ReactProps & { ref?: any }) {
            // Extract ref as a regular prop (React 19 feature)
            const { ref, className, style, children, ...restProps } = props;
            
            // Use custom hooks to connect to core state and logic
            const state = useStore(core.state);
            const logic = useLogic(core.logic, core.state);

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
            const interactionHandlers = logic.getInteractionHandlers('root');

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
            if (core.metadata.name === 'Input' && rootElement === 'input') {
                // Get options from core if available
                const options = (core as any).options || {};
                
                // Map state properties to DOM attributes
                if ('type' in state) componentSpecificProps.type = state.type;
                if ('value' in state) componentSpecificProps.value = state.value;
                if ('disabled' in state && state.disabled) componentSpecificProps.disabled = true;
                if ('readonly' in state && state.readonly) componentSpecificProps.readOnly = true;
                if ('required' in state && state.required) componentSpecificProps.required = true;
                
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
                if (restProps.placeholder) componentSpecificProps.placeholder = restProps.placeholder;
                if (restProps.name) componentSpecificProps.name = restProps.name;
                if (restProps.id) componentSpecificProps.id = restProps.id;
                if (restProps.autoComplete || restProps.autocomplete) {
                    componentSpecificProps.autoComplete = restProps.autoComplete || restProps.autocomplete;
                }
                if (restProps.minLength) componentSpecificProps.minLength = restProps.minLength;
                if (restProps.maxLength) componentSpecificProps.maxLength = restProps.maxLength;
                if (restProps.min) componentSpecificProps.min = restProps.min;
                if (restProps.max) componentSpecificProps.max = restProps.max;
                if (restProps.step) componentSpecificProps.step = restProps.step;
                if (restProps.pattern) componentSpecificProps.pattern = restProps.pattern;
            }
            
            // Void elements (input, br, hr, etc.) can't have children
            const isVoidElement = ['input', 'br', 'hr', 'img', 'area', 'base', 'col', 'embed', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(rootElement);
            
            return createElement(
                rootElement,
                {
                    ...domProps,
                    ...componentSpecificProps,
                    ...a11yProps,
                    ...interactionHandlers,
                    role: rootRole,
                    ref, // Direct ref prop (React 19)
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
 */
export function useStellarIXAction<TState, TResult>(
    action: (prevState: TState, formData: FormData) => Promise<TResult>,
    initialState: TState,
    _permalink?: string
) {
    // This would use React 19's useActionState when available
    // For now, we'll provide a type-safe interface
    return [initialState, action, false] as const;
}

/**
 * Hook for form status (React 19 feature)
 * Provides pending state for forms
 */
export function useStellarIXFormStatus() {
    // This would use React 19's useFormStatus when available
    return { pending: false };
}

// Re-export everything for convenience
export * from './hooks';
export * from './types';