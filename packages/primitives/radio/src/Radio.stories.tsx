/**
 * Radio Component Stories
 * Comprehensive Storybook stories showcasing all features and states
 */

import type { Meta, StoryObj } from '@storybook/react';
import { createRadio } from './index';
import { reactAdapter } from '@stellarix/adapters/react';
import { useState } from 'react';

// Create Radio component
const radioCore = createRadio({ name: 'default', value: 'default' });
const Radio = reactAdapter.createComponent(radioCore);

const meta: Meta<typeof Radio> = {
    title: 'Primitives/Radio',
    component: Radio,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A radio input component for selecting one option from a group. Radio buttons are mutually exclusive - only one can be selected at a time.',
            },
        },
    },
    argTypes: {
        name: {
            control: 'text',
            description: 'Name attribute for radio group (required)',
        },
        value: {
            control: 'text',
            description: 'Value attribute for this radio option (required)',
        },
        checked: {
            control: 'boolean',
            description: 'Whether the radio is checked',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the radio is disabled',
        },
        required: {
            control: 'boolean',
            description: 'Whether the radio is required',
        },
        id: {
            control: 'text',
            description: 'ID attribute for the radio',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
        onChange: {
            action: 'changed',
            description: 'Callback when checked state changes',
        },
        onFocus: {
            action: 'focused',
            description: 'Callback when radio receives focus',
        },
        onBlur: {
            action: 'blurred',
            description: 'Callback when radio loses focus',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Radio>;

// Base stories demonstrating core functionality
export const Default: Story = {
    args: {
        name: 'default-radio',
        value: 'option1',
        children: 'Default Radio',
    },
};

export const Checked: Story = {
    args: {
        name: 'checked-radio',
        value: 'option1',
        checked: true,
        children: 'Checked Radio',
    },
};

export const Disabled: Story = {
    args: {
        name: 'disabled-radio',
        value: 'option1',
        disabled: true,
        children: 'Disabled Radio',
    },
};

export const DisabledChecked: Story = {
    args: {
        name: 'disabled-checked-radio',
        value: 'option1',
        disabled: true,
        checked: true,
        children: 'Disabled Checked Radio',
    },
};

export const Required: Story = {
    args: {
        name: 'required-radio',
        value: 'option1',
        required: true,
        children: 'Required Radio',
    },
};

// Interactive group story demonstrating radio group behavior
export const RadioGroup: Story = {
    render: () => {
        const [selectedValue, setSelectedValue] = useState<string>('option2');
        
        const handleChange = (checked: boolean, value: string) => {
            if (checked) {
                setSelectedValue(value);
            }
        };

        const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
            { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
        ];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                    Select an option:
                </h3>
                {options.map((option) => {
                    const radioCore = createRadio({
                        name: 'radio-group',
                        value: option.value,
                        checked: selectedValue === option.value,
                        disabled: option.disabled,
                        onChange: handleChange,
                    });
                    const RadioOption = reactAdapter.createComponent(radioCore);
                    
                    return (
                        <label
                            key={option.value}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: option.disabled ? 'not-allowed' : 'pointer',
                                opacity: option.disabled ? 0.6 : 1,
                            }}
                        >
                            <RadioOption />
                            <span>{option.label}</span>
                        </label>
                    );
                })}
                <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>Selected:</strong> {selectedValue}
                </div>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Radio buttons in a group where only one can be selected at a time. Notice how selecting one automatically deselects the others.',
            },
        },
    },
};

// Error state story
export const WithError: Story = {
    render: () => {
        const radioCore = createRadio({
            name: 'error-radio',
            value: 'option1',
            id: 'error-radio',
        });
        
        // Simulate error state
        radioCore.state.setError(true, 'Please select an option');
        
        const RadioWithError = reactAdapter.createComponent(radioCore);
        
        return (
            <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RadioWithError />
                    <span>Option with Error</span>
                </label>
                <div id="error-radio-error" style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>
                    Please select an option
                </div>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Radio with error state and aria-describedby pointing to error message.',
            },
        },
    },
};

