/**
 * Table Component Stories
 * Comprehensive showcase of all table features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createTable } from './index';
import { reactAdapter } from '@stellarix/react';
import type { ColumnDef, TableOptions } from './types';

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  department: string;
  salary: number;
  startDate: string;
}

// Sample data for stories
const sampleData: Person[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', age: 32, email: 'john.doe@example.com', department: 'Engineering', salary: 95000, startDate: '2020-01-15' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', age: 28, email: 'jane.smith@example.com', department: 'Marketing', salary: 78000, startDate: '2021-03-22' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', age: 45, email: 'bob.johnson@example.com', department: 'Sales', salary: 105000, startDate: '2018-07-01' },
  { id: 4, firstName: 'Alice', lastName: 'Williams', age: 35, email: 'alice.williams@example.com', department: 'Engineering', salary: 98000, startDate: '2019-11-10' },
  { id: 5, firstName: 'Charlie', lastName: 'Brown', age: 41, email: 'charlie.brown@example.com', department: 'HR', salary: 85000, startDate: '2017-05-18' },
  { id: 6, firstName: 'Diana', lastName: 'Davis', age: 29, email: 'diana.davis@example.com', department: 'Marketing', salary: 72000, startDate: '2022-02-14' },
  { id: 7, firstName: 'Edward', lastName: 'Miller', age: 38, email: 'edward.miller@example.com', department: 'Engineering', salary: 110000, startDate: '2019-09-03' },
  { id: 8, firstName: 'Fiona', lastName: 'Wilson', age: 31, email: 'fiona.wilson@example.com', department: 'Sales', salary: 92000, startDate: '2020-06-25' },
  { id: 9, firstName: 'George', lastName: 'Moore', age: 52, email: 'george.moore@example.com', department: 'Finance', salary: 125000, startDate: '2016-04-12' },
  { id: 10, firstName: 'Helen', lastName: 'Taylor', age: 26, email: 'helen.taylor@example.com', department: 'Engineering', salary: 87000, startDate: '2021-08-30' }
];

// Default columns configuration
const defaultColumns: ColumnDef<Person>[] = [
  { id: 'id', header: 'ID', accessorKey: 'id', enableSorting: true },
  { id: 'firstName', header: 'First Name', accessorKey: 'firstName', enableSorting: true },
  { id: 'lastName', header: 'Last Name', accessorKey: 'lastName', enableSorting: true },
  { id: 'age', header: 'Age', accessorKey: 'age', enableSorting: true },
  { id: 'email', header: 'Email', accessorKey: 'email', enableSorting: false },
  { id: 'department', header: 'Department', accessorKey: 'department', enableSorting: true },
  { 
    id: 'salary', 
    header: 'Salary', 
    accessorKey: 'salary', 
    enableSorting: true,
    cell: ({ value }) => `$${value.toLocaleString()}`
  },
  { id: 'startDate', header: 'Start Date', accessorKey: 'startDate', enableSorting: true }
];

// Create a wrapper component that creates individual Table instances
const TableWrapper = React.forwardRef((props: TableOptions<Person>, ref: any) => {
  const [table] = React.useState(() => createTable(props));
  const Table = React.useMemo(() => table.connect(reactAdapter), [table]);
  
  // Subscribe to state changes
  const [state, setState] = React.useState(table.state.getState());
  React.useEffect(() => {
    return table.state.subscribe(setState);
  }, [table]);
  
  // Get sorted and paginated data
  const { tableUtils } = require('./logic');
  const sortedData = tableUtils.getSortedData(state.data, state.sorting, state.columns);
  const paginatedData = tableUtils.getPaginatedData(sortedData, state.pagination);
  const visibleColumns = tableUtils.getVisibleColumns(state.columns, state.columnVisibility);
  
  const tableHandlers = table.logic.getInteractionHandlers('table');
  const a11yProps = table.logic.getA11yProps('table');
  
  return (
    <div className="w-full">
      <table 
        className="w-full border-collapse" 
        {...a11yProps}
        onKeyDown={tableHandlers.onKeyDown}
      >
        <thead>
          <tr>
            {state.selectionMode !== 'none' && (
              <th className="border p-2 bg-gray-100">
                <input
                  type="checkbox"
                  checked={state.data.length > 0 && state.data.every((_, i) => state.selection[state.getRowId(state.data[i], i)])}
                  onChange={table.logic.getInteractionHandlers('selectAll').onChange}
                  {...table.logic.getA11yProps('selectAll')}
                />
              </th>
            )}
            {visibleColumns.map(column => {
              const handlers = table.logic.getInteractionHandlers('th');
              const sortState = state.sorting.find(s => s.id === column.id);
              return (
                <th
                  key={column.id}
                  className={`border p-2 bg-gray-100 ${column.enableSorting !== false ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                  data-column-id={column.id}
                  onClick={handlers.onClick}
                  onKeyDown={handlers.onKeyDown}
                  {...table.logic.getA11yProps('th')(column.id)}
                >
                  <div className="flex items-center justify-between">
                    <span>{typeof column.header === 'function' ? column.header() : column.header}</span>
                    {column.enableSorting !== false && (
                      <span className="ml-2">
                        {sortState?.desc ? '▼' : sortState ? '▲' : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => {
            const actualRowIndex = state.pagination.pageIndex * state.pagination.pageSize + rowIndex;
            const rowId = state.getRowId(row, actualRowIndex);
            const rowHandlers = table.logic.getInteractionHandlers('row');
            const isSelected = state.selection[rowId];
            
            return (
              <tr
                key={rowId}
                className={`border-b hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                data-row-index={actualRowIndex}
                onClick={rowHandlers.onClick}
                {...table.logic.getA11yProps('tr')}
              >
                {state.selectionMode !== 'none' && (
                  <td className="border p-2">
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      data-row-id={rowId}
                      onChange={table.logic.getInteractionHandlers('checkbox').onChange}
                      onClick={e => e.stopPropagation()}
                      {...table.logic.getA11yProps('checkbox')(rowId)}
                    />
                  </td>
                )}
                {visibleColumns.map(column => {
                  const value = column.accessorKey ? row[column.accessorKey] : column.accessorFn?.(row);
                  const cellHandlers = table.logic.getInteractionHandlers('cell');
                  const isFocused = state.focusedCell?.row === actualRowIndex && 
                                   state.focusedCell?.col === visibleColumns.indexOf(column);
                  
                  return (
                    <td
                      key={column.id}
                      className={`border p-2 ${isFocused ? 'outline outline-2 outline-blue-500' : ''}`}
                      data-row-index={actualRowIndex}
                      data-column-id={column.id}
                      onClick={cellHandlers.onClick}
                      {...table.logic.getA11yProps('td')}
                    >
                      {column.cell ? column.cell({ row, value }) : String(value)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.state.previousPage()}
            disabled={!table.state.canPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {state.pagination.pageIndex + 1} of {table.state.getTotalPages()}
          </span>
          <button
            onClick={() => table.state.nextPage()}
            disabled={!table.state.canNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <select
            value={state.pagination.pageSize}
            onChange={e => table.state.setPageSize(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      
      {/* Column Visibility Controls */}
      <div className="mt-4">
        <details className="border rounded p-2">
          <summary className="cursor-pointer font-semibold">Column Visibility</summary>
          <div className="mt-2 space-y-1">
            {state.columns.map(column => (
              <label key={column.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.columnVisibility[column.id] !== false}
                  onChange={() => table.state.toggleColumnVisibility(column.id)}
                />
                {typeof column.header === 'function' ? column.header() : column.header}
              </label>
            ))}
          </div>
        </details>
      </div>
      
      {/* Selected Rows Info */}
      {state.selectionMode !== 'none' && (
        <div className="mt-4 text-sm text-gray-600">
          Selected: {table.state.getSelectedRowIds().length} row(s)
        </div>
      )}
    </div>
  );
});

