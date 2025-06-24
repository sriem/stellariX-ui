# @stellarix/slider

A flexible slider component with single and range value support, keyboard navigation, and full accessibility.

## Features

- ✅ Single value slider
- ✅ Range slider (min/max values)
- ✅ Step increments
- ✅ Min/max bounds validation
- ✅ Keyboard navigation (Arrow keys, Home, End, Page Up/Down)
- ✅ ARIA attributes (role="slider", aria-valuemin, aria-valuemax, aria-valuenow)
- ✅ Disabled state support
- ✅ Orientation support (horizontal/vertical)
- ✅ Mouse/touch interaction
- ✅ Customizable value formatting

## Installation

```bash
pnpm add @stellarix/slider
```

## Usage

### Basic Slider

```typescript
import { createSlider } from '@stellarix/slider';
import { reactAdapter } from '@stellarix/react';

// Create slider instance
const slider = createSlider({
  value: 50,
  min: 0,
  max: 100,
  onChange: (value) => console.log('Value:', value)
});

// Connect to React
const SliderComponent = slider.connect(reactAdapter);

// Use in your app
function App() {
  return <SliderComponent />;
}
```

### Range Slider

```typescript
const rangeSlider = createSlider({
  value: [25, 75], // Array for range
  min: 0,
  max: 100,
  onChange: (value) => console.log('Range:', value)
});
```

### With Step Increments

```typescript
const steppedSlider = createSlider({
  value: 40,
  step: 10, // Increments of 10
  min: 0,
  max: 100
});
```

### Vertical Orientation

```typescript
const verticalSlider = createSlider({
  value: 50,
  orientation: 'vertical',
  onChange: (value) => console.log('Value:', value)
});
```

## API

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `number \| [number, number]` | `0` or `[0, 100]` | Current value (single or range) |
| `min` | `number` | `0` | Minimum allowed value |
| `max` | `number` | `100` | Maximum allowed value |
| `step` | `number` | `1` | Step increment for value changes |
| `disabled` | `boolean` | `false` | Whether the slider is disabled |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `onChange` | `(value: number \| [number, number]) => void` | - | Callback when value changes |
| `onDragStart` | `() => void` | - | Callback when dragging starts |
| `onDragEnd` | `() => void` | - | Callback when dragging ends |

### State Methods

```typescript
// Set value
slider.state.setValue(75);
slider.state.setValue([30, 70]); // For range

// Update boundaries
slider.state.setMin(0);
slider.state.setMax(200);
slider.state.setStep(5);

// Control states
slider.state.setDisabled(true);
slider.state.setOrientation('vertical');

// Value manipulation
slider.state.increment();      // Increase by step
slider.state.decrement();      // Decrease by step
slider.state.incrementPage();  // Increase by 10%
slider.state.decrementPage();  // Decrease by 10%
slider.state.setToMin();       // Set to minimum
slider.state.setToMax();       // Set to maximum

// For range sliders, specify thumb index
slider.state.increment(0);     // Increment min thumb
slider.state.increment(1);     // Increment max thumb

// Get computed values
const percentage = slider.state.getPercentage();
const valueFromPercent = slider.state.getValueFromPercentage(50);
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ value, previousValue }` | Fired when value changes |
| `dragStart` | `{ value }` | Fired when dragging starts |
| `dragEnd` | `{ value }` | Fired when dragging ends |
| `focus` | `{ event }` | Fired when slider receives focus |
| `blur` | `{ event }` | Fired when slider loses focus |

## Keyboard Navigation

- **Arrow Left/Down**: Decrease value by step
- **Arrow Right/Up**: Increase value by step
- **Page Down**: Decrease value by 10% of range
- **Page Up**: Increase value by 10% of range
- **Home**: Set to minimum value
- **End**: Set to maximum value

For range sliders, keyboard navigation affects the focused thumb.

## Accessibility

The slider component follows WCAG 2.1 AA guidelines:

- Proper ARIA roles and attributes
- Full keyboard navigation support
- Focus management
- Screen reader announcements
- Disabled state handling

### ARIA Attributes

- `role="slider"` on thumb elements
- `aria-valuemin`: Minimum value
- `aria-valuemax`: Maximum value
- `aria-valuenow`: Current value
- `aria-orientation`: Slider orientation
- `aria-disabled`: Disabled state

## Examples

### Controlled Slider

```typescript
function ControlledSlider() {
  const [value, setValue] = useState(50);
  const [slider] = useState(() => 
    createSlider({
      value,
      onChange: setValue
    })
  );
  
  const SliderComponent = slider.connect(reactAdapter);
  
  return (
    <div>
      <SliderComponent />
      <button onClick={() => setValue(0)}>Reset</button>
    </div>
  );
}
```

### Price Range Filter

```typescript
function PriceRangeFilter() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  
  const slider = createSlider({
    value: priceRange,
    min: 0,
    max: 5000,
    step: 50,
    onChange: setPriceRange
  });
  
  const SliderComponent = slider.connect(reactAdapter);
  
  return (
    <div>
      <h3>Price Range</h3>
      <SliderComponent />
      <p>${priceRange[0]} - ${priceRange[1]}</p>
    </div>
  );
}
```

### Volume Control

```typescript
function VolumeControl() {
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  
  const slider = createSlider({
    value: muted ? 0 : volume,
    disabled: muted,
    onChange: (v) => {
      setVolume(v);
      if (v > 0) setMuted(false);
    }
  });
  
  const SliderComponent = slider.connect(reactAdapter);
  
  return (
    <div>
      <SliderComponent aria-label="Volume control" />
      <button onClick={() => setMuted(!muted)}>
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
}
```

## Styling

The slider component uses CSS classes with the `sx-` prefix:

```css
.sx-slider          /* Root container */
.sx-slider-track    /* Slider track */
.sx-slider-thumb    /* Thumb element */
.sx-slider-thumb-min /* Min thumb (range) */
.sx-slider-thumb-max /* Max thumb (range) */

/* States */
.sx-slider--disabled
.sx-slider--vertical
.sx-slider--horizontal
.sx-slider--dragging
.sx-slider--focused

/* Thumb states */
.sx-slider-thumb--focused
.sx-slider-thumb--dragging
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)