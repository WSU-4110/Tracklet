'use client';

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import type { ItemActionState } from '../actions/items';

type FormObserverOptions = {
  onSuccess?: (state: ItemActionState) => void;
  onError?: (state: ItemActionState) => void;
};

export function useFormObserver(
  action: (state: ItemActionState, payload: FormData) => Promise<ItemActionState>,
  options: FormObserverOptions = {}
): [ItemActionState, (payload: FormData) => void] {
  const initialState: ItemActionState = {};
  const [state, formAction] = useFormState(action, initialState);

  const onSuccessRef = useRef(options.onSuccess);
  const onErrorRef = useRef(options.onError);

  useEffect(() => {
    onSuccessRef.current = options.onSuccess;
    onErrorRef.current = options.onError;
  });

  const prevStateRef = useRef<ItemActionState>(initialState);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state.success) {
      onSuccessRef.current?.(state);
    } else if (state.error) {
      onErrorRef.current?.(state);
    }
  }, [state]);

  return [state, formAction];
}