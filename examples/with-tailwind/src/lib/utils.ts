import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if the user prefers dark mode
 */
export function prefersDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Format class names for different component states
 */
export function formatStateClasses(state: Record<string, boolean>, classMap: Record<string, string>) {
  return Object.entries(state)
    .filter(([_, isActive]) => isActive)
    .map(([key]) => classMap[key])
    .filter(Boolean)
    .join(' ');
}

/**
 * Generate responsive class names
 */
export function responsive(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string,
  xxl?: string
) {
  return cn(
    base,
    sm && `sm:${sm}`,
    md && `md:${md}`,
    lg && `lg:${lg}`,
    xl && `xl:${xl}`,
    xxl && `2xl:${xxl}`
  );
}

/**
 * Generate variant class names using a variant map
 */
export function variant<T extends Record<string, Record<string, string>>>(
  variants: T,
  props: {
    variant?: keyof T['variant'];
    size?: keyof T['size'];
    state?: keyof T['state'];
  }
) {
  const classes: string[] = [];
  
  if (props.variant && variants.variant?.[props.variant]) {
    classes.push(variants.variant[props.variant]);
  }
  
  if (props.size && variants.size?.[props.size]) {
    classes.push(variants.size[props.size]);
  }
  
  if (props.state && variants.state?.[props.state]) {
    classes.push(variants.state[props.state]);
  }
  
  return classes.join(' ');
}