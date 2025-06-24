import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from '@storybook/react-vite';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: [
    // Load all stories from our primitives packages
    '../packages/primitives/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../packages/primitives/**/stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    // Load any stories from adapters
    '../packages/adapters/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    // Load stories from themes package
    '../packages/themes/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    // Explicitly exclude templates directory
    '!../templates/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],

  addons: [getAbsolutePath("@storybook/addon-a11y"), getAbsolutePath("@storybook/addon-docs")],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  typescript: {
    // Use react-docgen for better monorepo support
    reactDocgen: 'react-docgen',
    check: false,
  },

  // Core configuration
  core: {
    disableTelemetry: true,
  },

  // Vite configuration
  async viteFinal(config) {
    // Ensure proper module resolution for our monorepo
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@stellarix-ui/core': '/packages/core/src',
          '@stellarix-ui/utils': '/packages/utils/src',
          '@stellarix-ui/react': '/packages/adapters/react/src',
        },
      },
    };
  }
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}