# @stellarix-ui/tooltip

A framework-agnostic tooltip component that provides contextual help text on hover or focus.

## Installation

```bash
pnpm add @stellarix-ui/tooltip
```

## Features

- ✅ Hover and focus-based triggering
- ✅ Smart positioning with 4 placement options (top, bottom, left, right)
- ✅ Configurable show/hide delays for optimal UX
- ✅ Controlled and uncontrolled modes
- ✅ Custom offset positioning
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createTooltip } from '@stellarix-ui/tooltip';
import { reactAdapter } from '@stellarix-ui/react';

// Create component instance
const tooltip = createTooltip({
  content: 'This is helpful information',
  placement: 'top',
  showDelay: 200
});

// Connect to React
const ReactTooltip = tooltip.connect(reactAdapter);

// Use in your app
function App() {
  return (
    <ReactTooltip>
      <button>Hover me for help</button>
    </ReactTooltip>
  );
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | `string` | `''` | Text content displayed in the tooltip |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position relative to trigger element |
| `showDelay` | `number` | `200` | Delay in ms before showing tooltip |
| `hideDelay` | `number` | `0` | Delay in ms before hiding tooltip |
| `offset` | `number` | `8` | Distance from trigger element in pixels |
| `disabled` | `boolean` | `false` | Disable tooltip interactions |
| `controlled` | `boolean` | `false` | Use controlled visibility state |
| `visible` | `boolean` | - | Visible state when controlled |
| `onVisibilityChange` | `(visible: boolean) => void` | - | Callback when visibility changes |
| `id` | `string` | - | HTML id attribute for tooltip |
| `className` | `string` | - | Additional CSS classes |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `visible` | `boolean` | Whether tooltip is currently visible |
| `placement` | `TooltipPlacement` | Current placement position |
| `content` | `string \| null` | Current tooltip content |
| `focused` | `boolean` | Whether trigger element is focused |
| `disabled` | `boolean` | Whether tooltip is disabled |
| `position` | `{ x: number; y: number } \| null` | Current position coordinates |

### Methods

- `setVisible(visible: boolean)` - Set tooltip visibility
- `setPlacement(placement: TooltipPlacement)` - Change tooltip placement
- `setContent(content: string | null)` - Update tooltip content
- `setFocused(focused: boolean)` - Set focus state
- `setDisabled(disabled: boolean)` - Toggle disabled state
- `setPosition(position: { x: number; y: number })` - Set position coordinates
- `show()` - Show tooltip immediately
- `hide()` - Hide tooltip immediately
- `toggle()` - Toggle tooltip visibility

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `visibilityChange` | `{ visible: boolean }` | Fired when tooltip visibility changes |
| `focus` | `{ event: FocusEvent }` | Fired when trigger receives focus |
| `blur` | `{ event: FocusEvent }` | Fired when trigger loses focus |
| `mouseenter` | `{ event: MouseEvent }` | Fired when mouse enters trigger |
| `mouseleave` | `{ event: MouseEvent }` | Fired when mouse leaves trigger |

## Examples

### Basic Tooltip

```typescript
const tooltip = createTooltip({
  content: 'Click to save your changes',
  placement: 'top'
});
```

### With Custom Delays

```typescript
const tooltip = createTooltip({
  content: 'This appears after a longer delay',
  showDelay: 500,
  hideDelay: 100,
  placement: 'bottom'
});
```

### Controlled Tooltip

```typescript
const [isVisible, setIsVisible] = useState(false);

const tooltip = createTooltip({
  content: 'Controlled tooltip content',
  controlled: true,
  visible: isVisible,
  onVisibilityChange: (visible) => {
    setIsVisible(visible);
    console.log('Tooltip visibility changed:', visible);
  }
});
```

### Dynamic Content Updates

```typescript
const tooltip = createTooltip({
  content: 'Initial content',
  placement: 'right'
});

// Update content based on some condition
setTimeout(() => {
  tooltip.state.setContent('Updated content after 2 seconds');
}, 2000);
```

### Custom Positioning

```typescript
const tooltip = createTooltip({
  content: 'Custom positioned tooltip',
  placement: 'top',
  offset: 16, // Further from trigger
  onVisibilityChange: (visible) => {
    if (visible) {
      // Optionally set custom position
      tooltip.state.setPosition({ x: 100, y: 200 });
    }
  }
});
```

## Accessibility

- **ARIA roles**: Uses `tooltip` role with proper `aria-describedby` connection
- **Keyboard support**: 
  - `Tab` - Focus navigation shows/hides tooltip
  - `Escape` - Dismisses tooltip when focused
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **Focus management**: Proper focus/blur event handling

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