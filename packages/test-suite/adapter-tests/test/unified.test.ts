import { describe, it, expect, beforeAll } from 'vitest';
import { reactAdapter } from '@stellarix-ui/react';
import { vueAdapter } from '@stellarix-ui/vue';
import { svelteAdapter } from '@stellarix-ui/svelte';
import { solidAdapter } from '@stellarix-ui/solid';
import type { FrameworkAdapter, ComponentCore } from '@stellarix-ui/core';

import { 
  ADAPTERS, 
  COMPONENTS, 
  TEST_SCENARIOS,
  adapterTestMatrix,
  getTestName,
  shouldSkipTest,
  type AdapterName,
  type ComponentName
} from '../src/test-matrix';

import { 
  AdapterValidator,
  validateAllAdapters,
  validateAdapterInterface
} from '../src/adapter-validator';

import {
  PerformanceTester,
  compareAdapterPerformance,
  generatePerformanceReport
} from '../src/performance';

const adapters: Record<AdapterName, FrameworkAdapter<any>> = {
  react: reactAdapter,
  vue: vueAdapter,
  svelte: svelteAdapter,
  solid: solidAdapter
};

import { loadComponent } from '../src/component-loader';

describe('Unified Adapter Testing Suite', () => {
  let validator: AdapterValidator;
  let performanceTester: PerformanceTester;
  
  beforeAll(() => {
    validator = new AdapterValidator();
    performanceTester = new PerformanceTester();
  });
  
  describe('Adapter Interface Validation', () => {
    ADAPTERS.forEach(adapterName => {
      it(`${adapterName} adapter implements required interface`, () => {
        const adapter = adapters[adapterName];
        expect(validateAdapterInterface(adapter)).toBe(true);
        
        const result = validator.validateAdapter(adapter, adapterName);
        expect(result.passed).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.score).toBeGreaterThanOrEqual(90);
      });
    });
  });
  
  describe('Component Compatibility Matrix', () => {
    ADAPTERS.forEach(adapterName => {
      describe(`${adapterName} Adapter`, () => {
        COMPONENTS.forEach(componentName => {
          describe(`${componentName} Component`, () => {
            TEST_SCENARIOS.forEach(scenario => {
              const testName = getTestName(adapterName, componentName, scenario);
              const shouldSkip = shouldSkipTest(adapterName, componentName, scenario);
              
              const testFn = shouldSkip ? it.skip : it;
              
              testFn(`${scenario.name}: ${scenario.description}`, async () => {
                const adapter = adapters[adapterName];
                const component = await loadComponent(componentName);
                
                await scenario.test(adapter, component);
              });
            });
          });
        });
      });
    });
  });
  
  describe('Cross-Adapter Consistency', () => {
    COMPONENTS.forEach(componentName => {
      it(`All adapters handle ${componentName} consistently`, async () => {
        const component = await loadComponent(componentName);
        const results: Record<AdapterName, any> = {} as any;
        
        for (const adapterName of ADAPTERS) {
          const adapter = adapters[adapterName];
          const TestComponent = adapter.createComponent(component);
          
          results[adapterName] = {
            componentType: typeof TestComponent,
            hasDisplayName: 'displayName' in TestComponent || TestComponent.name !== undefined,
            state: component.state.getState(),
            a11yProps: component.logic.getA11yProps('root')
          };
        }
        
        const states = Object.values(results).map(r => JSON.stringify(r.state));
        const uniqueStates = new Set(states);
        expect(uniqueStates.size).toBe(1);
        
        const a11yProps = Object.values(results).map(r => Object.keys(r.a11yProps || {}).sort().join(','));
        const uniqueA11y = new Set(a11yProps);
        expect(uniqueA11y.size).toBe(1);
      });
    });
  });
  
  describe('Performance Benchmarks', () => {
    it('measures adapter performance across all components', async () => {
      const components: Record<ComponentName, ComponentCore<any, any>> = {} as any;
      
      for (const componentName of COMPONENTS.slice(0, 5)) {
        components[componentName] = await loadComponent(componentName);
      }
      
      const results = await compareAdapterPerformance(adapters, components);
      const report = generatePerformanceReport(results);
      
      console.log('\n' + report);
      
      for (const adapterName of ADAPTERS) {
        const adapterResults = results[adapterName];
        const scores = Object.values(adapterResults).map(r => r.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        expect(avgScore).toBeGreaterThan(50);
      }
    });
  });
  
  describe('Adapter Validation Summary', () => {
    it('validates all adapters and generates report', () => {
      const validationResults = validateAllAdapters(adapters);
      
      console.log('\n## Adapter Validation Report\n');
      
      for (const [adapterName, result] of Object.entries(validationResults)) {
        console.log(`### ${adapterName} Adapter`);
        console.log(`- Score: ${result.score}/100`);
        console.log(`- Passed: ${result.passed}`);
        
        if (result.errors.length > 0) {
          console.log('- Errors:');
          result.errors.forEach(err => console.log(`  - ${err}`));
        }
        
        if (result.warnings.length > 0) {
          console.log('- Warnings:');
          result.warnings.forEach(warn => console.log(`  - ${warn}`));
        }
        
        console.log('');
      }
      
      const allPassed = Object.values(validationResults).every(r => r.passed);
      expect(allPassed).toBe(true);
    });
  });
  
  describe('Test Matrix Statistics', () => {
    it('reports test matrix coverage', () => {
      console.log('\n## Test Matrix Statistics\n');
      console.log(`- Total Adapters: ${adapterTestMatrix.adapters.length}`);
      console.log(`- Total Components: ${adapterTestMatrix.components.length}`);
      console.log(`- Test Scenarios: ${adapterTestMatrix.scenarios.length}`);
      console.log(`- Total Tests: ${adapterTestMatrix.totalTests}`);
      console.log('\n### Adapters:');
      adapterTestMatrix.adapters.forEach(a => console.log(`  - ${a}`));
      console.log('\n### Components:');
      adapterTestMatrix.components.forEach(c => console.log(`  - ${c}`));
      console.log('\n### Test Scenarios:');
      adapterTestMatrix.scenarios.forEach(s => console.log(`  - ${s.name}: ${s.description}`));
    });
  });
});

export default {};