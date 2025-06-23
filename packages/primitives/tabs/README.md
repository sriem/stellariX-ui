# @stellarix-ui/tabs

A fully accessible tabs component with keyboard navigation, content panels, and flexible orientation support.

## Installation

```bash
pnpm add @stellarix-ui/tabs
```

## Features

- ✅ Horizontal and vertical tab orientations
- ✅ Automatic and manual tab activation modes
- ✅ Full keyboard navigation (Arrow keys, Home, End)
- ✅ Disabled tab support with proper ARIA states
- ✅ Icon support in tab labels
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createTabs } from '@stellarix-ui/tabs';
import { reactAdapter } from '@stellarix-ui/react';

// Create component instance
const tabs = createTabs({
  tabs: [
    { id: 'tab1', label: 'Home' },
    { id: 'tab2', label: 'Profile' },
    { id: 'tab3', label: 'Settings' }
  ],
  activeTab: 'tab1',
  orientation: 'horizontal',
  onChange: (tabId) => console.log('Active tab:', tabId)
});

// Connect to React
const ReactTabs = tabs.connect(reactAdapter);

// Use in your app
function App() {
  return (
    <ReactTabs>
      <div data-tab="tab1">Home content</div>
      <div data-tab="tab2">Profile content</div>
      <div data-tab="tab3">Settings content</div>
    </ReactTabs>
  );
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tabs` | `Tab[]` | `[]` | Array of tab configurations |
| `activeTab` | `string` | - | ID of the currently active tab |
| `disabled` | `boolean` | `false` | Disable all tab interactions |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab list orientation |
| `activationMode` | `'automatic' \| 'manual'` | `'automatic'` | Whether tabs activate on focus or require selection |
| `id` | `string` | - | ID attribute for the tabs container |
| `className` | `string` | - | Additional CSS classes |
| `onChange` | `(tabId: string) => void` | - | Callback when active tab changes |

### Tab Interface

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the tab |
| `label` | `string` | Label to display in the tab list |
| `disabled` | `boolean` | Whether the tab is disabled |
| `icon` | `any` | Icon to display (framework adapter handles rendering) |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `activeTab` | `string \| null` | ID of the currently active tab |
| `tabs` | `Tab[]` | Array of all tabs |
| `disabled` | `boolean` | Whether the entire component is disabled |
| `orientation` | `TabsOrientation` | Current orientation (horizontal/vertical) |
| `focusedIndex` | `number` | Index of the currently focused tab |
| `activationMode` | `TabActivationMode` | Current activation mode |

### Methods

- `setActiveTab(tabId: string)` - Change the active tab
- `setTabs(tabs: Tab[])` - Update the tab list
- `setDisabled(disabled: boolean)` - Toggle disabled state
- `setOrientation(orientation: TabsOrientation)` - Change orientation
- `setActivationMode(mode: TabActivationMode)` - Change activation mode
- `setFocusedIndex(index: number)` - Set focused tab index

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ tabId: string, previousTabId: string \| null }` | Fired when active tab changes |
| `focus` | `{ tabId: string, index: number }` | Fired when a tab receives focus |
| `navigate` | `{ direction: 'next' \| 'previous' \| 'first' \| 'last', index: number }` | Fired on keyboard navigation |

## Examples

### Basic Horizontal Tabs

```typescript
const tabs = createTabs({
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'reviews', label: 'Reviews' }
  ],
  activeTab: 'overview',
  onChange: (tabId) => console.log('Switched to:', tabId)
});
```

### Vertical Tabs with Icons

```typescript
const tabs = createTabs({
  tabs: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard-icon' },
    { id: 'analytics', label: 'Analytics', icon: 'chart-icon' },
    { id: 'settings', label: 'Settings', icon: 'settings-icon' }
  ],
  orientation: 'vertical',
  activeTab: 'dashboard'
});
```

### Manual Activation Mode

```typescript
const tabs = createTabs({
  tabs: [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' }
  ],
  activationMode: 'manual', // Tabs require Enter/Space to activate
  onChange: (tabId) => {
    // Only fires when user explicitly activates a tab
    loadTabContent(tabId);
  }
});
```

### Tabs with Disabled State

```typescript
const tabs = createTabs({
  tabs: [
    { id: 'available', label: 'Available' },
    { id: 'premium', label: 'Premium', disabled: true },
    { id: 'archived', label: 'Archived', disabled: true }
  ],
  activeTab: 'available',
  onChange: (tabId) => {
    // Only 'available' can be selected
    console.log('Active tab:', tabId);
  }
});
```

### Dynamic Tab Management

```typescript
const tabs = createTabs({
  tabs: [
    { id: 'tab1', label: 'Tab 1' }
  ],
  activeTab: 'tab1'
});

// Add new tab
const addTab = (id: string, label: string) => {
  const currentTabs = tabs.state.getState().tabs;
  tabs.setTabs([...currentTabs, { id, label }]);
};

// Remove tab
const removeTab = (tabId: string) => {
  const currentTabs = tabs.state.getState().tabs;
  const newTabs = currentTabs.filter(tab => tab.id !== tabId);
  tabs.setTabs(newTabs);
  
  // If removing active tab, switch to first available
  if (tabs.state.getState().activeTab === tabId && newTabs.length > 0) {
    tabs.setActiveTab(newTabs[0].id);
  }
};
```

## Accessibility

- **ARIA roles**: 
  - `tablist` for the tab container
  - `tab` for each tab button
  - `tabpanel` for content panels
- **Keyboard support**: 
  - `Arrow Keys` - Navigate between tabs (horizontal: Left/Right, vertical: Up/Down)
  - `Home` - Focus first tab
  - `End` - Focus last tab
  - `Enter/Space` - Activate focused tab (in manual mode)
  - `Tab` - Move focus to active tab panel
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby for tab panels
- **States**: Proper `aria-selected`, `aria-disabled`, `tabindex` management

## Framework Adapters

Works with all major frameworks:

- ✅ React 18+ / React 19
- ✅ Vue 3.5+
- ✅ Svelte 5+
- ✅ Solid 1.0+
- ✅ Qwik
- ✅ Angular
- ✅ Web Components

## Browser Support

- Chrome/Edge 90+ (Chromium-based)
- Firefox 90+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for development setup.

## License

MIT © StellarIX UI