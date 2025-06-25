import type { FrameworkAdapter, ComponentCore } from '@stellarix-ui/core';
import type { AdapterName, ComponentName } from './test-matrix';

export interface PerformanceMetrics {
  componentCreationTime: number;
  stateUpdateTime: number;
  eventHandlingTime: number;
  memoryUsage: number;
  subscriptionOverhead: number;
}

export interface PerformanceResult {
  adapter: AdapterName;
  component: ComponentName;
  metrics: PerformanceMetrics;
  score: number;
}

export interface PerformanceBenchmark {
  name: string;
  iterations: number;
  warmupIterations: number;
  measure: (adapter: FrameworkAdapter<any>, component: ComponentCore<any, any>) => number;
}

export class PerformanceTester {
  private benchmarks: PerformanceBenchmark[] = [
    {
      name: 'Component Creation',
      iterations: 1000,
      warmupIterations: 100,
      measure: (adapter, component) => {
        const start = performance.now();
        adapter.createComponent(component);
        return performance.now() - start;
      }
    },
    {
      name: 'State Update',
      iterations: 10000,
      warmupIterations: 1000,
      measure: (adapter, component) => {
        const state = component.state;
        const start = performance.now();
        
        if ('setValue' in state && typeof state.setValue === 'function') {
          state.setValue(`test-${Math.random()}`);
        } else if ('setOpen' in state && typeof state.setOpen === 'function') {
          state.setOpen(Math.random() > 0.5);
        } else if ('setChecked' in state && typeof state.setChecked === 'function') {
          state.setChecked(Math.random() > 0.5);
        }
        
        return performance.now() - start;
      }
    },
    {
      name: 'Event Handling',
      iterations: 5000,
      warmupIterations: 500,
      measure: (adapter, component) => {
        const logic = component.logic;
        const start = performance.now();
        
        logic.handleEvent('click', { target: {} });
        
        return performance.now() - start;
      }
    },
    {
      name: 'A11y Props Generation',
      iterations: 5000,
      warmupIterations: 500,
      measure: (adapter, component) => {
        const logic = component.logic;
        const start = performance.now();
        
        logic.getA11yProps('root');
        
        return performance.now() - start;
      }
    },
    {
      name: 'Subscription Overhead',
      iterations: 1000,
      warmupIterations: 100,
      measure: (adapter, component) => {
        const state = component.state;
        const subscriptions: (() => void)[] = [];
        
        const start = performance.now();
        
        for (let i = 0; i < 10; i++) {
          subscriptions.push(state.subscribe(() => {}));
        }
        
        const subscribeTime = performance.now() - start;
        
        subscriptions.forEach(unsub => unsub());
        
        return subscribeTime;
      }
    }
  ];

  async measurePerformance(
    adapter: FrameworkAdapter<any>,
    component: ComponentCore<any, any>,
    adapterName: AdapterName,
    componentName: ComponentName
  ): Promise<PerformanceResult> {
    const metrics: Partial<PerformanceMetrics> = {};
    
    for (const benchmark of this.benchmarks) {
      const time = await this.runBenchmark(benchmark, adapter, component);
      
      switch (benchmark.name) {
        case 'Component Creation':
          metrics.componentCreationTime = time;
          break;
        case 'State Update':
          metrics.stateUpdateTime = time;
          break;
        case 'Event Handling':
          metrics.eventHandlingTime = time;
          break;
        case 'Subscription Overhead':
          metrics.subscriptionOverhead = time;
          break;
      }
    }
    
    metrics.memoryUsage = await this.measureMemoryUsage(adapter, component);
    
    const score = this.calculatePerformanceScore(metrics as PerformanceMetrics);
    
    return {
      adapter: adapterName,
      component: componentName,
      metrics: metrics as PerformanceMetrics,
      score
    };
  }

  private async runBenchmark(
    benchmark: PerformanceBenchmark,
    adapter: FrameworkAdapter<any>,
    component: ComponentCore<any, any>
  ): Promise<number> {
    for (let i = 0; i < benchmark.warmupIterations; i++) {
      benchmark.measure(adapter, component);
    }
    
    const times: number[] = [];
    for (let i = 0; i < benchmark.iterations; i++) {
      times.push(benchmark.measure(adapter, component));
    }
    
    times.sort((a, b) => a - b);
    const median = times[Math.floor(times.length / 2)];
    
    return median;
  }

