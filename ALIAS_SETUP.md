# @sx/ Import Alias Configuration

Want even shorter imports? Configure your bundler to use `@sx/` instead of `@stellarix/`!

## Before (Default)
```tsx
import { createButton } from '@stellarix/button';
import { createInput } from '@stellarix/input';
import { reactAdapter } from '@stellarix/react';
```

## After (With Alias)
```tsx
import { createButton } from '@sx/button';
import { createInput } from '@sx/input';
import { reactAdapter } from '@sx/react';
```

## Configuration

### Vite
```js
// vite.config.js
export default {
  resolve: {
    alias: {
      '@sx/': '@stellarix/'
    }
  }
}
```

### Webpack
```js
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@sx': '@stellarix'
    }
  }
}
```

### TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@sx/*": ["node_modules/@stellarix/*"]
    }
  }
}
```

### Next.js
```js
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.alias['@sx'] = '@stellarix';
    return config;
  }
}
```

### ESBuild
```js
// build script
require('esbuild').build({
  alias: {
    '@sx': '@stellarix'
  }
})
```

### Rollup
```js
// rollup.config.js
import alias from '@rollup/plugin-alias';

export default {
  plugins: [
    alias({
      entries: [
        { find: '@sx', replacement: '@stellarix' }
      ]
    })
  ]
}
```

## Package.json Configuration (For Library Authors)

While we can't directly make npm understand @sx as @stellarix, you can add this to your app's package.json for documentation:

```json
{
  "stellarix": {
    "aliases": {
      "@sx/*": "@stellarix/*"
    }
  }
}
```

This serves as documentation for your team about the alias convention.