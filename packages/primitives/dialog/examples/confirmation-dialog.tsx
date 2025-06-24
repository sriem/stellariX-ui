/**
 * Dialog Component Examples
 * 
 * This file demonstrates various practical dialog patterns commonly used in applications:
 * 
 * 1. Confirmation Dialogs - Yes/No, OK/Cancel patterns with keyboard shortcuts
 * 2. Different Dialog Types - Info, Warning, Error, Success with visual indicators
 * 3. Async Operations - Delete confirmations with loading states
 * 4. Form Dialogs - Collecting user input with proper focus management
 * 5. Accessibility - ARIA attributes, keyboard navigation, focus trapping
 * 
 * Key Features Demonstrated:
 * - Reusable dialog wrapper component with TypeScript types
 * - Keyboard shortcuts (Enter to confirm, Escape to cancel)
 * - Loading states that prevent accidental actions
 * - Custom action buttons with different variants
 * - Focus management and restoration
 * - Preventing backdrop clicks during critical operations
 * 
 * @example
 * // Basic usage
 * <ConfirmationDialog
 *   type="warning"
 *   title="Delete Item"
 *   message="Are you sure?"
 *   actions={[
 *     { label: 'Cancel', onClick: handleCancel, shortcut: 'Escape' },
 *     { label: 'Delete', onClick: handleDelete, variant: 'danger', shortcut: 'Enter' }
 *   ]}
 * />
 */

import React, { useState, useCallback, FormEvent } from 'react';
import { createDialogWithImplementation } from '../src';

// import { reactAdapter } from '@stellarix-ui/react';
// For this example, we'll create a simple mock adapter
const reactAdapter = {
  name: 'react',
  version: '19.0.0',
  createComponent: (core: any) => {
    return (props: any) => {
      // Mock implementation - in real usage, the adapter handles state management
      return props.children;
    };
  }
};

// Dialog types for different use cases
type DialogType = 'info' | 'warning' | 'error' | 'success';

// Action configuration
interface DialogAction {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger';
  shortcut?: string; // e.g., 'Enter', 'Escape'
}

// Confirmation dialog props
interface ConfirmationDialogProps {
  type?: DialogType;
  title: string;
  message: string;
  actions?: DialogAction[];
  loading?: boolean;
  onClose?: () => void;
}

// Style mapping for different dialog types
const typeStyles: Record<DialogType, { icon: string; color: string }> = {
  info: { icon: 'ℹ️', color: '#3b82f6' },
  warning: { icon: '⚠️', color: '#f59e0b' },
  error: { icon: '❌', color: '#ef4444' },
  success: { icon: '✅', color: '#10b981' },
};

// Create a reusable confirmation dialog component
function ConfirmationDialog({ 
  type = 'info', 
  title, 
  message, 
  actions = [], 
  loading = false,
  onClose 
}: ConfirmationDialogProps) {
  const dialogInstance = createDialogWithImplementation({
    open: true,
    role: 'alertdialog',
    closeOnBackdropClick: !loading,
    closeOnEscape: !loading,
    onOpenChange: (open) => {
      if (!open && onClose) {
        onClose();
      }
    },
  });
  
  const Dialog = dialogInstance.connect(reactAdapter);
  const style = typeStyles[type];
  
  // Handle keyboard shortcuts for better accessibility
  // This allows users to quickly confirm or cancel with keyboard
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return; // Disable shortcuts during loading
      
      actions.forEach(action => {
        if (action.shortcut && e.key === action.shortcut) {
          e.preventDefault();
          action.onClick();
        }
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, loading]);
  
  return (
    <Dialog>
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}>
          {/* Header with icon */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>{style.icon}</span>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: style.color }}>
              {title}
            </h2>
          </div>
          
          {/* Message */}
          <p style={{ marginBottom: '24px', color: '#4b5563' }}>{message}</p>
          
          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  backgroundColor: action.variant === 'danger' ? '#ef4444' : 
                                   action.variant === 'primary' ? '#3b82f6' : '#e5e7eb',
                  color: action.variant === 'secondary' ? '#374151' : 'white',
                }}
              >
                {loading && index === 0 ? 'Processing...' : action.label}
                {action.shortcut && ` (${action.shortcut})`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

// Example 1: Basic confirmation dialog
export function BasicConfirmation() {
  const [showDialog, setShowDialog] = useState(false);
  const [result, setResult] = useState<string>('');
  
  return (
    <div>
      <button onClick={() => setShowDialog(true)}>Show Basic Confirmation</button>
      
      {showDialog && (
        <ConfirmationDialog
          title="Confirm Action"
          message="Are you sure you want to proceed with this action?"
          actions={[
            {
              label: 'Cancel',
              onClick: () => {
                setResult('Cancelled');
                setShowDialog(false);
              },
              variant: 'secondary',
              shortcut: 'Escape',
            },
            {
              label: 'Confirm',
              onClick: () => {
                setResult('Confirmed');
                setShowDialog(false);
              },
              variant: 'primary',
              shortcut: 'Enter',
            },
          ]}
          onClose={() => setShowDialog(false)}
        />
      )}
      
      {result && <p>Result: {result}</p>}
    </div>
  );
}

// Example 2: Delete confirmation with loading state
// This pattern is useful for destructive actions that require server confirmation
export function DeleteConfirmation() {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  
  // Async delete handler that shows loading state
  // In a real app, this would make an API call
  const handleDelete = async () => {
    setLoading(true);
    try {
      // Simulate async delete operation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDeleted(true);
      setShowDialog(false);
    } catch (error) {
      // Handle error case
      console.error('Delete failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button onClick={() => setShowDialog(true)}>Delete Item</button>
      
      {showDialog && (
        <ConfirmationDialog
          type="warning"
          title="Delete Item"
          message="This action cannot be undone. Are you sure you want to delete this item?"
          loading={loading}
          actions={[
            {
              label: 'Cancel',
              onClick: () => setShowDialog(false),
              variant: 'secondary',
              shortcut: 'Escape',
            },
            {
              label: 'Delete',
              onClick: handleDelete,
              variant: 'danger',
              shortcut: 'Enter',
            },
          ]}
          onClose={() => setShowDialog(false)}
        />
      )}
      
      {deleted && <p style={{ color: '#ef4444' }}>Item deleted successfully!</p>}
    </div>
  );
}

// Example 3: Form inside dialog
export function FormDialog() {
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  
  // Create dialog with form-specific settings
  const dialogInstance = createDialogWithImplementation({
    open: showDialog,
    closeOnBackdropClick: false, // Prevent accidental closure
    ariaLabel: 'User Information Form',
    onOpenChange: setShowDialog,
  });
  
  const Dialog = dialogInstance.connect(reactAdapter);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setShowDialog(false);
    // Reset form
    setFormData({ name: '', email: '' });
  };
  
  return (
    <div>
      <button onClick={() => setShowDialog(true)}>Open Form Dialog</button>
      
      <Dialog>
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              User Information
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '4px' }}>
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '4px' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
      
      {submitted && (
        <p style={{ color: '#10b981' }}>
          Form submitted! Name: {formData.name}, Email: {formData.email}
        </p>
      )}
    </div>
  );
}

