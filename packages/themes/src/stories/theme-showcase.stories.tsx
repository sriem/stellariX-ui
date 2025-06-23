import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';

// Import all themes
import stellarLight from '../../css/stellar-light.css?raw';
import stellarDark from '../../css/stellar-dark.css?raw';
import auroraLight from '../../css/aurora-light.css?raw';
import auroraDark from '../../css/aurora-dark.css?raw';
import nebulaLight from '../../css/nebula-light.css?raw';
import nebulaDark from '../../css/nebula-dark.css?raw';

// Import all components
import { createButtonWithImplementation } from '../../../primitives/button/src';
import { createCardWithImplementation } from '../../../primitives/card/src';
import { createBadgeWithImplementation } from '../../../primitives/badge/src';
import { createAlertWithImplementation } from '../../../primitives/alert/src';
import { createAvatarWithImplementation } from '../../../primitives/avatar/src';
import { createCheckboxWithImplementation } from '../../../primitives/checkbox/src';
import { createRadioWithImplementation } from '../../../primitives/radio/src';
import { createToggleWithImplementation } from '../../../primitives/toggle/src';
import { createInputWithImplementation } from '../../../primitives/input/src';
import { createTextareaWithImplementation } from '../../../primitives/textarea/src';
import { createSpinnerWithImplementation } from '../../../primitives/spinner/src';
import { createDividerWithImplementation } from '../../../primitives/divider/src';
import { createContainerWithImplementation } from '../../../primitives/container/src';

