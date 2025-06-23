import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    // Load all stories from our primitives packages
    '../packages/primitives/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    // Load any stories from adapters
    '../packages/adapters/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    // Load stories from themes package
    '../packages/themes/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    // Use react-docgen for better monorepo support
    reactDocgen: 'react-docgen',
    check: false,
  },
  docs: {
    autodocs: 'tag',
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
          '@stellarix/core': '/packages/core/src',
          '@stellarix/utils': '/packages/utils/src',
          '@stellarix/react': '/packages/adapters/react/src',
        },
      },
    };
  },
};

export default config;