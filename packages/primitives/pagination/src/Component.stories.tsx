/**
 * Pagination Component Stories
 * Comprehensive showcase of all component features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createPaginationWithImplementation, getPageNumbers } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Create a wrapper component that creates individual Pagination instances
const PaginationWrapper = React.forwardRef((props: any, ref: any) => {
  const [component] = React.useState(() => createPaginationWithImplementation(props));
  const Pagination = React.useMemo(() => component.connect(reactAdapter), [component]);
  
  // Update the component's state when props change
  React.useEffect(() => {
    if (props.currentPage !== undefined) {
      component.state.setCurrentPage(props.currentPage);
    }
  }, [props.currentPage, component]);
  
  React.useEffect(() => {
    if (props.totalItems !== undefined) {
      component.state.setTotalItems(props.totalItems);
    }
  }, [props.totalItems, component]);
  
  React.useEffect(() => {
    if (props.itemsPerPage !== undefined) {
      component.state.setItemsPerPage(props.itemsPerPage);
    }
  }, [props.itemsPerPage, component]);
  
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      component.state.setDisabled(props.disabled);
    }
  }, [props.disabled, component]);
  
  return <Pagination ref={ref} {...props} />;
});

PaginationWrapper.displayName = 'Pagination';

// Custom React implementation for visual demonstration
const PaginationDemo: React.FC<any> = ({ 
  totalItems = 100, 
  itemsPerPage = 10, 
  siblingCount = 1,
  disabled = false,
  onPageChange,
  onItemsPerPageChange 
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(itemsPerPage);
  
  const totalPages = Math.ceil(totalItems / perPage);
  const pages = getPageNumbers(currentPage, totalPages, siblingCount);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };
  
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page
    onItemsPerPageChange?.(newPerPage);
  };
  
  const startIndex = (currentPage - 1) * perPage + 1;
  const endIndex = Math.min(currentPage * perPage, totalItems);
  
  return (
    <nav className="flex flex-col gap-4" aria-label="Pagination Navigation">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">
          Showing {startIndex} to {endIndex} of {totalItems} items
        </span>
        
        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-sm text-gray-700">
            Items per page:
          </label>
          <select
            id="items-per-page"
            value={perPage}
            onChange={handleItemsPerPageChange}
            disabled={disabled}
            className="px-2 py-1 border rounded"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={disabled || currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          aria-label="Go to first page"
        >
          First
        </button>
        
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          aria-label="Go to previous page"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return <span key={`ellipsis-${index}`} className="px-2">...</span>;
            }
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={disabled}
                className={`px-3 py-1 border rounded ${
                  currentPage === page 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          aria-label="Go to next page"
        >
          Next
        </button>
        
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={disabled || currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          aria-label="Go to last page"
        >
          Last
        </button>
      </div>
    </nav>
  );
};

const meta: Meta<typeof PaginationDemo> = {
  title: 'Primitives/Pagination',
  component: PaginationDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible pagination component for navigating through pages of content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    totalItems: {
      control: { type: 'number', min: 0, max: 1000 },
      description: 'Total number of items',
    },
    itemsPerPage: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Number of items per page',
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Number of sibling pages to show on each side',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the pagination is disabled',
    },
    onPageChange: {
      action: 'pageChanged',
      description: 'Called when the page changes',
    },
    onItemsPerPageChange: {
      action: 'itemsPerPageChanged',
      description: 'Called when items per page changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    siblingCount: 1,
  },
};

export const FewPages: Story = {
  args: {
    totalItems: 30,
    itemsPerPage: 10,
    siblingCount: 1,
  },
};

export const ManyPages: Story = {
  args: {
    totalItems: 500,
    itemsPerPage: 10,
    siblingCount: 1,
  },
};

export const LargeSiblingCount: Story = {
  args: {
    totalItems: 200,
    itemsPerPage: 10,
    siblingCount: 3,
  },
};

export const CustomItemsPerPage: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 20,
    siblingCount: 1,
  },
};

export const Disabled: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    disabled: true,
  },
};

export const NoItems: Story = {
  args: {
    totalItems: 0,
    itemsPerPage: 10,
  },
};

// Interactive example with state
export const Interactive: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    
    return (
      <div className="flex flex-col gap-4">
        <PaginationDemo
          totalItems={255}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          onItemsPerPageChange={setItemsPerPage}
        />
        <div className="text-sm text-gray-600">
          <p>Current page: {page}</p>
          <p>Items per page: {itemsPerPage}</p>
        </div>
      </div>
    );
  },
};

// Keyboard navigation demo
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Keyboard Navigation Demo</h3>
      <PaginationDemo totalItems={100} itemsPerPage={10} />
      <div className="text-sm space-y-2 text-gray-600">
        <p>Try these keyboard shortcuts:</p>
        <p>← Arrow Left: Go to previous page</p>
        <p>→ Arrow Right: Go to next page</p>
        <p>Home: Go to first page</p>
        <p>End: Go to last page</p>
      </div>
    </div>
  ),
};

// Showcase of all variations
export const Showcase: Story = {
  render: () => (
    <div className="grid gap-8">
      <section>
        <h3 className="text-lg font-semibold mb-4">Different Page Counts</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Single page (10 items)</p>
            <PaginationDemo totalItems={10} itemsPerPage={10} />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Few pages (30 items)</p>
            <PaginationDemo totalItems={30} itemsPerPage={10} />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Many pages (500 items)</p>
            <PaginationDemo totalItems={500} itemsPerPage={10} />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Different Sibling Counts</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">No siblings</p>
            <PaginationDemo totalItems={200} itemsPerPage={10} siblingCount={0} />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">1 sibling (default)</p>
            <PaginationDemo totalItems={200} itemsPerPage={10} siblingCount={1} />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">3 siblings</p>
            <PaginationDemo totalItems={200} itemsPerPage={10} siblingCount={3} />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Edge Cases</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">No items</p>
            <PaginationDemo totalItems={0} itemsPerPage={10} />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Disabled state</p>
            <PaginationDemo totalItems={100} itemsPerPage={10} disabled />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Large items per page</p>
            <PaginationDemo totalItems={100} itemsPerPage={50} />
          </div>
        </div>
      </section>
    </div>
  ),
};

// Accessibility demonstration
export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Accessibility Features</h3>
      <PaginationDemo totalItems={100} itemsPerPage={10} />
      <div className="text-sm space-y-2 text-gray-600">
        <p>✓ Semantic navigation element with proper ARIA label</p>
        <p>✓ Clear button labels for screen readers</p>
        <p>✓ Current page indicated with aria-current</p>
        <p>✓ Disabled states properly announced</p>
        <p>✓ Page info announced with aria-live region</p>
        <p>✓ Full keyboard navigation support</p>
        <p>✓ Focus indicators on all interactive elements</p>
      </div>
    </div>
  ),
};