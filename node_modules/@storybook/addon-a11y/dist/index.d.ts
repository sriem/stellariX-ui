import * as core_dist_types from 'storybook/internal/types';
import { ElementContext, Spec, RunOptions } from 'axe-core';

declare const PARAM_KEY = "a11y";

interface Setup {
    element?: ElementContext;
    config: Spec;
    options: RunOptions;
}

interface A11yParameters {
    /**
     * Accessibility configuration
     *
     * @see https://storybook.js.org/docs/writing-tests/accessibility-testing
     */
    a11y?: {
        /** Manual configuration for specific elements */
        element?: ElementContext;
        /**
         * Configuration for the accessibility rules
         *
         * @see https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
         */
        config?: Spec;
        /**
         * Options for the accessibility checks To learn more about the available options,
         *
         * @see https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
         */
        options?: RunOptions;
        /** Remove the addon panel and disable the addon's behavior */
        disable?: boolean;
    };
}

declare const _default: () => core_dist_types.ProjectAnnotations<core_dist_types.Renderer>;

export { A11yParameters, PARAM_KEY, Setup, _default as default };
