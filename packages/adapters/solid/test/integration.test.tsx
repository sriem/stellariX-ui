import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, cleanup } from '@solidjs/testing-library';
import { createSignal, createEffect } from 'solid-js';
import { isServer } from 'solid-js/web';
import { createStore, createComponentFactory, createLogicLayer } from '@stellarix-ui/core';
import { solidAdapter } from '../src/adapter';

describe('Solid.js Adapter Integration Tests', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Full component lifecycle', () => {
    it('should handle complete component lifecycle', async () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const onMount = vi.fn();
      const onCleanup = vi.fn();
      
      const testFactory = createComponentFactory({
        name: 'LifecycleTest',
        createInitialState: () => ({ mounted: false }),
        createLogic: (state) => {
          const logic = createLogicLayer({
            handlers: {
              mount: () => {
                onMount();
                state.setState({ mounted: true });
              }
            },
            getA11yProps: () => ({}),
            getInteractionHandlers: () => ({})
          });
          
          logic.cleanup = onCleanup;
          return logic;
        },
        metadata: {
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: [], required: [], custom: {} },
          structure: { elements: { root: { type: 'div' } } },
        },
      });

      const core = testFactory();
      const Component = solidAdapter.createComponent(core);
      
      const { unmount, getByText } = render(() => {
        createEffect(() => {
          core.logic.handleEvent('mount');
        });
        
        return <Component>{core.state.getState().mounted ? 'Mounted' : 'Not Mounted'}</Component>;
      });
      
      await waitFor(() => {
        expect(onMount).toHaveBeenCalledTimes(1);
        expect(getByText('Mounted')).toBeInTheDocument();
      });
      
      unmount();
      expect(onCleanup).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reactive state synchronization', () => {
    it('should sync multiple state changes efficiently', async () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const factory = createComponentFactory({
        name: 'Counter',
        createInitialState: () => ({ 
          count: 0, 
          doubled: 0,
          history: [] as number[]
        }),
        createLogic: (state) => createLogicLayer({
          handlers: {
            increment: () => {
              const current = state.getState();
              state.setState({
                count: current.count + 1,
                doubled: (current.count + 1) * 2,
                history: [...current.history, current.count + 1]
              });
            },
            reset: () => {
              state.setState({ count: 0, doubled: 0, history: [] });
            }
          },
          getA11yProps: () => ({}),
          getInteractionHandlers: () => ({})
        }),
        metadata: {
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: ['click'], required: [], custom: {} },
          structure: { elements: { root: { type: 'div' } } },
        },
      });

      const core = factory();
      const Component = solidAdapter.createComponent(core);
      
      const TestApp = () => {
        const [localCount, setLocalCount] = createSignal(0);
        
        createEffect(() => {
          const state = core.state.getState();
          setLocalCount(state.count);
        });
        
        return (
          <div>
            <Component>
              <div>Count: {core.state.getState().count}</div>
              <div>Doubled: {core.state.getState().doubled}</div>
              <div>History: {core.state.getState().history.join(', ')}</div>
            </Component>
            <div>Local: {localCount()}</div>
            <button onClick={() => core.logic.handleEvent('increment')}>Increment</button>
            <button onClick={() => core.logic.handleEvent('reset')}>Reset</button>
          </div>
        );
      };
      
      const { getByText } = render(() => <TestApp />);
      
      expect(getByText('Count: 0')).toBeInTheDocument();
      expect(getByText('Doubled: 0')).toBeInTheDocument();
      expect(getByText('Local: 0')).toBeInTheDocument();
      
      fireEvent.click(getByText('Increment'));
      await waitFor(() => {
        expect(getByText('Count: 1')).toBeInTheDocument();
        expect(getByText('Doubled: 2')).toBeInTheDocument();
        expect(getByText('History: 1')).toBeInTheDocument();
        expect(getByText('Local: 1')).toBeInTheDocument();
      });
      
      fireEvent.click(getByText('Increment'));
      fireEvent.click(getByText('Increment'));
      
      await waitFor(() => {
        expect(getByText('Count: 3')).toBeInTheDocument();
        expect(getByText('Doubled: 6')).toBeInTheDocument();
        expect(getByText('History: 1, 2, 3')).toBeInTheDocument();
        expect(getByText('Local: 3')).toBeInTheDocument();
      });
      
      fireEvent.click(getByText('Reset'));
      await waitFor(() => {
        expect(getByText('Count: 0')).toBeInTheDocument();
        expect(getByText('Doubled: 0')).toBeInTheDocument();
        expect(getByText('History:')).toBeInTheDocument();
        expect(getByText('Local: 0')).toBeInTheDocument();
      });
    });
  });

  describe('Complex component interactions', () => {
    it('should handle form with multiple inputs', async () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const onSubmit = vi.fn();
      
      const formFactory = createComponentFactory({
        name: 'Form',
        createInitialState: () => ({
          username: '',
          email: '',
          agreed: false,
          errors: {} as Record<string, string>
        }),
        createLogic: (state) => createLogicLayer({
          handlers: {
            updateUsername: (e: Event) => {
              const value = (e.target as HTMLInputElement).value;
              state.setState(prev => ({ ...prev, username: value }));
            },
            updateEmail: (e: Event) => {
              const value = (e.target as HTMLInputElement).value;
              state.setState(prev => ({ ...prev, email: value }));
            },
            toggleAgreed: () => {
              state.setState(prev => ({ ...prev, agreed: !prev.agreed }));
            },
            submit: (e: Event) => {
              e.preventDefault();
              const current = state.getState();
              const errors: Record<string, string> = {};
              
              if (!current.username) errors.username = 'Username is required';
              if (!current.email) errors.email = 'Email is required';
              if (!current.agreed) errors.agreed = 'You must agree to terms';
              
              if (Object.keys(errors).length === 0) {
                onSubmit(current);
              } else {
                state.setState(prev => ({ ...prev, errors }));
              }
            }
          },
          getA11yProps: () => ({}),
          getInteractionHandlers: () => ({})
        }),
        metadata: {
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: ['submit', 'input', 'change'], required: [], custom: {} },
          structure: { elements: { root: { type: 'form' } } },
        },
      });

      const core = formFactory();
      const Form = solidAdapter.createComponent(core);
      
      const inputFactory = createComponentFactory({
        name: 'Input',
        createInitialState: (options: { value?: string }) => ({ 
          value: options.value || '',
          type: 'text'
        }),
        createLogic: () => createLogicLayer({ handlers: {}, getA11yProps: () => ({}), getInteractionHandlers: () => ({}) }),
        metadata: {
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: ['input'], required: [], custom: {} },
          structure: { elements: { root: { type: 'input' } } },
        },
      });

      const checkboxFactory = createComponentFactory({
        name: 'Checkbox',
        createInitialState: (options: { checked?: boolean }) => ({ 
          checked: options.checked || false 
        }),
        createLogic: () => createLogicLayer({ handlers: {}, getA11yProps: () => ({}), getInteractionHandlers: () => ({}) }),
        metadata: {
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: ['change'], required: [], custom: {} },
          structure: { elements: { root: { type: 'input' } } },
        },
      });

      const usernameInput = inputFactory({ value: core.state.getState().username });
      const emailInput = inputFactory({ value: core.state.getState().email });
      const checkboxInput = checkboxFactory({ checked: core.state.getState().agreed });
      
      const UsernameInput = solidAdapter.createComponent(usernameInput);
      const EmailInput = solidAdapter.createComponent(emailInput);
      const Checkbox = solidAdapter.createComponent(checkboxInput);
      
      const TestForm = () => {
        const formState = core.state.getState();
        
        return (
          <Form onSubmit={(e: Event) => core.logic.handleEvent('submit', e)}>
            <div>
              <label htmlFor="username">Username</label>
              <UsernameInput 
                id="username"
                value={formState.username}
                onInput={(e: Event) => core.logic.handleEvent('updateUsername', e)}
              />
              {formState.errors.username && <span>{formState.errors.username}</span>}
            </div>
            
            <div>
              <label htmlFor="email">Email</label>
              <EmailInput 
                id="email"
                value={formState.email}
                onInput={(e: Event) => core.logic.handleEvent('updateEmail', e)}
              />
              {formState.errors.email && <span>{formState.errors.email}</span>}
            </div>
            
            <div>
              <Checkbox 
                id="agree"
                checked={formState.agreed}
                onChange={() => core.logic.handleEvent('toggleAgreed')}
              />
              <label htmlFor="agree">I agree to terms</label>
              {formState.errors.agreed && <span>{formState.errors.agreed}</span>}
            </div>
            
            <button type="submit">Submit</button>
          </Form>
        );
      };
      
      const { getByLabelText, getByText, queryByText } = render(() => <TestForm />);
      
      fireEvent.click(getByText('Submit'));
      
      await waitFor(() => {
        expect(queryByText('Username is required')).toBeInTheDocument();
        expect(queryByText('Email is required')).toBeInTheDocument();
        expect(queryByText('You must agree to terms')).toBeInTheDocument();
      });
      
      fireEvent.input(getByLabelText('Username'), { target: { value: 'testuser' } });
      fireEvent.input(getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.click(getByLabelText('I agree to terms'));
      
      fireEvent.click(getByText('Submit'));
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          username: 'testuser',
          email: 'test@example.com',
          agreed: true,
          errors: {}
        });
      });
    });
  });

  describe('Performance optimizations', () => {
    it('should batch multiple state updates efficiently', async () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      let renderCount = 0;
      
      const factory = createComponentFactory({
        name: 'BatchTest',
        createInitialState: () => ({
          a: 0,
          b: 0,
          c: 0,
          sum: 0
        }),
        createLogic: (state) => createLogicLayer({
          handlers: {
            updateAll: () => {
              state.setState(prev => ({
                a: prev.a + 1,
                b: prev.b + 2,
                c: prev.c + 3,
                sum: prev.a + prev.b + prev.c + 6
              }));
            }
          },
          getA11yProps: () => ({}),
          getInteractionHandlers: () => ({})
        }),
        metadata: {
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: [], required: [], custom: {} },
          structure: { elements: { root: { type: 'div' } } },
        },
      });

      const core = factory();
      const Component = solidAdapter.createComponent(core);
      
      const TestComponent = () => {
        renderCount++;
        const state = core.state.getState();
        
        return (
          <Component>
            <div>A: {state.a}, B: {state.b}, C: {state.c}, Sum: {state.sum}</div>
            <div>Renders: {renderCount}</div>
          </Component>
        );
      };
      
      const { getByText } = render(() => (
        <div>
          <TestComponent />
          <button onClick={() => core.logic.handleEvent('updateAll')}>Update All</button>
        </div>
      ));
      
      const initialRenders = renderCount;
      
      fireEvent.click(getByText('Update All'));
      
      await waitFor(() => {
        expect(getByText('A: 1, B: 2, C: 3, Sum: 6')).toBeInTheDocument();
      });
      
      expect(renderCount).toBeLessThanOrEqual(initialRenders + 2);
    });
  });
});