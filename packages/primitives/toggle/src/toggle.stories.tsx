/**
 * Toggle Component Stories
 * Comprehensive showcase of all Toggle features
 */

import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createToggleWithImplementation } from './index';
import { reactAdapter } from '@stellarix/react';

const meta: Meta = {
    title: 'Primitives/Toggle',
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Create a React component for the Toggle
const ToggleComponent = (props: any) => {
    const [component] = useState(() => {
        const toggle = createToggleWithImplementation(props);
        return toggle.connect(reactAdapter);
    });
    
    // Subscribe to state changes for display
    const [toggleState, setToggleState] = useState(() => component.state.getState());
    
    useEffect(() => {
        const unsubscribe = component.state.subscribe(setToggleState);
        return unsubscribe;
    }, [component]);
    
    return (
        <div style={{ padding: '20px' }}>
            <component.root />
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                State: {toggleState.checked ? 'On' : 'Off'} | 
                Focused: {toggleState.focused ? 'Yes' : 'No'} | 
                Disabled: {toggleState.disabled ? 'Yes' : 'No'}
            </div>
        </div>
    );
};

// Default toggle
export const Default: Story = {
    render: () => <ToggleComponent />
};

// Initially checked
export const Checked: Story = {
    render: () => <ToggleComponent checked={true} />
};

// Disabled states
export const Disabled: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '20px' }}>
            <ToggleComponent disabled={true} checked={false} />
            <ToggleComponent disabled={true} checked={true} />
        </div>
    )
};

// Size variants
export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <ToggleComponent size="sm" />
            <ToggleComponent size="md" />
            <ToggleComponent size="lg" />
        </div>
    )
};

// With labels
export const WithLabels: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ToggleComponent label="Enable notifications" />
            <ToggleComponent label="Dark mode" checked={true} />
            <ToggleComponent label="Auto-save" disabled={true} />
        </div>
    )
};

// Interactive demo
export const Interactive: Story = {
    render: () => {
        const [checked, setChecked] = useState(false);
        const [changeCount, setChangeCount] = useState(0);
        
        return (
            <div>
                <ToggleComponent 
                    checked={checked}
                    onChange={(newChecked) => {
                        setChecked(newChecked);
                        setChangeCount(count => count + 1);
                    }}
                />
                <div style={{ marginTop: '20px' }}>
                    <p>Toggle is: <strong>{checked ? 'On' : 'Off'}</strong></p>
                    <p>Changed {changeCount} times</p>
                </div>
            </div>
        );
    }
};

// Showcase all variations
export const Showcase: Story = {
    render: () => (
        <div style={{ padding: '20px' }}>
            <h3>Toggle Component Showcase</h3>
            
            <div style={{ marginTop: '20px' }}>
                <h4>States</h4>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                    <div>
                        <p style={{ fontSize: '12px', marginBottom: '5px' }}>Default (Off)</p>
                        <ToggleComponent />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', marginBottom: '5px' }}>Checked (On)</p>
                        <ToggleComponent checked={true} />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', marginBottom: '5px' }}>Disabled Off</p>
                        <ToggleComponent disabled={true} />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', marginBottom: '5px' }}>Disabled On</p>
                        <ToggleComponent disabled={true} checked={true} />
                    </div>
                </div>
            </div>
            
            <div style={{ marginTop: '30px' }}>
                <h4>Sizes</h4>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '10px' }}>
                    <div>
                        <p style={{ fontSize: '12px', marginBottom: '5px' }}>Small</p>
                        <ToggleComponent size="sm" />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', marginBottom: '5px' }}>Medium</p>
                        <ToggleComponent size="md" />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', marginBottom: '5px' }}>Large</p>
                        <ToggleComponent size="lg" />
                    </div>
                </div>
            </div>
            
            <div style={{ marginTop: '30px' }}>
                <h4>With Labels</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                    <ToggleComponent label="Wi-Fi" />
                    <ToggleComponent label="Bluetooth" checked={true} />
                    <ToggleComponent label="Airplane Mode" disabled={true} />
                    <ToggleComponent label="Location Services" disabled={true} checked={true} />
                </div>
            </div>
            
            <div style={{ marginTop: '30px' }}>
                <h4>Keyboard Navigation</h4>
                <p style={{ fontSize: '12px', marginBottom: '10px' }}>
                    Use Tab to focus and Space to toggle
                </p>
                <ToggleComponent label="Keyboard accessible toggle" />
            </div>
        </div>
    )
};