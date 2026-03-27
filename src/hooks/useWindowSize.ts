import { useState, useEffect, useRef } from 'react'

export function useWindowSize(): number {
  const [width, setWidth] = useState<number>(1200)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (typeof window === 'undefined') return

    setWidth(window.innerWidth)

    function handleWindowSizeChange() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setWidth(window.innerWidth)
      }, 100)
    }

    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return width
}
