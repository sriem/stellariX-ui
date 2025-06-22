module.exports = {
    stories: [
        '../packages/primitives/**/*.stories.@(js|jsx|ts|tsx)',
        '../packages/adapters/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
    ],
    framework: {
        name: '@storybook/react',
        options: {}
    },
    docs: {
        autodocs: 'tag'
    },
    typescript: {
        reactDocgen: 'react-docgen-typescript',
    }
}; 