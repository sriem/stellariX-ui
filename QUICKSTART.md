# StellarIX UI - Quick Start

Get up and running in 30 seconds!

## Install

```bash
pnpm add @stellarix/button @stellarix/react
```

## Use

```tsx
import { createButton } from '@stellarix/button';
import { reactAdapter } from '@stellarix/react';

const Button = createButton().connect(reactAdapter);

export default function App() {
  return <Button onClick={() => alert('Hello!')}>Click me</Button>;
}
```

## That's it! 🚀

- 30 components available
- Framework-agnostic core
- TypeScript-first
- Zero config

**[Full Documentation →](./README.md)**