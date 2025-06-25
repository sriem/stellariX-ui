import type { FrameworkAdapter, ComponentCore } from '@stellarix-ui/core';
import type { AdapterName } from './test-matrix';

export interface AdapterValidationResult {
  adapter: AdapterName;
  passed: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export interface ComponentValidationResult {
  component: string;
  adapter: AdapterName;
  passed: boolean;
  errors: string[];
  warnings: string[];
}

export class AdapterValidator {
  private errors: string[] = [];
  private warnings: string[] = [];

  validateAdapter(adapter: FrameworkAdapter<any>, name: AdapterName): AdapterValidationResult {
    this.errors = [];
    this.warnings = [];
    
    this.validateRequiredProperties(adapter);
    this.validateCreateComponent(adapter);
    this.validateOptionalMethods(adapter);
    this.validateVersion(adapter);
    
    const score = this.calculateScore();
    
    return {
      adapter: name,
      passed: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings],
      score
    };
  }

  validateComponentWithAdapter(
    component: ComponentCore<any, any>,
    adapter: FrameworkAdapter<any>,
    adapterName: AdapterName
  ): ComponentValidationResult {
    this.errors = [];
    this.warnings = [];
    
    try {
      const TestComponent = adapter.createComponent(component);
      
      if (!TestComponent) {
        this.errors.push('createComponent returned null or undefined');
      } else if (typeof TestComponent !== 'function') {
        this.errors.push(`createComponent returned ${typeof TestComponent}, expected function`);
      }
      
      this.validateComponentState(component);
      this.validateComponentLogic(component);
      this.validateComponentMetadata(component);
      
    } catch (error) {
      this.errors.push(`Failed to create component: ${error}`);
    }
    
    return {
      component: component.metadata.name,
      adapter: adapterName,
      passed: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings]
    };
  }

  private validateRequiredProperties(adapter: FrameworkAdapter<any>) {
    if (!adapter.name) {
      this.errors.push('Adapter missing required property: name');
    } else if (typeof adapter.name !== 'string') {
      this.errors.push(`Adapter.name must be string, got ${typeof adapter.name}`);
    }
    
    if (!adapter.version) {
      this.errors.push('Adapter missing required property: version');
    } else if (typeof adapter.version !== 'string') {
      this.errors.push(`Adapter.version must be string, got ${typeof adapter.version}`);
    }
    
    if (!adapter.createComponent) {
      this.errors.push('Adapter missing required method: createComponent');
    } else if (typeof adapter.createComponent !== 'function') {
      this.errors.push(`Adapter.createComponent must be function, got ${typeof adapter.createComponent}`);
    }
  }

  private validateCreateComponent(adapter: FrameworkAdapter<any>) {
    if (typeof adapter.createComponent !== 'function') return;
    
    const funcStr = adapter.createComponent.toString();
    
    if (!funcStr.includes('core')) {
      this.warnings.push('createComponent may not be using core parameter');
    }
    
    if (!funcStr.includes('state')) {
      this.warnings.push('createComponent may not be accessing component state');
    }
    
    if (!funcStr.includes('logic')) {
      this.warnings.push('createComponent may not be accessing component logic');
    }
  }

  private validateOptionalMethods(adapter: FrameworkAdapter<any>) {
    if (adapter.optimize) {
      if (typeof adapter.optimize !== 'function') {
        this.errors.push(`Adapter.optimize must be function, got ${typeof adapter.optimize}`);
      }
    }
  }

  private validateVersion(adapter: FrameworkAdapter<any>) {
    if (!adapter.version) return;
    
    const versionPattern = /^\d+\.\d+\.\d+$/;
    if (!versionPattern.test(adapter.version)) {
      this.warnings.push(`Version "${adapter.version}" does not follow semver format`);
    }
  }

  private validateComponentState(component: ComponentCore<any, any>) {
    const state = component.state;
    
    if (!state) {
      this.errors.push('Component missing state');
      return;
    }
    
    if (typeof state.getState !== 'function') {
      this.errors.push('Component state missing getState method');
    }
    
    if (typeof state.subscribe !== 'function') {
      this.errors.push('Component state missing subscribe method');
    }
    
    const stateValue = state.getState();
    if (stateValue === null || stateValue === undefined) {
      this.warnings.push('Component state is null or undefined');
    }
  }

  private validateComponentLogic(component: ComponentCore<any, any>) {
    const logic = component.logic;
    
    if (!logic) {
      this.errors.push('Component missing logic');
      return;
    }
    
    if (typeof logic.handleEvent !== 'function') {
      this.errors.push('Component logic missing handleEvent method');
    }
    
    if (typeof logic.getA11yProps !== 'function') {
      this.errors.push('Component logic missing getA11yProps method');
    }
    
    if (typeof logic.getInteractionHandlers !== 'function') {
      this.errors.push('Component logic missing getInteractionHandlers method');
    }
  }

  private validateComponentMetadata(component: ComponentCore<any, any>) {
    const metadata = component.metadata;
    
    if (!metadata) {
      this.errors.push('Component missing metadata');
      return;
    }
    
    if (!metadata.name) {
      this.errors.push('Component metadata missing name');
    }
    
    if (!metadata.structure) {
      this.errors.push('Component metadata missing structure');
    } else {
      if (!metadata.structure.elements) {
        this.errors.push('Component metadata structure missing elements');
      }
    }
    
    if (!metadata.accessibility) {
      this.warnings.push('Component metadata missing accessibility info');
    }
  }

  private calculateScore(): number {
    const baseScore = 100;
    const errorPenalty = 10;
    const warningPenalty = 2;
    
    const score = baseScore - (this.errors.length * errorPenalty) - (this.warnings.length * warningPenalty);
    return Math.max(0, Math.min(100, score));
  }
}

export function validateAllAdapters(
  adapters: Record<AdapterName, FrameworkAdapter<any>>
): Record<AdapterName, AdapterValidationResult> {
  const validator = new AdapterValidator();
  const results: Record<AdapterName, AdapterValidationResult> = {} as any;
  
  for (const [name, adapter] of Object.entries(adapters)) {
    results[name as AdapterName] = validator.validateAdapter(adapter, name as AdapterName);
  }
  
  return results;
}

export function validateAdapterInterface(adapter: FrameworkAdapter<any>): boolean {
  return (
    typeof adapter === 'object' &&
    adapter !== null &&
    typeof adapter.name === 'string' &&
    typeof adapter.version === 'string' &&
    typeof adapter.createComponent === 'function' &&
    (adapter.optimize === undefined || typeof adapter.optimize === 'function')
  );
}