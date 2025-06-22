import * as react from 'react';
import { CSSProperties, ReactNode, ComponentType, RefAttributes } from 'react';
import { Store, LogicLayer, FrameworkAdapter, ComponentCore } from '@stellarix/core';

/**
 * React Adapter Types
 * Type definitions for React 19 adapter
 */

/**
 * React-specific props that all StellarIX components accept
 * Includes React 19 ref as prop pattern
 */
interface ReactProps {
    /**
     * CSS class name
     */
    className?: string;
    /**
     * Inline styles
     */
    style?: CSSProperties;
    /**
     * Child elements
     */
    children?: ReactNode;
    /**
     * React 19 ref prop (no forwardRef needed!)
     */
    ref?: any;
    /**
     * Additional data attributes
     */
    [key: `data-${string}`]: any;
    /**
     * Additional aria attributes
     */
    [key: `aria-${string}`]: any;
}
/**
 * Component factory result for React
 * Extends ComponentType for full React compatibility
 */
type ReactComponent<P = {}> = ComponentType<P & ReactProps>;
/**
 * React-specific logic hook result
 * Provides typed access to state and logic
 */
interface ReactLogic<S, E extends Record<string, any> = Record<string, any>> {
    /**
     * Current state value
     */
    state: S;
    /**
     * Handle an event
     */
    handleEvent: (event: keyof E | string, payload?: any) => void;
    /**
     * Get accessibility props for an element
     */
    getA11yProps: (elementId: string) => Record<string, any>;
    /**
     * Get interaction handlers for an element
     */
    getInteractionHandlers: (elementId: string) => Record<string, Function>;
}
/**
 * React 19 form action type
 * Used with useActionState hook
 */
type ReactFormAction<TState, TResult> = (prevState: TState, formData: FormData) => Promise<TResult> | TResult;
/**
 * React 19 server function type
 * Marked with 'use server' directive
 */
type ReactServerFunction<TArgs extends any[] = any[], TResult = any> = (...args: TArgs) => Promise<TResult>;
/**
 * React 19 client component props
 * Used for components marked with 'use client'
 */
interface ReactClientComponentProps extends ReactProps {
    /**
     * Server-side props passed to client
     */
    serverProps?: Record<string, any>;
}
/**
 * React 19 server component props
 * Used for components that run on the server
 */
interface ReactServerComponentProps {
    /**
     * Props that can be serialized and sent to client
     */
    [key: string]: any;
}
/**
 * Hook result for useActionState
 * Matches React 19's useActionState return type
 */
type ReactActionState<TState> = readonly [
    state: TState,
    formAction: (formData: FormData) => void,
    isPending: boolean
];
/**
 * Hook result for useFormStatus
 * Matches React 19's useFormStatus return type
 */
interface ReactFormStatus {
    pending: boolean;
    data: FormData | null;
    method: string | null;
    action: string | null;
}
/**
 * Ref type for React 19
 * Can be used directly as a prop
 */
type ReactRef<T> = RefAttributes<T>['ref'];
/**
 * State setter type
 * Used by useState and similar hooks
 */
type ReactStateSetter<T> = (value: T | ((prev: T) => T)) => void;
/**
 * Effect cleanup function
 * Returned by useEffect and similar hooks
 */
type ReactEffectCleanup = () => void;
/**
 * Memo dependencies
 * Used by useMemo, useCallback, useEffect
 */
type ReactDependencies = ReadonlyArray<any>;

/**
 * Hook to use a StellarIX store in React components
 * Provides reactive state updates with React 19 optimizations
 * @param store The store to use
 * @returns React state with value and setters
 */
declare function useStore<T>(store: Store<T>): T;
/**
 * Hook to use a StellarIX logic layer in React components
 * Provides access to event handlers and accessibility props
 * @param logicLayer The logic layer to use
 * @param store The state store (for reactive updates)
 * @returns React logic interface
 */
declare function useLogic<S, E extends Record<string, any> = Record<string, any>>(logicLayer: LogicLayer<S, E>, store: Store<S>): ReactLogic<S, E>;
/**
 * Hook for managing refs with React 19 patterns
 * Supports both callback refs and ref objects
 */
declare function useStellarIXRef<T extends HTMLElement = HTMLElement>(): readonly [react.RefObject<T | null>, (element: T | null) => void];
/**
 * Hook for managing focus with React 19 patterns
 * Provides focus management utilities
 */
declare function useStellarIXFocus<T extends HTMLElement = HTMLElement>(): {
    ref: (element: T | null) => void;
    isFocused: boolean;
    focus: () => void;
    blur: () => void;
};
/**
 * Hook for keyboard navigation
 * Provides keyboard event handling utilities
 */
declare function useStellarIXKeyboard(handlers: Record<string, (event: KeyboardEvent) => void>): {
    onKeyDown: (event: KeyboardEvent) => void;
};

/**
 * React 19 Adapter Implementation
 * State-of-the-art adapter using latest React 19 patterns
 */

/**
 * React 19 adapter for StellarIX UI
 * Implements the ultra-generic adapter interface
 */
declare const reactAdapter: FrameworkAdapter<ComponentType<any>>;
/**
 * Helper to connect a component factory to React
 * @param componentCore The component core from createComponentFactory
 * @returns React component
 */
declare function connectToReact<TState, TLogic extends Record<string, any>>(componentCore: ComponentCore<TState, TLogic>): ReactComponent;
/**
 * React 19 specific features support
 */
/**
 * Server Component wrapper
 * Marks a component as a Server Component
 */
declare function createServerComponent<P extends object>(Component: ComponentType<P>): ComponentType<P>;
/**
 * Client Component wrapper
 * Marks a component as a Client Component
 */
declare function createClientComponent<P extends object>(Component: ComponentType<P>): ComponentType<P>;
/**
 * Hook for using React 19's useActionState with forms
 * Provides integration with StellarIX components
 */
declare function useStellarIXAction<TState, TResult>(action: (prevState: TState, formData: FormData) => Promise<TResult>, initialState: TState, _permalink?: string): readonly [TState, (prevState: TState, formData: FormData) => Promise<TResult>, false];
/**
 * Hook for form status (React 19 feature)
 * Provides pending state for forms
 */
declare function useStellarIXFormStatus(): {
    pending: boolean;
};

/**
 * StellarIX UI React Adapter
 * Adapts framework-agnostic components to React
 */

declare const VERSION = "0.0.1";

export { type ReactActionState, type ReactClientComponentProps, type ReactComponent, type ReactDependencies, type ReactEffectCleanup, type ReactFormAction, type ReactFormStatus, type ReactLogic, type ReactProps, type ReactRef, type ReactServerComponentProps, type ReactServerFunction, type ReactStateSetter, VERSION, connectToReact, createClientComponent, createServerComponent, reactAdapter, useLogic, useStellarIXAction, useStellarIXFocus, useStellarIXFormStatus, useStellarIXKeyboard, useStellarIXRef, useStore };
