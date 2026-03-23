import { useState, useEffect } from 'react'

export function useWindowSize(): number {
  const [width, setWidth] = useState<number>(window.innerWidth)

  useEffect(() => {
    function handleWindowSizeChange() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  return width
}
