# @stellarix-ui/pagination

A flexible, framework-agnostic pagination component for navigating through pages of content.

## Features

- **Page Navigation**: Navigate to first, previous, next, last, or specific pages
- **Items Per Page**: Configurable items per page with selector
- **Page Range Display**: Shows current page range (e.g., "1-10 of 100")
- **Smart Ellipsis**: Intelligent page number display with ellipsis for many pages
- **Keyboard Navigation**: Full keyboard support (Arrow keys, Home, End)
- **Accessible**: WCAG 2.1 AA compliant with proper ARIA attributes
- **Framework Agnostic**: Works with React, Vue, Svelte, and more
- **TypeScript**: Full type safety and autocompletion
- **Headless**: Bring your own styles and rendering

## Installation

```bash
npm install @stellarix-ui/pagination
```

## Usage

### Basic Example

```typescript
import { createPaginationWithImplementation } from '@stellarix-ui/pagination';
import { reactAdapter } from '@stellarix-ui/react';

// Create pagination instance
const pagination = createPaginationWithImplementation({
  totalItems: 100,
  itemsPerPage: 10,
  onPageChange: (page) => console.log(`Page changed to ${page}`)
});

// Connect to your framework
const PaginationComponent = pagination.connect(reactAdapter);
```

### React Example

```tsx
import React from 'react';
import { createPaginationWithImplementation } from '@stellarix-ui/pagination';
import { reactAdapter } from '@stellarix-ui/react';

function ProductList() {
  const [products, setProducts] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const pagination = React.useMemo(() => 
    createPaginationWithImplementation({
      totalItems: products.length,
      itemsPerPage: 20,
      currentPage,
      onPageChange: setCurrentPage
    }), [products.length]
  );
  
  const Pagination = React.useMemo(() => 
    pagination.connect(reactAdapter), [pagination]
  );
  
  return (
    <>
      {/* Render your paginated products */}
      <Pagination />
    </>
  );
}
```

### Vue Example

```vue
<template>
  <Pagination />
</template>

<script setup>
import { createPaginationWithImplementation } from '@stellarix-ui/pagination';
import { vueAdapter } from '@stellarix-ui/vue';

const pagination = createPaginationWithImplementation({
  totalItems: 100,
  itemsPerPage: 10,
  onPageChange: (page) => {
    // Handle page change
  }
});

const Pagination = pagination.connect(vueAdapter);
</script>
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `currentPage` | `number` | `1` | Current active page (1-based) |
| `totalItems` | `number` | `0` | Total number of items |
| `itemsPerPage` | `number` | `10` | Number of items per page |
| `siblingCount` | `number` | `1` | Number of page buttons to show on each side of current page |
| `disabled` | `boolean` | `false` | Whether pagination is disabled |
| `onPageChange` | `(page: number) => void` | - | Callback when page changes |
| `onItemsPerPageChange` | `(itemsPerPage: number) => void` | - | Callback when items per page changes |

### State Methods

```typescript
// Navigation
pagination.state.goToPage(5);        // Go to specific page
pagination.state.goToFirst();        // Go to first page
pagination.state.goToPrevious();     // Go to previous page
pagination.state.goToNext();         // Go to next page
pagination.state.goToLast();         // Go to last page

// Configuration
pagination.state.setTotalItems(200);     // Update total items
pagination.state.setItemsPerPage(20);    // Update items per page
pagination.state.setDisabled(true);      // Disable pagination

// Computed properties
pagination.state.canGoPrevious();    // Check if can go to previous page
pagination.state.canGoNext();        // Check if can go to next page
pagination.state.getPageInfo();      // Get current page info
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `pageChange` | `{ page: number, previousPage: number }` | Fired when page changes |
| `itemsPerPageChange` | `{ itemsPerPage: number, previousItemsPerPage: number }` | Fired when items per page changes |
| `navigate` | `{ direction: string, page: number }` | Fired on any navigation action |

### Helper Functions

```typescript
import { getPageNumbers } from '@stellarix-ui/pagination';

// Get array of page numbers to display
const pages = getPageNumbers(currentPage, totalPages, siblingCount);
// Returns: [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
```

## Keyboard Navigation

- **Arrow Left**: Go to previous page
- **Arrow Right**: Go to next page
- **Home**: Go to first page
- **End**: Go to last page

## Accessibility

The pagination component follows WCAG 2.1 AA guidelines:

- Semantic `<nav>` element with proper ARIA label
- Clear button labels for screen readers
- Current page indicated with `aria-current="page"`
- Disabled states properly announced
- Page info with `aria-live` region for updates
- Full keyboard navigation support

## Styling

The component is headless, meaning you have full control over the styling. Here's an example with Tailwind CSS:

```tsx
// Custom rendering with Tailwind CSS
function CustomPagination({ pagination }) {
  const state = usePaginationState(pagination);
  const pages = getPageNumbers(state.currentPage, state.totalPages, state.siblingCount);
  
  return (
    <nav className="flex items-center gap-2">
      <button
        onClick={() => pagination.state.goToPrevious()}
        disabled={!state.canGoPrevious}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        Previous
      </button>
      
      {pages.map((page, index) => 
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => pagination.state.goToPage(page)}
            aria-current={page === state.currentPage ? 'page' : undefined}
            className={`px-3 py-1 rounded border ${
              page === state.currentPage ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {page}
          </button>
        )
      )}
      
      <button
        onClick={() => pagination.state.goToNext()}
        disabled={!state.canGoNext}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
```

## Advanced Usage

### Server-Side Pagination

```typescript
const pagination = createPaginationWithImplementation({
  totalItems: 1000,
  itemsPerPage: 50,
  currentPage: 1,
  onPageChange: async (page) => {
    // Fetch data from server
    const response = await fetch(`/api/items?page=${page}&limit=50`);
    const data = await response.json();
    
    // Update UI with new data
    updateItemsList(data.items);
  }
});
```

### Dynamic Items Per Page

```typescript
const pagination = createPaginationWithImplementation({
  totalItems: 500,
  itemsPerPage: 10,
  onItemsPerPageChange: (newItemsPerPage) => {
    // Reset to first page when changing items per page
    pagination.state.goToFirst();
    
    // Update display
    updateItemsDisplay(newItemsPerPage);
  }
});
```

## TypeScript Support

The component is fully typed with TypeScript:

```typescript
import type { 
  PaginationOptions, 
  PaginationState, 
  PaginationEvents,
  PageInfo 
} from '@stellarix-ui/pagination';

// Type-safe options
const options: PaginationOptions = {
  totalItems: 100,
  itemsPerPage: 10,
  onPageChange: (page: number) => {}
};

// Type-safe state
const state: PaginationState = {
  currentPage: 1,
  totalItems: 100,
  itemsPerPage: 10,
  totalPages: 10,
  siblingCount: 1,
  disabled: false
};
```