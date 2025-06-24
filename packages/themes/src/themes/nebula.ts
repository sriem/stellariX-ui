/**
 * Nebula Theme
 * Dark-first futuristic theme with neon accents
 */

import type { Theme } from '../types';

export const nebulaLight: Theme = {
    name: 'nebula-light',
    mode: 'light',
    colors: {
        background: 'hsl(0, 0%, 98%)',
        foreground: 'hsl(239.5, 29.4%, 12.7%)',
        
        card: 'hsl(0, 0%, 100%)',
        cardForeground: 'hsl(239.5, 29.4%, 12.7%)',
        
        primary: 'hsl(203.8, 69.7%, 26.1%)',
        primaryForeground: 'hsl(0, 0%, 100%)',
        primaryHover: 'hsl(203.8, 69.7%, 19.4%)',
        primaryHoverForeground: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(207.3, 56.1%, 43.7%)',
        secondaryForeground: 'hsl(0, 0%, 100%)',
        secondaryHover: 'hsl(207.3, 56.1%, 36.5%)',
        secondaryHoverForeground: 'hsl(0, 0%, 100%)',
        
        destructive: '#d62828',
        destructiveForeground: '#ffffff',
        destructiveHover: '#c42020',
        destructiveHoverForeground: '#ffffff',
        success: '#009960',
        successForeground: '#ffffff',
        successHover: '#007a4d',
        successHoverForeground: '#ffffff',
        warning: '#ffb700',
        warningForeground: '#1a1a2e',
        warningHover: '#e6a300',
        warningHoverForeground: '#1a1a2e',
        info: '#0077aa',
        infoForeground: '#ffffff',
        infoHover: '#006090',
        infoHoverForeground: '#ffffff',
        
        muted: 'hsl(0, 0%, 94.1%)',
        mutedForeground: 'hsl(0, 0%, 25%)',
        accent: 'hsl(0, 0%, 91%)',
        accentForeground: 'hsl(239.5, 29.4%, 12.7%)',
        
        // Borders and dividers - Clean lines
        border: 'hsl(0, 0%, 81.6%)',
        input: 'hsl(0, 0%, 81.6%)',
        ring: 'hsl(207.3, 56.1%, 43.7%)',
        
        // Special effects - Tech gradients
        gradient: {
            from: 'hsl(203.8, 69.7%, 26.1%)',
            via: 'hsl(207.3, 56.1%, 43.7%)',
            to: 'hsl(188.7, 100%, 50%)',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'rgba(50, 130, 184, 0.15)',
            blur: '12px',
        },
    },
    typography: {
        fontFamily: {
            sans: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            mono: '"JetBrains Mono", "Fira Code", Monaco, Consolas, monospace',
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        },
        fontWeight: {
            thin: 100,
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeight: {
            none: 1,
            tight: 1.25,
            snug: 1.375,
            normal: 1.5,
            relaxed: 1.625,
            loose: 2,
        },
    },
    spacing: {
        px: '1px',
        0: '0',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
    },
    radii: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.625rem',
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        full: '9999px',
    },
    shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgb(26 26 46 / 0.04), 0 1px 1px -1px rgb(26 26 46 / 0.03)',
        DEFAULT: '0 2px 4px -1px rgb(26 26 46 / 0.06), 0 2px 2px -2px rgb(26 26 46 / 0.04)',
        md: '0 4px 8px -2px rgb(26 26 46 / 0.08), 0 3px 4px -3px rgb(26 26 46 / 0.04)',
        lg: '0 10px 20px -5px rgb(26 26 46 / 0.1), 0 6px 8px -6px rgb(26 26 46 / 0.04)',
        xl: '0 20px 30px -7px rgb(26 26 46 / 0.12), 0 10px 12px -8px rgb(26 26 46 / 0.04)',
        '2xl': '0 25px 50px -12px rgb(26 26 46 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(26 26 46 / 0.05)',
        // Tech shadows
        card: '0 2px 6px -2px rgb(26 26 46 / 0.05), 0 1px 2px -1px rgb(26 26 46 / 0.03)',
        button: '0 1px 2px 0 rgb(26 26 46 / 0.04), 0 1px 1px -1px rgb(26 26 46 / 0.03)',
        dropdown: '0 10px 20px -5px rgb(26 26 46 / 0.1), 0 6px 8px -6px rgb(26 26 46 / 0.04)',
        glow: '0 0 20px -5px rgba(0, 217, 255, 0.25)',
        glowSm: '0 0 12px -3px rgba(0, 217, 255, 0.2)',
        glowLg: '0 0 30px -7px rgba(0, 217, 255, 0.35)',
        glass: '0 8px 32px -8px rgba(26, 26, 46, 0.12)',
    },
    animations: {
        duration: {
            fast: '100ms',
            normal: '250ms',
            slow: '400ms',
        },
        easing: {
            linear: 'linear',
            in: 'cubic-bezier(0.4, 0, 1, 1)',
            out: 'cubic-bezier(0, 0, 0.2, 1)',
            inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            spring: 'cubic-bezier(0.3, 1.7, 0.3, 1)',
            bounce: 'cubic-bezier(0.7, -0.4, 0.3, 1.3)',
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 },
            },
            fadeOut: {
                '0%': { opacity: 1 },
                '100%': { opacity: 0 },
            },
            slideIn: {
                '0%': { transform: 'translateY(12px)', opacity: 0 },
                '100%': { transform: 'translateY(0)', opacity: 1 },
            },
            slideOut: {
                '0%': { transform: 'translateY(0)', opacity: 1 },
                '100%': { transform: 'translateY(12px)', opacity: 0 },
            },
            scaleIn: {
                '0%': { transform: 'scale(0.9)', opacity: 0 },
                '100%': { transform: 'scale(1)', opacity: 1 },
            },
            scaleOut: {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '100%': { transform: 'scale(0.9)', opacity: 0 },
            },
            shimmer: {
                '0%': { backgroundPosition: '-200% 0' },
                '100%': { backgroundPosition: '200% 0' },
            },
            pulse: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.4 },
            },
            bounce: {
                '0%, 100%': { 
                    transform: 'translateY(0)',
                    animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                },
                '50%': {
                    transform: 'translateY(-30%)',
                    animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                },
            },
            gradientShift: {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
            },
        },
    },
    effects: {
        glassMorphism: true,
        gradientBorders: true,
        dynamicShadows: true,
        springAnimations: true,
    },
};

