/**
 * Button Component
 * A framework-agnostic button component
 */
import { ComponentFactory } from '@stellarix/core';
import { ButtonState, ButtonEvents, ButtonOptions } from './types';
export * from './types';
/**
 * Creates a button component
 * @param options Button options
 * @returns Button component factory
 */
export declare function createButton(options?: ButtonOptions): ComponentFactory<ButtonState, ButtonEvents, ButtonOptions>;
//# sourceMappingURL=index.d.ts.map