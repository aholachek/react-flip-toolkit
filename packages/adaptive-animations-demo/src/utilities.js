import { useEffect, useRef } from 'react'
import { breakpoint } from './App/styles'

export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export const callOnMobile = func => (...args) => {
  if (window.matchMedia(`screen and (max-width: ${breakpoint}px)`).matches) {
    func(...args)
  }
}

export const callOnDesktop = func => (...args) => {
  if (
    window.matchMedia(`screen and (min-width: ${breakpoint + 1}px)`).matches
  ) {
    func(...args)
  }
}
