# Svelte 5 Patterns for StellarIX UI

This document outlines the revolutionary Svelte 5 runes system and how it's implemented in the StellarIX Svelte adapter.

## 🚀 Key Svelte 5 Features - The Runes System

### 1. $state Rune - Reactive State

The `$state` rune creates reactive state variables:

```svelte
<script>
  // Simple reactive state
  let count = $state(0);
  let message = $state('Hello');
  let user = $state({ name: 'Alice', age: 30 });
  
  // Arrays and objects are deeply reactive
  let todos = $state([
    { id: 1, text: 'Learn Svelte 5', done: false },
    { id: 2, text: 'Build app', done: false }
  ]);
  
  // Mutations are tracked
  function addTodo(text) {
    todos.push({ id: Date.now(), text, done: false });
  }
  
  function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done; // Reactivity works!
  }
</script>

<button onclick={() => count++}>
  Count: {count}
</button>
```

### 2. $derived Rune - Computed Values

The `$derived` rune creates reactive derived values:

```svelte
<script>
  let count = $state(0);
  
  // Simple derived value
  let doubled = $derived(count * 2);
  let isEven = $derived(count % 2 === 0);
  
  // Complex derivation with $derived.by
  let todos = $state([...]);
  let stats = $derived.by(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.done).length;
    const remaining = total - completed;
    
    return { total, completed, remaining };
  });
  
  // Derived values are cached and only update when dependencies change
  let expensive = $derived.by(() => {
    console.log('Computing...'); // Only runs when todos change
    return todos.reduce((sum, todo) => {
      return sum + todo.text.length;
    }, 0);
  });
</script>

<p>Count: {count}, Doubled: {doubled}</p>
<p>{stats.completed} of {stats.total} todos completed</p>
```

### 3. $effect Rune - Side Effects

The `$effect` rune handles side effects and cleanup:

```svelte
<script>
  let count = $state(0);
  let theme = $state('light');
  
  // Basic effect
  $effect(() => {
    console.log(`Count is now: ${count}`);
  });
  
  // Effect with cleanup
  $effect(() => {
    const interval = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  });
  
  // DOM manipulation
  $effect(() => {
    document.body.className = theme;
  });
  
  // Conditional effects
  let isActive = $state(false);
  
  $effect(() => {
    if (!isActive) return;
    
    const handler = (e) => console.log('Click:', e);
    document.addEventListener('click', handler);
    
    return () => {
      document.removeEventListener('click', handler);
    };
  });
</script>
```

### 4. $props Rune - Component Props

The `$props` rune handles component props with full reactivity:

```svelte
<script>
  // Destructure props with defaults
  let { 
    name = 'Guest',
    age = 0,
    onUpdate,
    ...restProps 
  } = $props();
  
  // Props are reactive
  $effect(() => {
    console.log(`Name changed to: ${name}`);
  });
  
  // TypeScript support
  interface Props {
    name?: string;
    age?: number;
    onUpdate?: (data: any) => void;
  }
  
  let { name, age, onUpdate }: Props = $props();
</script>

<div {...restProps}>
  <h1>Hello, {name}!</h1>
  <p>Age: {age}</p>
</div>
```

### 5. $inspect Rune - Development Debugging

The `$inspect` rune helps with debugging (dev mode only):

```svelte
<script>
  let count = $state(0);
  let user = $state({ name: 'Alice', scores: [10, 20, 30] });
  
  // Auto-logs when values change
  $inspect(count, user);
  
  // Custom inspect handler
  $inspect(count).with((type, value) => {
    if (type === 'update') {
      console.log('Count updated to:', value);
    }
  });
  
  // Trace what caused an effect to run
  $effect(() => {
    $inspect.trace(); // Shows which dependencies triggered
    console.log('Effect ran');
  });
</script>
```

### 6. $bindable Rune - Two-Way Binding

The `$bindable` rune creates bindable props:

