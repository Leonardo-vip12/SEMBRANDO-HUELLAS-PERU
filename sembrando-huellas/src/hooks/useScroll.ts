import { useState, useEffect, useRef } from 'react'

interface ScrollState {
  x: number
  y: number
  direction: 'up' | 'down'
  progress: number
}

export function useScroll(): ScrollState {
  const [state, setState] = useState<ScrollState>({
    x: 0,
    y: 0,
    direction: 'down',
    progress: 0,
  })
  const lastY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const x = window.scrollX
      const y = window.scrollY
      const direction = y > lastY.current ? 'down' : 'up'
      lastY.current = y
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? Math.min(y / docHeight, 1) : 0

      setState({ x, y, direction, progress })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return state
}
