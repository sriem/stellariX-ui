/**
 * Menu Logic Tests
 * Tests for business logic following proven patterns
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMenuState } from './state';
import { 
    createMenuLogic,
    handleMenuItemClick,
    handleMenuItemMouseEnter,
    getMenuItemA11yProps
} from './logic';
import type { MenuItem, MenuOptions, MenuState } from './types';

describe('createMenuLogic', () => {
    let state: ReturnType<typeof createMenuState>;
    let options: MenuOptions;
    let logic: ReturnType<typeof createMenuLogic>;
    
    beforeEach(() => {
        options = {
            id: 'test-menu',
            onOpen: vi.fn(),
            onClose: vi.fn(),
            onSelect: vi.fn(),
        };
        state = createMenuState(options);
        logic = createMenuLogic(state, options);
        logic.connect(state);
        logic.initialize();
    });
    
    describe('Event Handlers', () => {
        it('should handle open event', () => {
            logic.handleEvent('open', null);
            
            expect(options.onOpen).toHaveBeenCalled();
            const currentState = state.getState();
            expect(currentState.open).toBe(true);
        });
        
        it('should handle close event', () => {
            state.setOpen(true);
            state.pushSubmenu('item1');
            state.setActiveIndex(2);
            
            logic.handleEvent('close', null);
            
            expect(options.onClose).toHaveBeenCalled();
            const currentState = state.getState();
            expect(currentState.open).toBe(false);
            expect(currentState.submenuStack).toEqual([]);
            expect(currentState.activeIndex).toBe(-1);
            expect(currentState.searchQuery).toBe('');
        });
        
        it('should handle select event', () => {
            const item: MenuItem = { id: '1', label: 'Test Item' };
            
            logic.handleEvent('select', { item });
            
            expect(options.onSelect).toHaveBeenCalledWith(item);
            const currentState = state.getState();
            expect(currentState.selectedId).toBe('1');
        });
        
        it('should handle navigate event', () => {
            logic.handleEvent('navigate', { index: 3 });
            
            const currentState = state.getState();
            expect(currentState.activeIndex).toBe(3);
        });
        
        it('should handle search event', () => {
            logic.handleEvent('search', { query: 'test' });
            
            const currentState = state.getState();
            expect(currentState.searchQuery).toBe('test');
        });
        
        it('should handle focus/blur events', () => {
            logic.handleEvent('focus', { event: {} as FocusEvent });
            expect(state.getState().focused).toBe(true);
            
            logic.handleEvent('blur', { event: {} as FocusEvent });
            expect(state.getState().focused).toBe(false);
        });
    });
    
    describe('A11y Props', () => {
        it('should provide trigger a11y props', () => {
            const props = logic.getA11yProps('trigger');
            
            expect(props).toEqual({
                'aria-haspopup': 'true',
                'aria-expanded': 'false',
                'aria-controls': 'test-menu-menu',
                tabIndex: 0,
            });
            
            state.setOpen(true);
            const openProps = logic.getA11yProps('trigger');
            expect(openProps['aria-expanded']).toBe('true');
        });
        
        it('should provide menu a11y props', () => {
            const props = logic.getA11yProps('menu');
            
            expect(props).toEqual({
                role: 'menu',
                'aria-labelledby': 'test-menu-trigger',
                id: 'test-menu-menu',
                tabIndex: -1,
            });
        });
        
        it('should provide item a11y props', () => {
            const items: MenuItem[] = [
                { id: '1', label: 'Item 1' },
                { id: '2', label: 'Item 2', disabled: true },
                { id: '3', label: 'Item 3', items: [{ id: '3.1', label: 'Subitem' }] }
            ];
            
            state.setItems(items);
            state.setActiveIndex(0);
            
            // Active item
            const currentState = state.getState();
            const activeProps = getMenuItemA11yProps(currentState, '1');
            expect(activeProps).toEqual({
                role: 'menuitem',
                'aria-disabled': undefined,
                'aria-haspopup': undefined,
                'aria-expanded': undefined,
                tabIndex: 0,
            });
            
            // Disabled item
            const disabledProps = getMenuItemA11yProps(currentState, '2');
            expect(disabledProps).toEqual({
                role: 'menuitem',
                'aria-disabled': 'true',
                'aria-haspopup': undefined,
                'aria-expanded': undefined,
                tabIndex: -1,
            });
            
            // Item with submenu
            const submenuProps = getMenuItemA11yProps(currentState, '3');
            expect(submenuProps).toEqual({
                role: 'menuitem',
                'aria-disabled': undefined,
                'aria-haspopup': 'true',
                'aria-expanded': undefined,
                tabIndex: -1,
            });
        });
    });
    
    describe('Trigger Interactions', () => {
        it('should toggle menu on trigger click', () => {
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { preventDefault: vi.fn() } as any;
            
            // Open menu
            interactions.onClick(mockEvent);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(state.getState().open).toBe(true);
            expect(options.onOpen).toHaveBeenCalled();
            
            // Close menu
            interactions.onClick(mockEvent);
            expect(state.getState().open).toBe(false);
            expect(options.onClose).toHaveBeenCalled();
        });
        
        it('should open menu with keyboard', () => {
            const interactions = logic.getInteractionHandlers('trigger');
            const mockEvent = { key: 'Enter', preventDefault: vi.fn() } as any;
            
            interactions.onKeyDown(mockEvent);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(state.getState().open).toBe(true);
            expect(options.onOpen).toHaveBeenCalled();
        });
        
        it('should open menu and navigate with arrow keys', () => {
            const items: MenuItem[] = [
                { id: '1', label: 'Item 1' },
                { id: '2', label: 'Item 2' }
            ];
            state.setItems(items);
            
            const interactions = logic.getInteractionHandlers('trigger');
            
            // Arrow down opens and goes to first
            const downEvent = { key: 'ArrowDown', preventDefault: vi.fn() } as any;
            interactions.onKeyDown(downEvent);
            expect(state.getState().open).toBe(true);
            expect(state.getState().activeIndex).toBe(0);
            
            // Reset
            state.setOpen(false);
            state.setActiveIndex(-1);
            
            // Arrow up opens and goes to last
            const upEvent = { key: 'ArrowUp', preventDefault: vi.fn() } as any;
            interactions.onKeyDown(upEvent);
            expect(state.getState().open).toBe(true);
            expect(state.getState().activeIndex).toBe(1);
        });
    });
    
    describe('Menu Interactions', () => {
        it('should navigate with arrow keys', () => {
            const items: MenuItem[] = [
                { id: '1', label: 'Item 1' },
                { id: '2', label: 'Item 2', disabled: true },
                { id: '3', label: 'Item 3' }
            ];
            state.setItems(items);
            state.setOpen(true);
            
            const interactions = logic.getInteractionHandlers('menu');
            
            // Arrow down
            const downEvent = { key: 'ArrowDown', preventDefault: vi.fn() } as any;
            interactions.onKeyDown(downEvent);
            expect(state.getState().activeIndex).toBe(0);
            
            // Arrow down again (skip disabled)
            interactions.onKeyDown(downEvent);
            expect(state.getState().activeIndex).toBe(2);
            
            // Arrow up
            const upEvent = { key: 'ArrowUp', preventDefault: vi.fn() } as any;
            interactions.onKeyDown(upEvent);
            expect(state.getState().activeIndex).toBe(0);
        });
        
        it('should navigate to first/last with home/end', () => {
            const items: MenuItem[] = [
                { id: '1', label: 'Item 1' },
                { id: '2', label: 'Item 2' },
                { id: '3', label: 'Item 3' }
            ];
            state.setItems(items);
            state.setOpen(true);
            
            const interactions = logic.getInteractionHandlers('menu');
            
            // End key
            const endEvent = { key: 'End', preventDefault: vi.fn() } as any;
            interactions.onKeyDown(endEvent);
            expect(state.getState().activeIndex).toBe(2);
            
            // Home key
            const homeEvent = { key: 'Home', preventDefault: vi.fn() } as any;
            interactions.onKeyDown(homeEvent);
            expect(state.getState().activeIndex).toBe(0);
        });
        
        it('should select item with enter/space', () => {
            const items: MenuItem[] = [
                { id: '1', label: 'Item 1', onSelect: vi.fn() }
            ];
            state.setItems(items);
            state.setActiveIndex(0);
            
            const interactions = logic.getInteractionHandlers('menu');
            const enterEvent = { key: 'Enter', preventDefault: vi.fn() } as any;
            
            interactions.onKeyDown(enterEvent);
            expect(items[0].onSelect).toHaveBeenCalled();
            expect(options.onSelect).toHaveBeenCalledWith(items[0]);
        });
        
        it('should enter submenu with arrow right', () => {
            const items: MenuItem[] = [
                { 
                    id: '1', 
                    label: 'Item 1',
                    items: [{ id: '1.1', label: 'Subitem' }]
                }
            ];
            state.setItems(items);
            state.setActiveIndex(0);
            
            const interactions = logic.getInteractionHandlers('menu');
            const rightEvent = { key: 'ArrowRight', preventDefault: vi.fn() } as any;
            
            interactions.onKeyDown(rightEvent);
            expect(state.getState().submenuStack).toEqual(['1']);
            expect(state.getState().activeIndex).toBe(0);
        });
        
        it('should exit submenu with arrow left/escape', () => {
            state.pushSubmenu('1');
            
            const interactions = logic.getInteractionHandlers('menu');
            const leftEvent = { key: 'ArrowLeft', preventDefault: vi.fn() } as any;
            
            interactions.onKeyDown(leftEvent);
            expect(state.getState().submenuStack).toEqual([]);
            
            // Escape closes menu when not in submenu
            const escapeEvent = { key: 'Escape', preventDefault: vi.fn() } as any;
            interactions.onKeyDown(escapeEvent);
            expect(state.getState().open).toBe(false);
            expect(options.onClose).toHaveBeenCalled();
        });
        
        it('should close on tab', () => {
            state.setOpen(true);
            const interactions = logic.getInteractionHandlers('menu');
            const tabEvent = { key: 'Tab' } as any;
            
            interactions.onKeyDown(tabEvent);
            expect(options.onClose).toHaveBeenCalled();
        });
        
        it('should handle type-ahead search', () => {
            const items: MenuItem[] = [
                { id: '1', label: 'Apple' },
                { id: '2', label: 'Banana' },
                { id: '3', label: 'Apricot' }
            ];
            state.setItems(items);
            
            const interactions = logic.getInteractionHandlers('menu');
            
            // Type 'a' - should go to Apple
            const aEvent = { key: 'a', ctrlKey: false, metaKey: false } as any;
            interactions.onKeyDown(aEvent);
            expect(state.getState().activeIndex).toBe(0);
            expect(state.getState().searchQuery).toBe('a');
            
            // Type 'p' quickly - should go to Apricot
            const pEvent = { key: 'p', ctrlKey: false, metaKey: false } as any;
            interactions.onKeyDown(pEvent);
            expect(state.getState().activeIndex).toBe(2);
            expect(state.getState().searchQuery).toBe('ap');
        });
        
        it('should close when focus leaves menu', () => {
            state.setOpen(true);
            const interactions = logic.getInteractionHandlers('menu');
            const blurEvent = {
                relatedTarget: document.createElement('div'),
                currentTarget: document.createElement('div')
            } as any;
            
            interactions.onBlur(blurEvent);
            expect(options.onClose).toHaveBeenCalled();
        });
    });
    
    describe('Item Helper Functions', () => {
        it('should select item on click', () => {
            const items: MenuItem[] = [
                { id: '1', label: 'Item 1', onSelect: vi.fn() }
            ];
            state.setItems(items);
            
            const interactions = logic.getInteractionHandlers('item');
            const mockEvent = { preventDefault: vi.fn() } as any;
            
            const currentState = state.getState();
            handleMenuItemClick(state, logic, currentState, '1', mockEvent);
            expect(items[0].onSelect).toHaveBeenCalled();
            expect(options.onSelect).toHaveBeenCalledWith(items[0]);
        });
        
        it('should enter submenu on click', () => {
            const items: MenuItem[] = [
                { 
                    id: '1', 
                    label: 'Item 1',
                    items: [{ id: '1.1', label: 'Subitem' }]
                }
            ];
            state.setItems(items);
            
            const mockEvent = { preventDefault: vi.fn() } as any;
            const currentState = state.getState();
            
            handleMenuItemClick(state, logic, currentState, '1', mockEvent);
            expect(state.getState().submenuStack).toEqual(['1']);
        });
        
        it('should not interact with disabled items', () => {
            const items: MenuItem[] = [
                { id: '1', label: 'Item 1', disabled: true, onSelect: vi.fn() }
            ];
            state.setItems(items);
            
            const mockEvent = { preventDefault: vi.fn() } as any;
            const currentState = state.getState();
            
            handleMenuItemClick(state, logic, currentState, '1', mockEvent);
            expect(items[0].onSelect).not.toHaveBeenCalled();
        });
        
        it('should update active index on mouse enter', () => {
            const items: MenuItem[] = [
                { id: '1', label: 'Item 1' },
                { id: '2', label: 'Item 2' }
            ];
            state.setItems(items);
            
            const currentState = state.getState();
            
            handleMenuItemMouseEnter(state, logic, currentState, '2');
            expect(state.getState().activeIndex).toBe(1);
        });
    });
    
    describe('Options', () => {
        it('should not close on select when closeOnSelect is false', () => {
            const customOptions = { ...options, closeOnSelect: false };
            const customLogic = createMenuLogic(state, customOptions);
            customLogic.connect(state);
            customLogic.initialize();
            
            state.setOpen(true);
            const item: MenuItem = { id: '1', label: 'Test' };
            
            customLogic.handleEvent('select', { item });
            expect(state.getState().open).toBe(true);
        });
        
        it('should disable type-ahead when typeAhead is false', () => {
            const customOptions = { ...options, typeAhead: false };
            const customLogic = createMenuLogic(state, customOptions);
            customLogic.connect(state);
            customLogic.initialize();
            
            const items: MenuItem[] = [
                { id: '1', label: 'Apple' },
                { id: '2', label: 'Banana' }
            ];
            state.setItems(items);
            
            const interactions = customLogic.getInteractionHandlers('menu');
            const aEvent = { key: 'a', ctrlKey: false, metaKey: false } as any;
            
            interactions.onKeyDown(aEvent);
            expect(state.getState().searchQuery).toBe('');
            expect(state.getState().activeIndex).toBe(-1);
        });
    });
});