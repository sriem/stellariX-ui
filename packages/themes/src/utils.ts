/**
 * Theme System Utilities
 * Helper functions for working with themes
 */

import type { Theme, CSSVariables, ColorPalette } from './types';

/**
 * Converts a theme object to CSS variables
 */
export function themeToCSSVariables(theme: Theme, prefix = '--sx'): CSSVariables {
    const vars: CSSVariables = {};
    
    // Convert colors
    Object.entries(theme.colors).forEach(([key, value]) => {
        if (typeof value === 'string') {
            vars[`${prefix}-${camelToKebab(key)}`] = value;
        } else if (typeof value === 'object') {
            // Handle nested objects like gradient and glass
            Object.entries(value).forEach(([subKey, subValue]) => {
                vars[`${prefix}-${camelToKebab(key)}-${camelToKebab(subKey)}`] = subValue as string;
            });
        }
    });
    
    // Convert typography
    Object.entries(theme.typography).forEach(([category, values]) => {
        if (typeof values === 'object') {
            Object.entries(values).forEach(([key, value]) => {
                vars[`${prefix}-font-${camelToKebab(category)}-${key}`] = String(value);
            });
        }
    });
    
    // Convert spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
        vars[`${prefix}-spacing-${key.replace('.', '_')}`] = value;
    });
    
    // Convert radii
    Object.entries(theme.radii).forEach(([key, value]) => {
        const radiusKey = key === 'DEFAULT' ? 'radius' : `radius-${camelToKebab(key)}`;
        vars[`${prefix}-${radiusKey}`] = value;
    });
    
    // Convert shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
        const shadowKey = key === 'DEFAULT' ? 'shadow' : `shadow-${camelToKebab(key)}`;
        vars[`${prefix}-${shadowKey}`] = value;
    });
    
    // Convert animation durations
    Object.entries(theme.animations.duration).forEach(([key, value]) => {
        vars[`${prefix}-duration-${key}`] = value;
    });
    
    // Convert animation easings
    Object.entries(theme.animations.easing).forEach(([key, value]) => {
        vars[`${prefix}-easing-${key}`] = value;
    });
    
    return vars;
}

/**
 * Generates a CSS string from CSS variables
 */
export function generateCSSString(cssVars: CSSVariables, selector = ':root'): string {
    const declarations = Object.entries(cssVars)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');
    
    return `${selector} {\n${declarations}\n}`;
}

/**
 * Converts camelCase to kebab-case
 */
function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generates keyframe CSS
 */
export function generateKeyframes(keyframes: Record<string, Record<string, any>>): string {
    return Object.entries(keyframes)
        .map(([name, frames]) => {
            const framesCss = Object.entries(frames)
                .map(([key, styles]) => {
                    const styleStr = Object.entries(styles)
                        .map(([prop, value]) => `    ${camelToKebab(prop)}: ${value};`)
                        .join('\n');
                    return `  ${key} {\n${styleStr}\n  }`;
                })
                .join('\n');
            
            return `@keyframes ${name} {\n${framesCss}\n}`;
        })
        .join('\n\n');
}

/**
 * Interpolates between two colors
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
    // Simple RGB interpolation (can be enhanced)
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
    
    return rgbToHex(r, g, b);
}

/**
 * Converts hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Converts RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Generates glass morphism CSS
 */
export function generateGlassMorphism(theme: Theme): string {
    if (!theme.effects.glassMorphism) return '';
    
    return `
.sx-glass {
  background: ${theme.colors.glass.background};
  backdrop-filter: blur(${theme.colors.glass.blur});
  -webkit-backdrop-filter: blur(${theme.colors.glass.blur});
  border: 1px solid ${theme.colors.glass.border};
}

.sx-glass-subtle {
  background: ${theme.colors.glass.background}66;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid ${theme.colors.glass.border}40;
}
`;
}

/**
 * Generates gradient border CSS
 */
export function generateGradientBorders(theme: Theme): string {
    if (!theme.effects.gradientBorders) return '';
    
    const { from, via, to } = theme.colors.gradient;
    const gradient = via 
        ? `linear-gradient(45deg, ${from}, ${via}, ${to})`
        : `linear-gradient(45deg, ${from}, ${to})`;
    
    return `
.sx-gradient-border {
  position: relative;
  background: ${theme.colors.background};
  border-radius: var(--sx-radius);
}

.sx-gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--sx-radius);
  padding: 2px;
  background: ${gradient};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity var(--sx-duration-normal) var(--sx-easing-out);
}

.sx-gradient-border:hover::before,
.sx-gradient-border:focus-within::before {
  opacity: 1;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.sx-gradient-border-animated::before {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
`;
}

/**
 * Generates dynamic shadow utilities
 */
export function generateDynamicShadows(theme: Theme): string {
    if (!theme.effects.dynamicShadows) return '';
    
    return `
.sx-shadow-dynamic {
  transition: box-shadow var(--sx-duration-normal) var(--sx-easing-spring);
}

.sx-shadow-dynamic:hover {
  box-shadow: var(--sx-shadow-lg);
}

.sx-shadow-dynamic:active {
  box-shadow: var(--sx-shadow-sm);
}

.sx-shadow-glow {
  box-shadow: var(--sx-shadow-glow);
  transition: box-shadow var(--sx-duration-normal) var(--sx-easing-out);
}

.sx-shadow-glow:hover {
  box-shadow: var(--sx-shadow-glow-lg);
}
`;
}