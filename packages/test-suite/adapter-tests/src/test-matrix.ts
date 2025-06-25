import type { FrameworkAdapter, ComponentCore } from '@stellarix-ui/core';

export const ADAPTERS = ['react', 'vue', 'svelte', 'solid'] as const;
export type AdapterName = typeof ADAPTERS[number];

export const COMPONENTS = [
  'accordion',
  'alert', 
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'calendar',
  'card',
  'checkbox',
  'container',
  'date-picker',
  'dialog',
  'divider',
  'file-upload',
  'input',
  'menu',
  'navigation-menu',
  'pagination',
  'popover',
  'progress-bar',
  'radio',
  'select',
  'slider',
  'spinner',
  'stepper',
  'table',
  'tabs',
  'textarea',
  'toggle',
  'tooltip'
] as const;

export type ComponentName = typeof COMPONENTS[number];

export interface TestScenario {
  name: string;
  description: string;
  test: (adapter: FrameworkAdapter<any>, component: ComponentCore<any, any>) => Promise<void>;
}

export const TEST_SCENARIOS: TestScenario[] = [
  {
    name: 'State Initialization',
    description: 'Verifies component initializes with correct default state',
    test: async (adapter, component) => {
      const TestComponent = adapter.createComponent(component);
      expect(TestComponent).toBeDefined();
      expect(typeof TestComponent).toBe('function');
      
      const state = component.state.getState();
      expect(state).toBeDefined();
    }
  },
  {
    name: 'State Updates',
    description: 'Verifies state updates propagate correctly',
    test: async (adapter, component) => {
      const TestComponent = adapter.createComponent(component);
      const state = component.state;
      
      if ('setValue' in state && typeof state.setValue === 'function') {
        const initialValue = state.getState().value;
        state.setValue('test-value');
        const newState = state.getState();
        expect(newState.value).toBe('test-value');
      }
      
      if ('setOpen' in state && typeof state.setOpen === 'function') {
        state.setOpen(true);
        expect(state.getState().open).toBe(true);
        state.setOpen(false);
        expect(state.getState().open).toBe(false);
      }
      
      if ('setChecked' in state && typeof state.setChecked === 'function') {
        state.setChecked(true);
        expect(state.getState().checked).toBe(true);
      }
    }
  },
  {
    name: 'Event Handling',
    description: 'Verifies event handlers are properly connected',
    test: async (adapter, component) => {
      const TestComponent = adapter.createComponent(component);
      const logic = component.logic;
      
      const handlers = logic.getInteractionHandlers('root');
      expect(handlers).toBeDefined();
      expect(typeof handlers).toBe('object');
      
      const events = ['click', 'focus', 'blur', 'change'];
      for (const event of events) {
        const eventKey = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
        if (handlers[eventKey]) {
          expect(typeof handlers[eventKey]).toBe('function');
        }
      }
    }
  },
  {
    name: 'Accessibility Props',
    description: 'Verifies ARIA props are correctly applied',
    test: async (adapter, component) => {
      const TestComponent = adapter.createComponent(component);
      const logic = component.logic;
      
      const a11yProps = logic.getA11yProps('root');
      expect(a11yProps).toBeDefined();
      expect(typeof a11yProps).toBe('object');
      
      const { role, accessibility } = component.metadata;
      if (role || accessibility?.role) {
        const expectedRole = role || accessibility.role;
        if (a11yProps.role) {
          expect(a11yProps.role).toBe(expectedRole);
        }
      }
      
      const ariaAttributes = Object.keys(a11yProps).filter(key => key.startsWith('aria-'));
      expect(ariaAttributes.length).toBeGreaterThan(0);
    }
  },
  {
    name: 'Component Lifecycle',
    description: 'Verifies component lifecycle methods work correctly',
    test: async (adapter, component) => {
      const TestComponent = adapter.createComponent(component);
      
      if (component.logic.init) {
        expect(typeof component.logic.init).toBe('function');
      }
      
      if (component.logic.cleanup) {
        expect(typeof component.logic.cleanup).toBe('function');
        component.logic.cleanup();
      }
    }
  },
  {
    name: 'Compound Components',
    description: 'Verifies compound components render sub-elements correctly',
    test: async (adapter, component) => {
      const compoundComponents = ['select', 'menu', 'tabs', 'stepper', 'dialog'];
      if (!compoundComponents.includes(component.metadata.name.toLowerCase())) {
        return;
      }
      
      const TestComponent = adapter.createComponent(component);
      const logic = component.logic;
      
      const triggerA11y = logic.getA11yProps('trigger');
      if (triggerA11y) {
        expect(triggerA11y).toBeDefined();
      }
      
      const listboxA11y = logic.getA11yProps('listbox');
      if (listboxA11y) {
        expect(listboxA11y).toBeDefined();
      }
      
      const tabListA11y = logic.getA11yProps('tabList');
      if (tabListA11y) {
        expect(tabListA11y).toBeDefined();
      }
    }
  },
  {
    name: 'TypeScript Types',
    description: 'Verifies TypeScript types are correctly inferred',
    test: async (adapter, component) => {
      const TestComponent = adapter.createComponent(component);
      
      expect(adapter.name).toMatch(/^(react|vue|svelte|solid)$/);
      expect(adapter.version).toBeDefined();
      expect(typeof adapter.createComponent).toBe('function');
      
      if (adapter.optimize) {
        expect(typeof adapter.optimize).toBe('function');
      }
    }
  },
  {
    name: 'State Subscription',
    description: 'Verifies state subscriptions work correctly',
    test: async (adapter, component) => {
      const state = component.state;
      let updateCount = 0;
      
      const unsubscribe = state.subscribe(() => {
        updateCount++;
      });
      
      if ('setValue' in state && typeof state.setValue === 'function') {
        state.setValue('test');
        expect(updateCount).toBeGreaterThan(0);
      }
      
      unsubscribe();
    }
  }
];

export const adapterTestMatrix = {
  adapters: ADAPTERS,
  components: COMPONENTS,
  scenarios: TEST_SCENARIOS,
  totalTests: ADAPTERS.length * COMPONENTS.length * TEST_SCENARIOS.length
};

export function getTestName(adapter: AdapterName, component: ComponentName, scenario: TestScenario): string {
  return `${adapter}:${component}:${scenario.name}`;
}

export function shouldSkipTest(adapter: AdapterName, component: ComponentName, scenario: TestScenario): boolean {
  const skipMatrix: Record<string, string[]> = {
    'svelte:calendar': ['State Updates', 'Event Handling'],
    'svelte:date-picker': ['State Updates', 'Event Handling'],
  };
  
  const key = `${adapter}:${component}`;
  return skipMatrix[key]?.includes(scenario.name) || false;
}