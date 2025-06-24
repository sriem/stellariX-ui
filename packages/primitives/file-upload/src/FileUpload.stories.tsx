/**
 * FileUpload Component Stories
 * Comprehensive showcase of all component features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createFileUpload } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Helper to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Create a wrapper component that creates individual FileUpload instances
const FileUploadWrapper = React.forwardRef((props: any, ref: any) => {
  const [component] = React.useState(() => createFileUpload(props));
  const FileUpload = React.useMemo(() => component.connect(reactAdapter), [component]);
  
  // Subscribe to state changes
  const [state, setState] = React.useState(component.state.getState());
  React.useEffect(() => {
    return component.state.subscribe(setState);
  }, [component]);
  
  // Update the component's state when props change
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      component.state.setDisabled(props.disabled);
    }
  }, [props.disabled, component]);
  
  React.useEffect(() => {
    if (props.multiple !== undefined) {
      component.state.setMultiple(props.multiple);
    }
  }, [props.multiple, component]);
  
  React.useEffect(() => {
    if (props.accept !== undefined) {
      component.state.setAccept(props.accept);
    }
  }, [props.accept, component]);
  
  React.useEffect(() => {
    if (props.maxSize !== undefined) {
      component.state.setMaxSize(props.maxSize);
    }
  }, [props.maxSize, component]);
  
  React.useEffect(() => {
    if (props.maxFiles !== undefined) {
      component.state.setMaxFiles(props.maxFiles);
    }
  }, [props.maxFiles, component]);
  
  // Simulate upload progress
  const simulateUpload = React.useCallback(async (file: File) => {
    component.handleEvent('uploadstart', { file });
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      component.handleEvent('uploadprogress', { file, progress: i });
    }
    
    component.handleEvent('uploadcomplete', { file });
  }, [component]);
  
  return (
    <div className="w-full max-w-md">
      <FileUpload ref={ref} {...props} />
      
      {/* File list display */}
      {state.files.length > 0 && (
        <div className="mt-4 space-y-2">
          {state.files.map((file) => (
            <div key={file.name} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  
                  {state.errors[file.name] && (
                    <p className="text-xs text-red-500 mt-1">{state.errors[file.name]}</p>
                  )}
                  
                  {state.progress[file.name] !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${state.progress[file.name]}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{state.progress[file.name]}%</p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => component.handleEvent('remove', { file })}
                  className="ml-2 text-red-500 hover:text-red-700"
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          
          {props.onUpload && state.files.length > 0 && !state.uploading && (
            <button
              onClick={() => state.files.forEach(simulateUpload)}
              className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload All Files
            </button>
          )}
        </div>
      )}
    </div>
  );
});

FileUploadWrapper.displayName = 'FileUpload';

const meta: Meta<typeof FileUploadWrapper> = {
  title: 'Primitives/FileUpload',
  component: FileUploadWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible file upload component with drag and drop support, file validation, and upload progress tracking.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple files can be selected',
      defaultValue: true,
    },
    accept: {
      control: 'text',
      description: 'Accepted file types (e.g., "image/*", ".pdf")',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files',
    },
    onChange: {
      action: 'files changed',
      description: 'Called when files are added or removed',
    },
    onDrop: {
      action: 'files dropped',
      description: 'Called when files are dropped',
    },
    onError: {
      action: 'error occurred',
      description: 'Called when a validation error occurs',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {},
};

export const SingleFile: Story = {
  args: {
    multiple: false,
  },
};

export const AcceptImages: Story = {
  args: {
    accept: 'image/*',
  },
};

export const AcceptDocuments: Story = {
  args: {
    accept: '.pdf,.doc,.docx',
  },
};

export const WithMaxSize: Story = {
  args: {
    maxSize: 5 * 1024 * 1024, // 5MB
  },
};

export const WithMaxFiles: Story = {
  args: {
    maxFiles: 3,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

// Upload simulation
export const WithUploadSimulation: Story = {
  args: {
    onUpload: async (file: File) => {
      // Simulated upload handler
      await new Promise(resolve => setTimeout(resolve, 2000));
    },
  },
};

// Interactive example with all features
export const Interactive: Story = {
  render: () => {
    const [files, setFiles] = React.useState<File[]>([]);
    const [errors, setErrors] = React.useState<Array<{ file: File; message: string }>>([]);
    
    return (
      <div className="flex flex-col gap-4">
        <FileUploadWrapper
          multiple
          accept="image/*,.pdf"
          maxSize={10 * 1024 * 1024} // 10MB
          maxFiles={5}
          onChange={(newFiles: File[]) => {
            setFiles(newFiles);
            console.log('Files changed:', newFiles);
          }}
          onError={(error: { file: File; message: string }) => {
            setErrors(prev => [...prev, error]);
            console.error('File error:', error);
          }}
          onUpload={async (file: File) => {
            console.log('Uploading file:', file);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }}
        />
        
        <div className="text-sm text-gray-600">
          <p>Files selected: {files.length}</p>
          {errors.length > 0 && (
            <div className="mt-2 text-red-500">
              <p>Errors:</p>
              {errors.map((error, index) => (
                <p key={index}>- {error.file.name}: {error.message}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
};

// Showcase of all variations
export const Showcase: Story = {
  render: () => (
    <div className="grid gap-8">
      <section>
        <h3 className="text-lg font-semibold mb-4">File Selection Modes</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Single File</p>
            <FileUploadWrapper multiple={false} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Multiple Files</p>
            <FileUploadWrapper multiple={true} />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">File Type Restrictions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Images Only</p>
            <FileUploadWrapper accept="image/*" />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Documents Only</p>
            <FileUploadWrapper accept=".pdf,.doc,.docx" />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Size & Quantity Limits</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Max 2MB per file</p>
            <FileUploadWrapper maxSize={2 * 1024 * 1024} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Max 3 files</p>
            <FileUploadWrapper maxFiles={3} />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">States</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Enabled</p>
            <FileUploadWrapper />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Disabled</p>
            <FileUploadWrapper disabled />
          </div>
        </div>
      </section>
    </div>
  ),
};

// Accessibility demonstration
export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Accessibility Features</h3>
      <FileUploadWrapper aria-label="Upload profile picture" />
      <div className="text-sm space-y-2 text-gray-600">
        <p>✓ Keyboard navigation support (Enter/Space to open file picker)</p>
        <p>✓ ARIA live regions for status announcements</p>
        <p>✓ Proper labeling for screen readers</p>
        <p>✓ Focus management for drag and drop</p>
        <p>✓ Clear error messages with ARIA descriptions</p>
      </div>
    </div>
  ),
};