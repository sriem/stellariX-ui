/**
 * Logic Layer
 * Contains behavioral logic and accessibility requirements
 */

import { Store } from './state';

export interface LogicLayer<StateType, EventsType = Record<string, any>> {
    handleEvent: (event: keyof EventsType, payload?: any) => void;
    getA11yProps: (elementId: string) => Record<string, any>;
    getInteractionHandlers: (elementId: string) => Record<string, (event: any) => void>;
}

/**
 * Creates a logic layer connected to a state store
 * @param store The state store to connect to
 * @param handlers Event handlers mapping
 * @returns A logic layer object
 */
export function createLogicLayer<
    StateType,
    EventsType extends Record<string, any> = Record<string, any>
>(
    store: Store<StateType>,
    handlers: {
        [K in keyof EventsType]?: (state: StateType, payload: EventsType[K]) => Partial<StateType> | null;
    },
    a11yConfig: {
        [elementId: string]: (state: StateType) => Record<string, any>;
    } = {},
    interactionConfig: {
        [elementId: string]: {
            [eventName: string]: (state: StateType, event: any) => keyof EventsType | null;
        };
    } = {}
): LogicLayer<StateType, EventsType> {

    const handleEvent = (event: keyof EventsType, payload?: any) => {
        const handler = handlers[event];
        if (handler) {
            const currentState = store.getState();
            const stateUpdate = handler(currentState, payload);

            if (stateUpdate) {
                store.setState(prev => ({
                    ...prev,
                    ...stateUpdate,
                }));
            }
        }
    };

    const getA11yProps = (elementId: string) => {
        const a11yGenerator = a11yConfig[elementId];
        if (a11yGenerator) {
            return a11yGenerator(store.getState());
        }
        return {};
    };

    const getInteractionHandlers = (elementId: string) => {
        const elementConfig = interactionConfig[elementId] || {};
        const result: Record<string, (event: any) => void> = {};

        Object.entries(elementConfig).forEach(([eventName, eventHandler]) => {
            result[eventName] = (event: any) => {
                const eventType = eventHandler(store.getState(), event);
                if (eventType) {
                    handleEvent(eventType, event);
                }
            };
        });

        return result;
    };

    return {
        handleEvent,
        getA11yProps,
        getInteractionHandlers,
    };
} 