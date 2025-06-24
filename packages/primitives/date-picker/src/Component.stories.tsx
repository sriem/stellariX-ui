/**
 * DatePicker Component Stories
 * Comprehensive showcase of all date picker features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createDatePickerWithImplementation, generateCalendarGrid } from './index';
import { reactAdapter } from '@stellarix/react';
import type { DatePickerOptions, CalendarCell } from './types';

// Create a wrapper component that creates individual DatePicker instances
const DatePickerWrapper = React.forwardRef((props: DatePickerOptions, ref: any) => {
  const [component] = React.useState(() => createDatePickerWithImplementation(props));
  const DatePicker = React.useMemo(() => component.connect(reactAdapter), [component]);
  const [state, setState] = React.useState(component.state.getState());
  
  React.useEffect(() => {
    const unsubscribe = component.state.subscribe(setState);
    return unsubscribe;
  }, [component]);
  
  // Update the component's state when props change
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      component.state.setDisabled(props.disabled);
    }
  }, [props.disabled, component]);
  
  React.useEffect(() => {
    if (props.value !== undefined) {
      component.state.setValue(props.value);
    }
  }, [props.value, component]);
  
  // Render a simple date picker UI
  const { displayValue, isDateDisabled, isDateInRange } = component.state;
  const grid = generateCalendarGrid(state.viewDate, state.firstDayOfWeek, state.locale);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const handlers = component.logic.getInteractionHandlers('input');
  const inputA11y = component.logic.getA11yProps('input');
  const calendarA11y = component.logic.getA11yProps('calendar');
  const gridA11y = component.logic.getA11yProps('grid');
  
  return (
    <div className="date-picker-wrapper">
      <div className="relative">
        <input
          ref={ref}
          type="text"
          value={displayValue.get()}
          readOnly
          className={`border rounded px-3 py-2 w-64 ${state.disabled ? 'bg-gray-100' : 'bg-white'}`}
          placeholder={state.placeholder}
          {...inputA11y}
          {...handlers}
        />
        {state.hasValue.get() && !state.disabled && !state.readonly && (
          <button
            className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
            {...component.logic.getInteractionHandlers('clear')}
          >
            ✕
          </button>
        )}
      </div>
      
      {state.open && (
        <div 
          className="absolute mt-1 bg-white border rounded-lg shadow-lg p-4 z-50"
          {...calendarA11y}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              className="p-1 hover:bg-gray-100 rounded"
              {...component.logic.getInteractionHandlers('prevMonth')}
            >
              ‹
            </button>
            <button
              className="font-semibold hover:bg-gray-100 px-2 py-1 rounded"
              {...component.logic.getInteractionHandlers('monthYearButton')}
            >
              {monthNames[state.viewDate.getMonth()]} {state.viewDate.getFullYear()}
            </button>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              {...component.logic.getInteractionHandlers('nextMonth')}
            >
              ›
            </button>
          </div>
          
          <table className="w-full" {...gridA11y}>
            <thead>
              <tr>
                {weekdayNames.map((day, i) => (
                  <th key={i} className="text-xs text-gray-500 font-normal pb-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.weeks.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.days.map((cell, dayIndex) => {
                    const isDisabled = isDateDisabled.get()(cell.date);
                    const isInRange = state.mode === 'range' && isDateInRange.get()(cell.date);
                    const isSelected = state.mode === 'single' 
                      ? state.value?.toDateString() === cell.date.toDateString()
                      : (state.startDate?.toDateString() === cell.date.toDateString() ||
                         state.endDate?.toDateString() === cell.date.toDateString());
                    
                    const cellHandlers = component.logic.getInteractionHandlers('cell');
                    const cellA11y = component.logic.getA11yProps('cell');
                    const cellProps = typeof cellA11y === 'function' ? cellA11y({
                      ...cell,
                      isDisabled,
                      isSelected,
                      isInRange,
                      isHighlighted: state.highlightedDate?.toDateString() === cell.date.toDateString()
                    } as CalendarCell) : cellA11y;
                    
                    return (
                      <td key={dayIndex} className="p-0">
                        <button
                          className={`
                            w-8 h-8 rounded hover:bg-gray-100 
                            ${cell.isOutsideMonth ? 'text-gray-300' : ''}
                            ${cell.isToday ? 'font-bold' : ''}
                            ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                            ${isInRange && !isSelected ? 'bg-blue-100' : ''}
                            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : ''}
                          `}
                          disabled={isDisabled}
                          onClick={(e) => cellHandlers.onClick({ ...e, date: cell.date })}
                          onMouseEnter={(e) => cellHandlers.onMouseEnter?.({ ...e, date: cell.date })}
                          onMouseLeave={(e) => cellHandlers.onMouseLeave?.(e)}
                          {...cellProps}
                        >
                          {cell.day}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          
          {state.includeTime && (
            <div className="mt-4 flex items-center gap-2 justify-center">
              <input
                type="number"
                min="0"
                max="23"
                value={state.hour}
                className="w-12 text-center border rounded"
                {...component.logic.getInteractionHandlers('timeInput')}
                onChange={(e) => {
                  const handler = component.logic.getInteractionHandlers('timeInput').onChange;
                  handler({ ...e, isHour: true });
                }}
              />
              <span>:</span>
              <input
                type="number"
                min="0"
                max="59"
                value={state.minute}
                className="w-12 text-center border rounded"
                {...component.logic.getInteractionHandlers('timeInput')}
                onChange={(e) => {
                  const handler = component.logic.getInteractionHandlers('timeInput').onChange;
                  handler({ ...e, isHour: false });
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

DatePickerWrapper.displayName = 'DatePicker';

const meta: Meta<typeof DatePickerWrapper> = {
  title: 'Primitives/DatePicker',
  component: DatePickerWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible date picker component with single date, date range, and time selection support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'date',
      description: 'Selected date value (single mode)',
    },
    mode: {
      control: 'select',
      options: ['single', 'range'],
      description: 'Selection mode',
    },
    includeTime: {
      control: 'boolean',
      description: 'Include time selection',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the date picker is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the date picker is readonly',
    },
    minDate: {
      control: 'date',
      description: 'Minimum selectable date',
    },
    maxDate: {
      control: 'date',
      description: 'Maximum selectable date',
    },
    firstDayOfWeek: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6],
      description: 'First day of week (0 = Sunday)',
    },
    locale: {
      control: 'text',
      description: 'Locale for month/day names',
    },
    dateFormat: {
      control: 'text',
      description: 'Date format string',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    onChange: {
      action: 'changed',
      description: 'Called when the date value changes',
    },
    onRangeChange: {
      action: 'rangeChanged',
      description: 'Called when the date range changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {},
};

export const WithValue: Story = {
  args: {
    value: new Date('2024-01-15'),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: new Date('2024-01-15'),
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: new Date('2024-01-15'),
  },
};

// Date range stories
export const DateRange: Story = {
  args: {
    mode: 'range',
    placeholder: 'Select date range',
  },
};

export const DateRangeWithValues: Story = {
  args: {
    mode: 'range',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-20'),
  },
};

// Time selection
export const WithTime: Story = {
  args: {
    includeTime: true,
    placeholder: 'Select date and time',
  },
};

export const DateRangeWithTime: Story = {
  args: {
    mode: 'range',
    includeTime: true,
    placeholder: 'Select date range with time',
  },
};

// Constraints
export const WithMinMaxDates: Story = {
  args: {
    minDate: new Date('2024-01-10'),
    maxDate: new Date('2024-01-25'),
    placeholder: 'Select between Jan 10-25',
  },
};

export const WithDisabledDates: Story = {
  args: {
    disabledDates: [
      new Date('2024-01-15'),
      new Date('2024-01-16'),
      new Date('2024-01-17'),
    ],
    placeholder: 'Some dates disabled',
  },
};

export const DisableSundays: Story = {
  args: {
    isDateDisabled: (date: Date) => date.getDay() === 0,
    placeholder: 'Sundays disabled',
  },
};

// Localization
export const MondayStart: Story = {
  args: {
    firstDayOfWeek: 1,
    placeholder: 'Week starts on Monday',
  },
};

export const FrenchLocale: Story = {
  args: {
    locale: 'fr-FR',
    dateFormat: 'DD/MM/YYYY',
    placeholder: 'Sélectionner une date',
  },
};

// Interactive examples
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = React.useState<Date | null>(null);
    
    return (
      <div className="flex flex-col gap-4">
        <DatePickerWrapper
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
        <p className="text-sm text-gray-600">
          Selected: {value ? value.toLocaleDateString() : '(none)'}
        </p>
      </div>
    );
  },
};

export const InteractiveRange: Story = {
  render: () => {
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    
    return (
      <div className="flex flex-col gap-4">
        <DatePickerWrapper
          mode="range"
          startDate={startDate}
          endDate={endDate}
          onRangeChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <div className="text-sm text-gray-600">
          <p>Start: {startDate ? startDate.toLocaleDateString() : '(none)'}</p>
          <p>End: {endDate ? endDate.toLocaleDateString() : '(none)'}</p>
        </div>
      </div>
    );
  },
};

// Showcase of all variations
export const Showcase: Story = {
  render: () => (
    <div className="grid gap-8 max-w-4xl">
      <section>
        <h3 className="text-lg font-semibold mb-4">Selection Modes</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Single Date</p>
            <DatePickerWrapper />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Date Range</p>
            <DatePickerWrapper mode="range" />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">With Time Selection</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Single Date + Time</p>
            <DatePickerWrapper includeTime />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Date Range + Time</p>
            <DatePickerWrapper mode="range" includeTime />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">States</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Normal</p>
            <DatePickerWrapper value={new Date('2024-01-15')} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Disabled</p>
            <DatePickerWrapper value={new Date('2024-01-15')} disabled />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Readonly</p>
            <DatePickerWrapper value={new Date('2024-01-15')} readonly />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Min/Max Dates (Jan 10-25)</p>
            <DatePickerWrapper 
              minDate={new Date('2024-01-10')}
              maxDate={new Date('2024-01-25')}
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Weekends Disabled</p>
            <DatePickerWrapper 
              isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
            />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Localization</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">US Format (MM/DD/YYYY)</p>
            <DatePickerWrapper 
              dateFormat="MM/DD/YYYY"
              firstDayOfWeek={0}
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">EU Format (DD.MM.YYYY)</p>
            <DatePickerWrapper 
              dateFormat="DD.MM.YYYY"
              firstDayOfWeek={1}
            />
          </div>
        </div>
      </section>
    </div>
  ),
};

// Accessibility demonstration
export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Accessibility Features</h3>
      <DatePickerWrapper aria-label="Select appointment date" />
      <div className="text-sm space-y-2 text-gray-600">
        <p>✓ Full keyboard navigation support</p>
        <p>✓ Arrow keys navigate calendar grid</p>
        <p>✓ PageUp/PageDown change months</p>
        <p>✓ Home/End navigate to week start/end</p>
        <p>✓ Enter/Space select dates</p>
        <p>✓ Escape closes calendar</p>
        <p>✓ ARIA attributes for screen readers</p>
        <p>✓ Focus management and indicators</p>
        <p>✓ Role-based calendar structure</p>
      </div>
    </div>
  ),
};

// Edge cases
export const EdgeCases: Story = {
  render: () => (
    <div className="grid gap-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Leap Year (Feb 2024)</p>
        <DatePickerWrapper value={new Date('2024-02-29')} />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Year Boundaries</p>
        <DatePickerWrapper value={new Date('2023-12-31')} />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Far Future Date</p>
        <DatePickerWrapper value={new Date('2099-12-31')} />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Complex Constraints</p>
        <DatePickerWrapper 
          minDate={new Date('2024-01-15')}
          maxDate={new Date('2024-02-15')}
          disabledDates={[
            new Date('2024-01-20'),
            new Date('2024-01-25'),
            new Date('2024-01-30'),
          ]}
          isDateDisabled={(date) => date.getDay() === 0}
          placeholder="Many constraints"
        />
      </div>
    </div>
  ),
};