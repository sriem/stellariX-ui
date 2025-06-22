/**
 * React Adapter for Dialog Component
 */

import React, { createContext, useContext, forwardRef, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createDialog, DialogOptions } from '../../../primitives/dialog/src/index';
import { connectToReact } from '../adapter';

// Create a context for sharing dialog state across components
const DialogContext = createContext<{
  isOpen: boolean;
  titleId: string;
  descriptionId: string;
  close: () => void;
} | null>(null);

// Hook to use dialog context
const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog compound components must be used within a Dialog component');
  }
  return context;
};

// Create base dialog component
const createDialogComponent = (options: DialogOptions = {}) => {
  const dialogFactory = createDialog(options);
  return connectToReact(dialogFactory);
};

export type DialogProps = DialogOptions & {
  children: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  className?: string;
  overlayClassName?: string;
};

// Main Dialog component
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    { 
      children, 
      open, 
      onClose, 
      className = '', 
      overlayClassName = '',
      ...options 
    }, 
    ref
  ) => {
    // Create a controlled component
    const controlled = typeof open === 'boolean';
    const openState = controlled ? open : undefined;
    const onCloseHandler = controlled ? onClose : options.onClose;
    
    // Create dialog component with merged options
    const DialogComponent = createDialogComponent({
      ...options,
      initialOpen: controlled ? undefined : options.initialOpen,
      onClose: onCloseHandler,
    });
    
    // Get portal container
    const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
    
    useEffect(() => {
      if (typeof document !== 'undefined') {
        // Create portal container if it doesn't exist
        const existingContainer = document.getElementById('stellarix-dialog-container');
        if (existingContainer) {
          setPortalContainer(existingContainer);
        } else {
          const container = document.createElement('div');
          container.id = 'stellarix-dialog-container';
          document.body.appendChild(container);
          setPortalContainer(container);
        }
      }
      
      // Cleanup on unmount
      return () => {
        if (typeof document !== 'undefined' && !document.querySelector('[data-stellarix-dialog]')) {
          const container = document.getElementById('stellarix-dialog-container');
          if (container && container.childNodes.length === 0) {
            document.body.removeChild(container);
          }
        }
      };
    }, []);

    // @ts-ignore - We know DialogComponent is a valid component
    return (
      <DialogComponent
        ref={ref}
        data-stellarix-dialog
        className={className}
        open={openState}
      >
        {({ isOpen, titleId, descriptionId, trigger }: { 
          isOpen: boolean, 
          titleId: string, 
          descriptionId: string, 
          trigger: (event: string) => void,
          getHandlers: (id: string) => Record<string, any>
        }) => {
          // Context value to share with compound components
          const contextValue = {
            isOpen,
            titleId,
            descriptionId,
            close: () => trigger('CLOSE'),
          };
          
          // Return early if no portal container and dialog is not open
          if (!portalContainer && !isOpen) {
            return null;
          }
          
          // Create the dialog content
          const content = (
            <DialogContext.Provider value={contextValue}>
              {children}
            </DialogContext.Provider>
          );
          
          // Render into portal
          return portalContainer ? createPortal(content, portalContainer) : content;
        }}
      </DialogComponent>
    );
  }
);

Dialog.displayName = 'Dialog';

// DialogPanel component
export const DialogPanel = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    const { isOpen, titleId, descriptionId } = useDialogContext();
    
    if (!isOpen) return null;
    
    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={`stellarix-dialog-panel ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogPanel.displayName = 'DialogPanel';

// DialogBackdrop component
export const DialogBackdrop = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    const { isOpen, close } = useDialogContext();
    
    if (!isOpen) return null;
    
    return (
      <div
        ref={ref}
        className={`stellarix-dialog-backdrop ${className}`}
        onClick={close}
        {...props}
      />
    );
  }
);

DialogBackdrop.displayName = 'DialogBackdrop';

// DialogTitle component
export const DialogTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className = '', ...props }, ref) => {
    const { titleId } = useDialogContext();
    
    return (
      <h2
        ref={ref}
        id={titleId}
        className={`stellarix-dialog-title ${className}`}
        {...props}
      >
        {children}
      </h2>
    );
  }
);

DialogTitle.displayName = 'DialogTitle';

// DialogDescription component
export const DialogDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className = '', ...props }, ref) => {
    const { descriptionId } = useDialogContext();
    
    return (
      <p
        ref={ref}
        id={descriptionId}
        className={`stellarix-dialog-description ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

DialogDescription.displayName = 'DialogDescription';

// DialogClose component
export const DialogClose = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, className = '', ...props }, ref) => {
    const { close } = useDialogContext();
    
    return (
      <button
        ref={ref}
        type="button"
        className={`stellarix-dialog-close ${className}`}
        onClick={close}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DialogClose.displayName = 'DialogClose';

// Add compound components to Dialog
Dialog.Panel = DialogPanel;
Dialog.Backdrop = DialogBackdrop;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Close = DialogClose; 