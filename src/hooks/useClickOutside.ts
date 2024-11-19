import { useEffect, RefObject } from 'react';

type Handler = (event: MouseEvent) => void;

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler, enabled]);
}