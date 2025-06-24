/**
 * Select Component Stories
 * Comprehensive showcase of all select features and edge cases
 */

import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createSelectWithImplementation } from './src/index';
import { reactAdapter } from '@stellarix-ui/react';
import type { SelectOption } from './src/types';

// Create the React select component
const select = createSelectWithImplementation();
const Select = select.connect(reactAdapter);

// Sample data for stories
const basicOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'watermelon', label: 'Watermelon' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'mango', label: 'Mango' },
];

const groupedOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple', group: 'Common Fruits' },
  { value: 'banana', label: 'Banana', group: 'Common Fruits' },
  { value: 'orange', label: 'Orange', group: 'Common Fruits' },
  { value: 'grape', label: 'Grape', group: 'Common Fruits' },
  { value: 'mango', label: 'Mango', group: 'Tropical Fruits' },
  { value: 'pineapple', label: 'Pineapple', group: 'Tropical Fruits' },
  { value: 'papaya', label: 'Papaya', group: 'Tropical Fruits' },
  { value: 'dragon-fruit', label: 'Dragon Fruit', group: 'Exotic Fruits' },
  { value: 'star-fruit', label: 'Star Fruit', group: 'Exotic Fruits' },
  { value: 'durian', label: 'Durian', group: 'Exotic Fruits' },
];

const countryOptions: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
];

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A versatile select component with search, keyboard navigation, and multi-select support.

## Features
- ✅ Single and multi-select modes
- ✅ Searchable options with filtering
- ✅ Grouped options support
- ✅ Keyboard navigation (Arrow keys, Home, End, Enter, Escape)
- ✅ Disabled and readonly states
- ✅ Custom option rendering
- ✅ Full accessibility support
- ✅ Loading state with spinner
- ✅ Clearable selections

