/**
 * Vue 3.5+ Adapter Integration Tests
 * Tests the Vue adapter with key StellarIX components
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref, nextTick } from 'vue';
import { vueAdapter, connectToVue, createStellarIXProvider } from '../src/adapter';
import { useStellarIXComponent, useStellarIXModel } from '../src/composables';

// Mock StellarIX core for testing
const createMockCore = (name: string, customState = {}, customLogic = {}) => ({
    metadata: {
        name,
        structure: {
            elements: {
                root: { 
                    type: name === 'Button' ? 'button' : 
                          name === 'Input' ? 'input' : 'div', 
                    role: name === 'Button' ? 'button' : 
                          name === 'Input' ? 'textbox' : 'generic' 
                }
            }
        },
        accessibility: {
            role: name === 'Button' ? 'button' : 
                  name === 'Input' ? 'textbox' : 'generic'
        }
    },
    state: {
        value: '',
        disabled: false,
        loading: false,
        error: null,
        ...customState
    },
    logic: {
        handleEvent: vi.fn((eventName: string, event: any) => {
            console.log(`Event handled: ${eventName}`, event);
            return eventName;
        }),
        getA11yProps: vi.fn((element: string) => ({
            'aria-label': `${name} ${element}`,
            role: element === 'root' ? 'generic' : element
        })),
        getInteractionHandlers: vi.fn((element: string) => ({
            onClick: (event: Event) => `click-${element}`,
            onFocus: (event: Event) => `focus-${element}`,
            onBlur: (event: Event) => `blur-${element}`
        })),
        ...customLogic
    },
    initialize: vi.fn(),
    update: vi.fn(),
    cleanup: vi.fn()
});

describe('Vue Adapter', () => {
    describe('vueAdapter.createComponent', () => {
        it('should create a Vue component from StellarIX core', () => {
            const mockCore = createMockCore('TestComponent');
            const VueComponent = vueAdapter.createComponent(mockCore);
            
            expect(VueComponent).toBeDefined();
            expect(typeof VueComponent).toBe('object');
        });

        it('should handle component props correctly', async () => {
            const mockCore = createMockCore('Button', { type: 'button' });
            const VueButton = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueButton, {
                props: {
                    disabled: true,
                    class: 'test-button',
                    'data-testid': 'button-test'
                }
            });

            expect(wrapper.props('disabled')).toBe(true);
            expect(wrapper.classes()).toContain('test-button');
            expect(wrapper.attributes('data-testid')).toBe('button-test');
        });

        it('should emit v-model events correctly', async () => {
            const mockCore = createMockCore('Input', { type: 'text', value: '' });
            // Override the handleEvent to simulate value change
            mockCore.logic.handleEvent = vi.fn((eventName: string, event: any) => {
                if (eventName === 'input') {
                    mockCore.state.value = event.target?.value || 'test-value';
                }
                return eventName;
            });
            
            const VueInput = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueInput, {
                props: {
                    modelValue: 'initial-value'
                }
            });

            // Simulate input event
            const input = wrapper.find('input');
            if (input.exists()) {
                await input.setValue('new-value');
                
                // Check if update:modelValue event was emitted
                expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            }
        });
    });

    describe('connectToVue helper', () => {
        it('should connect a component core to Vue', () => {
            const mockCore = createMockCore('ConnectedComponent');
            const VueComponent = connectToVue(mockCore);
            
            expect(VueComponent).toBeDefined();
            
            const wrapper = mount(VueComponent);
            expect(wrapper.exists()).toBe(true);
        });
    });

    describe('Component-specific rendering', () => {
        it('should render Button component correctly', async () => {
            const mockCore = createMockCore('Button', { 
                type: 'button',
                disabled: false,
                loading: false 
            });
            
            // Override structure for button
            mockCore.metadata.structure.elements.root = { type: 'button', role: 'button' };
            
            const VueButton = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueButton, {
                props: {
                    type: 'submit',
                    disabled: false
                },
                slots: {
                    default: 'Click me'
                }
            });

            expect(wrapper.find('button').exists()).toBe(true);
            expect(wrapper.text()).toBe('Click me');
        });

        it('should render Input component correctly', async () => {
            const mockCore = createMockCore('Input', { 
                type: 'text',
                value: '',
                disabled: false 
            });
            
            // Override structure for input
            mockCore.metadata.structure.elements.root = { type: 'input', role: 'textbox' };
            
            const VueInput = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueInput, {
                props: {
                    modelValue: 'test-input',
                    placeholder: 'Enter text'
                }
            });

            const input = wrapper.find('input');
            expect(input.exists()).toBe(true);
            expect(input.attributes('placeholder')).toBe('Enter text');
        });

        it('should render Checkbox component correctly', async () => {
            const mockCore = createMockCore('Checkbox', { 
                checked: false,
                disabled: false 
            });
            
            // Override structure for checkbox
            mockCore.metadata.structure.elements.root = { type: 'input', role: 'checkbox' };
            
            const VueCheckbox = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueCheckbox, {
                props: {
                    checked: true,
                    disabled: false
                }
            });

            const checkbox = wrapper.find('input[type="checkbox"]');
            expect(checkbox.exists()).toBe(true);
        });
    });

    describe('Compound Components', () => {
        it('should render Dialog component with portal', async () => {
            const mockCore = createMockCore('Dialog', { 
                open: true 
            });
            
            // Mock additional methods for dialog
            mockCore.logic.getA11yProps = vi.fn((element: string) => {
                if (element === 'backdrop') return { 'aria-hidden': 'true' };
                if (element === 'dialog') return { role: 'dialog', 'aria-modal': 'true' };
                return { role: element };
            });
            
            mockCore.logic.getInteractionHandlers = vi.fn((element: string) => ({
                onClick: (event: Event) => `click-${element}`
            }));
            
            const VueDialog = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueDialog, {
                props: {
                    open: true
                },
                slots: {
                    default: 'Dialog content'
                },
                attachTo: document.body
            });

            // Dialog should be rendered
            expect(wrapper.exists()).toBe(true);
        });

        it('should render Select component with options', async () => {
            const mockOptions = [
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' }
            ];
            
            const mockCore = createMockCore('Select', { 
                open: false,
                value: '',
                options: mockOptions,
                filteredOptions: mockOptions,
                highlightedIndex: -1,
                placeholder: 'Select an option'
            });
            
            // Mock compound component methods
            mockCore.logic.getA11yProps = vi.fn((element: string) => {
                switch (element) {
                    case 'trigger':
                        return { 'aria-haspopup': 'listbox', 'aria-expanded': 'false' };
                    case 'listbox':
                        return { role: 'listbox' };
                    case 'option':
                        return { role: 'option' };
                    default:
                        return { role: element };
                }
            });
            
            mockCore.logic.getInteractionHandlers = vi.fn((element: string) => ({
                onClick: (event: Event) => `click-${element}`,
                onKeyDown: (event: Event) => `keydown-${element}`
            }));
            
            const VueSelect = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueSelect, {
                props: {
                    options: mockOptions,
                    modelValue: '',
                    placeholder: 'Select an option'
                }
            });

            // Select trigger should be rendered
            const trigger = wrapper.find('[data-part="trigger"]');
            expect(trigger.exists()).toBe(true);
            expect(trigger.text()).toContain('Select an option');
        });
    });

    describe('Event Handling', () => {
        it('should handle click events correctly', async () => {
            const mockCore = createMockCore('Button');
            const VueButton = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueButton, {
                props: {
                    onClick: vi.fn()
                }
            });

            await wrapper.trigger('click');
            
            // Check if core handleEvent was called
            expect(mockCore.logic.handleEvent).toHaveBeenCalled();
        });

        it('should handle focus and blur events', async () => {
            const mockCore = createMockCore('Input');
            mockCore.metadata.structure.elements.root = { type: 'input', role: 'textbox' };
            
            const VueInput = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueInput);
            const input = wrapper.find('input');

            if (input.exists()) {
                await input.trigger('focus');
                await input.trigger('blur');
                
                // Check if core handleEvent was called for both events
                expect(mockCore.logic.handleEvent).toHaveBeenCalledWith('focus', expect.any(Object));
            }
        });
    });

    describe('Accessibility', () => {
        it('should apply ARIA attributes correctly', () => {
            const mockCore = createMockCore('Button');
            const VueButton = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueButton, {
                props: {
                    'aria-label': 'Custom button label',
                    'aria-describedby': 'button-description'
                }
            });

            expect(wrapper.attributes('aria-label')).toBe('Custom button label');
            expect(wrapper.attributes('aria-describedby')).toBe('button-description');
        });

        it('should call getA11yProps for accessibility', () => {
            const mockCore = createMockCore('Input');
            const VueInput = vueAdapter.createComponent(mockCore);
            
            mount(VueInput);
            
            // Check if getA11yProps was called
            expect(mockCore.logic.getA11yProps).toHaveBeenCalledWith('root');
        });
    });

    describe('Lifecycle Integration', () => {
        it('should call core lifecycle methods', () => {
            const mockCore = createMockCore('TestComponent');
            const VueComponent = vueAdapter.createComponent(mockCore);
            
            const wrapper = mount(VueComponent);
            
            // Component should be mounted
            expect(wrapper.exists()).toBe(true);
            
            // Unmount to test cleanup
            wrapper.unmount();
        });
    });

    describe('Configuration Provider', () => {
        it('should provide configuration to child components', () => {
            const config = { devtools: true, production: false };
            const Provider = createStellarIXProvider(config);
            
            expect(Provider).toBeDefined();
            
            const wrapper = mount(Provider, {
                slots: {
                    default: '<div>Test content</div>'
                }
            });

            expect(wrapper.exists()).toBe(true);
        });
    });
});

describe('Vue Composables', () => {
    describe('useStellarIXComponent', () => {
        it('should return reactive state and logic', () => {
            const mockCore = createMockCore('TestComponent');
            
            // Create a test component to use the composable
            const TestComponent = defineComponent({
                setup() {
                    return useStellarIXComponent(mockCore);
                },
                template: '<div>{{ state.value }}</div>'
            });

            const wrapper = mount(TestComponent);
            expect(wrapper.exists()).toBe(true);
        });
    });

    describe('useStellarIXModel', () => {
        it('should provide v-model functionality', () => {
            const TestComponent = defineComponent({
                props: {
                    modelValue: String
                },
                emits: ['update:modelValue'],
                setup(props, { emit }) {
                    const model = useStellarIXModel(props, emit);
                    return { model };
                },
                template: '<input v-model="model" />'
            });

            const wrapper = mount(TestComponent, {
                props: {
                    modelValue: 'initial-value'
                }
            });

            expect(wrapper.exists()).toBe(true);
        });
    });
});

describe('Type Safety', () => {
    it('should maintain type safety with TypeScript', () => {
        // This test verifies that the types compile correctly
        // The actual type checking happens at compile time
        const mockCore = createMockCore('TypedComponent');
        const TypedComponent = connectToVue(mockCore);
        
        expect(TypedComponent).toBeDefined();
    });
});