// Utility for generating unique IDs
let idCounter = 0;

export function generateId(prefix = 'stellarix'): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

export function generateUniqueId(): string {
  return generateId('sx');
}

// For specific component types
export function generateComponentId(componentName: string): string {
  return generateId(componentName.toLowerCase());
}

// Generate ARIA IDs
export function generateAriaId(prefix = 'aria'): string {
  return generateId(prefix);
}