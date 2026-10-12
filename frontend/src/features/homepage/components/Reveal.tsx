import { useEffect, useRef, type ReactNode } from 'react'

/** Fade once on entry, without changing layout or hiding content from assistive tools. */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (
      !element ||
      !window.IntersectionObserver ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return
    element.dataset.pending = 'true'
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        delete element.dataset.pending
        observer.disconnect()
      },
      { threshold: 0.05 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      delete element.dataset.pending
    }
  }, [])
  return (
    <div ref={ref} className={`factory-reveal ${className}`}>
      {children}
    </div>
  )
}
