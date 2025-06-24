/**
 * Tabs Component Stories
 * Comprehensive showcase of all tabs features and edge cases
 */

import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createTabs } from './index';
import { reactAdapter } from '@stellarix-ui/react';
import type { Tab } from './types';

// Create the React tabs component
const tabs = createTabs();
const Tabs = tabs.connect(reactAdapter);

// Example tab content components
const TabContent = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ padding: '1.5rem' }}>
    <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
    {children}
  </div>
);

const meta: Meta<typeof Tabs> = {
  title: 'Primitives/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A flexible tabs component supporting horizontal and vertical layouts, keyboard navigation, and various states.

## Features
- ✅ Horizontal and vertical orientations
- ✅ Automatic and manual activation modes
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Disabled tabs support
- ✅ Icons support
- ✅ Lazy loading content
- ✅ Full accessibility support (WCAG 2.1 AA)
- ✅ Focus management
- ✅ Controlled and uncontrolled modes

## Keyboard Navigation
- **Arrow Right/Down**: Next tab (horizontal/vertical)
- **Arrow Left/Up**: Previous tab (horizontal/vertical)
- **Home**: First tab
- **End**: Last tab
- **Enter/Space**: Activate tab (manual mode only)

## Accessibility
- Uses semantic ARIA roles (tablist, tab, tabpanel)
- Proper focus management with roving tabindex
- Screen reader friendly
- Keyboard navigation support
        `,
      },
    },
  },
  argTypes: {
    activeTab: {
      control: 'text',
      description: 'Currently active tab ID',
    },
    tabs: {
      control: 'object',
      description: 'Array of tab configurations',
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Tabs orientation',
      defaultValue: 'horizontal',
    },
    activationMode: {
      control: { type: 'select' },
      options: ['automatic', 'manual'],
      description: 'Tab activation mode',
      defaultValue: 'automatic',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether all tabs are disabled',
    },
    onChange: { action: 'changed' },
  },
  args: {
    tabs: [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
      { id: 'tab3', label: 'Tab 3' },
    ],
    orientation: 'horizontal',
    activationMode: 'automatic',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    useEffect(() => {
      const unsubscribe = tabs.state.subscribe((state) => {
        setActiveTab(state.activeTab || 'tab1');
      });
      return unsubscribe;
    }, []);
    
    return (
      <Tabs {...args} activeTab={activeTab} onChange={setActiveTab}>
        <TabContent title="First Tab">
          <p>This is the content of the first tab. It contains some example text to demonstrate the tab functionality.</p>
        </TabContent>
        <TabContent title="Second Tab">
          <p>This is the content of the second tab. You can navigate between tabs using the mouse or keyboard.</p>
        </TabContent>
        <TabContent title="Third Tab">
          <p>This is the content of the third tab. Try using the arrow keys to navigate!</p>
        </TabContent>
      </Tabs>
    );
  },
};

// Vertical orientation
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    return (
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Tabs {...args} activeTab={activeTab} onChange={setActiveTab}>
          <TabContent title="Vertical Tab 1">
            <p>In vertical mode, use the Up and Down arrow keys to navigate between tabs.</p>
          </TabContent>
          <TabContent title="Vertical Tab 2">
            <p>The tab list is displayed vertically on the left side of the content.</p>
          </TabContent>
          <TabContent title="Vertical Tab 3">
            <p>This layout is useful for navigation menus or settings panels.</p>
          </TabContent>
        </Tabs>
      </div>
    );
  },
};

// Tabs with icons
export const WithIcons: Story = {
  args: {
    tabs: [
      { id: 'home', label: 'Home', icon: '🏠' },
      { id: 'profile', label: 'Profile', icon: '👤' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
    ],
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('home');
    
    return (
      <Tabs {...args} activeTab={activeTab} onChange={setActiveTab}>
        <TabContent title="Home">
          <p>Welcome to your home dashboard. Here you can see an overview of your activity.</p>
        </TabContent>
        <TabContent title="Profile">
          <p>Manage your profile information and preferences here.</p>
        </TabContent>
        <TabContent title="Settings">
          <p>Configure your application settings and preferences.</p>
        </TabContent>
        <TabContent title="Notifications">
          <p>View and manage your notifications.</p>
        </TabContent>
      </Tabs>
    );
  },
};

// Disabled tabs
export const Disabled: Story = {
  args: {
    tabs: [
      { id: 'available', label: 'Available' },
      { id: 'restricted', label: 'Restricted', disabled: true },
      { id: 'premium', label: 'Premium', disabled: true },
      { id: 'basic', label: 'Basic' },
    ],
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('available');
    
    return (
      <Tabs {...args} activeTab={activeTab} onChange={setActiveTab}>
        <TabContent title="Available Content">
          <p>This tab is available for all users.</p>
        </TabContent>
        <TabContent title="Restricted Content">
          <p>This content requires special permissions.</p>
        </TabContent>
        <TabContent title="Premium Content">
          <p>This content is only available to premium users.</p>
        </TabContent>
        <TabContent title="Basic Content">
          <p>This is basic content available to all users.</p>
        </TabContent>
      </Tabs>
    );
  },
};

// Controlled tabs
export const Controlled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab2');
    const [history, setHistory] = useState<string[]>(['tab2']);
    
    const handleChange = (tabId: string) => {
      setActiveTab(tabId);
      setHistory(prev => [...prev, tabId]);
    };
    
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h4>External Controls:</h4>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={() => handleChange('tab1')}>Go to Tab 1</button>
            <button onClick={() => handleChange('tab2')}>Go to Tab 2</button>
            <button onClick={() => handleChange('tab3')}>Go to Tab 3</button>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Current: {activeTab} | History: {history.join(' → ')}
          </p>
        </div>
        
        <Tabs
          tabs={[
            { id: 'tab1', label: 'First' },
            { id: 'tab2', label: 'Second' },
            { id: 'tab3', label: 'Third' },
          ]}
          activeTab={activeTab}
          onChange={handleChange}
        >
          <TabContent title="First Tab">
            <p>This is a controlled tab component.</p>
          </TabContent>
          <TabContent title="Second Tab">
            <p>The active tab is controlled by external state.</p>
          </TabContent>
          <TabContent title="Third Tab">
            <p>You can control which tab is active programmatically.</p>
          </TabContent>
        </Tabs>
      </div>
    );
  },
};

// Lazy loading demonstration
export const LazyLoad: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set(['tab1']));
    
    const handleChange = (tabId: string) => {
      setActiveTab(tabId);
      setLoadedTabs(prev => new Set([...prev, tabId]));
    };
    
    const LazyContent = ({ tabId, children }: { tabId: string; children: React.ReactNode }) => {
      if (!loadedTabs.has(tabId)) {
        return <div style={{ padding: '1.5rem', color: '#999' }}>Loading...</div>;
      }
      return <>{children}</>;
    };
    
    return (
      <div>
        <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Loaded tabs: {Array.from(loadedTabs).join(', ')}
        </p>
        
        <Tabs
          tabs={[
            { id: 'tab1', label: 'Already Loaded' },
            { id: 'tab2', label: 'Lazy Load 1' },
            { id: 'tab3', label: 'Lazy Load 2' },
            { id: 'tab4', label: 'Lazy Load 3' },
          ]}
          activeTab={activeTab}
          onChange={handleChange}
        >
          <LazyContent tabId="tab1">
            <TabContent title="Pre-loaded Content">
              <p>This content was loaded immediately.</p>
            </TabContent>
          </LazyContent>
          
          <LazyContent tabId="tab2">
            <TabContent title="Lazy Loaded Content 1">
              <p>This content was loaded when you first clicked this tab.</p>
              <p>In a real application, this could be an API call or heavy component.</p>
            </TabContent>
          </LazyContent>
          
          <LazyContent tabId="tab3">
            <TabContent title="Lazy Loaded Content 2">
              <p>Another example of lazy-loaded content.</p>
              <img 
                src="https://via.placeholder.com/300x200" 
                alt="Placeholder" 
                style={{ marginTop: '1rem' }}
              />
            </TabContent>
          </LazyContent>
          
          <LazyContent tabId="tab4">
            <TabContent title="Lazy Loaded Content 3">
              <p>This demonstrates how you can defer loading of heavy content.</p>
              <table style={{ marginTop: '1rem', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                    <th>Column 3</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }, (_, i) => (
                    <tr key={i}>
                      <td>Row {i + 1} Data 1</td>
                      <td>Row {i + 1} Data 2</td>
                      <td>Row {i + 1} Data 3</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabContent>
          </LazyContent>
        </Tabs>
      </div>
    );
  },
};

// Size variations
export const Sizes: Story = {
  render: () => {
    const [activeTabs, setActiveTabs] = useState({
      small: 'tab1',
      medium: 'tab1',
      large: 'tab1',
    });
    
    const tabConfigs = [
      { id: 'tab1', label: 'First' },
      { id: 'tab2', label: 'Second' },
      { id: 'tab3', label: 'Third' },
    ];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Small Size</h3>
          <div style={{ fontSize: '0.875rem' }}>
            <Tabs
              tabs={tabConfigs}
              activeTab={activeTabs.small}
              onChange={(tabId) => setActiveTabs(prev => ({ ...prev, small: tabId }))}
              className="size-sm"
            >
              <TabContent title="Small Tab Content">
                <p style={{ fontSize: '0.875rem' }}>Content with smaller text size.</p>
              </TabContent>
              <TabContent title="Small Tab Content">
                <p style={{ fontSize: '0.875rem' }}>Another small content area.</p>
              </TabContent>
              <TabContent title="Small Tab Content">
                <p style={{ fontSize: '0.875rem' }}>Third small content area.</p>
              </TabContent>
            </Tabs>
          </div>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Medium Size (Default)</h3>
          <Tabs
            tabs={tabConfigs}
            activeTab={activeTabs.medium}
            onChange={(tabId) => setActiveTabs(prev => ({ ...prev, medium: tabId }))}
          >
            <TabContent title="Medium Tab Content">
              <p>Standard sized content for regular use cases.</p>
            </TabContent>
            <TabContent title="Medium Tab Content">
              <p>Another standard content area.</p>
            </TabContent>
            <TabContent title="Medium Tab Content">
              <p>Third standard content area.</p>
            </TabContent>
          </Tabs>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Large Size</h3>
          <div style={{ fontSize: '1.125rem' }}>
            <Tabs
              tabs={tabConfigs}
              activeTab={activeTabs.large}
              onChange={(tabId) => setActiveTabs(prev => ({ ...prev, large: tabId }))}
              className="size-lg"
            >
              <TabContent title="Large Tab Content">
                <p style={{ fontSize: '1.125rem' }}>Larger text for better visibility.</p>
              </TabContent>
              <TabContent title="Large Tab Content">
                <p style={{ fontSize: '1.125rem' }}>Another large content area.</p>
              </TabContent>
              <TabContent title="Large Tab Content">
                <p style={{ fontSize: '1.125rem' }}>Third large content area.</p>
              </TabContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  },
};

// Comprehensive showcase
export const Showcase: Story = {
  render: () => {
    const [states, setStates] = useState({
      horizontal: 'tab1',
      vertical: 'tab1',
      icons: 'home',
      disabled: 'available',
      manual: 'tab1',
    });
    
    const updateState = (key: string, value: string) => {
      setStates(prev => ({ ...prev, [key]: value }));
    };
    
    return (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Tabs Component Showcase</h2>
        
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Horizontal Tabs (Default)</h3>
          <Tabs
            tabs={[
              { id: 'tab1', label: 'First Tab' },
              { id: 'tab2', label: 'Second Tab' },
              { id: 'tab3', label: 'Third Tab' },
              { id: 'tab4', label: 'Fourth Tab' },
            ]}
            activeTab={states.horizontal}
            onChange={(id) => updateState('horizontal', id)}
          >
            <TabContent title="Content 1">
              <p>Horizontal tabs with automatic activation.</p>
            </TabContent>
            <TabContent title="Content 2">
              <p>Navigate with Left/Right arrow keys.</p>
            </TabContent>
            <TabContent title="Content 3">
              <p>Use Home/End to jump to first/last tab.</p>
            </TabContent>
            <TabContent title="Content 4">
              <p>Tabs activate automatically on focus.</p>
            </TabContent>
          </Tabs>
        </section>
        
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Vertical Tabs</h3>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Tabs
              tabs={[
                { id: 'tab1', label: 'General' },
                { id: 'tab2', label: 'Privacy' },
                { id: 'tab3', label: 'Security' },
                { id: 'tab4', label: 'Advanced' },
              ]}
              orientation="vertical"
              activeTab={states.vertical}
              onChange={(id) => updateState('vertical', id)}
            >
              <TabContent title="General Settings">
                <p>Vertical tabs with Up/Down navigation.</p>
              </TabContent>
              <TabContent title="Privacy Settings">
                <p>Perfect for settings or navigation menus.</p>
              </TabContent>
              <TabContent title="Security Settings">
                <p>Tab list appears on the left side.</p>
              </TabContent>
              <TabContent title="Advanced Settings">
                <p>Content appears on the right.</p>
              </TabContent>
            </Tabs>
          </div>
        </section>
        
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>With Icons</h3>
          <Tabs
            tabs={[
              { id: 'home', label: 'Home', icon: '🏠' },
              { id: 'search', label: 'Search', icon: '🔍' },
              { id: 'favorites', label: 'Favorites', icon: '⭐' },
              { id: 'profile', label: 'Profile', icon: '👤' },
            ]}
            activeTab={states.icons}
            onChange={(id) => updateState('icons', id)}
          >
            <TabContent title="Home Page">
              <p>Icons make tabs more recognizable.</p>
            </TabContent>
            <TabContent title="Search Results">
              <p>Visual cues improve user experience.</p>
            </TabContent>
            <TabContent title="Your Favorites">
              <p>Icons can be emojis or custom components.</p>
            </TabContent>
            <TabContent title="User Profile">
              <p>Framework adapters handle icon rendering.</p>
            </TabContent>
          </Tabs>
        </section>
        
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>With Disabled Tabs</h3>
          <Tabs
            tabs={[
              { id: 'available', label: 'Available' },
              { id: 'locked1', label: 'Locked', disabled: true },
              { id: 'premium', label: 'Premium Only', disabled: true },
              { id: 'basic', label: 'Basic' },
              { id: 'locked2', label: 'Coming Soon', disabled: true },
            ]}
            activeTab={states.disabled}
            onChange={(id) => updateState('disabled', id)}
          >
            <TabContent title="Available Content">
              <p>This tab is accessible to all users.</p>
            </TabContent>
            <TabContent title="Locked Content">
              <p>This content is currently locked.</p>
            </TabContent>
            <TabContent title="Premium Content">
              <p>Upgrade to premium to access this content.</p>
            </TabContent>
            <TabContent title="Basic Content">
              <p>Basic features available to all.</p>
            </TabContent>
            <TabContent title="Coming Soon">
              <p>This feature is under development.</p>
            </TabContent>
          </Tabs>
        </section>
        
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Manual Activation Mode</h3>
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
            In manual mode, use Enter or Space to activate the focused tab.
          </p>
          <Tabs
            tabs={[
              { id: 'tab1', label: 'Manual 1' },
              { id: 'tab2', label: 'Manual 2' },
              { id: 'tab3', label: 'Manual 3' },
            ]}
            activationMode="manual"
            activeTab={states.manual}
            onChange={(id) => updateState('manual', id)}
          >
            <TabContent title="Manual Activation 1">
              <p>Arrow keys only move focus, not activation.</p>
            </TabContent>
            <TabContent title="Manual Activation 2">
              <p>Press Enter or Space to activate the focused tab.</p>
            </TabContent>
            <TabContent title="Manual Activation 3">
              <p>Useful when tab switching has side effects.</p>
            </TabContent>
          </Tabs>
        </section>
        
        <section>
          <h3 style={{ marginBottom: '1rem' }}>Keyboard Navigation Guide</h3>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Horizontal Tabs:</h4>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><kbd>→</kbd> - Next tab</li>
              <li><kbd>←</kbd> - Previous tab</li>
              <li><kbd>Home</kbd> - First tab</li>
              <li><kbd>End</kbd> - Last tab</li>
            </ul>
            
            <h4 style={{ marginBottom: '0.5rem' }}>Vertical Tabs:</h4>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><kbd>↓</kbd> - Next tab</li>
              <li><kbd>↑</kbd> - Previous tab</li>
              <li><kbd>Home</kbd> - First tab</li>
              <li><kbd>End</kbd> - Last tab</li>
            </ul>
            
            <h4 style={{ marginBottom: '0.5rem' }}>Manual Mode:</h4>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li><kbd>Enter</kbd> or <kbd>Space</kbd> - Activate focused tab</li>
            </ul>
          </div>
        </section>
      </div>
    );
  },
};