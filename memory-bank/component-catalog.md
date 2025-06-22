# StellarIX UI Component Catalog

## Overview

This document catalogs all UI components to be implemented in the StellarIX UI framework. Components are organized by category and include specifications for their core functionality, accessibility requirements, and implementation complexity.

## Component Categories

1. **Input Components**: User input and form controls
2. **Navigation Components**: Navigation and structure controls
3. **Feedback Components**: User feedback and notifications
4. **Layout Components**: Content structure and organization
5. **Data Display Components**: Information presentation

## Component Priority Matrix

| Priority Level | Description | Selection Criteria |
|----------------|-------------|-------------------|
| P0 | Foundation | Essential for any UI, required for other components |
| P1 | Core | Commonly used in most applications |
| P2 | Standard | Important but not required in all applications |
| P3 | Advanced | Complex components with specialized use cases |
| P4 | Specialized | Highly specialized or experimental components |

## Component Specifications

### Input Components

#### Button (P0)
- **Description**: Basic interactive control that triggers an action
- **Variants**: Default, Primary, Secondary, Destructive, Ghost, Link, Icon
- **States**: Default, Hover, Focus, Active, Disabled, Loading
- **Accessibility**: 
  - Role: `button`
  - Keyboard: Space, Enter
  - ARIA: `aria-disabled`, `aria-pressed` (for toggle variants)
- **Complexity**: Low
- **Dependencies**: None

#### Checkbox (P0)
- **Description**: Toggle control for boolean input
- **Variants**: Default, Indeterminate
- **States**: Unchecked, Checked, Indeterminate, Disabled, Focus
- **Accessibility**:
  - Role: `checkbox`
  - Keyboard: Space
  - ARIA: `aria-checked`, `aria-disabled`
- **Complexity**: Low
- **Dependencies**: None

#### Radio (P0)
- **Description**: Selection control for mutually exclusive options
- **Variants**: Default, Card 
- **States**: Unchecked, Checked, Disabled, Focus
- **Accessibility**:
  - Role: `radio`
  - Keyboard: Space, Arrow keys (within group)
  - ARIA: `aria-checked`, `aria-disabled`
- **Complexity**: Low
- **Dependencies**: None

#### Input (P0)
- **Description**: Text input field for various data types
- **Variants**: Text, Number, Password, Email, URL, Search
- **States**: Default, Focus, Disabled, Error, With Prefix/Suffix
- **Accessibility**:
  - Role: Native `input`
  - Keyboard: Standard text input
  - ARIA: `aria-invalid`, `aria-required`
- **Complexity**: Medium
- **Dependencies**: None

#### Select (P1)
- **Description**: Dropdown selection component
- **Variants**: Single select, Multi-select, Searchable, Autocomplete
- **States**: Default, Open, Focused, Disabled, Loading
- **Accessibility**:
  - Role: `combobox`, `listbox`, `option`
  - Keyboard: Arrow keys, Enter, Escape, Type-ahead
  - ARIA: `aria-expanded`, `aria-activedescendant`, `aria-selected`
- **Complexity**: High
- **Dependencies**: Popover, List

#### Textarea (P1)
- **Description**: Multi-line text input
- **Variants**: Fixed height, Auto-grow
- **States**: Default, Focus, Disabled, Error
- **Accessibility**:
  - Role: Native `textarea`
  - Keyboard: Standard text input
  - ARIA: `aria-invalid`, `aria-required`
- **Complexity**: Medium
- **Dependencies**: None

