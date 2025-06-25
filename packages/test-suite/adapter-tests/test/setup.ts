import { vi } from 'vitest';

beforeEach(() => {
  vi.clearAllMocks();
});

if (typeof global !== 'undefined' && !global.performance) {
  global.performance = {
    now: () => Date.now(),
    memory: {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0
    }
  } as any;
}

if (typeof global !== 'undefined' && !global.requestAnimationFrame) {
  global.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 16) as any;
  global.cancelAnimationFrame = (id: number) => clearTimeout(id);
}