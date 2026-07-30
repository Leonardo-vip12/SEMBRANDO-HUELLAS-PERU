import { useState, useRef, useEffect, type RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): { ref: RefObject<HTMLElement | null>; isIntersecting: boolean } {
  const ref = useRef<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.root, options.rootMargin, options.threshold]);

  return { ref, isIntersecting };
}
