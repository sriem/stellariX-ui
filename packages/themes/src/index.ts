/**
 * StellarIX UI Theme System
 * Beautiful, modern themes for headless components
 */

export * from './types';
export * from './utils';

// Import all themes
import { stellarLight, stellarDark } from './themes/stellar';
import { auroraLight, auroraDark } from './themes/aurora';
import { nebulaDark, nebulaLight } from './themes/nebula';

// Export individual themes
export { stellarLight, stellarDark } from './themes/stellar';
export { auroraLight, auroraDark } from './themes/aurora';
export { nebulaDark, nebulaLight } from './themes/nebula';

// Theme registry
export const themes = {
    'stellar-light': stellarLight,
    'stellar-dark': stellarDark,
    'aurora-light': auroraLight,
    'aurora-dark': auroraDark,
    'nebula-light': nebulaLight,
    'nebula-dark': nebulaDark,
} as const;

// Default theme
export const defaultTheme = stellarLight;
export const defaultDarkTheme = stellarDark;

/**
 * Get theme by name
 */
export function getTheme(name: keyof typeof themes) {
    return themes[name] || defaultTheme;
}

/**
 * Theme provider interface for framework adapters
 */
export interface ThemeProviderProps {
    theme?: keyof typeof themes;
    children?: any;
    cssVarPrefix?: string;
}

/**
 * Component style presets
 */
export const componentStyles = {
    button: {
        base: 'sx-component sx-focus-ring',
        variant: {
            primary: 'sx-gradient-border',
            secondary: 'sx-glass',
            ghost: 'sx-shadow-dynamic',
        },
        size: {
            sm: 'sx-spacing-2 sx-spacing-4',
            md: 'sx-spacing-3 sx-spacing-6',
            lg: 'sx-spacing-4 sx-spacing-8',
        },
    },
    card: {
        base: 'sx-component',
        variant: {
            simple: '',
            outlined: 'sx-border',
            elevated: 'sx-shadow-dynamic',
            glass: 'sx-glass sx-gradient-border',
        },
    },
    input: {
        base: 'sx-component sx-focus-ring',
        variant: {
            default: 'sx-border',
            filled: 'sx-glass-subtle',
            ghost: '',
        },
    },
} as const;