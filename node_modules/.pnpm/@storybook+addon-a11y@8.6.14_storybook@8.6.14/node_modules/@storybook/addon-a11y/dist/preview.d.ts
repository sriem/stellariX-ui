import { AfterEach } from 'storybook/internal/types';
import { ElementContext, Spec, RunOptions } from 'axe-core';

type A11yTest = 'off' | 'todo' | 'error';
interface A11yParameters {
    element?: ElementContext;
    config?: Spec;
    options?: RunOptions;
    /** @deprecated Use globals.a11y.manual instead */
    manual?: boolean;
    disable?: boolean;
    test?: A11yTest;
}

declare const experimental_afterEach: AfterEach<any>;
declare const initialGlobals: {
    a11y: {
        manual: boolean;
    };
};
declare const parameters: {
    a11y: A11yParameters;
};

export { experimental_afterEach, initialGlobals, parameters };