// Example 4: Different dialog types showcase
export function DialogTypesShowcase() {
  const [dialogType, setDialogType] = useState<DialogType | null>(null);
  
  const dialogConfigs: Record<DialogType, { title: string; message: string }> = {
    info: {
      title: 'Information',
      message: 'This is an informational message to keep you updated.',
    },
    warning: {
      title: 'Warning',
      message: 'Please be careful. This action may have consequences.',
    },
    error: {
      title: 'Error Occurred',
      message: 'Something went wrong. Please try again or contact support.',
    },
    success: {
      title: 'Success!',
      message: 'Your operation completed successfully.',
    },
  };
  
  return (
    <div>
      <h3>Dialog Types</h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {(Object.keys(dialogConfigs) as DialogType[]).map(type => (
          <button
            key={type}
            onClick={() => setDialogType(type)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            Show {type}
          </button>
        ))}
      </div>
      
      {dialogType && (
        <ConfirmationDialog
          type={dialogType}
          title={dialogConfigs[dialogType].title}
          message={dialogConfigs[dialogType].message}
          actions={[
            {
              label: 'Got it',
              onClick: () => setDialogType(null),
              variant: 'primary',
              shortcut: 'Enter',
            },
          ]}
          onClose={() => setDialogType(null)}
        />
      )}
    </div>
  );
}

// Main example component that showcases all patterns
export function DialogExamples() {
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Dialog Component Examples</h1>
      <p style={{ marginBottom: '32px', color: '#6b7280' }}>
        These examples demonstrate various dialog patterns including confirmations,
        forms, async operations, and proper accessibility.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <section>
          <h2>Basic Confirmation</h2>
          <p>Simple yes/no confirmation with keyboard shortcuts (Enter/Escape)</p>
          <BasicConfirmation />
        </section>
        
        <section>
          <h2>Delete with Loading State</h2>
          <p>Async operation with loading state and disabled interactions</p>
          <DeleteConfirmation />
        </section>
        
        <section>
          <h2>Form Dialog</h2>
          <p>Dialog containing a form with proper focus management</p>
          <FormDialog />
        </section>
        
        <section>
          <h2>Dialog Types</h2>
          <p>Different dialog types for various use cases</p>
          <DialogTypesShowcase />
        </section>
      </div>
      
      <div style={{ marginTop: '48px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3>Key Features Demonstrated:</h3>
        <ul>
          <li>✓ Reusable confirmation dialog pattern</li>
          <li>✓ Different dialog types (info, warning, error, success)</li>
          <li>✓ Custom actions with variants</li>
          <li>✓ Form inside dialog with focus management</li>
          <li>✓ Async operation handling with loading states</li>
          <li>✓ Keyboard shortcuts (Enter to confirm, Escape to cancel)</li>
          <li>✓ Proper ARIA attributes and roles</li>
          <li>✓ Prevent closing during async operations</li>
          <li>✓ TypeScript types for type safety</li>
        </ul>
      </div>
    </div>
  );
}

export default DialogExamples;