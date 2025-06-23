# @stellarix/card

A flexible content container component for organizing and displaying related information with support for headers, media, and footers.

## Installation

```bash
pnpm add @stellarix/card
```

## Features

- ✅ Multiple visual variants (simple, outlined, elevated, filled)
- ✅ Interactive cards with click, focus, and selection states
- ✅ Flexible content organization (header, media, content, footer)
- ✅ Configurable padding options
- ✅ Hover and focus interactions
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createCard } from '@stellarix/card';
import { reactAdapter } from '@stellarix/react';

// Create component instance
const card = createCard({
  variant: 'outlined',
  padding: 'lg',
  hasHeader: true,
  hasFooter: true
});

// Connect to React
const ReactCard = card.connect(reactAdapter);

// Use in your app
function App() {
  return (
    <ReactCard 
      header={<h3>Card Title</h3>}
      footer={<button>Action</button>}
    >
      <p>Card content goes here</p>
    </ReactCard>
  );
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `'simple' \| 'outlined' \| 'elevated' \| 'filled'` | `'simple'` | Visual style variant |
| `interactive` | `boolean` | `false` | Enable click interactions |
| `selected` | `boolean` | `false` | Selection state |
| `disabled` | `boolean` | `false` | Disable interactions |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Internal padding size |
| `hasHeader` | `boolean` | `false` | Include header section |
| `hasFooter` | `boolean` | `false` | Include footer section |
| `hasMedia` | `boolean` | `false` | Include media section |
| `onClick` | `(event: MouseEvent) => void` | - | Click handler |
| `onSelectionChange` | `(selected: boolean) => void` | - | Selection change handler |
| `onFocus` | `(event: FocusEvent) => void` | - | Focus handler |
| `onBlur` | `(event: FocusEvent) => void` | - | Blur handler |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `variant` | `CardVariant` | Current visual variant |
| `interactive` | `boolean` | Interactive state |
| `hovered` | `boolean` | Hover state |
| `focused` | `boolean` | Focus state |
| `selected` | `boolean` | Selection state |
| `disabled` | `boolean` | Disabled state |
| `padding` | `CardPadding` | Current padding size |
| `hasHeader` | `boolean` | Header presence |
| `hasFooter` | `boolean` | Footer presence |
| `hasMedia` | `boolean` | Media presence |

### Methods

- `setVariant(variant: CardVariant)` - Update the visual variant
- `setInteractive(interactive: boolean)` - Toggle interactive state
- `setSelected(selected: boolean)` - Update selection state
- `setDisabled(disabled: boolean)` - Toggle disabled state
- `setPadding(padding: CardPadding)` - Change padding size
- `setHasHeader(hasHeader: boolean)` - Toggle header section
- `setHasFooter(hasFooter: boolean)` - Toggle footer section
- `setHasMedia(hasMedia: boolean)` - Toggle media section
- `toggleSelection()` - Toggle selection state
- `reset()` - Reset to initial state
- `isClickable()` - Check if card is clickable
- `isHighlighted()` - Check if card is highlighted (selected/hovered/focused)

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `{ event: MouseEvent }` | Fired on card click |
| `selectionChange` | `{ selected: boolean }` | Fired on selection change |
| `focus` | `{ event: FocusEvent }` | Fired on focus |
| `blur` | `{ event: FocusEvent }` | Fired on blur |
| `hover` | `{ hovered: boolean }` | Fired on hover state change |

## Examples

### Basic Card with Content

```typescript
const card = createCard({
  variant: 'outlined',
  padding: 'lg'
});

// Use with content
<ReactCard>
  <h3>Welcome</h3>
  <p>This is a simple card with some content.</p>
</ReactCard>
```

### Interactive Card with Selection

```typescript
const card = createCard({
  variant: 'elevated',
  interactive: true,
  onSelectionChange: (selected) => {
    console.log('Card selected:', selected);
  },
  onClick: (event) => {
    console.log('Card clicked:', event);
  }
});
```

### Card with Header, Media, and Footer

```typescript
const card = createCard({
  variant: 'filled',
  hasHeader: true,
  hasMedia: true,
  hasFooter: true,
  padding: 'xl'
});

<ReactCard
  header={
    <div>
      <h2>Product Title</h2>
      <span>$99.99</span>
    </div>
  }
  media={
    <img src="product.jpg" alt="Product" />
  }
  footer={
    <div>
      <button>Add to Cart</button>
      <button>Save</button>
    </div>
  }
>
  <p>Product description and details.</p>
  <ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
  </ul>
</ReactCard>
```

### Card Grid Layout

```typescript
const cards = [
  { id: 1, title: 'Card 1', content: 'Content 1' },
  { id: 2, title: 'Card 2', content: 'Content 2' },
  { id: 3, title: 'Card 3', content: 'Content 3' }
];

<div className="card-grid">
  {cards.map(item => (
    <ReactCard key={item.id} variant="outlined" padding="lg">
      <h3>{item.title}</h3>
      <p>{item.content}</p>
    </ReactCard>
  ))}
</div>
```

### Selectable Card List

```typescript
const [selectedCards, setSelectedCards] = useState(new Set());

const handleSelectionChange = (cardId, selected) => {
  setSelectedCards(prev => {
    const newSet = new Set(prev);
    if (selected) {
      newSet.add(cardId);
    } else {
      newSet.delete(cardId);
    }
    return newSet;
  });
};

{items.map(item => (
  <ReactCard
    key={item.id}
    variant="outlined"
    interactive={true}
    selected={selectedCards.has(item.id)}
    onSelectionChange={(selected) => handleSelectionChange(item.id, selected)}
  >
    <h4>{item.title}</h4>
    <p>{item.description}</p>
  </ReactCard>
))}
```

## Accessibility

- **ARIA roles**: `article` for main card, `heading` for header, `contentinfo` for footer
- **Keyboard support**: 
  - `Tab` - Focus navigation
  - `Enter` - Activate interactive cards
  - `Space` - Toggle selection
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **States**: Properly announces disabled, selected, and interactive states

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