## Accessibility
- Uses semantic combobox and listbox roles
- Full keyboard navigation support
- Proper ARIA attributes
- Screen reader friendly
- Focus management
        `,
      },
    },
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Available options to select from',
    },
    value: {
      control: 'text',
      description: 'Currently selected value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no selection',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the select is readonly',
    },
    searchable: {
      control: 'boolean',
      description: 'Whether the select is searchable',
    },
    clearable: {
      control: 'boolean',
      description: 'Whether the selection can be cleared',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple selections are allowed',
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
    onOpen: { action: 'opened' },
    onClose: { action: 'closed' },
    onSearch: { action: 'searched' },
  },
  args: {
    options: basicOptions,
    placeholder: 'Select a fruit...',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: 'banana',
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Choose your favorite fruit...',
  },
};

// Searchable Select
export const Searchable: Story = {
  args: {
    searchable: true,
    placeholder: 'Type to search...',
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Subscribe to component state for search query
    useEffect(() => {
      const unsubscribe = select.state.subscribe((state) => {
        setSearchQuery(state.searchQuery);
      });
      return unsubscribe;
    }, []);
    
    return (
      <div>
        <Select 
          {...args}
          value={value}
          onChange={(val) => {
            setValue(val);
            args.onChange?.(val);
          }}
          onSearch={(query) => {
            args.onSearch?.(query);
          }}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Search query: "{searchQuery}"
        </p>
      </div>
    );
  },
};

// Multi-Select
export const MultiSelect: Story = {
  args: {
    multiple: true,
    searchable: true,
    clearable: true,
    placeholder: 'Select multiple fruits...',
  },
  render: (args) => {
    const [values, setValues] = useState<string[]>([]);
    
    return (
      <div>
        <Select 
          {...args}
          value={values}
          onChange={(val) => {
            setValues(Array.isArray(val) ? val : val ? [val] : []);
            args.onChange?.(val);
          }}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Selected: {values.length > 0 ? values.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

// Grouped Options
export const Grouped: Story = {
  args: {
    options: groupedOptions,
    searchable: true,
    placeholder: 'Select a fruit by category...',
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    
    return (
      <div>
        <Select 
          {...args}
          value={value}
          onChange={(val) => {
            setValue(val);
            args.onChange?.(val);
          }}
        />
        {value && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            Selected: {groupedOptions.find(opt => opt.value === value)?.label} 
            ({groupedOptions.find(opt => opt.value === value)?.group})
          </p>
        )}
      </div>
    );
  },
};

// State Variations
export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'apple',
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: 'orange',
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    placeholder: 'Loading options...',
  },
  render: (args) => (
    <div style={{ position: 'relative' }}>
      <Select {...args} />
      <div style={{
        position: 'absolute',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
      }}>
        <div className="sx-spinner sx-spinner-sm" style={{
          animation: 'spin 1s linear infinite',
        }} />
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  ),
};

// Custom Option Rendering
export const CustomOption: Story = {
  args: {
    options: countryOptions,
    searchable: true,
    placeholder: 'Select a country...',
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    
    // Custom render would be handled by the adapter
    // This shows the concept with additional info display
    return (
      <div>
        <Select 
          {...args}
          value={value}
          onChange={(val) => {
            setValue(val);
            args.onChange?.(val);
          }}
        />
        {value && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
          }}>
            <p style={{ fontWeight: 'bold' }}>
              Selected Country: {countryOptions.find(opt => opt.value === value)?.label}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Code: {value.toUpperCase()}
            </p>
          </div>
        )}
      </div>
    );
  },
};

// Size Variations
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          Small
        </label>
        <Select 
          options={basicOptions}
          placeholder="Small select"
          className="sx-select-sm"
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          Medium (Default)
        </label>
        <Select 
          options={basicOptions}
          placeholder="Medium select"
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          Large
        </label>
        <Select 
          options={basicOptions}
          placeholder="Large select"
          className="sx-select-lg"
        />
      </div>
    </div>
  ),
};

// Interactive Examples
export const WithForm: Story = {
  render: () => {
    const [country, setCountry] = useState('');
    const [fruit, setFruit] = useState('');
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
    };
    
    return (
      <form onSubmit={handleSubmit} style={{ 
        maxWidth: '400px', 
        padding: '2rem', 
        backgroundColor: '#f9fafb', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Preferences Form</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Country
          </label>
          <Select
            options={countryOptions}
            placeholder="Select your country"
            value={country}
            onChange={(val) => setCountry(val || '')}
            searchable
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Favorite Fruit
          </label>
          <Select
            options={basicOptions}
            placeholder="Select your favorite fruit"
            value={fruit}
            onChange={(val) => setFruit(val || '')}
            searchable
          />
        </div>
        
        <button type="submit" style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          fontSize: '1rem',
        }}>
          Submit
        </button>
        
        {submitted && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#d1fae5',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}>
            Submitted: Country = {country || 'None'}, Fruit = {fruit || 'None'}
          </div>
        )}
      </form>
    );
  },
};

// Showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Select Component Showcase</h2>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Basic Variations</h3>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <Select options={basicOptions} placeholder="Default select" />
          <Select options={basicOptions} value="apple" placeholder="With value" />
          <Select options={basicOptions} searchable placeholder="Searchable select" />
          <Select options={basicOptions} clearable value="banana" placeholder="Clearable" />
        </div>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>States</h3>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <Select options={basicOptions} placeholder="Normal state" />
          <Select options={basicOptions} disabled placeholder="Disabled state" />
          <Select options={basicOptions} readonly value="grape" placeholder="Readonly state" />
          <div style={{ position: 'relative' }}>
            <Select options={[]} disabled placeholder="Loading..." />
            <div style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}>
              <div className="sx-spinner sx-spinner-sm" style={{
                animation: 'spin 1s linear infinite',
                width: '16px',
                height: '16px',
                border: '2px solid #e5e7eb',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
              }} />
            </div>
          </div>
        </div>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Advanced Features</h3>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <Select 
            options={groupedOptions} 
            searchable 
            placeholder="Grouped options" 
          />
          <Select 
            options={basicOptions} 
            multiple 
            searchable 
            clearable
            placeholder="Multi-select" 
          />
        </div>
      </section>
      
      <section>
        <h3 style={{ marginBottom: '1rem' }}>Keyboard Navigation Demo</h3>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '4px',
          maxWidth: '400px',
        }}>
          <Select 
            options={basicOptions} 
            searchable 
            placeholder="Try keyboard navigation..." 
          />
          <ul style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <li>↓/↑ - Navigate options</li>
            <li>Enter/Space - Select option</li>
            <li>Escape - Close dropdown</li>
            <li>Home/End - Jump to first/last</li>
            <li>Type to search</li>
          </ul>
        </div>
      </section>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .sx-select-sm {
          font-size: 0.875rem;
          padding: 0.375rem 0.75rem;
        }
        
        .sx-select-lg {
          font-size: 1.125rem;
          padding: 0.75rem 1rem;
        }
      `}</style>
    </div>
  ),
};

// Edge Cases
export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 100 }, (_, i) => ({
      value: `option-${i}`,
      label: `Option ${i + 1}`,
    })),
    searchable: true,
    placeholder: 'Select from 100 options...',
  },
};

export const LongLabels: Story = {
  args: {
    options: [
      { value: 'short', label: 'Short' },
      { value: 'medium', label: 'This is a medium length label' },
      { value: 'long', label: 'This is a very long label that might overflow the select component and should be handled gracefully' },
      { value: 'super-long', label: 'This is an extremely long label with lots of text that definitely will overflow and needs proper handling to ensure the component remains usable and the text is properly truncated or wrapped depending on the design requirements' },
    ],
    placeholder: 'Select an option with varying label lengths...',
  },
};

export const NoOptions: Story = {
  args: {
    options: [],
    searchable: true,
    placeholder: 'No options available',
  },
};

// Stress Test
export const StressTest: Story = {
  render: () => {
    const [values, setValues] = useState<Record<number, string | null>>({});
    
    return (
      <div style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Performance Test: 20 Selects</h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.5rem',
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          {Array.from({ length: 20 }, (_, i) => (
            <Select
              key={i}
              options={basicOptions}
              placeholder={`Select ${i + 1}`}
              value={values[i] || null}
              onChange={(val) => setValues(prev => ({ ...prev, [i]: val }))}
              searchable
            />
          ))}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Active selections: {Object.values(values).filter(Boolean).length}
        </p>
      </div>
    );
  },
};