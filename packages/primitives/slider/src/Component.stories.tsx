/**
 * Slider Component Stories
 * Comprehensive showcase of all component features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSliderWithImplementation } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Create a wrapper component that creates individual Slider instances
const SliderWrapper = React.forwardRef((props: any, ref: any) => {
  const [component] = React.useState(() => createSliderWithImplementation(props));
  const Component = React.useMemo(() => component.connect(reactAdapter), [component]);
  
  // Track state changes for display
  const [currentValue, setCurrentValue] = React.useState(props.value ?? 0);
  
  // Update the component's state when props change
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      component.state.setDisabled(props.disabled);
    }
  }, [props.disabled, component]);
  
  React.useEffect(() => {
    if (props.value !== undefined) {
      component.state.setValue(props.value);
    }
  }, [props.value, component]);
  
  React.useEffect(() => {
    if (props.min !== undefined) {
      component.state.setMin(props.min);
    }
  }, [props.min, component]);
  
  React.useEffect(() => {
    if (props.max !== undefined) {
      component.state.setMax(props.max);
    }
  }, [props.max, component]);
  
  React.useEffect(() => {
    if (props.step !== undefined) {
      component.state.setStep(props.step);
    }
  }, [props.step, component]);
  
  React.useEffect(() => {
    if (props.orientation !== undefined) {
      component.state.setOrientation(props.orientation);
    }
  }, [props.orientation, component]);
  
  // Subscribe to state changes
  React.useEffect(() => {
    const unsubscribe = component.state.subscribe((state: any) => {
      setCurrentValue(state.value);
    });
    return unsubscribe;
  }, [component]);
  
  const handleChange = (value: number | [number, number]) => {
    setCurrentValue(value);
    props.onChange?.(value);
  };
  
  return (
    <div className="flex flex-col gap-2">
      <Component ref={ref} {...props} onChange={handleChange} />
      <div className="text-sm text-gray-600">
        Value: {Array.isArray(currentValue) ? `[${currentValue.join(', ')}]` : currentValue}
      </div>
    </div>
  );
});

SliderWrapper.displayName = 'Slider';

const meta: Meta<typeof SliderWrapper> = {
  title: 'Primitives/Slider',
  component: SliderWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible slider component with single and range value support, keyboard navigation, and full accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'The current value (number for single, [min, max] for range)',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum allowed value',
      defaultValue: 0,
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum allowed value',
      defaultValue: 100,
    },
    step: {
      control: { type: 'number', min: 1 },
      description: 'Step increment for value changes',
      defaultValue: 1,
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the slider',
      defaultValue: 'horizontal',
    },
    onChange: {
      action: 'changed',
      description: 'Called when the value changes',
    },
    onDragStart: {
      action: 'dragStart',
      description: 'Called when dragging starts',
    },
    onDragEnd: {
      action: 'dragEnd',
      description: 'Called when dragging ends',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {},
};

export const WithValue: Story = {
  args: {
    value: 50,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 30,
  },
};

export const CustomRange: Story = {
  args: {
    min: 0,
    max: 200,
    value: 100,
  },
};

export const WithStep: Story = {
  args: {
    min: 0,
    max: 100,
    step: 10,
    value: 40,
  },
};

export const VerticalOrientation: Story = {
  args: {
    orientation: 'vertical',
    value: 75,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

// Range slider stories
export const RangeSlider: Story = {
  args: {
    value: [25, 75],
  },
};

export const RangeSliderDisabled: Story = {
  args: {
    value: [20, 80],
    disabled: true,
  },
};

export const RangeSliderWithStep: Story = {
  args: {
    value: [20, 80],
    step: 5,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = React.useState(50);
    
    return (
      <div className="flex flex-col gap-4 w-64">
        <SliderWrapper
          value={value}
          onChange={(newValue: number) => setValue(newValue)}
        />
        <div className="flex gap-2">
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => setValue(0)}
          >
            Min
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => setValue(50)}
          >
            Center
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => setValue(100)}
          >
            Max
          </button>
        </div>
      </div>
    );
  },
};

// Interactive range example
export const InteractiveRange: Story = {
  render: () => {
    const [value, setValue] = React.useState<[number, number]>([30, 70]);
    
    return (
      <div className="flex flex-col gap-4 w-64">
        <SliderWrapper
          value={value}
          onChange={(newValue: [number, number]) => setValue(newValue)}
        />
        <div className="flex gap-2">
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => setValue([0, 100])}
          >
            Full Range
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => setValue([40, 60])}
          >
            Center
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => setValue([0, 50])}
          >
            Lower Half
          </button>
        </div>
      </div>
    );
  },
};

// Showcase of all variations
export const Showcase: Story = {
  render: () => (
    <div className="grid gap-8 p-8">
      <section>
        <h3 className="text-lg font-semibold mb-4">Single Value Sliders</h3>
        <div className="grid gap-6 w-96">
          <div>
            <h4 className="text-sm font-medium mb-2">Default</h4>
            <SliderWrapper value={50} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">With Steps (10)</h4>
            <SliderWrapper value={40} step={10} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Custom Range (0-200)</h4>
            <SliderWrapper value={150} min={0} max={200} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Disabled</h4>
            <SliderWrapper value={60} disabled />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Range Sliders</h3>
        <div className="grid gap-6 w-96">
          <div>
            <h4 className="text-sm font-medium mb-2">Default Range</h4>
            <SliderWrapper value={[25, 75]} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">With Steps (5)</h4>
            <SliderWrapper value={[30, 70]} step={5} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Narrow Range</h4>
            <SliderWrapper value={[45, 55]} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Disabled Range</h4>
            <SliderWrapper value={[20, 80]} disabled />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Orientations</h3>
        <div className="flex gap-8">
          <div className="w-96">
            <h4 className="text-sm font-medium mb-2">Horizontal (Default)</h4>
            <SliderWrapper value={75} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Vertical</h4>
            <div style={{ height: '200px' }}>
              <SliderWrapper value={75} orientation="vertical" />
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};

// Keyboard navigation demonstration
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <h3 className="text-lg font-semibold">Keyboard Navigation</h3>
      <SliderWrapper value={50} aria-label="Keyboard navigation demo" />
      <div className="text-sm space-y-2 text-gray-600">
        <p>Try these keyboard shortcuts:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><kbd>←</kbd> / <kbd>↓</kbd> - Decrease value</li>
          <li><kbd>→</kbd> / <kbd>↑</kbd> - Increase value</li>
          <li><kbd>Page Down</kbd> - Decrease by 10%</li>
          <li><kbd>Page Up</kbd> - Increase by 10%</li>
          <li><kbd>Home</kbd> - Set to minimum</li>
          <li><kbd>End</kbd> - Set to maximum</li>
        </ul>
      </div>
    </div>
  ),
};

// Accessibility demonstration
export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <h3 className="text-lg font-semibold">Accessibility Features</h3>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Single Slider with Label</h4>
        <SliderWrapper aria-label="Volume control" value={75} />
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Range Slider with Labels</h4>
        <SliderWrapper 
          value={[20, 80]} 
          aria-label="Price range"
          aria-label-min="Minimum price"
          aria-label-max="Maximum price"
        />
      </div>
      
      <div className="text-sm space-y-2 text-gray-600">
        <p>✓ Full keyboard navigation support</p>
        <p>✓ ARIA attributes (role, aria-valuemin, aria-valuemax, aria-valuenow)</p>
        <p>✓ Focus indicators on thumbs</p>
        <p>✓ Screen reader announcements for value changes</p>
        <p>✓ Disabled state properly announced</p>
        <p>✓ Orientation support (horizontal/vertical)</p>
      </div>
    </div>
  ),
};