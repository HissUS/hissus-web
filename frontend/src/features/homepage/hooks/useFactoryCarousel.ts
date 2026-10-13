import useEmblaCarousel from 'embla-carousel-react'

export function useFactoryCarousel() {
  const [viewport, api] = useEmblaCarousel({ align: 'start', loop: true })
  const scroll = (direction: 'previous' | 'next') => {
    const jump = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (direction === 'previous') api?.scrollPrev(jump)
    else api?.scrollNext(jump)
  }
  return { viewport, scroll }
}
