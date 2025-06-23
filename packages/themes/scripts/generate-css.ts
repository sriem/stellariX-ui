/**
 * Generate CSS files for each theme
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { themes } from '../src';
import { 
    themeToCSSVariables, 
    generateCSSString, 
    generateKeyframes,
    generateGlassMorphism,
    generateGradientBorders,
    generateDynamicShadows 
} from '../src/utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cssDir = join(__dirname, '..', 'css');

// Read component styles
const componentStyles = readFileSync(join(__dirname, '..', 'src', 'components.css'), 'utf-8');

// Ensure CSS directory exists
mkdirSync(cssDir, { recursive: true });

// Generate CSS for each theme
Object.entries(themes).forEach(([name, theme]) => {
    const cssVars = themeToCSSVariables(theme);
    const rootCSS = generateCSSString(cssVars);
    const keyframesCSS = generateKeyframes(theme.animations.keyframes);
    const glassMorphismCSS = generateGlassMorphism(theme);
    const gradientBordersCSS = generateGradientBorders(theme);
    const dynamicShadowsCSS = generateDynamicShadows(theme);
    
    const fullCSS = `/* StellarIX UI Theme: ${theme.name} */
/* Auto-generated - Do not edit directly */

${rootCSS}

/* Keyframe Animations */
${keyframesCSS}

/* Special Effects */
${glassMorphismCSS}
${gradientBordersCSS}
${dynamicShadowsCSS}

/* Component Styles */
${componentStyles}

/* Theme-specific utilities */
.sx-theme-${theme.name} {
  color-scheme: ${theme.mode};
}

/* Additional theme-specific component styles */
body[data-theme="${name}"] {
  background-color: var(--sx-background);
  color: var(--sx-foreground);
  font-family: var(--sx-font-sans);
}

/* Animation Utilities */
.sx-animate-fade-in { animation: fadeIn var(--sx-duration-normal) var(--sx-easing-out); }
.sx-animate-slide-in { animation: slideIn var(--sx-duration-normal) var(--sx-easing-spring); }
.sx-animate-scale-in { animation: scaleIn var(--sx-duration-fast) var(--sx-easing-spring); }
.sx-animate-pulse { animation: pulse 2s infinite; }
.sx-animate-bounce { animation: bounce 1s infinite; }

.sx-animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* Gradient Text */
.sx-gradient-text {
  background: linear-gradient(
    135deg,
    var(--sx-gradient-from),
    var(--sx-gradient-via, var(--sx-gradient-to)),
    var(--sx-gradient-to)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Focus Styles */
.sx-focus-ring:focus {
  outline: 2px solid var(--sx-ring);
  outline-offset: 2px;
}

.sx-focus-ring:focus:not(:focus-visible) {
  outline: none;
}

/* Spacing Utilities */
${Object.entries(theme.spacing).map(([key, value]) => 
    `.sx-p-${key.replace('.', '_')} { padding: ${value}; }`
).join('\n')}

/* Border Radius Utilities */
${Object.entries(theme.radii).map(([key, value]) => 
    `.sx-rounded${key === 'DEFAULT' ? '' : '-' + key} { border-radius: ${value}; }`
).join('\n')}

/* Shadow Utilities */
${Object.entries(theme.shadows).map(([key, value]) => 
    `.sx-shadow${key === 'DEFAULT' ? '' : '-' + key} { box-shadow: ${value}; }`
).join('\n')}
`;

    // Write CSS file
    writeFileSync(join(cssDir, `${name}.css`), fullCSS, 'utf-8');
    console.log(`Generated ${name}.css`);
});

// Generate index CSS that includes all themes
const indexCSS = `/* StellarIX UI - All Themes */
/* Import the theme you want to use */

${Object.keys(themes).map(name => `/* @import './${name}.css'; */`).join('\n')}

/* Or import all themes and switch with data attributes */
${Object.entries(themes).map(([name, theme]) => {
    const cssVars = themeToCSSVariables(theme);
    return `
[data-theme="${name}"] {
${Object.entries(cssVars).map(([key, value]) => `  ${key}: ${value};`).join('\n')}
}`;
}).join('\n')}

/* Component styles (theme-independent) */
${componentStyles}
`;

writeFileSync(join(cssDir, 'index.css'), indexCSS, 'utf-8');
console.log('Generated index.css');

console.log('\nCSS generation complete!');