// Accessibility showcase
export const AccessibilityFeatures: Story = {
    render: () => {
        const [selectedValue, setSelectedValue] = useState<string>('');
        
        const handleChange = (checked: boolean, value: string) => {
            if (checked) {
                setSelectedValue(value);
            }
        };

        const options = [
            { value: 'accessibility1', label: 'Focus with Tab key' },
            { value: 'accessibility2', label: 'Select with Space key' },
            { value: 'accessibility3', label: 'Navigate with Arrow keys (future)' },
        ];

        return (
            <fieldset style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '4px' }}>
                <legend style={{ fontWeight: '600', padding: '0 8px' }}>
                    Accessibility Features (Required)
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    {options.map((option) => {
                        const radioCore = createRadio({
                            name: 'accessibility-group',
                            value: option.value,
                            checked: selectedValue === option.value,
                            required: true,
                            onChange: handleChange,
                        });
                        const RadioOption = reactAdapter.createComponent(radioCore);
                        
                        return (
                            <label
                                key={option.value}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                }}
                            >
                                <RadioOption />
                                <span>{option.label}</span>
                            </label>
                        );
                    })}
                </div>
                <div style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
                    <p><strong>Keyboard Navigation:</strong></p>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                        <li>Tab: Move focus between radio buttons</li>
                        <li>Space: Select the focused radio button</li>
                        <li>Arrow keys: Navigate within radio group (future enhancement)</li>
                    </ul>
                </div>
            </fieldset>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates accessibility features including proper ARIA attributes, keyboard navigation, and required field handling.',
            },
        },
    },
};

// Comprehensive showcase of all states and variations
export const Showcase: Story = {
    render: () => {
        const [groupValues, setGroupValues] = useState<Record<string, string>>({
            'basic-group': 'option2',
            'disabled-group': 'disabled2',
            'required-group': '',
        });
        
        const handleGroupChange = (groupName: string) => (checked: boolean, value: string) => {
            if (checked) {
                setGroupValues(prev => ({
                    ...prev,
                    [groupName]: value,
                }));
            }
        };

        const createRadioSet = (
            groupName: string,
            title: string,
            options: Array<{ value: string; label: string; disabled?: boolean; required?: boolean }>
        ) => {
            return (
                <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333' }}>
                        {title}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {options.map((option) => {
                            const radioCore = createRadio({
                                name: groupName,
                                value: option.value,
                                checked: groupValues[groupName] === option.value,
                                disabled: option.disabled,
                                required: option.required,
                                onChange: handleGroupChange(groupName),
                            });
                            const RadioOption = reactAdapter.createComponent(radioCore);
                            
                            return (
                                <label
                                    key={option.value}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: option.disabled ? 'not-allowed' : 'pointer',
                                        opacity: option.disabled ? 0.6 : 1,
                                        fontSize: '14px',
                                    }}
                                >
                                    <RadioOption />
                                    <span>{option.label}</span>
                                </label>
                            );
                        })}
                    </div>
                    <div style={{ 
                        marginTop: '8px', 
                        padding: '6px 8px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#666'
                    }}>
                        Selected: {groupValues[groupName] || 'None'}
                    </div>
                </div>
            );
        };

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1000px' }}>
                {createRadioSet('basic-group', 'Basic Radio Group', [
                    { value: 'option1', label: 'First Option' },
                    { value: 'option2', label: 'Second Option (Pre-selected)' },
                    { value: 'option3', label: 'Third Option' },
                ])}
                
                {createRadioSet('disabled-group', 'With Disabled Options', [
                    { value: 'disabled1', label: 'Enabled Option' },
                    { value: 'disabled2', label: 'Selected & Disabled', disabled: true },
                    { value: 'disabled3', label: 'Disabled Option', disabled: true },
                ])}
                
                {createRadioSet('required-group', 'Required Field Group', [
                    { value: 'required1', label: 'Required Option 1', required: true },
                    { value: 'required2', label: 'Required Option 2', required: true },
                    { value: 'required3', label: 'Required Option 3', required: true },
                ])}
                
                <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333' }}>
                        Individual States
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { core: createRadio({ name: 'single1', value: 'unchecked', checked: false }), label: 'Unchecked', disabled: false },
                            { core: createRadio({ name: 'single2', value: 'checked', checked: true }), label: 'Checked', disabled: false },
                            { core: createRadio({ name: 'single3', value: 'disabled', disabled: true }), label: 'Disabled', disabled: true },
                            { core: createRadio({ name: 'single4', value: 'disabled-checked', disabled: true, checked: true }), label: 'Disabled + Checked', disabled: true },
                        ].map((item, index) => {
                            const RadioSingle = reactAdapter.createComponent(item.core);
                            return (
                                <label
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '14px',
                                        cursor: item.disabled ? 'not-allowed' : 'pointer',
                                        opacity: item.disabled ? 0.6 : 1,
                                    }}
                                >
                                    <RadioSingle />
                                    <span>{item.label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Complete showcase of all radio button variations, states, and behaviors including groups, disabled states, and individual components.',
            },
        },
    },
};