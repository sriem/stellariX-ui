/**
 * React Adapter Implementation
 */

import React, { createElement, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    Store,
    LogicLayer,
    FrameworkAdapter,
    ComponentFactory
} from '@stellarix/core';
import { useStore, useLogic } from './hooks';
import { ReactComponent, ReactProps } from './types';

/**
 * React adapter for StellarIX UI
 */
export const reactAdapter: FrameworkAdapter<HTMLElement> = {
    adaptState<T>(store: Store<T>) {
        return (Component: React.FC<{ state: T }>) => {
            return (props: any) => {
                const state = useStore(store);
                return createElement(Component, { ...props, state: state.value });
            };
        };
    },

    adaptLogic<S, E>(logicLayer: LogicLayer<S, E>, store: Store<S>) {
        return (Component: React.FC<{ logic: ReturnType<typeof useLogic<S, E>> }>) => {
            return (props: any) => {
                const logic = useLogic(logicLayer, store);
                return createElement(Component, { ...props, logic });
            };
        };
    },

    renderToHost(node: React.ReactNode, hostElement: HTMLElement) {
        if (typeof document !== 'undefined') {
            createPortal(node, hostElement);
        }
    },

    createComponent<S, E>(
        state: Store<S>,
        logic: LogicLayer<S, E>,
        render: (props: {
            state: S;
            trigger: <K extends keyof E>(event: K, payload?: E[K]) => void;
            getA11yProps: (elementId: string) => Record<string, any>;
            getHandlers: (elementId: string) => Record<string, (event: any) => void>;
        } & ReactProps) => React.ReactNode
    ): ReactComponent {
        const Component = (props: ReactProps) => {
            const stateHook = useStore(state);
            const logicHook = useLogic(logic, state);

            return render({
                ...props,
                state: stateHook.value,
                trigger: logicHook.trigger,
                getA11yProps: logicHook.getA11yProps,
                getHandlers: logicHook.getHandlers,
            });
        };

        Component.displayName = 'StellarIX.Component';

        return Component as ReactComponent;
    },
};

/**
 * Connect a component factory to React
 * @param factory Component factory
 * @returns React component
 */
export function connectToReact<S, E, O>(
    factory: ComponentFactory<S, E, O>
): ReactComponent {
    return factory.connect(reactAdapter);
} 