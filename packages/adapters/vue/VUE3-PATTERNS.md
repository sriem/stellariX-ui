# Vue 3.5+ Patterns for StellarIX UI

This document outlines the latest Vue 3.5+ Composition API patterns and how they're implemented in the StellarIX Vue adapter.

## 🚀 Key Vue 3.5+ Features

### 1. Type-Safe Props with Generic Arguments

Vue 3.5+ introduces better TypeScript support for props:

```vue
<script setup lang="ts">
// Simple type-based declaration
const props = defineProps<{
  title: string
  count?: number
  items: string[]
}>()

// With defaults using withDefaults
const props = withDefaults(defineProps<{
  title: string
  count?: number
  disabled?: boolean
}>(), {
  count: 0,
  disabled: false
})

// Using interface
interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
}

const props = defineProps<Props>()
</script>
```

### 2. Type-Safe Emits with Call Signatures

Enhanced emit typing in Vue 3.5+:

```vue
<script setup lang="ts">
// Call signature syntax
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', id: number): void
  (e: 'delete', id: number): void
}>()

// Alternative tuple syntax (Vue 3.3+)
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [id: number]
  'delete': [id: number]
}>()

// With validation
const emit = defineEmits({
  change: (id: number) => {
    // Return true to indicate valid
    return id > 0
  }
})
</script>
```

### 3. useTemplateRef (Vue 3.5+)

New way to handle template refs with better typing:

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

// Automatically typed based on the element
const input = useTemplateRef<HTMLInputElement>('my-input')
const childComponent = useTemplateRef<typeof ChildComponent>('child')

onMounted(() => {
  // Direct access with proper typing
  input.value?.focus()
  
  // Access child component methods
  childComponent.value?.someMethod()
})
</script>

<template>
  <input ref="my-input" />
  <ChildComponent ref="child" />
</template>
```

### 4. Generic Components

Vue 3.5+ supports generic component types:

```vue
<script setup lang="ts" generic="T">
// Generic components for type-safe lists
interface Props<T> {
  items: T[]
  selected: T
  keyField: keyof T
}

const props = defineProps<Props<T>>()

const emit = defineEmits<{
  'update:selected': [item: T]
}>()

function selectItem(item: T) {
  emit('update:selected', item)
}
</script>

<template>
  <ul>
    <li 
      v-for="item in items" 
      :key="item[keyField]"
      @click="selectItem(item)"
      :class="{ active: item === selected }"
    >
      <slot :item="item" />
    </li>
  </ul>
</template>
```

### 5. defineModel (Vue 3.4+)

Simplified two-way binding:

```vue
<script setup lang="ts">
// Single model
const modelValue = defineModel<string>()

// Multiple models
const firstName = defineModel<string>('firstName')
const lastName = defineModel<string>('lastName')

// With options
const count = defineModel<number>('count', {
  default: 0,
  validator: (value) => value >= 0
})

// Direct usage
console.log(modelValue.value)
modelValue.value = 'new value'
</script>

<template>
  <input v-model="modelValue" />
  <input v-model="firstName" />
  <input v-model="lastName" />
  <button @click="count++">{{ count }}</button>
</template>
```

### 6. Improved provide/inject with Types

Type-safe dependency injection:

```ts
// injection-keys.ts
import type { InjectionKey, Ref } from 'vue'