const meta = {
    title: 'Theme Showcase/All Components',
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const themes = {
    'stellar-light': stellarLight,
    'stellar-dark': stellarDark,
    'aurora-light': auroraLight,
    'aurora-dark': auroraDark,
    'nebula-light': nebulaLight,
    'nebula-dark': nebulaDark,
};

// Helper component to manage theme injection
const ThemeProvider = ({ theme, children }: { theme: string; children: React.ReactNode }) => {
    useEffect(() => {
        // Remove existing theme
        const existingStyle = document.getElementById('sx-theme');
        if (existingStyle) {
            existingStyle.remove();
        }

        // Add new theme
        if (theme && themes[theme as keyof typeof themes]) {
            const style = document.createElement('style');
            style.id = 'sx-theme';
            style.textContent = themes[theme as keyof typeof themes];
            document.head.appendChild(style);
        }

        return () => {
            const style = document.getElementById('sx-theme');
            if (style) {
                style.remove();
            }
        };
    }, [theme]);

    return <>{children}</>;
};

// Component wrappers with themed styling
const ThemedButton = ({ variant, size, children, onClick, ...props }: any) => {
    const [button] = useState(() => createButtonWithImplementation({ variant, size, onClick, ...props }));
    const [state, setState] = useState(() => button.state.getState());

    useEffect(() => {
        const unsubscribe = button.state.subscribe(setState);
        return unsubscribe;
    }, [button]);

    const a11yProps = button.logic.getA11yProps('root');
    const handlers = button.logic.getInteractionHandlers('root');

    return (
        <button
            className={`sx-button sx-button--${variant} sx-button--${size}`}
            {...a11yProps}
            {...handlers}
            disabled={state.disabled}
        >
            {children}
        </button>
    );
};

const ThemedCard = ({ variant, padding, children }: any) => {
    const [card] = useState(() => createCardWithImplementation({ variant, padding }));
    const [state, setState] = useState(() => card.state.getState());

    useEffect(() => {
        const unsubscribe = card.state.subscribe(setState);
        return unsubscribe;
    }, [card]);

    const a11yProps = card.logic.getA11yProps('root');
    const handlers = card.logic.getInteractionHandlers('root');

    return (
        <div
            className={`sx-card sx-card--${variant} sx-card--padding-${padding}`}
            {...a11yProps}
            {...handlers}
        >
            {children}
        </div>
    );
};

const ThemedBadge = ({ variant, size, children }: any) => {
    const [badge] = useState(() => createBadgeWithImplementation({ variant, size }));
    const a11yProps = badge.logic.getA11yProps('root');

    return (
        <span
            className={`sx-badge sx-badge--${variant} sx-badge--${size}`}
            {...a11yProps}
        >
            {children}
        </span>
    );
};

const ThemedAlert = ({ variant, children }: any) => {
    const [alert] = useState(() => createAlertWithImplementation({ variant }));
    const [state, setState] = useState(() => alert.state.getState());

    useEffect(() => {
        const unsubscribe = alert.state.subscribe(setState);
        return unsubscribe;
    }, [alert]);

    if (!state.visible) return null;

    const a11yProps = alert.logic.getA11yProps('root');

    return (
        <div
            className={`sx-alert sx-alert--${variant}`}
            {...a11yProps}
        >
            {children}
        </div>
    );
};

const ThemedInput = ({ type = 'text', placeholder, value, onChange, ...props }: any) => {
    const [input] = useState(() => createInputWithImplementation({ type, placeholder, value, onChange, ...props }));
    const [state, setState] = useState(() => input.state.getState());

    useEffect(() => {
        const unsubscribe = input.state.subscribe(setState);
        return unsubscribe;
    }, [input]);

    const a11yProps = input.logic.getA11yProps('input');
    const handlers = input.logic.getInteractionHandlers('input');

    return (
        <input
            className="sx-input"
            type={type}
            value={state.value}
            placeholder={placeholder}
            disabled={state.disabled}
            readOnly={state.readonly}
            {...a11yProps}
            {...handlers}
        />
    );
};

const ThemedTextarea = ({ placeholder, rows = 4, value, onChange, ...props }: any) => {
    const [textarea] = useState(() => createTextareaWithImplementation({ placeholder, rows, value, onChange, ...props }));
    const [state, setState] = useState(() => textarea.state.getState());

    useEffect(() => {
        const unsubscribe = textarea.state.subscribe(setState);
        return unsubscribe;
    }, [textarea]);

    const a11yProps = textarea.logic.getA11yProps('root');
    const handlers = textarea.logic.getInteractionHandlers('root');

    return (
        <textarea
            className="sx-textarea"
            value={state.value}
            placeholder={placeholder}
            rows={state.rows}
            disabled={state.disabled}
            readOnly={state.readonly}
            {...a11yProps}
            {...handlers}
        />
    );
};

const ThemedCheckbox = ({ label, checked, onChange, ...props }: any) => {
    const [checkbox] = useState(() => createCheckboxWithImplementation({ checked, onChange, ...props }));
    const [state, setState] = useState(() => checkbox.state.getState());

    useEffect(() => {
        const unsubscribe = checkbox.state.subscribe(setState);
        return unsubscribe;
    }, [checkbox]);

    const a11yProps = checkbox.logic.getA11yProps('root');
    const handlers = checkbox.logic.getInteractionHandlers('root');

    return (
        <label className="sx-checkbox-wrapper">
            <div
                className={`sx-checkbox ${state.checked ? 'sx-checkbox--checked' : ''}`}
                {...a11yProps}
                {...handlers}
            >
                {state.checked && (
                    <svg viewBox="0 0 16 16" className="sx-checkbox__icon">
                        <path
                            d="M13.5 3.5L6 11L2.5 7.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                )}
            </div>
            <span className="sx-checkbox-label">{label}</span>
        </label>
    );
};

const ThemedToggle = ({ label, checked, onChange, ...props }: any) => {
    const [toggle] = useState(() => createToggleWithImplementation({ checked, onChange, ...props }));
    const [state, setState] = useState(() => toggle.state.getState());

    useEffect(() => {
        const unsubscribe = toggle.state.subscribe(setState);
        return unsubscribe;
    }, [toggle]);

    const a11yProps = toggle.logic.getA11yProps('root');
    const handlers = toggle.logic.getInteractionHandlers('root');

    return (
        <label className="sx-toggle-wrapper">
            <div
                className={`sx-toggle ${state.checked ? 'sx-toggle--checked' : ''}`}
                {...a11yProps}
                {...handlers}
            >
                <div className="sx-toggle__track" />
                <div className="sx-toggle__thumb" />
            </div>
            <span className="sx-toggle-label">{label}</span>
        </label>
    );
};

const ThemedSpinner = ({ size = 'md' }: any) => {
    const [spinner] = useState(() => createSpinnerWithImplementation({ size }));
    const a11yProps = spinner.logic.getA11yProps('root');

    return (
        <div
            className={`sx-spinner sx-spinner--${size}`}
            {...a11yProps}
        >
            <div className="sx-spinner__circle" />
        </div>
    );
};

export const CompleteShowcase: Story = {
    render: () => {
        const [currentTheme, setCurrentTheme] = useState('stellar-light');

        return (
            <ThemeProvider theme={currentTheme}>
                <div style={{ 
                    minHeight: '100vh', 
                    padding: '2rem',
                    backgroundColor: 'var(--sx-background, #f8fafc)',
                    color: 'var(--sx-foreground, #0f172a)',
                }}>
                    {/* Theme Selector */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ marginBottom: '1rem' }}>StellarIX Theme Showcase</h1>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {Object.keys(themes).map((theme) => (
                                <ThemedButton
                                    key={theme}
                                    variant={currentTheme === theme ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentTheme(theme)}
                                >
                                    {theme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </ThemedButton>
                            ))}
                        </div>
                    </div>

                    {/* Component Grid */}
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {/* Buttons Section */}
                        <ThemedCard variant="outlined" padding="lg">
                            <h2 style={{ marginBottom: '1rem' }}>Buttons</h2>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <ThemedButton variant="primary" size="sm">Primary Small</ThemedButton>
                                <ThemedButton variant="primary" size="md">Primary Medium</ThemedButton>
                                <ThemedButton variant="primary" size="lg">Primary Large</ThemedButton>
                                <ThemedButton variant="secondary" size="md">Secondary</ThemedButton>
                                <ThemedButton variant="outline" size="md">Outline</ThemedButton>
                                <ThemedButton variant="ghost" size="md">Ghost</ThemedButton>
                                <ThemedButton variant="danger" size="md">Danger</ThemedButton>
                                <ThemedButton variant="primary" size="md" disabled>Disabled</ThemedButton>
                            </div>
                        </ThemedCard>

                        {/* Badges & Alerts */}
                        <ThemedCard variant="outlined" padding="lg">
                            <h2 style={{ marginBottom: '1rem' }}>Badges & Alerts</h2>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'start', marginBottom: '1rem' }}>
                                <ThemedBadge variant="primary" size="sm">Primary</ThemedBadge>
                                <ThemedBadge variant="secondary" size="sm">Secondary</ThemedBadge>
                                <ThemedBadge variant="success" size="sm">Success</ThemedBadge>
                                <ThemedBadge variant="warning" size="sm">Warning</ThemedBadge>
                                <ThemedBadge variant="danger" size="sm">Danger</ThemedBadge>
                                <ThemedBadge variant="info" size="sm">Info</ThemedBadge>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <ThemedAlert variant="info">This is an info alert message</ThemedAlert>
                                <ThemedAlert variant="success">This is a success alert message</ThemedAlert>
                                <ThemedAlert variant="warning">This is a warning alert message</ThemedAlert>
                                <ThemedAlert variant="error">This is an error alert message</ThemedAlert>
                            </div>
                        </ThemedCard>

                        {/* Form Controls */}
                        <ThemedCard variant="outlined" padding="lg">
                            <h2 style={{ marginBottom: '1rem' }}>Form Controls</h2>
                            <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
                                <ThemedInput placeholder="Enter your name..." />
                                <ThemedInput type="email" placeholder="Enter your email..." />
                                <ThemedInput type="password" placeholder="Enter password..." />
                                <ThemedTextarea placeholder="Enter your message..." rows={3} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <ThemedCheckbox label="Accept terms" />
                                    <ThemedToggle label="Enable notifications" />
                                </div>
                            </div>
                        </ThemedCard>

                        {/* Cards */}
                        <div>
                            <h2 style={{ marginBottom: '1rem' }}>Card Variants</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                <ThemedCard variant="simple" padding="md">
                                    <h3>Simple Card</h3>
                                    <p>This is a simple card with basic styling</p>
                                </ThemedCard>
                                <ThemedCard variant="outlined" padding="md">
                                    <h3>Outlined Card</h3>
                                    <p>This card has a border outline</p>
                                </ThemedCard>
                                <ThemedCard variant="elevated" padding="md">
                                    <h3>Elevated Card</h3>
                                    <p>This card has shadow elevation</p>
                                </ThemedCard>
                                <ThemedCard variant="filled" padding="md">
                                    <h3>Filled Card</h3>
                                    <p>This card has a filled background</p>
                                </ThemedCard>
                            </div>
                        </div>

                        {/* Loading States */}
                        <ThemedCard variant="outlined" padding="lg">
                            <h2 style={{ marginBottom: '1rem' }}>Loading States</h2>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <ThemedSpinner size="sm" />
                                <ThemedSpinner size="md" />
                                <ThemedSpinner size="lg" />
                                <ThemedButton variant="primary" size="md" disabled>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <ThemedSpinner size="sm" />
                                        Loading...
                                    </span>
                                </ThemedButton>
                            </div>
                        </ThemedCard>
                    </div>
                </div>
            </ThemeProvider>
        );
    },
};

export const InteractivePlayground: Story = {
    render: () => {
        const [currentTheme, setCurrentTheme] = useState('stellar-light');
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            message: '',
            subscribe: false,
            notifications: true,
        });

        return (
            <ThemeProvider theme={currentTheme}>
                <div style={{ 
                    minHeight: '100vh', 
                    padding: '2rem',
                    backgroundColor: 'var(--sx-background, #f8fafc)',
                    color: 'var(--sx-foreground, #0f172a)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <ThemedCard variant="elevated" padding="xl">
                        <div style={{ maxWidth: '500px' }}>
                            <h2 style={{ marginBottom: '0.5rem' }}>Interactive Form Demo</h2>
                            <p style={{ marginBottom: '2rem', opacity: 0.7 }}>
                                Try different themes to see how components adapt
                            </p>

                            {/* Theme Selector */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Select Theme
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {Object.keys(themes).map((theme) => (
                                        <ThemedButton
                                            key={theme}
                                            variant={currentTheme === theme ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => setCurrentTheme(theme)}
                                        >
                                            {theme.split('-')[0]}
                                        </ThemedButton>
                                    ))}
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                            Name
                                        </label>
                                        <ThemedInput
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                            Email
                                        </label>
                                        <ThemedInput
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                            Message
                                        </label>
                                        <ThemedTextarea
                                            placeholder="Your message here..."
                                            value={formData.message}
                                            onChange={(e: any) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '2rem' }}>
                                        <ThemedCheckbox 
                                            label="Subscribe to newsletter"
                                            checked={formData.subscribe}
                                            onChange={() => setFormData({ ...formData, subscribe: !formData.subscribe })}
                                        />
                                        <ThemedToggle 
                                            label="Email notifications"
                                            checked={formData.notifications}
                                            onChange={() => setFormData({ ...formData, notifications: !formData.notifications })}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <ThemedButton variant="primary" size="md" type="submit">
                                            Submit Form
                                        </ThemedButton>
                                        <ThemedButton 
                                            variant="outline" 
                                            size="md" 
                                            type="button"
                                            onClick={() => setFormData({
                                                name: '',
                                                email: '',
                                                message: '',
                                                subscribe: false,
                                                notifications: true,
                                            })}
                                        >
                                            Reset
                                        </ThemedButton>
                                    </div>
                                </div>
                            </form>

                            {/* Form Data Display */}
                            {(formData.name || formData.email || formData.message) && (
                                <ThemedAlert variant="info" style={{ marginTop: '2rem' }}>
                                    <strong>Form Data:</strong>
                                    <pre style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                                        {JSON.stringify(formData, null, 2)}
                                    </pre>
                                </ThemedAlert>
                            )}
                        </div>
                    </ThemedCard>
                </div>
            </ThemeProvider>
        );
    },
};