/**
 * Searchable Select Example
 * A practical implementation showing a searchable country selector with:
 * - Real-time filtering
 * - Custom option rendering with flags
 * - Form integration
 * - Error and loading states
 * - Clear functionality
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createSelectWithImplementation } from '../src/index';
import { reactAdapter } from '@stellarix-ui/react';
import type { SelectOption } from '../src/types';

// Create the React-connected Select component
const selectCore = createSelectWithImplementation();
const Select = selectCore.connect(reactAdapter);

// Country data with emoji flags
interface CountryOption extends SelectOption {
  value: string;
  label: string;
  flag?: string;
  region?: string;
}

const countryData: CountryOption[] = [
  { value: 'us', label: 'United States', flag: '🇺🇸', region: 'North America' },
  { value: 'ca', label: 'Canada', flag: '🇨🇦', region: 'North America' },
  { value: 'mx', label: 'Mexico', flag: '🇲🇽', region: 'North America' },
  { value: 'uk', label: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { value: 'de', label: 'Germany', flag: '🇩🇪', region: 'Europe' },
  { value: 'fr', label: 'France', flag: '🇫🇷', region: 'Europe' },
  { value: 'es', label: 'Spain', flag: '🇪🇸', region: 'Europe' },
  { value: 'it', label: 'Italy', flag: '🇮🇹', region: 'Europe' },
  { value: 'jp', label: 'Japan', flag: '🇯🇵', region: 'Asia' },
  { value: 'cn', label: 'China', flag: '🇨🇳', region: 'Asia' },
  { value: 'in', label: 'India', flag: '🇮🇳', region: 'Asia' },
  { value: 'kr', label: 'South Korea', flag: '🇰🇷', region: 'Asia' },
  { value: 'au', label: 'Australia', flag: '🇦🇺', region: 'Oceania' },
  { value: 'nz', label: 'New Zealand', flag: '🇳🇿', region: 'Oceania' },
  { value: 'br', label: 'Brazil', flag: '🇧🇷', region: 'South America' },
  { value: 'ar', label: 'Argentina', flag: '🇦🇷', region: 'South America' },
  { value: 'za', label: 'South Africa', flag: '🇿🇦', region: 'Africa' },
  { value: 'eg', label: 'Egypt', flag: '🇪🇬', region: 'Africa' },
  { value: 'ng', label: 'Nigeria', flag: '🇳🇬', region: 'Africa' },
  { value: 'ke', label: 'Kenya', flag: '🇰🇪', region: 'Africa' },
];

// Custom option component with flag
const CountryOption: React.FC<{ option: CountryOption; isSelected: boolean }> = ({ 
  option, 
  isSelected 
}) => (
  <div className={`country-option ${isSelected ? 'selected' : ''}`}>
    <span className="country-flag">{option.flag}</span>
    <span className="country-name">{option.label}</span>
    {option.region && (
      <span className="country-region">({option.region})</span>
    )}
  </div>
);

// Main component demonstrating searchable select
export const SearchableSelectExample: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>(countryData);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state for demonstration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: null as string | null,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulate async loading of options
  const loadCountries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random error for demonstration
      if (Math.random() > 0.9) {
        throw new Error('Failed to load countries');
      }
      
      setCountries(countryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter countries based on search query
  const filteredCountries = searchQuery
    ? countries.filter(country => 
        country.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.region?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : countries;

  // Handle country selection
  const handleCountryChange = (value: string | null) => {
    setSelectedCountry(value);
    setFormData(prev => ({ ...prev, country: value }));
    
    // Clear country error if exists
    if (formErrors.country) {
      setFormErrors(prev => {
        const { country, ...rest } = prev;
        return rest;
      });
    }
  };

  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.country) {
      errors.country = 'Please select a country';
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      alert(`Registration successful!\nCountry: ${
        countries.find(c => c.value === formData.country)?.label
      }`);
      
      // Reset form
      setFormData({ name: '', email: '', country: null });
      setSelectedCountry(null);
      setFormErrors({});
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  return (
    <div className="searchable-select-example">
      <h2>Searchable Country Select Example</h2>
      
      {/* Standalone select demonstration */}
      <section className="demo-section">
        <h3>Standalone Usage</h3>
        <p>Try searching for countries or regions (e.g., "Europe", "Asia")</p>
        
        <div className="select-wrapper">
          <Select
            options={filteredCountries}
            value={selectedCountry}
            onChange={handleCountryChange}
            onSearch={handleSearch}
            placeholder="Select your country..."
            searchable={true}
            clearable={true}
            disabled={isLoading}
            aria-label="Country selection"
            className={error ? 'error' : ''}
          />
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="loading-message">
              Loading countries...
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="error-message">
              {error}
              <button onClick={loadCountries} className="retry-button">
                Retry
              </button>
            </div>
          )}
          
          {/* Selected value display */}
          {selectedCountry && !isLoading && (
            <div className="selected-display">
              Selected: {countries.find(c => c.value === selectedCountry)?.label}
            </div>
          )}
        </div>
      </section>

      {/* Form integration demonstration */}
      <section className="demo-section">
        <h3>Form Integration</h3>
        <p>Complete the registration form with country selection</p>
        
        <form onSubmit={handleSubmit} className="demo-form">
          <div className="form-field">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={formErrors.name ? 'error' : ''}
              disabled={isSubmitting}
            />
            {formErrors.name && (
              <span className="field-error">{formErrors.name}</span>
            )}
          </div>
          
          <div className="form-field">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={formErrors.email ? 'error' : ''}
              disabled={isSubmitting}
            />
            {formErrors.email && (
              <span className="field-error">{formErrors.email}</span>
            )}
          </div>
          
          <div className="form-field">
            <label htmlFor="country-select">Country *</label>
            <Select
              id="country-select"
              options={filteredCountries}
              value={formData.country}
              onChange={handleCountryChange}
              onSearch={handleSearch}
              placeholder="Select your country..."
              searchable={true}
              clearable={true}
              disabled={isSubmitting || isLoading}
              className={formErrors.country ? 'error' : ''}
              aria-describedby={formErrors.country ? 'country-error' : undefined}
            />
            {formErrors.country && (
              <span id="country-error" className="field-error">
                {formErrors.country}
              </span>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || isLoading}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        </form>
      </section>

      {/* Feature highlights */}
      <section className="demo-section">
        <h3>Key Features Demonstrated</h3>
        <ul className="feature-list">
          <li>✅ Real-time search filtering</li>
          <li>✅ Custom option rendering with country flags</li>
          <li>✅ Loading state with disabled select</li>
          <li>✅ Error handling with retry functionality</li>
          <li>✅ Form integration with validation</li>
          <li>✅ Clear button to reset selection</li>
          <li>✅ Proper accessibility attributes</li>
          <li>✅ Keyboard navigation support</li>
        </ul>
      </section>
      
      {/* CSS for the example */}
      <style jsx>{`
        .searchable-select-example {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .demo-section {
          margin-bottom: 3rem;
          padding: 2rem;
          background: #f5f5f5;
          border-radius: 8px;
        }
        
        .demo-section h3 {
          margin-top: 0;
          color: #333;
        }
        
        .select-wrapper {
          max-width: 400px;
        }
        
        .loading-message {
          margin-top: 0.5rem;
          color: #666;
          font-style: italic;
        }
        
        .error-message {
          margin-top: 0.5rem;
          color: #d32f2f;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .retry-button {
          padding: 0.25rem 0.5rem;
          background: #d32f2f;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .retry-button:hover {
          background: #b71c1c;
        }
        
        .selected-display {
          margin-top: 1rem;
          padding: 0.5rem;
          background: #e3f2fd;
          border-radius: 4px;
          color: #1976d2;
        }
        
        .demo-form {
          max-width: 400px;
        }
        
        .form-field {
          margin-bottom: 1.5rem;
        }
        
        .form-field label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        
        .form-field input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .form-field input:focus {
          outline: none;
          border-color: #1976d2;
        }
        
        .form-field input.error,
        .sx-select.error {
          border-color: #d32f2f;
        }
        
        .field-error {
          display: block;
          margin-top: 0.25rem;
          color: #d32f2f;
          font-size: 0.875rem;
        }
        
        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-button:hover:not(:disabled) {
          background: #1565c0;
        }
        
        .submit-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .feature-list {
          list-style: none;
          padding: 0;
        }
        
        .feature-list li {
          margin-bottom: 0.5rem;
          color: #555;
        }
        
        /* Custom styles for country options */
        .country-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
        }
        
        .country-option.selected {
          background: #e3f2fd;
        }
        
        .country-flag {
          font-size: 1.25rem;
        }
        
        .country-name {
          flex: 1;
          font-weight: 500;
        }
        
        .country-region {
          color: #666;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

// Export additional example configurations
export const basicUsage = () => {
  const [value, setValue] = useState<string | null>(null);
  
  return (
    <Select
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ]}
      value={value}
      onChange={setValue}
      placeholder="Select an option"
    />
  );
};

export const withDisabledOptions = () => {
  const [value, setValue] = useState<string | null>(null);
  
  return (
    <Select
      options={[
        { value: 'active1', label: 'Active Option 1' },
        { value: 'disabled1', label: 'Disabled Option 1', disabled: true },
        { value: 'active2', label: 'Active Option 2' },
        { value: 'disabled2', label: 'Disabled Option 2', disabled: true },
      ]}
      value={value}
      onChange={setValue}
      placeholder="Some options are disabled"
    />
  );
};

export const groupedOptions = () => {
  const [value, setValue] = useState<string | null>(null);
  
  return (
    <Select
      options={[
        { value: 'apple', label: 'Apple', group: 'Fruits' },
        { value: 'banana', label: 'Banana', group: 'Fruits' },
        { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
        { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
      ]}
      value={value}
      onChange={setValue}
      placeholder="Select from grouped options"
      searchable={true}
    />
  );
};

// Default export
export default SearchableSelectExample;