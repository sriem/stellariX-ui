/**
 * React Adapter Types
 */

import React from 'react';
import { Store, LogicLayer } from '@stellarix/core';

/**
 * React-specific props
 */
export interface ReactProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

/**
 * Component factory result for React
 */
export interface ReactComponent<P = {}> extends React.FC<P & ReactProps> {
    displayName: string;
}

/**
 * React-specific state hook result
 */
export interface ReactState<T> {
    /**
     * Current state value
     */
    value: T;

    /**
     * Update state
     */
    set: (updater: T | ((prev: T) => T)) => void;

    /**
     * Subscribe to state changes
     */
    subscribe: (callback: (state: T) => void) => () => void;
}

/**
 * React-specific logic hook result
 */
export interface ReactLogic<S, E = Record<string, any>> {
    /**
     * State object
     */
    state: ReactState<S>;

    /**
     * Trigger an event
     */
    trigger: <K extends keyof E>(event: K, payload?: E[K]) => void;

    /**
     * Get accessibility props for an element
     */
    getA11yProps: (elementId: string) => Record<string, any>;

    /**
     * Get event handlers for an element
     */
    getHandlers: (elementId: string) => Record<string, (event: any) => void>;
} 