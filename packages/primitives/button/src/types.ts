// Button component types
export interface ButtonState {
    pressed: boolean;
    focused: boolean;
    disabled: boolean;
    loading: boolean;
    variant: ButtonVariant;
    size: ButtonSize;
}

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonOptions {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    onClick?: (event: MouseEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
}

export interface ButtonEvents {
    click: { event: MouseEvent };
    focus: { event: FocusEvent };
    blur: { event: FocusEvent };
    keydown: { event: KeyboardEvent };
}

export interface ButtonProps extends ButtonOptions {
    children?: any;
    className?: string;
    id?: string;
    type?: 'button' | 'submit' | 'reset';
    'aria-label'?: string;
    'aria-describedby'?: string;
} 