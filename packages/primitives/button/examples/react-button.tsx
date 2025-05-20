/**
 * React Button Example
 */
import React from 'react';
import { createButton } from '../src';
import { reactAdapter } from '@stellarix/react';

/**
 * Basic Button Implementation
 */
export const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  type = 'button',
  onClick,
  className, 
  ...props 
}: {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent | KeyboardEvent) => void;
  className?: string;
  [key: string]: any;
}) => {
  // Create the button component
  const StellarixButton = React.useMemo(() => {
    return createButton({
      variant,
      size,
      disabled,
      loading,
      type,
      onClick: onClick as (e: MouseEvent | KeyboardEvent) => void,
    }).connect(reactAdapter);
  }, [variant, size, disabled, loading, type, onClick]);

  // Add styles based on variant and size
  const getButtonStyles = () => {
    // Base styles
    let styles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ';
    
    // Variant styles
    switch (variant) {
      case 'primary':
        styles += 'bg-blue-600 text-white hover:bg-blue-700 ';
        break;
      case 'secondary':
        styles += 'bg-gray-100 text-gray-900 hover:bg-gray-200 ';
        break;
      case 'outline':
        styles += 'border border-gray-300 bg-transparent hover:bg-gray-50 ';
        break;
      case 'ghost':
        styles += 'bg-transparent hover:bg-gray-100 ';
        break;
      case 'link':
        styles += 'bg-transparent underline-offset-4 hover:underline ';
        break;
      default:
        styles += 'bg-gray-900 text-white hover:bg-gray-800 ';
        break;
    }
    
    // Size styles
    switch (size) {
      case 'sm':
        styles += 'h-8 px-3 text-xs ';
        break;
      case 'lg':
        styles += 'h-12 px-6 text-lg ';
        break;
      default:
        styles += 'h-10 px-4 text-sm ';
        break;
    }
    
    // Disabled styles
    if (disabled || loading) {
      styles += 'opacity-50 cursor-not-allowed ';
    }
    
    return styles + (className || '');
  };

  return (
    <StellarixButton className={getButtonStyles()} {...props}>
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </StellarixButton>
  );
};

/**
 * Button Example Usage
 */
export const ButtonExample = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">Button Variants</h2>
      <div className="flex flex-wrap gap-4">
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      
      <h2 className="text-xl font-bold mt-6">Button Sizes</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      
      <h2 className="text-xl font-bold mt-6">Button States</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="primary" loading>Loading</Button>
      </div>
    </div>
  );
}; 