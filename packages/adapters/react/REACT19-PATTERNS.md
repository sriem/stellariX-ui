# React 19 Patterns for StellarIX UI

This document outlines the latest React 19 patterns and how they're implemented in the StellarIX React adapter.

## 🚀 Key React 19 Features

### 1. ref as Prop

In React 19, function components can access `ref` directly from props without `forwardRef`:

```tsx
// ❌ Old way (React 18 and below)
const MyInput = React.forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

// ✅ New way (React 19)
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

### 2. useActionState Hook

Simplifies form handling with async actions:

```tsx
import { useActionState } from 'react';

function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get('email');
      const message = formData.get('message');
      
      try {
        await sendEmail({ email, message });
        return { success: true };
      } catch (error) {
        return { error: error.message };
      }
    },
    { success: false, error: null }
  );

  return (
    <form action={formAction}>
      <input type="email" name="email" required />
      <textarea name="message" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">Message sent!</p>}
    </form>
  );
}
```

### 3. use Hook

Read promises and context with more flexibility:

```tsx
import { use, Suspense } from 'react';

// Reading promises
function UserProfile({ userPromise }) {
  const user = use(userPromise); // Suspends until resolved
  return <div>{user.name}</div>;
}

// Conditional context reading
function ThemedButton({ showTheme }) {
  let theme = 'default';
  
  // Can read context conditionally!
  if (showTheme) {
    theme = use(ThemeContext);
  }
  
  return <button className={theme}>Click me</button>;
}

// Using with data fetching
function App() {
  const dataPromise = fetch('/api/data').then(r => r.json());
  
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userPromise={dataPromise} />
    </Suspense>
  );
}
```

### 4. useFormStatus Hook

Access form submission state from any child component:

```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function Form() {
  return (
    <form action="/api/submit">
      <input name="email" type="email" />
      <SubmitButton /> {/* Can access form status! */}
    </form>
  );
}
```

### 5. Server Components and Actions

React 19 introduces better server/client boundaries:

```tsx
// server-action.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  
  // This runs on the server only
  const user = await db.users.create({ name, email });
  
  revalidatePath('/users');
  redirect(`/users/${user.id}`);
}

// client-component.tsx
'use client';

import { createUser } from './server-action';

export function SignupForm() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### 6. Optimistic Updates

Combine with useOptimistic for immediate UI feedback:

```tsx
import { useOptimistic, useActionState } from 'react';

function TodoList({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, newTodo]
  );

  const [state, formAction] = useActionState(
    async (prev, formData) => {
      const title = formData.get('title');
      const newTodo = { id: Date.now(), title, pending: true };
      
      // Optimistically add the todo
      addOptimisticTodo(newTodo);
      
      // Actually create it on the server
      await createTodo(title);
    },
    null
  );

  return (
    <>
      <form action={formAction}>
        <input name="title" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
            {todo.title}
          </li>
        ))}
      </ul>
    </>
  );
}
```

## 🔧 StellarIX Integration

### Using React 19 Features with StellarIX Components

```tsx
import { createInput } from '@stellarix/input';
import { connectToReact, useStellarIXAction } from '@stellarix/react';

const Input = connectToReact(createInput());

function LoginForm() {
  const [state, formAction, isPending] = useStellarIXAction(
    async (prev, formData) => {
      const email = formData.get('email');
      const password = formData.get('password');
      
      const result = await login({ email, password });
      if (!result.success) {
        return { error: result.error };
      }
      
      redirect('/dashboard');
    },
    { error: null }
  );

  return (
    <form action={formAction}>
      <Input
        name="email"
        type="email"
        placeholder="Email"
        required
        disabled={isPending}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        required
        disabled={isPending}
      />
      {state.error && <p className="error">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Direct ref Access

StellarIX components support React 19's ref as prop:

```tsx
function App() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Direct access to the DOM element
    inputRef.current?.focus();
  }, []);
  
  // No forwardRef needed!
  return <Input ref={inputRef} placeholder="Autofocused" />;
}
```

## 📚 Migration Guide

### From React 18 to React 19

1. **Remove forwardRef**:
   ```tsx
   // Before
   const Component = forwardRef((props, ref) => {/*...*/});
   
   // After
   function Component({ ref, ...props }) {/*...*/}
   ```

2. **Replace form handling**:
   ```tsx
   // Before
   const [loading, setLoading] = useState(false);
   const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
     // ... handle form
     setLoading(false);
   };
   
   // After
   const [state, formAction, isPending] = useActionState(
     async (prev, formData) => {
       // ... handle form
     },
     initialState
   );
   ```

3. **Use Suspense for async data**:
   ```tsx
   // Before
   const [data, setData] = useState(null);
   useEffect(() => {
     fetch('/api').then(r => r.json()).then(setData);
   }, []);
   
   // After
   const dataPromise = fetch('/api').then(r => r.json());
   function Component() {
     const data = use(dataPromise);
     return <div>{data}</div>;
   }
   ```

## 🎯 Best Practices

1. **Prefer Server Actions** for data mutations
2. **Use useActionState** for form handling instead of manual state
3. **Leverage ref as prop** - no more forwardRef boilerplate
4. **Combine use() with Suspense** for better loading states
5. **Keep Server Components pure** - no hooks or browser APIs
6. **Use useFormStatus** in submit buttons for consistent UX

## 🔗 Resources

- [React 19 Blog Post](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [useActionState Documentation](https://react.dev/reference/react/useActionState)
- [use Hook Documentation](https://react.dev/reference/react/use)