TableWrapper.displayName = 'Table';

const meta: Meta<typeof TableWrapper> = {
  title: 'Primitives/Table',
  component: TableWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A powerful data table component with sorting, filtering, pagination, and selection capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
      description: 'Row selection mode',
    },
    enableMultiSort: {
      control: 'boolean',
      description: 'Enable multi-column sorting',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic table
export const Default: Story = {
  args: {
    columns: defaultColumns,
    data: sampleData,
  },
};

// Table with single row selection
export const SingleSelection: Story = {
  args: {
    columns: defaultColumns,
    data: sampleData,
    selectionMode: 'single',
  },
};

// Table with multiple row selection
export const MultipleSelection: Story = {
  args: {
    columns: defaultColumns,
    data: sampleData,
    selectionMode: 'multiple',
  },
};

// Table with multi-sort enabled
export const MultiSort: Story = {
  args: {
    columns: defaultColumns,
    data: sampleData,
    enableMultiSort: true,
  },
};

// Table with initial sorting
export const PreSorted: Story = {
  args: {
    columns: defaultColumns,
    data: sampleData,
    sorting: [{ id: 'department', desc: false }, { id: 'salary', desc: true }],
    enableMultiSort: true,
  },
};

// Table with custom pagination
export const SmallPageSize: Story = {
  args: {
    columns: defaultColumns,
    data: sampleData,
    pagination: { pageIndex: 0, pageSize: 3 },
  },
};

// Table with hidden columns
export const HiddenColumns: Story = {
  args: {
    columns: defaultColumns,
    data: sampleData,
    columnVisibility: { email: false, startDate: false },
  },
};

// Table with custom cell rendering
export const CustomCells: Story = {
  args: {
    columns: [
      ...defaultColumns.slice(0, 3),
      {
        id: 'fullName',
        header: 'Full Name',
        accessorFn: (row: Person) => `${row.firstName} ${row.lastName}`,
        enableSorting: true,
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const years = new Date().getFullYear() - new Date(row.startDate).getFullYear();
          return years > 3 ? 
            <span className="text-green-600 font-semibold">Senior</span> : 
            <span className="text-blue-600">Junior</span>;
        },
      },
    ],
    data: sampleData,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    columns: defaultColumns,
    data: [],
    loading: true,
  },
};

// Empty state
export const EmptyTable: Story = {
  args: {
    columns: defaultColumns,
    data: [],
  },
};

// Interactive example with all features
export const FullFeatured: Story = {
  args: {
    columns: defaultColumns,
    data: sampleData,
    selectionMode: 'multiple',
    enableMultiSort: true,
    pagination: { pageIndex: 0, pageSize: 5 },
  },
};

// Accessibility showcase
export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Accessibility Features</h3>
      <TableWrapper
        columns={defaultColumns.slice(0, 4)}
        data={sampleData.slice(0, 3)}
        selectionMode="multiple"
      />
      <div className="text-sm space-y-2 text-gray-600">
        <p>✓ Full keyboard navigation (Arrow keys, Space, Enter)</p>
        <p>✓ ARIA attributes for table structure</p>
        <p>✓ Sort indicators with aria-sort</p>
        <p>✓ Selection state with aria-checked</p>
        <p>✓ Row and column count announcements</p>
        <p>✓ Focus management for cell navigation</p>
      </div>
    </div>
  ),
};