```svelte
<!-- Child.svelte -->
<script>
  let { value = $bindable(''), type = 'text' } = $props();
</script>

<input {type} bind:value />

<!-- Parent.svelte -->
<script>
  import Child from './Child.svelte';
  let name = $state('');
</script>

<Child bind:value={name} />
<p>Hello, {name}!</p>
```

## 🔧 StellarIX Integration

### Using Svelte 5 Runes with StellarIX Components

```svelte
<script>
  import { createInput } from '@stellarix/input';
  import { createButton } from '@stellarix/button';
  import { connectToSvelte } from '@stellarix/svelte';
  
  // Create StellarIX components
  const SxInput = connectToSvelte(createInput());
  const SxButton = connectToSvelte(createButton());
  
  // Component state
  let formData = $state({
    email: '',
    password: '',
    remember: false
  });
  
  let isLoading = $state(false);
  let error = $state(null);
  
  // Derived state
  let isValid = $derived(
    formData.email.includes('@') && 
    formData.password.length >= 8
  );
  
  // Effects
  $effect(() => {
    // Save to localStorage when remember changes
    if (formData.remember) {
      localStorage.setItem('remember-email', formData.email);
    } else {
      localStorage.removeItem('remember-email');
    }
  });
  
  // Actions
  async function handleSubmit() {
    if (!isValid) return;
    
    isLoading = true;
    error = null;
    
    try {
      const response = await login(formData);
      // Navigate on success
      goto('/dashboard');
    } catch (e) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <SxInput
    type="email"
    bind:value={formData.email}
    placeholder="Email"
    disabled={isLoading}
  />
  
  <SxInput
    type="password"
    bind:value={formData.password}
    placeholder="Password"
    disabled={isLoading}
  />
  
  <label>
    <input 
      type="checkbox" 
      bind:checked={formData.remember}
    />
    Remember me
  </label>
  
  {#if error}
    <p class="error">{error}</p>
  {/if}
  
  <SxButton
    type="submit"
    disabled={!isValid || isLoading}
    loading={isLoading}
  >
    {isLoading ? 'Logging in...' : 'Login'}
  </SxButton>
</form>
```

### Advanced Component with Snippets

```svelte
<script>
  import { createSelect } from '@stellarix/select';
  import { connectToSvelte } from '@stellarix/svelte';
  
  let {
    items = [],
    selected = $bindable(null),
    getLabel = (item) => item.label,
    getValue = (item) => item.value,
    placeholder = 'Select an option',
    children
  } = $props();
  
  const SxSelect = connectToSvelte(createSelect());
  
  let isOpen = $state(false);
  let searchQuery = $state('');
  
  // Filtered items based on search
  let filteredItems = $derived.by(() => {
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      getLabel(item).toLowerCase().includes(query)
    );
  });
  
  // Keyboard navigation
  let highlightedIndex = $state(0);
  
  $effect(() => {
    // Reset highlight when filtered items change
    highlightedIndex = 0;
  });
  
  function handleKeydown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        highlightedIndex = Math.min(
          highlightedIndex + 1, 
          filteredItems.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        break;
      case 'Enter':
        event.preventDefault();
        if (filteredItems[highlightedIndex]) {
          selected = filteredItems[highlightedIndex];
          isOpen = false;
        }
        break;
      case 'Escape':
        isOpen = false;
        break;
    }
  }
</script>

<SxSelect bind:open={isOpen}>
  <button 
    slot="trigger" 
    class="select-trigger"
    on:keydown={handleKeydown}
  >
    {#if selected}
      {@render children?.option?.(selected) || getLabel(selected)}
    {:else}
      {placeholder}
    {/if}
  </button>
  
  <div slot="content" class="select-dropdown">
    <input
      bind:value={searchQuery}
      placeholder="Search..."
      on:keydown={handleKeydown}
    />
    
    <ul>
      {#each filteredItems as item, index}
        <li
          class:highlighted={index === highlightedIndex}
          on:click={() => {
            selected = item;
            isOpen = false;
          }}
        >
          {@render children?.option?.(item) || getLabel(item)}
        </li>
      {/each}
    </ul>
  </div>
</SxSelect>

{#snippet option(item)}
  <div class="custom-option">
    <span>{getLabel(item)}</span>
    <small>{item.description}</small>
  </div>
{/snippet}
```

