// src/hooks/usePopupState.ts

import { useState } from 'react';

export interface PopupState<T> {
  isOpen: boolean;
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  open: () => void;
  close: () => void;
  reset: () => void;
}

export const usePopupState = <T extends object | null>(
  initialState: T
): PopupState<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const initialCopy = initialState !== null ? { ...initialState } : ({} as T);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const reset = () => setState(initialCopy);

  return {
    isOpen,
    state,
    setState,
    open,
    close,
    reset,
  };
};
