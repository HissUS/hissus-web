import { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

export function useFactoryCarousel() {
  const [viewport, api] = useEmblaCarousel({ align: 'start', loop: false })
  const [position, setPosition] = useState({ previous: false, next: true })
  useEffect(() => {
    if (!api) return
    const update = () => setPosition({ previous: api.canScrollPrev(), next: api.canScrollNext() })
    update()
    api.on('select', update)
    api.on('reInit', update)
    return () => {
      api.off('select', update)
      api.off('reInit', update)
    }
  }, [api])
  const scroll = (direction: 'previous' | 'next') => {
    const jump = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (direction === 'previous') api?.scrollPrev(jump)
    else api?.scrollNext(jump)
  }
  return { viewport, position, scroll }
}