  private async measureMemoryUsage(
    adapter: FrameworkAdapter<any>,
    component: ComponentCore<any, any>
  ): Promise<number> {
    if (typeof performance === 'undefined' || !(performance as any).memory) {
      return 0;
    }
    
    const components: any[] = [];
    const initialMemory = (performance as any).memory.usedJSHeapSize;
    
    for (let i = 0; i < 1000; i++) {
      components.push(adapter.createComponent(component));
    }
    
    const finalMemory = (performance as any).memory.usedJSHeapSize;
    const memoryPerComponent = (finalMemory - initialMemory) / 1000;
    
    return memoryPerComponent;
  }

  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    const weights = {
      componentCreationTime: 0.3,
      stateUpdateTime: 0.3,
      eventHandlingTime: 0.2,
      memoryUsage: 0.1,
      subscriptionOverhead: 0.1
    };
    
    const thresholds = {
      componentCreationTime: { excellent: 0.1, good: 0.5, acceptable: 1 },
      stateUpdateTime: { excellent: 0.01, good: 0.05, acceptable: 0.1 },
      eventHandlingTime: { excellent: 0.01, good: 0.05, acceptable: 0.1 },
      memoryUsage: { excellent: 1000, good: 5000, acceptable: 10000 },
      subscriptionOverhead: { excellent: 0.1, good: 0.5, acceptable: 1 }
    };
    
    let totalScore = 0;
    
    for (const [metric, value] of Object.entries(metrics)) {
      const threshold = thresholds[metric as keyof typeof thresholds];
      const weight = weights[metric as keyof typeof weights];
      
      let score: number;
      if (value <= threshold.excellent) {
        score = 100;
      } else if (value <= threshold.good) {
        score = 75;
      } else if (value <= threshold.acceptable) {
        score = 50;
      } else {
        score = 25;
      }
      
      totalScore += score * weight;
    }
    
    return Math.round(totalScore);
  }
}

export async function compareAdapterPerformance(
  adapters: Record<AdapterName, FrameworkAdapter<any>>,
  components: Record<ComponentName, ComponentCore<any, any>>
): Promise<Record<AdapterName, Record<ComponentName, PerformanceResult>>> {
  const tester = new PerformanceTester();
  const results: Record<AdapterName, Record<ComponentName, PerformanceResult>> = {} as any;
  
  for (const [adapterName, adapter] of Object.entries(adapters)) {
    results[adapterName as AdapterName] = {} as any;
    
    for (const [componentName, component] of Object.entries(components)) {
      const result = await tester.measurePerformance(
        adapter,
        component,
        adapterName as AdapterName,
        componentName as ComponentName
      );
      
      results[adapterName as AdapterName][componentName as ComponentName] = result;
    }
  }
  
  return results;
}

export function generatePerformanceReport(
  results: Record<AdapterName, Record<ComponentName, PerformanceResult>>
): string {
  let report = '# Adapter Performance Report\n\n';
  
  const adapterScores: Record<AdapterName, number> = {} as any;
  
  for (const [adapterName, componentResults] of Object.entries(results)) {
    const scores = Object.values(componentResults).map(r => r.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    adapterScores[adapterName as AdapterName] = avgScore;
    
    report += `## ${adapterName} Adapter\n`;
    report += `Average Score: ${avgScore.toFixed(2)}/100\n\n`;
    
    report += '| Component | Creation (ms) | Update (ms) | Events (ms) | Memory (bytes) | Score |\n';
    report += '|-----------|---------------|-------------|-------------|----------------|-------|\n';
    
    for (const [componentName, result] of Object.entries(componentResults)) {
      const m = result.metrics;
      report += `| ${componentName} | ${m.componentCreationTime.toFixed(3)} | ${m.stateUpdateTime.toFixed(3)} | ${m.eventHandlingTime.toFixed(3)} | ${m.memoryUsage.toFixed(0)} | ${result.score} |\n`;
    }
    
    report += '\n';
  }
  
  report += '## Summary\n\n';
  report += '| Adapter | Average Score |\n';
  report += '|---------|---------------|\n';
  
  const sortedAdapters = Object.entries(adapterScores).sort((a, b) => b[1] - a[1]);
  for (const [adapter, score] of sortedAdapters) {
    report += `| ${adapter} | ${score.toFixed(2)} |\n`;
  }
  
  return report;
}