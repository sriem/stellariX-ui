/**
 * React Adapter Types
 * Type definitions for React 19 adapter
 */

import type { CSSProperties, ReactNode, ComponentType, RefAttributes } from 'react';

/**
 * React-specific props that all StellarIX components accept
 * Includes React 19 ref as prop pattern
 */
export interface ReactProps {
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
export type ReactComponent<P = {}> = ComponentType<P & ReactProps>;

/**
 * React-specific logic hook result
 * Provides typed access to logic methods (state is managed separately)
 */
export interface ReactLogic<E extends Record<string, any> = Record<string, any>> {
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
export type ReactFormAction<TState, TResult> = (
    prevState: TState,
    formData: FormData
) => Promise<TResult> | TResult;

/**
 * React 19 server function type
 * Marked with 'use server' directive
 */
export type ReactServerFunction<TArgs extends any[] = any[], TResult = any> = (
    ...args: TArgs
) => Promise<TResult>;

/**
 * React 19 client component props
 * Used for components marked with 'use client'
 */
export interface ReactClientComponentProps extends ReactProps {
    /**
     * Server-side props passed to client
     */
    serverProps?: Record<string, any>;
}

/**
 * React 19 server component props
 * Used for components that run on the server
 */
export interface ReactServerComponentProps {
    /**
     * Props that can be serialized and sent to client
     */
    [key: string]: any;
}

/**
 * Hook result for useActionState
 * Matches React 19's useActionState return type
 */
export type ReactActionState<TState> = readonly [
    state: TState,
    formAction: (formData: FormData) => void,
    isPending: boolean
];

/**
 * Hook result for useFormStatus
 * Matches React 19's useFormStatus return type
 */
export interface ReactFormStatus {
    pending: boolean;
    data: FormData | null;
    method: string | null;
    action: string | null;
}

/**
 * Ref type for React 19
 * Can be used directly as a prop
 */
export type ReactRef<T> = RefAttributes<T>['ref'];

/**
 * State setter type
 * Used by useState and similar hooks
 */
export type ReactStateSetter<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Effect cleanup function
 * Returned by useEffect and similar hooks
 */
export type ReactEffectCleanup = () => void;

/**
 * Memo dependencies
 * Used by useMemo, useCallback, useEffect
 */
export type ReactDependencies = ReadonlyArray<any>;