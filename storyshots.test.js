import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import path from 'path';

initStoryshots({
    suite: 'Visual Regression Tests',
    test: imageSnapshot({
        storybookUrl: `file://${path.resolve(__dirname, './storybook-static')}`,
        // Set configuration options for image snapshots if needed
        getMatchOptions: () => ({
            failureThreshold: 0.05, // Threshold for what is considered a match (lower is stricter)
            failureThresholdType: 'percent',
        }),
    }),
}); 