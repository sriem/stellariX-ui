# @stellarix-ui/calendar

Date picker and calendar display component for StellarIX UI

## Installation

```bash
pnpm add @stellarix-ui/calendar
```

## Features

- ✅ Full keyboard navigation (arrow keys, home/end, page up/down)
- ✅ Month and year navigation
- ✅ Customizable first day of week
- ✅ Min/max date restrictions
- ✅ Custom date disabling logic
- ✅ Multiple view modes (days, months, years)
- ✅ Internationalization support
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createCalendar } from '@stellarix-ui/calendar';
import { reactAdapter } from '@stellarix-ui/react';

// Create calendar instance
const calendar = createCalendar({
  value: new Date(),
  onChange: (date) => {
    console.log('Selected date:', date);
  }
});

// Connect to React
const ReactCalendar = calendar.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactCalendar />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `Date \| null` | `null` | Initially selected date |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `firstDayOfWeek` | `number` | `0` | First day of week (0=Sunday, 1=Monday) |
| `locale` | `string` | `'en-US'` | Locale for date formatting |
| `showWeekNumbers` | `boolean` | `false` | Show week numbers |
| `disabled` | `boolean` | `false` | Disable the calendar |
| `readOnly` | `boolean` | `false` | Make calendar read-only |
| `onChange` | `(date: Date \| null) => void` | - | Date selection handler |
| `onMonthChange` | `(month: number, year: number) => void` | - | Month change handler |
| `onYearChange` | `(year: number) => void` | - | Year change handler |
| `isDateDisabled` | `(date: Date) => boolean` | - | Custom date disable logic |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `selectedDate` | `Date \| null` | Currently selected date |
| `focusedDate` | `Date` | Currently focused date |
| `displayMonth` | `number` | Currently displayed month |
| `displayYear` | `number` | Currently displayed year |
| `viewMode` | `'days' \| 'months' \| 'years'` | Current view mode |
| `disabled` | `boolean` | Disabled state |
| `readOnly` | `boolean` | Read-only state |
| `days` | `CalendarDay[]` | Days in current month view |

### Methods

- `selectDate(date: Date | null)` - Select a date
- `goToToday()` - Navigate to today
- `goToDate(date: Date)` - Navigate to specific date
- `nextMonth()` - Go to next month
- `previousMonth()` - Go to previous month
- `nextYear()` - Go to next year
- `previousYear()` - Go to previous year
- `setViewMode(mode: 'days' | 'months' | 'years')` - Change view mode
- `isDateSelected(date: Date)` - Check if date is selected
- `isDateDisabled(date: Date)` - Check if date is disabled
- `isDateToday(date: Date)` - Check if date is today

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | `{ date: Date \| null, previousDate: Date \| null }` | Date selected |
| `monthChange` | `{ month: number, year: number, previousMonth: number, previousYear: number }` | Month changed |
| `yearChange` | `{ year: number, previousYear: number }` | Year changed |
| `viewModeChange` | `{ viewMode: string, previousViewMode: string }` | View mode changed |

## Examples

### Basic Date Picker

```typescript
const calendar = createCalendar({
  value: new Date(),
  onChange: (date) => {
    console.log('Selected:', date);
  }
});
```

### With Date Restrictions

```typescript
const calendar = createCalendar({
  minDate: new Date(2024, 0, 1),
  maxDate: new Date(2024, 11, 31),
  isDateDisabled: (date) => {
    // Disable weekends
    return date.getDay() === 0 || date.getDay() === 6;
  }
});
```

### International Calendar

```typescript
const calendar = createCalendar({
  locale: 'de-DE',
  firstDayOfWeek: 1, // Monday
  formatMonth: (month, year) => {
    return new Date(year, month).toLocaleDateString('de-DE', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
});
```

### Keyboard Navigation

The calendar supports full keyboard navigation:

- **Arrow Keys**: Navigate between days
- **Home**: First day of month
- **End**: Last day of month
- **Page Up**: Previous month
- **Page Down**: Next month
- **Shift + Page Up**: Previous year
- **Shift + Page Down**: Next year
- **Enter/Space**: Select date

## Accessibility

- **ARIA roles**: `application`, `grid`, `gridcell`
- **Keyboard support**: 
  - Full arrow key navigation
  - Home/End for month boundaries
  - Page Up/Down for month navigation
  - Shift + Page Up/Down for year navigation
- **Screen reader**: Announces selected date, navigation changes
- **Focus management**: Maintains focus during navigation
- **Labels**: Full date announcements for screen readers

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