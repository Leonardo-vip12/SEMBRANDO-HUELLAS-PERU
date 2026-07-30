import { useState, useRef, useEffect, type RefObject } from 'react'

interface UseIntersectionOptions extends IntersectionObserverInit {}

interface UseIntersectionReturn {
  ref: RefObject<HTMLElement | null>
  isIntersecting: boolean
  intersectionRatio: number
  entry: IntersectionObserverEntry | null
}

export function useIntersection(options: UseIntersectionOptions = {}): UseIntersectionReturn {
  const ref = useRef<HTMLElement | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [intersectionRatio, setIntersectionRatio] = useState(0)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
      setIntersectionRatio(entry.intersectionRatio)
      setEntry(entry)
    }, options)

    observer.observe(element)
    return () => observer.disconnect()
  }, [options.root, options.rootMargin, options.threshold])

  return { ref, isIntersecting, intersectionRatio, entry }
}
