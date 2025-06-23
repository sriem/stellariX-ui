# @stellarix-ui/avatar

A flexible avatar component for displaying user representations with support for images, initials, icons, and fallback states.

## Installation

```bash
pnpm add @stellarix-ui/avatar
```

## Features

- ✅ Multiple display modes: image, initials, icon, and placeholder
- ✅ Automatic initials generation from names
- ✅ Graceful image loading with fallback to initials
- ✅ Five size variants (xs, sm, md, lg, xl) 
- ✅ Two shape options (circle, square)
- ✅ Status badge support for online/offline indicators
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createAvatarWithImplementation } from '@stellarix-ui/avatar';
import { reactAdapter } from '@stellarix-ui/react';

// Create avatar component instance
const avatar = createAvatarWithImplementation({
  src: 'https://example.com/user.jpg',
  name: 'John Doe',
  alt: 'User profile picture',
  size: 'md',
  shape: 'circle'
});

// Connect to React
const ReactAvatar = avatar.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactAvatar />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `'image' \| 'initials' \| 'icon' \| 'placeholder'` | `'placeholder'` | Display variant type |
| `src` | `string` | - | Image source URL |
| `alt` | `string` | `''` | Alternative text for image |
| `name` | `string` | - | Name to generate initials from |
| `initials` | `string` | - | Custom initials (overrides name) |
| `icon` | `string` | - | Icon content for icon variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `shape` | `'circle' \| 'square'` | `'circle'` | Avatar shape |
| `showBadge` | `boolean` | `false` | Whether to show status badge |
| `onLoad` | `() => void` | - | Callback when image loads |
| `onError` | `() => void` | - | Callback when image fails |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `variant` | `AvatarVariant` | Current display variant |
| `src` | `string` | Image source URL |
| `alt` | `string` | Alternative text |
| `name` | `string` | User name |
| `initials` | `string` | Displayed initials |
| `icon` | `string` | Icon content |
| `size` | `AvatarSize` | Current size |
| `shape` | `AvatarShape` | Current shape |
| `loading` | `boolean` | Image loading state |
| `error` | `boolean` | Image error state |
| `showBadge` | `boolean` | Badge visibility |

### Methods

- `setSrc(src: string)` - Update image source
- `setName(name: string)` - Update user name
- `setInitials(initials: string)` - Set custom initials
- `setSize(size: AvatarSize)` - Change avatar size
- `setShape(shape: AvatarShape)` - Change avatar shape
- `setBadge(show: boolean)` - Toggle badge visibility
- `getCurrentVariant()` - Get current display variant
- `getDisplayInitials()` - Get computed initials
- `shouldShowImage()` - Check if image should display

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `load` | `{ src: string }` | Fired when image loads successfully |
| `error` | `{ src: string, error: Error }` | Fired when image fails to load |
| `click` | `{ event: MouseEvent }` | Fired when avatar is clicked |

## Examples

### Image Avatar with Fallback

```typescript
const avatar = createAvatarWithImplementation({
  src: 'https://example.com/user.jpg',
  name: 'Jane Smith',
  alt: 'Jane Smith profile picture',
  onLoad: () => console.log('Image loaded'),
  onError: () => console.log('Image failed, showing initials')
});
```

### Initials from Name

```typescript
const avatar = createAvatarWithImplementation({
  name: 'John Doe',        // Will display "JD"
  size: 'lg',
  shape: 'circle'
});
```

### Custom Initials

```typescript
const avatar = createAvatarWithImplementation({
  initials: 'CEO',         // Custom initials override name
  size: 'xl',
  shape: 'square'
});
```

### Icon Avatar

```typescript
const avatar = createAvatarWithImplementation({
  variant: 'icon',
  icon: '👤',              // Any icon or emoji
  size: 'md'
});
```

### With Status Badge

```typescript
const avatar = createAvatarWithImplementation({
  src: 'https://example.com/user.jpg',
  name: 'Online User',
  showBadge: true,         // Shows status indicator
  size: 'lg'
});
```

### Size Variants

```typescript
// All available sizes
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

sizes.forEach(size => {
  const avatar = createAvatarWithImplementation({
    name: 'User',
    size: size as AvatarSize
  });
});
```

### Shape Variants

```typescript
// Circle avatar (default)
const circleAvatar = createAvatarWithImplementation({
  name: 'Circle User',
  shape: 'circle'
});

// Square avatar
const squareAvatar = createAvatarWithImplementation({
  name: 'Square User',
  shape: 'square'
});
```

### Interactive Avatar

```typescript
const avatar = createAvatarWithImplementation({
  name: 'Clickable User',
  onClick: (event) => {
    console.log('Avatar clicked!', event);
    // Handle click interaction
  }
});
```

## Accessibility

- **ARIA roles**: `img` for the avatar container
- **Keyboard support**: 
  - `Tab` - Focus navigation when clickable
  - `Enter/Space` - Activate when clickable
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **Image alt text**: Proper alternative text for screen readers
- **Focus indicators**: Clear focus states for keyboard navigation

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