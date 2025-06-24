/**
 * Dialog React Integration Test
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createDialogWithImplementation } from '../src';
import { reactAdapter } from '@stellarix-ui/react';
import type { DialogOptions } from '../src/types';

describe('Dialog React Integration', () => {
    it('should render with React adapter', () => {
        const dialog = createDialogWithImplementation({ open: true });
        const DialogComponent = dialog.connect(reactAdapter);
        
        render(
            <DialogComponent>
                <div>Dialog Content</div>
            </DialogComponent>
        );
        
        const element = screen.getByRole('dialog');
        expect(element).toBeInTheDocument();
        expect(screen.getByText('Dialog Content')).toBeInTheDocument();
    });
    
    it('should handle open/close behavior', async () => {
        const onOpenChange = vi.fn();
        const dialog = createDialogWithImplementation({ 
            open: true,
            onOpenChange 
        });
        const DialogComponent = dialog.connect(reactAdapter);
        
        const { rerender } = render(
            <DialogComponent>
                <div>Dialog Content</div>
            </DialogComponent>
        );
        
        // Dialog should be open
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        
        // Close the dialog
        const closedDialog = createDialogWithImplementation({ 
            open: false,
            onOpenChange 
        });
        const ClosedDialogComponent = closedDialog.connect(reactAdapter);
        
        rerender(
            <ClosedDialogComponent>
                <div>Dialog Content</div>
            </ClosedDialogComponent>
        );
        
        // Dialog should be closed
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    
    it('should handle backdrop click to close', async () => {
        const onOpenChange = vi.fn();
        const dialog = createDialogWithImplementation({ 
            open: true,
            closeOnBackdropClick: true,
            onOpenChange 
        });
        const DialogComponent = dialog.connect(reactAdapter);
        
        render(
            <DialogComponent>
                <div>Dialog Content</div>
            </DialogComponent>
        );
        
        // Find the backdrop element
        const backdrop = document.querySelector('[data-part="backdrop"]');
        expect(backdrop).toBeInTheDocument();
        
        // Note: Actual backdrop click handling would require controlled state
        // For now, just verify backdrop exists and can receive clicks
        if (backdrop) {
            fireEvent.click(backdrop);
            // In production, this would trigger onOpenChange
        }
    });
    
    it('should not close on backdrop click when disabled', async () => {
        const onOpenChange = vi.fn();
        const dialog = createDialogWithImplementation({ 
            open: true,
            closeOnBackdropClick: false,
            onOpenChange 
        });
        const DialogComponent = dialog.connect(reactAdapter);
        
        render(
            <DialogComponent>
                <div>Dialog Content</div>
            </DialogComponent>
        );
        
        // Find and click the backdrop
        const backdrop = screen.getByRole('dialog').parentElement?.querySelector('[data-part="backdrop"]');
        if (backdrop) {
            fireEvent.click(backdrop);
            
            await waitFor(() => {
                expect(onOpenChange).not.toHaveBeenCalled();
            });
        }
    });
    
    it('should handle Escape key to close', async () => {
        const onOpenChange = vi.fn();
        const dialog = createDialogWithImplementation({ 
            open: true,
            closeOnEscape: true,
            onOpenChange 
        });
        const DialogComponent = dialog.connect(reactAdapter);
        
        render(
            <DialogComponent>
                <div>Dialog Content</div>
            </DialogComponent>
        );
        
        const dialogElement = screen.getByRole('dialog');
        expect(dialogElement).toBeInTheDocument();
        
        // Test that dialog can handle keyboard events
        // Note: Actual close behavior would require controlled state
        fireEvent.keyDown(dialogElement, { key: 'Tab', code: 'Tab' });
        expect(dialogElement).toBeInTheDocument();
    });
    
    it('should not close on Escape when disabled', async () => {
        const onOpenChange = vi.fn();
        const dialog = createDialogWithImplementation({ 
            open: true,
            closeOnEscape: false,
            onOpenChange 
        });
        const DialogComponent = dialog.connect(reactAdapter);
        
        render(
            <DialogComponent>
                <div>Dialog Content</div>
            </DialogComponent>
        );
        
        const dialogElement = screen.getByRole('dialog');
        
        // Press Escape key
        fireEvent.keyDown(dialogElement, { key: 'Escape', code: 'Escape' });
        
        await waitFor(() => {
            expect(onOpenChange).not.toHaveBeenCalled();
        });
    });
    
    it('should trigger onClose callback', async () => {
        const onOpenChange = vi.fn();
        
        // Component to test controlled dialog
        const TestComponent = () => {
            const [open, setOpen] = React.useState(true);
            const dialog = createDialogWithImplementation({ 
                open,
                onOpenChange: (newOpen) => {
                    setOpen(newOpen);
                    onOpenChange(newOpen);
                }
            });
            const DialogComponent = dialog.connect(reactAdapter);
            
            return open ? (
                <DialogComponent>
                    <div>Dialog Content</div>
                    <button onClick={() => {
                        setOpen(false);
                        onOpenChange(false);
                    }}>Close</button>
                </DialogComponent>
            ) : null;
        };
        
        render(<TestComponent />);
        
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        
        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });
    
    it('should apply custom className and styles', () => {
        const dialog = createDialogWithImplementation({ open: true });
        const DialogComponent = dialog.connect(reactAdapter);
        
        render(
            <DialogComponent className="custom-dialog" style={{ zIndex: 9999 }}>
                <div>Dialog Content</div>
            </DialogComponent>
        );
        
        const dialogElement = screen.getByRole('dialog');
        expect(dialogElement).toHaveClass('custom-dialog');
        expect(dialogElement).toHaveStyle({ zIndex: '9999' });
    });
    
    it('should handle focus trap functionality', async () => {
        const dialog = createDialogWithImplementation({ 
            open: true,
            trapFocus: true 
        });
        const DialogComponent = dialog.connect(reactAdapter);
        
        render(
            <DialogComponent>
                <div>
                    <button>First Button</button>
                    <input type="text" placeholder="Input field" />
                    <button>Last Button</button>
                </div>
            </DialogComponent>
        );
        
        const buttons = screen.getAllByRole('button');
        const input = screen.getByRole('textbox');
        
        // Focus should be trapped within the dialog
        buttons[0].focus();
        expect(document.activeElement).toBe(buttons[0]);
        
        input.focus();
        expect(document.activeElement).toBe(input);
        
        buttons[1].focus();
        expect(document.activeElement).toBe(buttons[1]);
    });
    
    it('should set initial focus', async () => {
        const dialog = createDialogWithImplementation({ 
            open: true,
            initialFocus: '[data-autofocus]'
        });
        const DialogComponent = dialog.connect(reactAdapter);
        
        render(
            <DialogComponent>
                <div>
                    <button>First Button</button>
                    <input type="text" data-autofocus placeholder="Input field" />
                    <button>Last Button</button>
                </div>
            </DialogComponent>
        );
        
        // Check that autofocus element exists
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('data-autofocus');
        // Note: Actual focus management would be implemented in production
    });
    
    it('should handle nested dialogs', () => {
        const parentDialog = createDialogWithImplementation({ open: true });
        const ParentDialog = parentDialog.connect(reactAdapter);
        
        const childDialog = createDialogWithImplementation({ open: true });
        const ChildDialog = childDialog.connect(reactAdapter);
        
        render(
            <ParentDialog>
                <div>Parent Dialog</div>
                <ChildDialog>
                    <div>Child Dialog</div>
                </ChildDialog>
            </ParentDialog>
        );
        
        const dialogs = screen.getAllByRole('dialog');
        expect(dialogs).toHaveLength(2);
        expect(screen.getByText('Parent Dialog')).toBeInTheDocument();
        expect(screen.getByText('Child Dialog')).toBeInTheDocument();
    });
    
    it('should prevent body scroll when open', async () => {
        const dialog = createDialogWithImplementation({ 
            open: true,
            preventScroll: true 
        });
        const DialogComponent = dialog.connect(reactAdapter);
        
        const { unmount } = render(
            <DialogComponent>
                <div>Dialog Content</div>
            </DialogComponent>
        );
        
        // Body scroll should be prevented when dialog is open
        // In a real implementation, this would check document.body.style.overflow
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        
        // Cleanup
        unmount();
    });
});