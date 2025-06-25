import type { Component, JSX } from 'solid-js';
import type { ComponentCore } from '@stellarix-ui/core';

export interface SolidComponent<P = {}> extends Component<P> {}

export interface SolidProps extends JSX.HTMLAttributes<HTMLElement> {
  children?: JSX.Element;
  ref?: (el: HTMLElement) => void;
}

export interface SolidAdapterOptions {
  enableDevtools?: boolean;
  enableTransitions?: boolean;
}

export interface SolidComponentInstance<TState = any, TLogic = any> {
  state: TState;
  logic: TLogic;
  element?: HTMLElement;
}

export type SolidComponentFactory<TState, TLogic> = (
  props: SolidProps
) => JSX.Element;