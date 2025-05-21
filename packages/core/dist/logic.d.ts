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
export declare function createLogicLayer<StateType, EventsType extends Record<string, any> = Record<string, any>>(store: Store<StateType>, handlers: {
    [K in keyof EventsType]?: (state: StateType, payload: EventsType[K]) => Partial<StateType> | null;
}, a11yConfig?: {
    [elementId: string]: (state: StateType) => Record<string, any>;
}, interactionConfig?: {
    [elementId: string]: {
        [eventName: string]: (state: StateType, event: any) => keyof EventsType | null;
    };
}): LogicLayer<StateType, EventsType>;
//# sourceMappingURL=logic.d.ts.map