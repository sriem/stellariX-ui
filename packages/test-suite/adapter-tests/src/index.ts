export * from './test-matrix';
export * from './adapter-validator';
export * from './performance';
export * from './component-loader';

export { default as runUnifiedTests } from '../test/unified.test';
export { default as runReactTests } from '../test/react.test';
export { default as runVueTests } from '../test/vue.test';
export { default as runSvelteTests } from '../test/svelte.test';
export { default as runSolidTests } from '../test/solid.test';