# @stellarix/badge

A versatile badge component for displaying status indicators, counts, and notifications with multiple display modes.

## Installation

```bash
pnpm add @stellarix/badge
```

## Features

- ✅ Multiple badge types: numeric, dot, and status indicators
- ✅ Seven semantic variants: default, primary, secondary, success, warning, error, info
- ✅ Smart content handling with max value truncation (99+)
- ✅ Visibility controls with zero-value handling
- ✅ Increment/decrement for numeric badges
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createBadgeWithImplementation } from '@stellarix/badge';
import { reactAdapter } from '@stellarix/react';

// Create component instance
const badge = createBadgeWithImplementation({
  variant: 'primary',
  type: 'numeric',
  content: 5
});

// Connect to React
const ReactBadge = badge.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactBadge />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `BadgeVariant` | `'default'` | Visual style variant |
| `type` | `BadgeType` | `'numeric'` | Badge display type |
| `content` | `string \| number` | `''` | Badge content/value |
| `visible` | `boolean` | `true` | Whether badge is visible |
| `max` | `number` | `99` | Maximum value for numeric badges |
| `showZero` | `boolean` | `false` | Show badge when content is 0 |
| `onContentChange` | `(content: string \| number) => void` | - | Content change handler |
| `onVisibilityChange` | `(visible: boolean) => void` | - | Visibility change handler |

### Badge Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| `default` | Neutral gray styling | Default notifications |
| `primary` | Primary brand color | Important notifications |
| `secondary` | Secondary styling | Less important items |
| `success` | Green success color | Success states, completed items |
| `warning` | Yellow/orange warning | Warnings, attention needed |
| `error` | Red error color | Errors, critical issues |
| `info` | Blue information color | Informational messages |

### Badge Types

| Type | Description | Content Behavior |
|------|-------------|------------------|
| `numeric` | Shows numbers or text | Displays content with max truncation |
| `dot` | Small dot indicator | Ignores content, shows only dot |
| `status` | Status indicator | Shows content as status text |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `variant` | `BadgeVariant` | Current visual variant |
| `type` | `BadgeType` | Current badge type |
| `content` | `string \| number` | Current content value |
| `visible` | `boolean` | Current visibility state |
| `max` | `number` | Maximum value for truncation |
| `showZero` | `boolean` | Whether to show zero values |

### Methods

- `setVariant(variant: BadgeVariant)` - Update the visual variant
- `setType(type: BadgeType)` - Change the badge type
- `setContent(content: string | number)` - Update badge content
- `setVisible(visible: boolean)` - Toggle visibility
- `setMax(max: number)` - Set maximum value for numeric badges
- `setShowZero(showZero: boolean)` - Configure zero value display
- `show()` - Make badge visible
- `hide()` - Hide badge
- `increment()` - Increment numeric content by 1
- `decrement()` - Decrement numeric content by 1
- `reset()` - Reset to initial state
- `getDisplayContent()` - Get formatted display content
- `shouldDisplay()` - Check if badge should be displayed

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `contentChange` | `{ content: string \| number, previousContent: string \| number }` | Fired when content changes |
| `visibilityChange` | `{ visible: boolean }` | Fired when visibility changes |

## Examples

### Numeric Badge with Max Value

```typescript
const badge = createBadgeWithImplementation({
  type: 'numeric',
  variant: 'error',
  content: 150,
  max: 99,
  onContentChange: (content) => console.log('New count:', content)
});

// Displays "99+" when content exceeds max
console.log(badge.state.getDisplayContent()); // "99+"
```

### Dot Badge for Status

```typescript
const statusBadge = createBadgeWithImplementation({
  type: 'dot',
  variant: 'success',
  visible: true
});

// Shows only a colored dot, ignores content
statusBadge.state.setContent('ignored'); // Content ignored for dot type
```

### Status Badge with Text

```typescript
const statusBadge = createBadgeWithImplementation({
  type: 'status',
  variant: 'warning',
  content: 'PENDING',
  onVisibilityChange: (visible) => {
    console.log('Status badge visibility:', visible);
  }
});
```

### Notification Counter

```typescript
const notificationBadge = createBadgeWithImplementation({
  type: 'numeric',
  variant: 'primary',
  content: 0,
  showZero: false, // Hidden when 0
  max: 999
});

// Increment notifications
notificationBadge.state.increment(); // Shows "1"
notificationBadge.state.increment(); // Shows "2"

// Bulk update
notificationBadge.state.setContent(1500); // Shows "999+"
```

### Conditional Display

```typescript
const badge = createBadgeWithImplementation({
  type: 'numeric',
  content: 0,
  showZero: false // Hidden when content is 0
});

console.log(badge.state.shouldDisplay()); // false

badge.state.setContent(5);
console.log(badge.state.shouldDisplay()); // true

badge.state.setShowZero(true);
badge.state.setContent(0);
console.log(badge.state.shouldDisplay()); // true (now shows zero)
```

## Accessibility

- **ARIA roles**: `status` for status badges, automatic role assignment
- **ARIA labels**: Automatically generated for numeric content (`"Badge: 5"`)
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Hidden states**: Properly hidden with `aria-hidden="true"` when not displayed
- **Semantic variants**: Color is supplemented with text/context for accessibility

### Accessibility Features

- Status badges use `role="status"` for live updates
- Numeric badges get descriptive `aria-label` attributes
- Hidden badges are properly excluded from screen readers
- Dot badges rely on context/positioning for meaning

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