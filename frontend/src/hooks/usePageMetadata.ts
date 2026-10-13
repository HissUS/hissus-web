import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import { getPageSeo, renderSeoHead } from '@/lib/seo'

/** The build emits the same metadata; this keeps it current during client navigation. */
export function usePageMetadata() {
  const { href } = useLocation()
  useEffect(() => {
    const preview =
      import.meta.env.VITE_SEO_PREVIEW === 'true' ||
      !['hissus.com', 'www.hissus.com'].includes(window.location.hostname)
    const seo = getPageSeo(href, preview)
    document.documentElement.lang = seo.locale
    document.title = seo.title
    document
      .querySelectorAll('[data-hissus-seo], [data-hissus-locale], meta[name="description"]')
      .forEach((element) => element.remove())
    const template = document.createElement('template')
    template.innerHTML = renderSeoHead(href, preview)
    template.content.querySelector('title')?.remove()
    document.head.append(template.content)
  }, [href])
}
