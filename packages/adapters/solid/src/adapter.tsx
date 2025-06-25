import { 
  createSignal, 
  createEffect, 
  createMemo, 
  onMount, 
  onCleanup,
  Show,
  For,
  Switch,
  Match,
  Portal,
  mergeProps,
  splitProps,
  batch,
  type Component,
  type JSX
} from 'solid-js';
import { isServer } from 'solid-js/web';
import { Dynamic } from 'solid-js/web';
import type {
  ComponentCore,
  FrameworkAdapter,
} from '@stellarix-ui/core';
import { createSignalFromStore, createStoreEffect } from './signals';
import type { SolidComponent, SolidProps } from './types';

export const solidAdapter: FrameworkAdapter<Component<any>> = {
  name: 'solid',
  version: '1.8.0',

  createComponent<TState, TLogic extends Record<string, any> = Record<string, any>>(
    core: ComponentCore<TState, TLogic> & { render?: (props: any) => any }
  ): Component<SolidProps> {
    const componentName = core.metadata.name;
    const { structure, accessibility } = core.metadata;

    if (core.render && typeof core.render === 'function') {
      return (props: SolidProps) => {
        const state = createSignalFromStore(core.state);
        const logic = core.logic;

        const a11y = {
          root: createMemo(() => logic.getA11yProps('root')),
          mobileMenuButton: createMemo(() => logic.getA11yProps('mobileMenuButton')),
          menuList: createMemo(() => logic.getA11yProps('menuList')),
        };

        const interactions = {
          mobileMenuButton: createMemo(() => logic.getInteractionHandlers('mobileMenuButton')),
        };

        return core.render!({
          state: state(),
          a11y: {
            root: a11y.root(),
            mobileMenuButton: a11y.mobileMenuButton(),
            menuList: a11y.menuList(),
          },
          interactions: {
            mobileMenuButton: interactions.mobileMenuButton(),
          },
          props
        });
      };
    }

    const StellarIXSolidComponent: Component<SolidProps> = (props) => {
      const [local, others] = splitProps(props, [
        'children',
        'ref',
        'class',
        'classList',
        'style',
        'disabled',
        'loading',
        'readonly',
        'required',
        'error',
        'placeholder',
        'name',
        'id',
        'value',
        'checked',
        'open',
        'visible',
        'options',
        'items',
        'tabs',
        'steps',
        'orientation',
        'clearable',
        'searchable',
        'multiple',
        'onChange',
        'onFocus',
        'onBlur',
        'onClick',
        'role',
        'aria-label',
        'aria-labelledby',
        'aria-describedby',
        'data-testid'
      ]);

      const state = createSignalFromStore(core.state);
      const logic = core.logic;

      let isUpdating = false;
      createEffect(() => {
        if (isUpdating) return;
        
        const currentState = state();
        if (currentState && typeof currentState === 'object') {
          const updates: any = {};
          
          if (local.value !== undefined && 'value' in currentState && local.value !== currentState.value) {
            updates.value = local.value;
          }
          if (local.checked !== undefined && 'checked' in currentState && local.checked !== currentState.checked) {
            updates.checked = local.checked;
          }
          if (local.open !== undefined && 'open' in currentState && local.open !== currentState.open) {
            updates.open = local.open;
          }
          if (local.visible !== undefined && 'visible' in currentState && local.visible !== currentState.visible) {
            updates.visible = local.visible;
          }
          if (local.disabled !== undefined && 'disabled' in currentState && local.disabled !== currentState.disabled) {
            updates.disabled = local.disabled;
          }
          if (local.loading !== undefined && 'loading' in currentState && local.loading !== currentState.loading) {
            updates.loading = local.loading;
          }
          if (local.readonly !== undefined && 'readonly' in currentState && local.readonly !== currentState.readonly) {
            updates.readonly = local.readonly;
          }
          if (local.required !== undefined && 'required' in currentState && local.required !== currentState.required) {
            updates.required = local.required;
          }
          if (local.error !== undefined && 'error' in currentState && local.error !== currentState.error) {
            updates.error = local.error;
          }
          if (local.options !== undefined && 'options' in currentState && local.options !== currentState.options) {
            updates.options = local.options;
          }
          if (local.items !== undefined && 'items' in currentState && local.items !== currentState.items) {
            updates.items = local.items;
          }
          if (local.tabs !== undefined && 'tabs' in currentState && local.tabs !== currentState.tabs) {
            updates.tabs = local.tabs;
          }
          if (local.steps !== undefined && 'steps' in currentState && local.steps !== currentState.steps) {
            updates.steps = local.steps;
          }
          if (local.orientation !== undefined && 'orientation' in currentState && local.orientation !== currentState.orientation) {
            updates.orientation = local.orientation;
          }

          if (Object.keys(updates).length > 0) {
            isUpdating = true;
            batch(() => {
              core.state.setState((prev: any) => ({ ...prev, ...updates }));
              isUpdating = false;
            });
          }
        }
      });

      const rootElement = structure.elements.root?.type || 'div';
      const rootRole = structure.elements.root?.role || accessibility.role;

      const a11yProps = createMemo(() => logic.getA11yProps('root'));
      const interactionHandlers = createMemo(() => logic.getInteractionHandlers('root'));

      const createEventHandler = (handler: Function | undefined, solidHandler: Function | undefined, eventName: string) => {
        return (event: Event) => {
          if (handler && typeof handler === 'function') {
            const result = handler(event);
            if (result && typeof result === 'string') {
              logic.handleEvent(result, event);
            }
          }
          
          if (solidHandler && typeof solidHandler === 'function') {
            solidHandler(event);
          }
          
          if (local.onChange && eventName === 'change') {
            local.onChange(event);
          }
          if (local.onFocus && eventName === 'focus') {
            local.onFocus(event as FocusEvent);
          }
          if (local.onBlur && eventName === 'blur') {
            local.onBlur(event as FocusEvent);
          }
          if (local.onClick && eventName === 'click') {
            local.onClick(event as MouseEvent);
          }
        };
      };

      const solidHandlers = createMemo(() => {
        const handlers = interactionHandlers();
        const solidHandlers: Record<string, any> = {};
        
        if (handlers && typeof handlers === 'object') {
          Object.entries(handlers).forEach(([event, handler]) => {
            if (typeof handler === 'function') {
              const eventName = event.replace(/^on/, '').toLowerCase();
              solidHandlers[event] = createEventHandler(handler, undefined, eventName);
            }
          });
        }
        
        return solidHandlers;
      });

      if (componentName === 'Dialog') {
        return (
          <Show when={state().open && !isServer}>
            <Portal>
              <div style={{ position: 'fixed', inset: 0, 'z-index': 9999 }}>
                <div
                  data-part="backdrop"
                  role="presentation"
                  {...logic.getA11yProps('backdrop')}
                  {...logic.getInteractionHandlers('backdrop')}
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    'background-color': 'rgba(0, 0, 0, 0.5)'
                  }}
                  class={others.backdropClass || local.class}
                />
                <div
                  {...others}
                  {...a11yProps()}
                  {...solidHandlers()}
                  ref={local.ref}
                  role="dialog"
                  data-part="dialog"
                  class={local.class}
                  style={{
                    position: 'relative',
                    'background-color': 'white',
                    padding: '20px',
                    'max-width': '500px',
                    margin: '50px auto',
                    'border-radius': '8px',
                    ...(typeof local.style === 'object' ? local.style : {})
                  }}
                >
                  {local.children}
                </div>
              </div>
            </Portal>
          </Show>
        );
      }

      if (componentName === 'Select') {
        const selectState = state() as any;
        const allOptions = selectState.options || [];
        const filteredOptions = selectState.filteredOptions || allOptions;
        const selectedOption = allOptions.find((opt: any) => opt.value === selectState.value);
        
        const triggerA11y = createMemo(() => logic.getA11yProps('trigger'));
        const triggerHandlers = createMemo(() => logic.getInteractionHandlers('trigger'));
        const listboxA11y = createMemo(() => logic.getA11yProps('listbox'));
        const clearA11y = createMemo(() => logic.getA11yProps('clear'));
        const clearHandlers = createMemo(() => logic.getInteractionHandlers('clear'));

        return (
          <div
            {...others}
            ref={local.ref}
            style={{
              position: 'relative',
              display: 'inline-block',
              ...(typeof local.style === 'object' ? local.style : {})
            }}
            class={local.class}
          >
            <button
              data-part="trigger"
              type="button"
              {...triggerA11y()}
              {...triggerHandlers()}
              aria-expanded={selectState.open ? 'true' : 'false'}
              aria-haspopup="listbox"
              disabled={selectState.disabled}
              aria-readonly={selectState.readonly}
              class={`${local.class || ''} select-trigger`}
              style={{
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'space-between',
                padding: '8px 12px',
                border: '1px solid #ccc',
                'border-radius': '4px',
                'background-color': selectState.disabled ? '#f5f5f5' : 'white',
                cursor: selectState.disabled ? 'not-allowed' : 'pointer',
                'min-width': '200px'
              }}
            >
              <span>{selectedOption ? selectedOption.label : selectState.placeholder || 'Select an option'}</span>
              
              <Show when={local.clearable && selectState.value}>
                <span
                  role="button"
                  tabindex={0}
                  data-part="clear"
                  {...clearA11y()}
                  {...clearHandlers()}
                  aria-label="Clear selection"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '2px',
                    cursor: 'pointer',
                    'margin-left': '8px'
                  }}
                >
                  ×
                </span>
              </Show>
              
              <span
                aria-hidden="true"
                style={{
                  'margin-left': '8px',
                  transform: selectState.open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              >
                ▼
              </span>
            </button>
            
            <Show when={selectState.open && filteredOptions.length > 0}>
              <ul
                data-part="listbox"
                {...listboxA11y()}
                role="listbox"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  'background-color': 'white',
                  border: '1px solid #ccc',
                  'border-top': 'none',
                  'border-radius': '0 0 4px 4px',
                  'max-height': '200px',
                  'overflow-y': 'auto',
                  'list-style': 'none',
                  margin: 0,
                  padding: 0,
                  'z-index': 1000
                }}
              >
                <For each={filteredOptions}>
                  {(option: any, index) => {
                    const optionA11y = logic.getA11yProps('option');
                    const optionHandlers = logic.getInteractionHandlers('option');
                    
                    return (
                      <li
                        data-part="option"
                        {...(typeof optionA11y === 'function' ? optionA11y(index()) : optionA11y)}
                        {...optionHandlers}
                        role="option"
                        aria-selected={option.value === selectState.value}
                        style={{
                          padding: '8px 12px',
                          cursor: option.disabled ? 'not-allowed' : 'pointer',
                          'background-color': index() === selectState.highlightedIndex ? '#f0f0f0' : 
                                             option.value === selectState.value ? '#e6f3ff' : 'white',
                          color: option.disabled ? '#999' : 'black'
                        }}
                      >
                        {option.label}
                      </li>
                    );
                  }}
                </For>
              </ul>
            </Show>
          </div>
        );
      }

      if (componentName === 'Menu') {
        const menuState = state() as any;
        const items = menuState.items || [];
        
        return (
          <div
            {...others}
            {...logic.getA11yProps('root')}
            ref={local.ref}
            class={local.class}
            style={local.style}
            data-part="menu-container"
          >
            <ul
              {...logic.getA11yProps('menu')}
              role="menu"
              data-part="menu"
              style={{
                'list-style': 'none',
                margin: 0,
                padding: '4px 0',
                'background-color': 'white',
                border: '1px solid #e0e0e0',
                'border-radius': '6px',
                'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                'min-width': '200px'
              }}
            >
              <For each={items}>
                {(item: any, index) => (
                  <Switch>
                    <Match when={item.type === 'separator'}>
                      <li
                        role="separator"
                        data-part="separator"
                        style={{
                          height: '1px',
                          'background-color': '#e0e0e0',
                          margin: '4px 0'
                        }}
                      />
                    </Match>
                    <Match when={item.type === 'section'}>
                      <li
                        role="group"
                        data-part="section"
                      >
                        <Show when={item.label}>
                          <div
                            data-part="section-header"
                            style={{
                              padding: '8px 12px 4px 12px',
                              'font-size': '0.875rem',
                              'font-weight': '600',
                              color: '#666'
                            }}
                          >
                            {item.label}
                          </div>
                        </Show>
                        <For each={item.items || []}>
                          {(subItem: any) => renderMenuItem(subItem, logic, menuState)}
                        </For>
                      </li>
                    </Match>
                    <Match when={true}>
                      {renderMenuItem(item, logic, menuState)}
                    </Match>
                  </Switch>
                )}
              </For>
            </ul>
          </div>
        );
      }

      if (componentName === 'Tabs') {
        const tabsState = state() as any;
        const tabs = tabsState.tabs || [];
        const selectedTab = tabsState.selectedTab || tabs[0]?.id;
        
        return (
          <div
            {...others}
            {...logic.getA11yProps('root')}
            ref={local.ref}
            class={local.class}
            style={local.style}
            data-part="tabs"
          >
            <div
              {...logic.getA11yProps('tabList')}
              role="tablist"
              data-part="tab-list"
              style={{
                display: 'flex',
                'border-bottom': '1px solid #e0e0e0',
                'background-color': '#f9f9f9'
              }}
            >
              <For each={tabs}>
                {(tab: any, index) => {
                  const isSelected = tab.id === selectedTab;
                  const tabA11y = logic.getA11yProps('tab');
                  const tabHandlers = logic.getInteractionHandlers('tab');
                  
                  return (
                    <button
                      {...(typeof tabA11y === 'function' ? tabA11y(index()) : tabA11y)}
                      {...tabHandlers}
                      role="tab"
                      data-part="tab"
                      aria-selected={isSelected}
                      aria-controls={`panel-${tab.id}`}
                      id={`tab-${tab.id}`}
                      disabled={tab.disabled}
                      style={{
                        padding: '12px 16px',
                        border: 'none',
                        'background-color': isSelected ? 'white' : 'transparent',
                        color: isSelected ? '#007acc' : '#666',
                        'border-bottom': isSelected ? '2px solid #007acc' : '2px solid transparent',
                        cursor: tab.disabled ? 'not-allowed' : 'pointer',
                        'font-weight': isSelected ? '600' : 'normal'
                      }}
                    >
                      {tab.label || `Tab ${index() + 1}`}
                    </button>
                  );
                }}
              </For>
            </div>
            <For each={tabs}>
              {(tab: any, index) => (
                <Show when={tab.id === selectedTab}>
                  <div
                    {...(typeof logic.getA11yProps('tabPanel') === 'function' ? 
                        logic.getA11yProps('tabPanel')(index()) : 
                        logic.getA11yProps('tabPanel'))}
                    role="tabpanel"
                    data-part="tab-panel"
                    id={`panel-${tab.id}`}
                    aria-labelledby={`tab-${tab.id}`}
                    style={{
                      padding: '16px',
                      'background-color': 'white',
                      border: '1px solid #e0e0e0',
                      'border-top': 'none'
                    }}
                  >
                    {tab.content || local.children}
                  </div>
                </Show>
              )}
            </For>
          </div>
        );
      }

      if (componentName === 'Stepper') {
        const stepperState = state() as any;
        const steps = stepperState.steps || [];
        
        return (
          <div
            {...others}
            {...logic.getA11yProps('root')}
            ref={local.ref}
            class={local.class}
            style={local.style}
            data-part="stepper"
            data-testid="stepper-root"
          >
            <ol
              {...logic.getA11yProps('list')}
              data-part="step-list"
              style={{
                'list-style': 'none',
                display: 'flex',
                'flex-direction': stepperState.orientation === 'vertical' ? 'column' : 'row',
                gap: '20px',
                margin: 0,
                padding: 0
              }}
            >
              <For each={steps}>
                {(step: any, index) => {
                  const getStepStatus = (core as any).getStepStatus;
                  const status = typeof getStepStatus === 'function' ? getStepStatus(index(), stepperState) : 'upcoming';
                  const stepContent = status === 'completed' ? '✓' : (index() + 1).toString();
                  
                  const stepA11y = logic.getA11yProps('step');
                  const buttonA11y = logic.getA11yProps('stepButton');
                  const buttonHandlers = logic.getInteractionHandlers('stepButton');
                  
                  return (
                    <li
                      {...(typeof stepA11y === 'function' ? stepA11y(index()) : stepA11y)}
                      data-part="step"
                      style={{
                        display: stepperState.orientation === 'vertical' ? 'block' : 'inline-block',
                        'margin-right': stepperState.orientation === 'horizontal' ? '20px' : '0',
                        'margin-bottom': stepperState.orientation === 'vertical' ? '20px' : '0'
                      }}
                    >
                      <button
                        {...(typeof buttonA11y === 'function' ? buttonA11y(index()) : buttonA11y)}
                        {...buttonHandlers}
                        data-part="step-button"
                        data-testid={`step-${index()}`}
                        data-status={status}
                        disabled={stepperState.disabled || step.disabled}
                        style={{
                          padding: '10px',
                          'border-radius': '50%',
                          width: '40px',
                          height: '40px',
                          border: status === 'active' ? '2px solid #007acc' : '1px solid #ccc',
                          'background-color': status === 'completed' ? '#28a745' : 
                                              status === 'error' ? '#dc3545' : 'white',
                          color: status === 'completed' || status === 'error' ? 'white' : '#333',
                          cursor: stepperState.disabled || step.disabled ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {stepContent}
                      </button>
                      
                      <Show when={step.label}>
                        <span
                          data-part="step-label"
                          style={{
                            'margin-left': '10px',
                            'font-weight': status === 'active' ? 'bold' : 'normal',
                            color: status === 'error' ? '#dc3545' : 
                                   status === 'active' ? '#007acc' : '#333'
                          }}
                        >
                          {step.label}
                        </span>
                      </Show>
                      
                      <Show when={step.error && step.errorMessage}>
                        <span
                          data-part="step-error"
                          data-testid={`error-${index()}`}
                          style={{
                            display: 'block',
                            color: '#dc3545',
                            'font-size': '12px',
                            'margin-top': '5px'
                          }}
                        >
                          {step.errorMessage}
                        </span>
                      </Show>
                    </li>
                  );
                }}
              </For>
            </ol>
          </div>
        );
      }

      if (componentName === 'Popover') {
        return (
          <Show when={state().open && !isServer}>
            <Portal>
              <div
                {...others}
                {...a11yProps()}
                {...solidHandlers()}
                ref={local.ref}
                role="tooltip"
                data-part="popover"
                style={{
                  position: 'absolute',
                  'background-color': 'white',
                  border: '1px solid #e0e0e0',
                  'border-radius': '6px',
                  padding: '12px',
                  'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  'z-index': 1000,
                  'max-width': '300px',
                  ...(typeof local.style === 'object' ? local.style : {})
                }}
                class={local.class}
              >
                {local.children}
              </div>
            </Portal>
          </Show>
        );
      }

      if (componentName === 'Tooltip') {
        const tooltipState = state() as any;
        
        return (
          <Show when={tooltipState.visible && !isServer}>
            <Portal>
              <div
                {...others}
                {...a11yProps()}
                {...solidHandlers()}
                ref={local.ref}
                role="tooltip"
                data-part="tooltip"
                style={{
                  position: 'absolute',
                  'background-color': '#333',
                  color: 'white',
                  padding: '8px 12px',
                  'border-radius': '4px',
                  'font-size': '0.875rem',
                  'z-index': 1000,
                  'max-width': '250px',
                  'word-wrap': 'break-word',
                  ...(typeof local.style === 'object' ? local.style : {})
                }}
                class={local.class}
              >
                {local.children || tooltipState.content}
              </div>
            </Portal>
          </Show>
        );
      }

      const componentProps = mergeProps(
        others,
        a11yProps(),
        solidHandlers(),
        {
          ref: local.ref,
          role: rootRole,
          class: local.class,
          style: local.style,
        }
      );

      const currentState = state();

      if (componentName === 'Button' && rootElement === 'button') {
        const buttonProps: any = { ...componentProps };
        if (currentState && typeof currentState === 'object') {
          const stateObj = currentState as any;
          buttonProps.disabled = stateObj.disabled || stateObj.loading;
          buttonProps.type = stateObj.type || local['type'] || 'button';
        }
        return <button {...buttonProps}>{local.children}</button>;
      }

      if (componentName === 'Input' && rootElement === 'input') {
        const inputProps: any = { ...componentProps };
        if (currentState && typeof currentState === 'object') {
          const stateObj = currentState as any;
          inputProps.type = stateObj.type || local['type'] || 'text';
          inputProps.value = stateObj.value || local.value || '';
          inputProps.disabled = stateObj.disabled;
          inputProps.readonly = stateObj.readonly;
          inputProps.required = stateObj.required;
          inputProps.placeholder = local.placeholder;
          
          inputProps.onInput = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;
            
            if (stateObj) {
              batch(() => {
                core.state.setState((prev: any) => ({ ...prev, value }));
              });
            }
            
            if (local.onChange) {
              local.onChange(value);
            }
          };
        }
        return <input {...inputProps} />;
      }

      if (componentName === 'Checkbox' && rootElement === 'input') {
        const checkboxProps: any = { ...componentProps };
        if (currentState && typeof currentState === 'object') {
          const stateObj = currentState as any;
          checkboxProps.type = 'checkbox';
          checkboxProps.checked = stateObj.checked === true;
          checkboxProps.disabled = stateObj.disabled;
          checkboxProps.required = stateObj.required;
          
          if (stateObj.checked === 'indeterminate') {
            checkboxProps['aria-checked'] = 'mixed';
            if (!isServer) {
              onMount(() => {
                if (local.ref) {
                  const element = typeof local.ref === 'function' ? null : local.ref;
                  if (element && 'indeterminate' in element) {
                    (element as HTMLInputElement).indeterminate = true;
                  }
                }
              });
            }
          } else {
            checkboxProps['aria-checked'] = stateObj.checked ? 'true' : 'false';
          }
          
          checkboxProps.onChange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const checked = target.checked;
            
            batch(() => {
              core.state.setState((prev: any) => ({ ...prev, checked }));
            });
            
            if (local.onChange) {
              local.onChange(checked);
            }
          };
        }
        return <input {...checkboxProps} />;
      }

      const isVoidElement = ['input', 'br', 'hr', 'img', 'area', 'base', 'col', 'embed', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(rootElement);

      return (
        <Dynamic component={rootElement} {...componentProps}>
          {!isVoidElement && local.children}
        </Dynamic>
      );
    };

    StellarIXSolidComponent.displayName = `StellarIX.${componentName}`;

    return StellarIXSolidComponent;
  },

  optimize(component: Component<any>): Component<any> {
    return component;
  },
};