export interface UserStore {
  user: Ref<User | null>
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

export const userStoreKey: InjectionKey<UserStore> = Symbol('userStore')
```

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'
import { userStoreKey } from './injection-keys'

const user = ref<User | null>(null)

provide(userStoreKey, {
  user,
  async login(credentials) {
    const response = await api.login(credentials)
    user.value = response.user
  },
  logout() {
    user.value = null
  }
})
</script>

<!-- Consumer.vue -->
<script setup lang="ts">
import { inject } from 'vue'
import { userStoreKey } from './injection-keys'

// Type-safe inject with default
const userStore = inject(userStoreKey)!

// Or with default value
const userStore = inject(userStoreKey, {
  user: ref(null),
  login: async () => {},
  logout: () => {}
})
</script>
```

## 🔧 StellarIX Integration

### Using Vue 3.5+ Features with StellarIX Components

```vue
<script setup lang="ts">
import { createInput } from '@stellarix/input'
import { connectToVue } from '@stellarix/vue'
import { useTemplateRef, computed } from 'vue'

// Create StellarIX component
const SxInput = connectToVue(createInput())

// Props with full typing
const props = defineProps<{
  initialValue?: string
  disabled?: boolean
}>()

// Two-way binding with defineModel
const inputValue = defineModel<string>('modelValue', {
  default: ''
})

// Template ref with proper typing
const inputRef = useTemplateRef<InstanceType<typeof SxInput>>('input')

// Computed validation
const isValid = computed(() => {
  return inputValue.value.length >= 3
})

// Methods
function handleSubmit() {
  if (isValid.value) {
    console.log('Submitting:', inputValue.value)
  }
}

// Lifecycle
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <SxInput
      ref="input"
      v-model="inputValue"
      :disabled="disabled"
      placeholder="Enter at least 3 characters"
    />
    <button 
      type="submit" 
      :disabled="!isValid"
    >
      Submit
    </button>
  </form>
</template>
```

### Component with Slots and Generics

```vue
<script setup lang="ts" generic="T">
import { createSelect } from '@stellarix/select'
import { connectToVue } from '@stellarix/vue'

interface Props<T> {
  items: T[]
  modelValue: T | null
  itemText: keyof T | ((item: T) => string)
  itemValue: keyof T | ((item: T) => any)
}

const props = defineProps<Props<T>>()
const emit = defineEmits<{
  'update:modelValue': [value: T | null]
}>()

const SxSelect = connectToVue(createSelect())

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function getItemText(item: T): string {
  if (typeof props.itemText === 'function') {
    return props.itemText(item)
  }
  return String(item[props.itemText])
}

function getItemValue(item: T): any {
  if (typeof props.itemValue === 'function') {
    return props.itemValue(item)
  }
  return item[props.itemValue]
}
</script>

<template>
  <SxSelect v-model="selectedValue">
    <template #default="{ isOpen }">
      <slot name="trigger" :selected="selectedValue" :is-open="isOpen">
        {{ selectedValue ? getItemText(selectedValue) : 'Select an item' }}
      </slot>
    </template>
    <template #options>
      <div 
        v-for="item in items" 
        :key="getItemValue(item)"
        @click="selectedValue = item"
      >
        <slot name="option" :item="item">
          {{ getItemText(item) }}
        </slot>
      </div>
    </template>
  </SxSelect>
</template>
```

## 📚 Migration Guide

### From Options API to Composition API

```vue
<!-- Before (Options API) -->
<script>
export default {
  props: {
    title: String,
    count: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:count'],
  data() {
    return {
      localValue: ''
    }
  },
  computed: {
    doubled() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.$emit('update:count', this.count + 1)
    }
  },
  mounted() {
    console.log('Component mounted')
  }
}
</script>

<!-- After (Composition API with script setup) -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  count?: number
}>(), {
  count: 0
})

const emit = defineEmits<{
  'update:count': [value: number]
}>()

const localValue = ref('')

const doubled = computed(() => props.count * 2)

function increment() {
  emit('update:count', props.count + 1)
}

onMounted(() => {
  console.log('Component mounted')
})
</script>
```

### Using useTemplateRef Instead of ref

```vue
<!-- Before -->
<script setup>
import { ref, onMounted } from 'vue'

const inputEl = ref(null)

onMounted(() => {
  inputEl.value.focus()
})
</script>

<template>
  <input ref="inputEl" />
</template>

<!-- After (Vue 3.5+) -->
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

const inputEl = useTemplateRef<HTMLInputElement>('input')

onMounted(() => {
  inputEl.value?.focus() // Better null safety
})
</script>

<template>
  <input ref="input" />
</template>
```

## 🎯 Best Practices

1. **Always use TypeScript** with `<script setup lang="ts">`
2. **Prefer type-based props** over runtime declarations
3. **Use useTemplateRef** for better type safety
4. **Leverage generic components** for reusable type-safe components
5. **Use defineModel** for cleaner two-way binding
6. **Provide injection keys** with proper typing
7. **Avoid inline event handlers** - define methods in script

## 🔗 Resources

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript with Composition API](https://vuejs.org/guide/typescript/composition-api.html)
- [Vue 3.5 Release Notes](https://blog.vuejs.org/posts/vue-3-5)
- [Script Setup RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md)
- [Generic Components RFC](https://github.com/vuejs/rfcs/discussions/436)