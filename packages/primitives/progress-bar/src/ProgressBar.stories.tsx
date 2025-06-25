/**
 * ProgressBar Component Stories
 * Comprehensive showcase of all component features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createProgressBar } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Create a wrapper component that creates individual ProgressBar instances
const ProgressBarWrapper = React.forwardRef((props: any, ref: any) => {
  const [component] = React.useState(() => createProgressBar(props));
  const Component = React.useMemo(() => component.connect(reactAdapter), [component]);
  const [state, setState] = React.useState(component.state.getState());
  
  React.useEffect(() => {
    const unsubscribe = component.state.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, [component]);
  
  React.useEffect(() => {
    if (props.value !== undefined) {
      component.state.setValue(props.value);
    }
  }, [props.value, component]);
  
  React.useEffect(() => {
    if (props.max !== undefined) {
      component.state.setMax(props.max);
    }
  }, [props.max, component]);
  
  React.useEffect(() => {
    if (props.variant !== undefined) {
      component.state.setVariant(props.variant);
    }
  }, [props.variant, component]);
  
  React.useEffect(() => {
    if (props.showLabel !== undefined) {
      component.state.setShowLabel(props.showLabel);
    }
  }, [props.showLabel, component]);
  
  React.useEffect(() => {
    if (props.isIndeterminate !== undefined) {
      component.state.setIndeterminate(props.isIndeterminate);
    }
  }, [props.isIndeterminate, component]);
  
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      component.state.setDisabled(props.disabled);
    }
  }, [props.disabled, component]);
  
  // Custom rendering for ProgressBar
  const percentage = component.getPercentage();
  
  return (
    <div className="w-full">
      <Component ref={ref} {...props}>
        <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          {state.isIndeterminate ? (
            <div className="absolute inset-0 bg-blue-500 animate-pulse" />
          ) : (
            <div 
              className={`h-full transition-all duration-300 ${
                state.variant === 'success' ? 'bg-green-500' :
                state.variant === 'warning' ? 'bg-yellow-500' :
                state.variant === 'error' ? 'bg-red-500' :
                state.variant === 'info' ? 'bg-blue-400' :
                'bg-blue-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
        {state.showLabel && (
          <div className="mt-1 text-sm text-gray-600 text-center">
            {state.isIndeterminate ? 'Loading...' : `${percentage}%`}
          </div>
        )}
      </Component>
    </div>
  );
});

ProgressBarWrapper.displayName = 'ProgressBar';

const meta: Meta<typeof ProgressBarWrapper> = {
  title: 'Primitives/ProgressBar',
  component: ProgressBarWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A visual indicator showing the progress of a task or operation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress value',
      defaultValue: 0,
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Maximum value for the progress',
      defaultValue: 100,
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Visual variant of the progress bar',
      defaultValue: 'default',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show the percentage label',
      defaultValue: false,
    },
    isIndeterminate: {
      control: 'boolean',
      description: 'Whether the progress is indeterminate (loading state)',
      defaultValue: false,
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the progress bar is disabled',
      defaultValue: false,
    },
    onChange: {
      action: 'changed',
      description: 'Called when the value changes',
    },
    onComplete: {
      action: 'completed',
      description: 'Called when progress reaches 100%',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    value: 0,
    max: 100,
  },
};

export const HalfProgress: Story = {
  args: {
    value: 50,
    max: 100,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    max: 100,
    variant: 'success',
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    max: 100,
    showLabel: true,
  },
};

export const Indeterminate: Story = {
  args: {
    isIndeterminate: true,
    showLabel: true,
  },
};

export const Disabled: Story = {
  args: {
    value: 60,
    max: 100,
    disabled: true,
    showLabel: true,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(false);
    
    React.useEffect(() => {
      if (isRunning && value < 100) {
        const timer = setTimeout(() => {
          setValue(v => Math.min(v + 1, 100));
        }, 50);
        return () => clearTimeout(timer);
      } else if (value >= 100) {
        setIsRunning(false);
      }
    }, [isRunning, value]);
    
    return (
      <div className="flex flex-col gap-4 w-96">
        <ProgressBarWrapper
          value={value}
          max={100}
          showLabel
          variant={value >= 100 ? 'success' : 'default'}
          onChange={(v: number, p: number) => console.log(`Value: ${v}, Percentage: ${p}%`)}
          onComplete={() => console.log('Progress complete!')}
        />
        <div className="flex gap-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={() => { setValue(0); setIsRunning(false); }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
          <button 
            onClick={() => setValue(Math.min(value + 10, 100))}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +10%
          </button>
        </div>
      </div>
    );
  },
};

// Showcase of all variations
export const Showcase: Story = {
  render: () => (
    <div className="grid gap-8 w-full max-w-2xl">
      <section>
        <h3 className="text-lg font-semibold mb-4">Progress States</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Empty (0%)</p>
            <ProgressBarWrapper value={0} showLabel />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Quarter (25%)</p>
            <ProgressBarWrapper value={25} showLabel />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Half (50%)</p>
            <ProgressBarWrapper value={50} showLabel />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Three Quarters (75%)</p>
            <ProgressBarWrapper value={75} showLabel />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Complete (100%)</p>
            <ProgressBarWrapper value={100} showLabel variant="success" />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Variants</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Default</p>
            <ProgressBarWrapper value={60} variant="default" showLabel />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Success</p>
            <ProgressBarWrapper value={60} variant="success" showLabel />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Warning</p>
            <ProgressBarWrapper value={60} variant="warning" showLabel />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Error</p>
            <ProgressBarWrapper value={60} variant="error" showLabel />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Info</p>
            <ProgressBarWrapper value={60} variant="info" showLabel />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Special States</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Indeterminate (Loading)</p>
            <ProgressBarWrapper isIndeterminate showLabel />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Disabled</p>
            <ProgressBarWrapper value={40} disabled showLabel />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Custom Max (150)</p>
            <ProgressBarWrapper value={75} max={150} showLabel />
          </div>
        </div>
      </section>
    </div>
  ),
};

// Accessibility demonstration
export const AccessibilityShowcase: Story = {
  render: () => {
    const [progress] = React.useState(65);
    
    return (
      <div className="space-y-4 w-96">
        <h3 className="text-lg font-semibold">Accessibility Features</h3>
        <ProgressBarWrapper 
          value={progress} 
          showLabel 
          aria-label="File upload progress" 
        />
        <div className="text-sm space-y-2 text-gray-600">
          <p>✓ role="progressbar" for semantic meaning</p>
          <p>✓ aria-valuenow={progress} for current value</p>
          <p>✓ aria-valuemin="0" and aria-valuemax="100"</p>
          <p>✓ aria-valuetext="65%" for human-readable value</p>
          <p>✓ aria-busy="true" for indeterminate state</p>
          <p>✓ aria-disabled="true" when disabled</p>
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <p className="font-semibold mb-2">Screen Reader Output:</p>
          <p className="font-mono">"File upload progress, 65 percent"</p>
        </div>
      </div>
    );
  },
};

// Real-world examples
export const FileUploadExample: Story = {
  render: () => {
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [isUploading, setIsUploading] = React.useState(false);
    
    const simulateUpload = () => {
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
    };
    
    return (
      <div className="space-y-4 w-96">
        <h3 className="text-lg font-semibold">File Upload Progress</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {!isUploading && uploadProgress === 0 && (
            <button 
              onClick={simulateUpload}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Upload File
            </button>
          )}
          
          {(isUploading || uploadProgress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">document.pdf</span>
                <span className="text-sm text-gray-500">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <ProgressBarWrapper 
                value={uploadProgress} 
                variant={uploadProgress === 100 ? 'success' : 'default'}
              />
              {uploadProgress === 100 && (
                <p className="text-sm text-green-600">Upload complete!</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
};