function renderMenuItem(item: any, logic: any, menuState: any): JSX.Element {
  const itemA11y = logic.getA11yProps('menuItem');
  const itemHandlers = logic.getInteractionHandlers('menuItem');
  
  const isSelected = item.id === menuState.selectedItem;
  const isHighlighted = item.id === menuState.highlightedItem;
  
  return (
    <li
      {...itemA11y}
      {...itemHandlers}
      role="menuitem"
      data-part="menu-item"
      aria-selected={isSelected}
      style={{
        padding: '8px 12px',
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        'background-color': isHighlighted ? '#f0f0f0' : 
                           isSelected ? '#e6f3ff' : 'transparent',
        color: item.disabled ? '#999' : 'black',
        display: 'flex',
        'align-items': 'center',
        gap: '8px'
      }}
    >
      <Show when={item.icon}>
        <span data-part="menu-item-icon">{item.icon}</span>
      </Show>
      <span data-part="menu-item-label">{item.label || item.name}</span>
      <Show when={item.shortcut}>
        <span 
          data-part="menu-item-shortcut"
          style={{ 'margin-left': 'auto', 'font-size': '0.875rem', color: '#999' }}
        >
          {item.shortcut}
        </span>
      </Show>
    </li>
  );
}

export function connectToSolid<TState, TLogic extends Record<string, any>>(
  componentCore: ComponentCore<TState, TLogic>
): SolidComponent {
  return solidAdapter.createComponent(componentCore) as SolidComponent;
}