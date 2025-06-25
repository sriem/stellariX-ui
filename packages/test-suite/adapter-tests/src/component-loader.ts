import type { ComponentCore } from '@stellarix-ui/core';
import type { ComponentName } from './test-matrix';

const componentFactoryMap: Record<ComponentName, string> = {
  'accordion': 'createAccordionWithImplementation',
  'alert': 'createAlertWithImplementation',
  'avatar': 'createAvatarWithImplementation',
  'badge': 'createBadgeWithImplementation',
  'breadcrumb': 'createBreadcrumb',
  'button': 'createButtonWithImplementation',
  'calendar': 'createCalendarWithImplementation',
  'card': 'createCardWithImplementation',
  'checkbox': 'createCheckboxWithImplementation',
  'container': 'createContainerWithImplementation',
  'date-picker': 'createDatePickerWithImplementation',
  'dialog': 'createDialogWithImplementation',
  'divider': 'createDividerWithImplementation',
  'file-upload': 'createFileUploadWithImplementation',
  'input': 'createInputWithImplementation',
  'menu': 'createMenuWithImplementation',
  'navigation-menu': 'createNavigationMenu',
  'pagination': 'createPaginationWithImplementation',
  'popover': 'createPopoverWithImplementation',
  'progress-bar': 'createProgressBarWithImplementation',
  'radio': 'createRadioGroup',
  'select': 'createSelect',
  'slider': 'createSliderWithImplementation',
  'spinner': 'createSpinnerWithImplementation',
  'stepper': 'createStepper',
  'table': 'createTableWithImplementation',
  'tabs': 'createTabsWithImplementation',
  'textarea': 'createTextareaWithImplementation',
  'toggle': 'createToggleWithImplementation',
  'tooltip': 'createTooltipWithImplementation'
};

export async function loadComponent(componentName: ComponentName): Promise<ComponentCore<any, any>> {
  try {
    const module = await import(`@stellarix-ui/${componentName}`);
    
    const factoryName = componentFactoryMap[componentName];
    const factory = module[factoryName] || module.default || module[Object.keys(module)[0]];
    
    if (typeof factory === 'function') {
      return factory();
    } else {
      throw new Error(`No factory function found for ${componentName}`);
    }
  } catch (error) {
    console.error(`Failed to load component ${componentName}:`, error);
    throw error;
  }
}