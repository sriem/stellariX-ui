import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { createTextareaWithImplementation } from '../src';

const meta = {
    title: 'Primitives/Textarea',
    component: () => null,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to demonstrate the textarea
const TextareaDemo = ({ 
    variant = 'fixed',
    rows = 4,
    minRows = 2,
    maxRows = 10,
    disabled = false,
    readonly = false,
    error = false,
    placeholder = 'Enter your text here...',
    maxLength,
    required = false,
    resize = 'vertical',
    initialValue = ''
}: {
    variant?: 'fixed' | 'autogrow';
    rows?: number;
    minRows?: number;
    maxRows?: number;
    disabled?: boolean;
    readonly?: boolean;
    error?: boolean;
    placeholder?: string;
    maxLength?: number;
    required?: boolean;
    resize?: 'none' | 'horizontal' | 'vertical' | 'both';
    initialValue?: string;
}) => {
    const [textarea] = useState(() => createTextareaWithImplementation({
        value: initialValue,
        variant,
        rows,
        minRows,
        maxRows,
        disabled,
        readonly,
        error,
        placeholder,
        maxLength,
        required,
        resize,
        onChange: (value) => console.log('Textarea changed:', value),
        onFocus: () => console.log('Textarea focused'),
        onBlur: () => console.log('Textarea blurred'),
    }));

    const [state, setState] = useState(() => textarea.state.getState());
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        const unsubscribe = textarea.state.subscribe(setState);
        return unsubscribe;
    }, [textarea]);

    useEffect(() => {
        setCharCount(textarea.state.getCharCount());
    }, [state.value, textarea]);

    const logic = textarea.logic;
    const a11yProps = logic.getA11yProps('root');
    const handlers = logic.getInteractionHandlers('root');

    const baseStyles = {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        backgroundColor: state.disabled ? '#f8fafc' : '#ffffff',
        color: state.disabled ? '#94a3b8' : '#0f172a',
        width: '300px',
        minHeight: '80px',
        resize: resize as any,
        transition: 'all 0.2s ease',
        outline: 'none',
        cursor: state.disabled ? 'not-allowed' : state.readonly ? 'default' : 'text',
    };

    const focusedStyles = state.focused ? {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    } : {};

    const errorStyles = state.error ? {
        borderColor: '#ef4444',
        boxShadow: state.focused ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : undefined,
    } : {};

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
                {...a11yProps}
                {...handlers}
                value={state.value}
                style={{
                    ...baseStyles,
                    ...focusedStyles,
                    ...errorStyles,
                }}
            />
            {maxLength && (
                <div style={{ 
                    fontSize: '12px', 
                    color: charCount > maxLength ? '#ef4444' : '#64748b',
                    textAlign: 'right' 
                }}>
                    {charCount}/{maxLength}
                </div>
            )}
            {state.error && (
                <div style={{ fontSize: '12px', color: '#ef4444' }}>
                    This field has an error
                </div>
            )}
        </div>
    );
};

export const Default: Story = {
    render: () => <TextareaDemo />,
};

export const Autogrow: Story = {
    render: () => <TextareaDemo variant="autogrow" initialValue="Start typing and watch me grow!\n\nAdd more lines..." />,
};

export const Disabled: Story = {
    render: () => <TextareaDemo disabled initialValue="This textarea is disabled" />,
};

export const Readonly: Story = {
    render: () => <TextareaDemo readonly initialValue="This textarea is readonly. You can select and copy text but not edit it." />,
};

export const Error: Story = {
    render: () => <TextareaDemo error initialValue="This field has an error" />,
};

export const WithMaxLength: Story = {
    render: () => <TextareaDemo maxLength={100} initialValue="Type here and watch the character count..." />,
};

export const Required: Story = {
    render: () => <TextareaDemo required placeholder="This field is required *" />,
};

export const NoResize: Story = {
    render: () => <TextareaDemo resize="none" initialValue="This textarea cannot be resized" />,
};

export const CustomRows: Story = {
    render: () => <TextareaDemo rows={8} initialValue="This textarea has 8 rows by default" />,
};

export const Showcase: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
            <h2 style={{ margin: 0, fontFamily: 'system-ui' }}>Textarea Component Showcase</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                    <h3 style={{ marginBottom: '8px', fontFamily: 'system-ui' }}>Fixed Height</h3>
                    <TextareaDemo variant="fixed" />
                </div>
                
                <div>
                    <h3 style={{ marginBottom: '8px', fontFamily: 'system-ui' }}>Auto-grow</h3>
                    <TextareaDemo variant="autogrow" />
                </div>
                
                <div>
                    <h3 style={{ marginBottom: '8px', fontFamily: 'system-ui' }}>With Character Limit</h3>
                    <TextareaDemo maxLength={150} />
                </div>
                
                <div>
                    <h3 style={{ marginBottom: '8px', fontFamily: 'system-ui' }}>Error State</h3>
                    <TextareaDemo error />
                </div>
                
                <div>
                    <h3 style={{ marginBottom: '8px', fontFamily: 'system-ui' }}>Disabled</h3>
                    <TextareaDemo disabled initialValue="Cannot edit this" />
                </div>
                
                <div>
                    <h3 style={{ marginBottom: '8px', fontFamily: 'system-ui' }}>Readonly</h3>
                    <TextareaDemo readonly initialValue="Can only read this" />
                </div>
            </div>
            
            <div>
                <h3 style={{ marginBottom: '8px', fontFamily: 'system-ui' }}>Resize Options</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: '12px' }}>None</p>
                        <TextareaDemo resize="none" rows={3} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: '12px' }}>Horizontal</p>
                        <TextareaDemo resize="horizontal" rows={3} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: '12px' }}>Vertical (default)</p>
                        <TextareaDemo resize="vertical" rows={3} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: '12px' }}>Both</p>
                        <TextareaDemo resize="both" rows={3} />
                    </div>
                </div>
            </div>
        </div>
    ),
};