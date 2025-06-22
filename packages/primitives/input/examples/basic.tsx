import React from 'react';
import { createInputWithImplementation } from '../src';
import { reactAdapter } from '@stellarix/react';

// Create input instances with different configurations
const basicInput = createInputWithImplementation();
const BasicInput = basicInput.connect(reactAdapter);

const emailInput = createInputWithImplementation({
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
});
const EmailInput = emailInput.connect(reactAdapter);

const passwordInput = createInputWithImplementation({
    type: 'password',
    placeholder: 'Enter password',
});
const PasswordInput = passwordInput.connect(reactAdapter);

const largeInput = createInputWithImplementation({
    size: 'lg',
    placeholder: 'Large input field',
});
const LargeInput = largeInput.connect(reactAdapter);

export function InputExamples() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
            <h2>Input Component Examples</h2>
            
            <div>
                <h3>Basic Input</h3>
                <BasicInput />
            </div>
            
            <div>
                <h3>Email Input (Required)</h3>
                <EmailInput />
            </div>
            
            <div>
                <h3>Password Input</h3>
                <PasswordInput />
            </div>
            
            <div>
                <h3>Large Input</h3>
                <LargeInput />
            </div>
            
            <div>
                <h3>Disabled Input</h3>
                <BasicInput disabled value="Disabled input" />
            </div>
            
            <div>
                <h3>Input with Error</h3>
                <EmailInput error errorMessage="Invalid email address" />
            </div>
        </div>
    );
}