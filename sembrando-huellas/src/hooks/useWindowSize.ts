import { useState, useEffect } from 'react'

interface WindowSize {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

function getSize(): WindowSize {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0, isMobile: false, isTablet: false, isDesktop: true }
  }
  const width = window.innerWidth
  const height = window.innerHeight
  return {
    width,
    height,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  }
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(getSize)

  useEffect(() => {
    let frameId: number

    const handleResize = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => setSize(getSize()))
    }

    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return size
}