#### Slider (P1)
- **Description**: Input for selecting a value from a range
- **Variants**: Single value, Range, With steps
- **States**: Default, Focus, Disabled, Active
- **Accessibility**:
  - Role: `slider`
  - Keyboard: Arrow keys, Home, End
  - ARIA: `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- **Complexity**: Medium
- **Dependencies**: None

#### DatePicker (P2)
- **Description**: Component for date selection
- **Variants**: Single date, Date range, Month picker, Year picker
- **States**: Default, Focus, Disabled, With selected date(s)
- **Accessibility**:
  - Role: `application` (calendar), `button` (inputs), `gridcell` (dates)
  - Keyboard: Arrow keys, Page Up/Down, Home/End
  - ARIA: Various based on complex interaction model
- **Complexity**: Very High
- **Dependencies**: Popover, Button, Calendar

#### Toggle/Switch (P1)
- **Description**: Visual toggle switch for boolean settings
- **Variants**: Default, With labels
- **States**: Off, On, Disabled, Focus
- **Accessibility**:
  - Role: `switch`
  - Keyboard: Space
  - ARIA: `aria-checked`, `aria-disabled`
- **Complexity**: Low
- **Dependencies**: None

#### ColorPicker (P3)
- **Description**: Component for color selection
- **Variants**: Simple palette, Advanced with opacity, Eyedropper
- **States**: Default, With selected color
- **Accessibility**:
  - Role: Composite of various roles
  - Keyboard: Arrow keys, Enter
  - ARIA: Custom implementation
- **Complexity**: High
- **Dependencies**: Popover, Slider

#### FileUpload (P2)
- **Description**: Component for file selection and upload
- **Variants**: Button, Drag and drop area, With preview
- **States**: Empty, With file(s), Uploading, Error
- **Accessibility**:
  - Role: `button` or native `input[type=file]`
  - Keyboard: Space, Enter
  - ARIA: `aria-busy` during upload
- **Complexity**: High
- **Dependencies**: Button, Progress

### Navigation Components

#### Tabs (P1)
- **Description**: Content organization with tab navigation
- **Variants**: Horizontal, Vertical, Underlined, Contained
- **States**: Default, Active, Disabled, Hover
- **Accessibility**:
  - Role: `tablist`, `tab`, `tabpanel`
  - Keyboard: Arrow keys, Home, End
  - ARIA: `aria-selected`, `aria-controls`, `aria-labelledby`
- **Complexity**: Medium
- **Dependencies**: None

#### Menu (P1)
- **Description**: Dropdown menu for commands and navigation
- **Variants**: Dropdown, Context, Cascading
- **States**: Closed, Open, With active item
- **Accessibility**:
  - Role: `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio`
  - Keyboard: Arrow keys, Enter, Space, Escape
  - ARIA: `aria-expanded`, `aria-haspopup`, `aria-checked`
- **Complexity**: High
- **Dependencies**: Popover

#### Pagination (P2)
- **Description**: Controls for navigating paginated content
- **Variants**: Numbered pages, Previous/Next only, With ellipsis
- **States**: Default, Active page, Disabled controls
- **Accessibility**:
  - Role: `navigation`
  - Keyboard: Tab navigation between controls
  - ARIA: `aria-current="page"`, `aria-disabled`
- **Complexity**: Medium
- **Dependencies**: Button

#### Breadcrumb (P2)
- **Description**: Hierarchical navigation path
- **Variants**: Simple, With icons, Truncated
- **States**: Default, Current page
- **Accessibility**:
  - Role: `navigation`, `list`, `listitem`
  - Keyboard: Tab navigation
  - ARIA: `aria-current="page"`
- **Complexity**: Low
- **Dependencies**: None

#### NavigationMenu (P2)
- **Description**: Multi-level navigation structure
- **Variants**: Horizontal, Vertical, Collapsible
- **States**: Default, Active, Expanded
- **Accessibility**:
  - Role: `menubar`, `menu`, `menuitem`
  - Keyboard: Arrow keys, Enter, Space, Escape
  - ARIA: `aria-expanded`, `aria-haspopup`, `aria-current`
- **Complexity**: High
- **Dependencies**: Menu, Popover

#### Stepper (P2)
- **Description**: Multi-step process indicator
- **Variants**: Horizontal, Vertical, With content
- **States**: Completed, Current, Upcoming, Error
- **Accessibility**:
  - Role: `list`, `listitem`
  - Keyboard: Tab navigation
  - ARIA: `aria-current="step"`, custom state attributes
- **Complexity**: Medium
- **Dependencies**: None

### Feedback Components

#### Toast/Notification (P1)
- **Description**: Ephemeral feedback message
- **Variants**: Info, Success, Warning, Error, With action
- **States**: Appearing, Visible, Disappearing
- **Accessibility**:
  - Role: `alert` or `status`
  - Keyboard: Tab to action buttons
  - ARIA: `aria-live="polite"` or `"assertive"`
- **Complexity**: Medium
- **Dependencies**: None

#### Alert (P1)
- **Description**: Contextual message within the UI
- **Variants**: Info, Success, Warning, Error, With icon, Dismissible
- **States**: Default, Dismissing
- **Accessibility**:
  - Role: `alert` or `status`
  - Keyboard: Tab to action elements
  - ARIA: `aria-live="polite"` or `"assertive"`
- **Complexity**: Low
- **Dependencies**: None

#### Dialog/Modal (P1)
- **Description**: Focused overlay UI requiring attention
- **Variants**: Simple, With header/footer, Full screen, Drawer
- **States**: Closed, Opening, Open, Closing
- **Accessibility**:
  - Role: `dialog` or `alertdialog`
  - Keyboard: Tab (trapped), Escape
  - ARIA: `aria-modal="true"`, `aria-labelledby`, `aria-describedby`
- **Complexity**: High
- **Dependencies**: Focus trap, Portal

#### Popover (P1)
- **Description**: Contextual floating element
- **Variants**: Simple, With arrow, With header/footer
- **States**: Closed, Open
- **Accessibility**:
  - Role: Varies by usage
  - Keyboard: Tab, Escape
  - ARIA: `aria-expanded`, `aria-haspopup`, `aria-controls`
- **Complexity**: High
- **Dependencies**: Portal

#### Tooltip (P1)
- **Description**: Small informational popup on hover/focus
- **Variants**: Plain text, Rich content, With arrow
- **States**: Hidden, Showing
- **Accessibility**:
  - Role: `tooltip`
  - Keyboard: Appears on focus
  - ARIA: `aria-describedby`
- **Complexity**: Medium
- **Dependencies**: Popover

#### ProgressBar (P1)
- **Description**: Visual indicator of progress
- **Variants**: Determinate, Indeterminate, Linear, Circular
- **States**: In progress, Complete
- **Accessibility**:
  - Role: `progressbar`
  - ARIA: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- **Complexity**: Medium
- **Dependencies**: None

#### Spinner (P0)
- **Description**: Loading indicator
- **Variants**: Sizes, Colors
- **States**: Spinning
- **Accessibility**:
  - Role: `status`
  - ARIA: `aria-busy="true"`, `aria-label`
- **Complexity**: Low
- **Dependencies**: None

#### Skeleton (P2)
- **Description**: Placeholder UI during content loading
- **Variants**: Text, Avatar, Card, Custom
- **States**: Loading
- **Accessibility**:
  - Role: `status`
  - ARIA: `aria-busy="true"`, `aria-hidden="true"` if purely decorative
- **Complexity**: Medium
- **Dependencies**: None

### Layout Components

#### Accordion (P1)
- **Description**: Vertically collapsible sections
- **Variants**: Single expansion, Multiple expansion
- **States**: Collapsed, Expanded
- **Accessibility**:
  - Role: `button` (header), region or appropriate role (content)
  - Keyboard: Enter, Space
  - ARIA: `aria-expanded`, `aria-controls`, `aria-labelledby`
- **Complexity**: Medium
- **Dependencies**: None

#### Tabs Panel (P1)
- **Description**: Content panels controlled by tabs
- **Variants**: Simple, Card style, Vertical
- **States**: Shown, Hidden
- **Accessibility**:
  - Role: `tabpanel`
  - ARIA: `aria-labelledby`
- **Complexity**: Medium
- **Dependencies**: Tabs

#### Card (P1)
- **Description**: Container for related content
- **Variants**: Simple, With header/footer, Interactive, Media
- **States**: Default, Hover (if interactive), Selected
- **Accessibility**:
  - Role: Varies based on content and interaction
  - Keyboard: If interactive, Enter/Space
  - ARIA: Context-dependent
- **Complexity**: Medium
- **Dependencies**: None

#### Grid (P1)
- **Description**: Two-dimensional layout system
- **Variants**: Fixed, Responsive, Auto-placement
- **States**: N/A
- **Accessibility**:
  - No specific requirements beyond content accessibility
- **Complexity**: Medium
- **Dependencies**: None

#### Divider (P0)
- **Description**: Visual separator between content
- **Variants**: Horizontal, Vertical, With label
- **States**: N/A
- **Accessibility**:
  - Role: `separator`
  - ARIA: None specific
- **Complexity**: Low
- **Dependencies**: None

#### Aspect Ratio (P2)
- **Description**: Container maintaining specific aspect ratio
- **Variants**: Various ratios (16:9, 4:3, 1:1, etc.)
- **States**: N/A
- **Accessibility**:
  - No specific requirements
- **Complexity**: Low
- **Dependencies**: None

#### Container (P0)
- **Description**: Layout container with max-width constraints
- **Variants**: Default, Fluid, Sizes
- **States**: N/A
- **Accessibility**:
  - No specific requirements
- **Complexity**: Low
- **Dependencies**: None

### Data Display Components

#### Table (P2)
- **Description**: Tabular data display
- **Variants**: Simple, Sortable, Selectable, Expandable, Fixed header
- **States**: Default, Loading, Empty, With selection
- **Accessibility**:
  - Role: `table`, `rowgroup`, `row`, `columnheader`, `cell`
  - Keyboard: Arrow keys for navigation
  - ARIA: `aria-sort`, `aria-selected`
- **Complexity**: Very High
- **Dependencies**: Checkbox, Sorting controls

#### List (P1)
- **Description**: Vertical collection of items
- **Variants**: Simple, Interactive, Nested, With actions
- **States**: Default, With selection, With active item
- **Accessibility**:
  - Role: `list`, `listitem`
  - Keyboard: Arrow keys (if interactive)
  - ARIA: `aria-selected`, `aria-current`
- **Complexity**: Medium
- **Dependencies**: None

#### Tree (P3)
- **Description**: Hierarchical data display
- **Variants**: Simple, With icons, Selectable
- **States**: Default, Expanded/Collapsed nodes, With selection
- **Accessibility**:
  - Role: `tree`, `treeitem`, `group`
  - Keyboard: Arrow keys, Enter, Space
  - ARIA: `aria-expanded`, `aria-selected`, `aria-level`
- **Complexity**: High
- **Dependencies**: None

#### Calendar (P2)
- **Description**: Month/year calendar display
- **Variants**: Month view, Year view, Multi-month
- **States**: Default, With selection
- **Accessibility**:
  - Role: `grid`, `gridcell`, `rowheader`, `columnheader`
  - Keyboard: Arrow keys, Page Up/Down, Home/End
  - ARIA: `aria-selected`, date-specific attributes
- **Complexity**: High
- **Dependencies**: None

#### Avatar (P1)
- **Description**: User or entity representation
- **Variants**: Image, Initials, Icon, With badge
- **States**: Default, Loading
- **Accessibility**:
  - Role: `img` (if image) or `presentation`
  - ARIA: `aria-label` if informative
- **Complexity**: Low
- **Dependencies**: None

#### Badge (P1)
- **Description**: Small status indicator
- **Variants**: Numeric, Dot, Status
- **States**: Default
- **Accessibility**:
  - Role: `status` if conveying status
  - ARIA: `aria-label` if needed
- **Complexity**: Low
- **Dependencies**: None

#### Tag/Chip (P1)
- **Description**: Compact entity representation
- **Variants**: Simple, Removable, With icon, With avatar
- **States**: Default, Selected, Disabled
- **Accessibility**:
  - Role: Varies based on interaction
  - Keyboard: Enter/Space if interactive
  - ARIA: Context-dependent
- **Complexity**: Medium
- **Dependencies**: None

## Implementation Priority

### Phase 1: Foundation (Weeks 1-4)
**Core Primitives (P0)**:
- Button
- Input
- Spinner
- Container
- Divider

### Phase 2: Core Components (Weeks 5-10)
**Essential Components (P1)**:
- Checkbox
- Radio
- Toggle/Switch
- Textarea
- Select
- Dialog/Modal
- Popover
- Tooltip
- Alert
- Tabs
- Menu
- Accordion
- Card
- List
- Avatar
- Badge
- Tag/Chip

### Phase 3: Standard Components (Weeks 11-16)
**Framework Expansion + Standard Components (P2)**:
- Slider
- FileUpload
- DatePicker
- Pagination
- Breadcrumb
- NavigationMenu
- Stepper
- Skeleton
- ProgressBar
- Table
- Calendar

### Phase 4: Advanced Components (Weeks 17-22)
**Complex Components (P3)**:
- ColorPicker
- Tree
- Advanced Table features
- Virtualized List
- Chart (basic)

### Phase 5: Developer Experience (Weeks 23-26)
- Documentation
- DevTools
- Testing & QA
- Performance optimization 