export const nebulaDark: Theme = {
    ...nebulaLight,
    name: 'nebula-dark',
    mode: 'dark',
    colors: {
        // Base colors - Deep space canvas
        background: 'hsl(240, 42.9%, 9.6%)',
        foreground: 'hsl(240, 100%, 93.9%)',
        
        // Component colors - Void surfaces
        card: 'hsl(239.5, 29.4%, 12.7%)',
        cardForeground: 'hsl(240, 100%, 93.9%)',
        
        // Interactive colors - Cyberpunk neon
        primary: 'hsl(188.7, 100%, 50%)',
        primaryForeground: 'hsl(240, 42.9%, 9.6%)',
        primaryHover: 'hsl(188.7, 100%, 42.4%)',
        primaryHoverForeground: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(336.4, 100%, 50%)',
        secondaryForeground: 'hsl(0, 0%, 100%)',
        secondaryHover: 'hsl(336.4, 100%, 44.9%)',
        secondaryHoverForeground: 'hsl(0, 0%, 100%)',
        
        // Semantic colors - Cyberpunk neon
        destructive: '#ff006e',
        destructiveForeground: '#ffffff',
        destructiveHover: '#e60060',
        destructiveHoverForeground: '#ffffff',
        success: '#06ffa5',
        successForeground: '#0f0f23',
        successHover: '#00e691',
        successHoverForeground: '#0f0f23',
        warning: '#ffb700',
        warningForeground: '#0f0f23',
        warningHover: '#e6a300',
        warningHoverForeground: '#ffffff',
        info: '#00d9ff',
        infoForeground: '#0f0f23',
        infoHover: '#00b8d9',
        infoHoverForeground: '#ffffff',
        
        // UI colors - Cyber depth
        muted: 'hsl(221.1, 43.4%, 16.9%)',
        mutedForeground: 'hsl(240, 20%, 69%)',
        accent: 'hsl(222.8, 42.9%, 20.8%)',
        accentForeground: 'hsl(240, 100%, 93.9%)',
        
        // Borders and dividers - Neon traces
        border: 'hsl(225.6, 30.5%, 24.5%)',
        input: 'hsl(225.6, 30.5%, 24.5%)',
        ring: 'hsl(188.7, 100%, 50%)',
        
        // Special effects - Cyberpunk vibes
        gradient: {
            from: 'hsl(188.7, 100%, 50%)',
            via: 'hsl(336.4, 100%, 50%)',
            to: 'hsl(42.9, 100%, 50%)',
        },
        glass: {
            background: 'rgba(26, 26, 46, 0.7)',
            border: 'rgba(0, 217, 255, 0.2)',
            blur: '24px',
        },
    },
    shadows: {
        ...nebulaLight.shadows,
        // Cyberpunk shadows and glows
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.6), 0 1px 2px -1px rgb(0 0 0 / 0.5)',
        DEFAULT: '0 2px 6px -1px rgb(0 0 0 / 0.7), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
        md: '0 4px 12px -2px rgb(0 0 0 / 0.7), 0 3px 6px -3px rgb(0 0 0 / 0.5)',
        lg: '0 10px 24px -4px rgb(0 0 0 / 0.7), 0 6px 12px -5px rgb(0 0 0 / 0.5)',
        xl: '0 20px 40px -6px rgb(0 0 0 / 0.7), 0 10px 20px -7px rgb(0 0 0 / 0.5)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.8)',
        // Neon glow effects
        card: '0 2px 8px -2px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(0 217 255 / 0.1)',
        button: '0 1px 4px 0 rgb(0 0 0 / 0.6), 0 0 0 1px rgb(0 217 255 / 0.05)',
        dropdown: '0 10px 30px -5px rgb(0 0 0 / 0.7), 0 0 0 1px rgb(0 217 255 / 0.1)',
        glow: '0 0 25px -5px rgba(0, 217, 255, 0.6), 0 0 50px -10px rgba(0, 217, 255, 0.3)',
        glowSm: '0 0 15px -3px rgba(0, 217, 255, 0.5)',
        glowLg: '0 0 40px -8px rgba(0, 217, 255, 0.7), 0 0 80px -16px rgba(0, 217, 255, 0.35)',
        glass: '0 8px 32px -8px rgba(0, 217, 255, 0.2)',
    },
};