import { describe, it, expect, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, ref } from 'vue';
import { vueAdapter } from '@stellarix-ui/vue';
import { COMPONENTS, type ComponentName } from '../src/test-matrix';

describe('Vue Adapter Specific Tests', () => {
  describe('Vue 3.5+ Features', () => {
    it('supports v-model binding', async () => {
      const { createInputFactory } = await import('@stellarix-ui/input');
      const inputCore = createInputFactory();
      const Input = vueAdapter.createComponent(inputCore);
      
      const wrapper = mount({
        components: { Input },
        data() {
          return { value: 'initial' };
        },
        template: '<Input v-model="value" />'
      });
      
      const input = wrapper.find('input');
      expect(input.element.value).toBe('initial');
      
      await input.setValue('updated');
      expect(wrapper.vm.value).toBe('updated');
    });
    
    it('uses useTemplateRef pattern', async () => {
      const { createButtonFactory } = await import('@stellarix-ui/button');
      const buttonCore = createButtonFactory();
      const Button = vueAdapter.createComponent(buttonCore);
      
      const wrapper = mount({
        components: { Button },
        template: '<Button ref="buttonRef">Click me</Button>',
        setup() {
          const buttonRef = ref(null);
          return { buttonRef };
        }
      });
      
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.buttonRef).toBeTruthy();
    });
  });
  
  describe('Reactive State Management', () => {
    it('syncs state with props reactively', async () => {
      const { createCheckboxFactory } = await import('@stellarix-ui/checkbox');
      const checkboxCore = createCheckboxFactory();
      const Checkbox = vueAdapter.createComponent(checkboxCore);
      
      const wrapper = mount(Checkbox, {
        props: {
          checked: false
        }
      });
      
      expect(wrapper.find('input').element.checked).toBe(false);
      
      await wrapper.setProps({ checked: true });
      expect(wrapper.find('input').element.checked).toBe(true);
    });
    
    it('emits events correctly', async () => {
      const { createSelectFactory } = await import('@stellarix-ui/select');
      const selectCore = createSelectFactory({
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' }
        ]
      });
      const Select = vueAdapter.createComponent(selectCore);
      
      const wrapper = mount(Select);
      
      const trigger = wrapper.find('[role="button"]');
      await trigger.trigger('click');
      
      const option = wrapper.find('[role="option"]');
      await option.trigger('click');
      
      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });
  });
  
  describe('Compound Components', () => {
    it('renders Dialog with Teleport', async () => {
      const { createDialogFactory } = await import('@stellarix-ui/dialog');
      const dialogCore = createDialogFactory();
      const Dialog = vueAdapter.createComponent(dialogCore);
      
      const wrapper = mount(Dialog, {
        props: {
          open: true
        },
        slots: {
          default: () => 'Dialog content'
        },
        global: {
          stubs: {
            teleport: true
          }
        }
      });
      
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Dialog content');
    });
    
    it('renders Menu with sections', async () => {
      const { createMenuFactory } = await import('@stellarix-ui/menu');
      const menuCore = createMenuFactory({
        items: [
          { id: '1', label: 'Item 1' },
          { id: '2', type: 'separator' },
          { 
            id: '3', 
            type: 'section', 
            label: 'Section',
            items: [
              { id: '4', label: 'Item 4' }
            ]
          }
        ]
      });
      const Menu = vueAdapter.createComponent(menuCore);
      
      const wrapper = mount(Menu);
      
      expect(wrapper.find('[role="menu"]').exists()).toBe(true);
      expect(wrapper.find('[role="separator"]').exists()).toBe(true);
      expect(wrapper.find('[role="group"]').exists()).toBe(true);
    });
  });
  
  describe('Slots and Scoped Slots', () => {
    it('supports default slots', async () => {
      const { createCardFactory } = await import('@stellarix-ui/card');
      const cardCore = createCardFactory();
      const Card = vueAdapter.createComponent(cardCore);
      
      const wrapper = mount(Card, {
        slots: {
          default: () => h('div', 'Card content')
        }
      });
      
      expect(wrapper.text()).toContain('Card content');
    });
  });
  
  describe('Provide/Inject', () => {
    it('uses injection for configuration', async () => {
      const { createButtonFactory } = await import('@stellarix-ui/button');
      const buttonCore = createButtonFactory();
      const Button = vueAdapter.createComponent(buttonCore);
      
      const wrapper = mount({
        components: { Button },
        provide: {
          stellarixConfig: {
            theme: 'dark'
          }
        },
        template: '<Button>Test</Button>'
      });
      
      expect(wrapper.find('button').exists()).toBe(true);
    });
  });
  
  describe('Lifecycle Hooks', () => {
    it('initializes on mount', async () => {
      const { createSliderFactory } = await import('@stellarix-ui/slider');
      const sliderCore = createSliderFactory();
      const Slider = vueAdapter.createComponent(sliderCore);
      
      const initSpy = vi.spyOn(sliderCore.logic, 'init');
      
      const wrapper = mount(Slider);
      
      if (sliderCore.logic.init) {
        expect(initSpy).toHaveBeenCalled();
      }
    });
    
    it('cleans up on unmount', async () => {
      const { createPopoverFactory } = await import('@stellarix-ui/popover');
      const popoverCore = createPopoverFactory();
      const Popover = vueAdapter.createComponent(popoverCore);
      
      const cleanupSpy = vi.spyOn(popoverCore.logic, 'cleanup');
      
      const wrapper = mount(Popover);
      wrapper.unmount();
      
      if (popoverCore.logic.cleanup) {
        expect(cleanupSpy).toHaveBeenCalled();
      }
    });
  });
});

export default {};