import { describe, it, expect } from 'vitest';

describe('Basic Test Suite Setup', () => {
  it('should pass a simple test', () => {
    expect(true).toBe(true);
  });
  
  it('should have access to adapters', async () => {
    const { reactAdapter } = await import('@stellarix-ui/react');
    const { vueAdapter } = await import('@stellarix-ui/vue');
    const { svelteAdapter } = await import('@stellarix-ui/svelte');
    const { solidAdapter } = await import('@stellarix-ui/solid');
    
    expect(reactAdapter).toBeDefined();
    expect(reactAdapter.name).toBe('react');
    
    expect(vueAdapter).toBeDefined();
    expect(vueAdapter.name).toBe('vue');
    
    expect(svelteAdapter).toBeDefined();
    expect(svelteAdapter.name).toBe('svelte');
    
    expect(solidAdapter).toBeDefined();
    expect(solidAdapter.name).toBe('solid');
  });
  
  it('should have access to components', async () => {
    const buttonModule = await import('@stellarix-ui/button');
    const createButton = buttonModule.createButtonWithImplementation || buttonModule.default;
    const buttonCore = createButton();
    
    expect(buttonCore).toBeDefined();
    expect(buttonCore.metadata.name).toBe('Button');
    expect(buttonCore.state).toBeDefined();
    expect(buttonCore.logic).toBeDefined();
  });
});