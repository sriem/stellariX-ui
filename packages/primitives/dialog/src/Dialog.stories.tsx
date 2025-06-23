/**
 * Dialog Component Stories
 * Placeholder story for the Dialog component
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Primitives/Dialog',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Dialog component is not yet implemented.

## Planned Features
- Modal and non-modal variants
- Customizable header, body, and footer
- Focus management
- Keyboard navigation (Escape to close)
- Click outside to close
- Animation support
- Accessibility compliant (WCAG 2.1 AA)

## Use Cases
- Confirmation dialogs
- Form dialogs
- Alert messages
- Content modals
- Image lightboxes
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {
  render: () => (
    <div style={{ 
      padding: '40px', 
      border: '2px dashed #ccc', 
      borderRadius: '8px',
      textAlign: 'center',
      color: '#666'
    }}>
      <h3>Dialog Component</h3>
      <p>Not yet implemented</p>
      <p style={{ fontSize: '14px', marginTop: '20px' }}>
        The Dialog component will be implemented as part of Task 23
      </p>
    </div>
  ),
};