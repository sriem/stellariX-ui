import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

describe('Debug A11y', () => {
  it('should debug violations', async () => {
    const { container } = render(
      <main>
        <h1>Test Page</h1>
        <div role="group" aria-label="Progress">
          <ol role="list">
            <li role="listitem">
              <button role="button" aria-label="Step 1: Account">
                1
              </button>
            </li>
            <li role="listitem">
              <button role="button" aria-label="Step 2: Details">
                2
              </button>
            </li>
          </ol>
        </div>
      </main>
    );
    
    const results = await axe(container);
    
    if (results.violations.length > 0) {
      console.log('Violations:');
      results.violations.forEach(v => {
        console.log(`${v.id}: ${v.description}`);
        v.nodes.forEach(n => console.log(`  - ${n.html}`));
      });
    }
    
    expect(results).toHaveNoViolations();
  });
});