## 📚 Migration Guide

### From Svelte 4 to Svelte 5

```svelte
<!-- Before (Svelte 4) -->
<script>
  export let name = 'World';
  export let count = 0;
  
  let doubled;
  $: doubled = count * 2;
  
  $: console.log(`Count is ${count}`);
  
  $: if (count > 10) {
    console.log('Count is high!');
  }
  
  import { onMount, onDestroy } from 'svelte';
  
  onMount(() => {
    const interval = setInterval(() => {
      count += 1;
    }, 1000);
    
    return () => clearInterval(interval);
  });
</script>

<!-- After (Svelte 5) -->
<script>
  let { name = 'World', count = $bindable(0) } = $props();
  
  let doubled = $derived(count * 2);
  
  $effect(() => {
    console.log(`Count is ${count}`);
  });
  
  $effect(() => {
    if (count > 10) {
      console.log('Count is high!');
    }
  });
  
  $effect(() => {
    const interval = setInterval(() => {
      count += 1;
    }, 1000);
    
    return () => clearInterval(interval);
  });
</script>
```

### Store Migration

```svelte
<!-- Before (with stores) -->
<script>
  import { writable, derived } from 'svelte/store';
  
  const count = writable(0);
  const doubled = derived(count, $count => $count * 2);
  
  function increment() {
    count.update(n => n + 1);
  }
</script>

<button on:click={increment}>
  Count: {$count}, Doubled: {$doubled}
</button>

<!-- After (with runes) -->
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  function increment() {
    count++;
  }
</script>

<button onclick={increment}>
  Count: {count}, Doubled: {doubled}
</button>
```

## 🎯 Best Practices

1. **Use $state for all reactive data** - no more `let` for reactive variables
2. **Prefer $derived over manual computations** - it's cached and optimized
3. **Always return cleanup functions** from $effect when needed
4. **Use $inspect during development** - remove for production
5. **Destructure $props() with defaults** for better readability
6. **Use $bindable sparingly** - prefer one-way data flow
7. **Leverage $derived.by** for complex computations
8. **Keep effects focused** - one effect per concern

## 🚀 Advanced Patterns

### Custom Stores with Runes

```svelte
<script context="module">
  export function createCounter(initial = 0) {
    let count = $state(initial);
    let history = $state([initial]);
    
    return {
      get value() { return count; },
      get history() { return history; },
      get doubled() { return $derived(count * 2); },
      
      increment() {
        count++;
        history.push(count);
      },
      
      decrement() {
        count--;
        history.push(count);
      },
      
      reset() {
        count = initial;
        history = [initial];
      }
    };
  }
</script>

<script>
  const counter = createCounter(10);
</script>

<button onclick={counter.increment}>+</button>
<span>{counter.value} (doubled: {counter.doubled})</span>
<button onclick={counter.decrement}>-</button>
```

### Async Patterns

```svelte
<script>
  let userId = $state(1);
  let userData = $state(null);
  let loading = $state(false);
  let error = $state(null);
  
  // Reactive async fetching
  $effect(() => {
    loading = true;
    error = null;
    
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        userData = data;
        loading = false;
      })
      .catch(e => {
        error = e.message;
        loading = false;
      });
  });
</script>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p class="error">{error}</p>
{:else if userData}
  <h1>{userData.name}</h1>
{/if}
```

## 🔗 Resources

- [Svelte 5 Documentation](https://svelte.dev/docs/svelte)
- [Runes Introduction](https://svelte.dev/docs/svelte/what-are-runes)
- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [Interactive Svelte 5 Tutorial](https://learn.svelte.dev/tutorial/welcome-to-svelte)
- [Svelte 5 REPL](https://svelte.dev/repl)