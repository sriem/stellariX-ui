/**
 * Theme System Types
 * Defines the structure of StellarIX UI themes
 */

/**
 * Color palette structure
 */
export interface ColorPalette {
    // Base colors
    background: string;
    foreground: string;
    
    // Component colors
    card: string;
    cardForeground: string;
    
    // Interactive colors
    primary: string;
    primaryForeground: string;
    primaryHover?: string;
    primaryHoverForeground?: string;
    secondary: string;
    secondaryForeground: string;
    secondaryHover?: string;
    secondaryHoverForeground?: string;
    
    // Semantic colors
    destructive: string;
    destructiveForeground: string;
    destructiveHover?: string;
    destructiveHoverForeground?: string;
    success: string;
    successForeground: string;
    successHover?: string;
    successHoverForeground?: string;
    warning: string;
    warningForeground: string;
    warningHover?: string;
    warningHoverForeground?: string;
    info: string;
    infoForeground: string;
    infoHover?: string;
    infoHoverForeground?: string;
    
    // UI colors
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    
    // Borders and dividers
    border: string;
    input: string;
    ring: string;
    
    // Special effects
    gradient: {
        from: string;
        via?: string;
        to: string;
    };
    glass: {
        background: string;
        border: string;
        blur: string;
    };
}

/**
 * Typography configuration
 */
export interface Typography {
    fontFamily: {
        sans: string;
        mono: string;
    };
    fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
    };
    fontWeight: {
        thin: number;
        light: number;
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
    };
    lineHeight: {
        none: number;
        tight: number;
        snug: number;
        normal: number;
        relaxed: number;
        loose: number;
    };
}

/**
 * Spacing scale
 */
export interface SpacingScale {
    px: string;
    0: string;
    0.5: string;
    1: string;
    1.5: string;
    2: string;
    2.5: string;
    3: string;
    3.5: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    14: string;
    16: string;
    20: string;
    24: string;
    28: string;
    32: string;
    36: string;
    40: string;
    44: string;
    48: string;
    52: string;
    56: string;
    60: string;
    64: string;
    72: string;
    80: string;
    96: string;
}

/**
 * Border radius scale
 */
export interface RadiusScale {
    none: string;
    sm: string;
    DEFAULT: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
}

/**
 * Shadow scale
 */
export interface ShadowScale {
    none: string;
    sm: string;
    DEFAULT: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    // Special shadows
    glow: string;
    glowSm: string;
    glowLg: string;
    glass: string;
}

/**
 * Animation presets
 */
export interface AnimationPresets {
    // Durations
    duration: {
        fast: string;
        normal: string;
        slow: string;
    };
    // Easings
    easing: {
        linear: string;
        in: string;
        out: string;
        inOut: string;
        spring: string;
        bounce: string;
    };
    // Keyframes
    keyframes: {
        fadeIn: Record<string, any>;
        fadeOut: Record<string, any>;
        slideIn: Record<string, any>;
        slideOut: Record<string, any>;
        scaleIn: Record<string, any>;
        scaleOut: Record<string, any>;
        shimmer: Record<string, any>;
        pulse: Record<string, any>;
        bounce: Record<string, any>;
        gradientShift: Record<string, any>;
    };
}

/**
 * Complete theme structure
 */
export interface Theme {
    name: string;
    mode: 'light' | 'dark';
    colors: ColorPalette;
    typography: Typography;
    spacing: SpacingScale;
    radii: RadiusScale;
    shadows: ShadowScale;
    animations: AnimationPresets;
    // Special effects configuration
    effects: {
        glassMorphism: boolean;
        gradientBorders: boolean;
        dynamicShadows: boolean;
        springAnimations: boolean;
    };
}

/**
 * Theme configuration options
 */
export interface ThemeConfig {
    defaultTheme?: string;
    themes: Record<string, Theme>;
    cssVarPrefix?: string;
}

/**
 * CSS variable map type
 */
export type CSSVariables = Record<string, string>;

/**
 * Component theme variant
 */
export interface ComponentTheme {
    root?: CSSVariables;
    variants?: Record<string, CSSVariables>;
    states?: Record<string, CSSVariables>;
}