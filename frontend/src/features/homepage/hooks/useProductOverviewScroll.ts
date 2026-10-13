import { useEffect, useRef, useState, type MouseEvent } from 'react'

export function useProductOverviewScroll(activeProductId: string) {
  const overview = useRef<HTMLElement>(null)
  const [requestedProduct, setRequestedProduct] = useState<string | null>(null)

  useEffect(() => {
    if (requestedProduct === null || requestedProduct !== activeProductId) return
    // Wait until the selected product has rendered before measuring the overview.
    const frame = requestAnimationFrame(() => {
      setRequestedProduct(null)
      if (!window.matchMedia('(max-width: 767px)').matches || !overview.current) return
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      window.scrollTo({
        top: window.scrollY + overview.current.getBoundingClientRect().top - headerHeight - 16,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [activeProductId, requestedProduct])

  const selectProduct = (event: MouseEvent<HTMLAnchorElement>, productId: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !window.matchMedia('(max-width: 767px)').matches
    )
      return
    setRequestedProduct(productId)
  }

  return { overview, selectProduct }
}
