import { useLocation } from '@tanstack/react-router'

const SCREEN_ROUTES = new Set(['/window-screen-solutions', '/products', '/get-a-quote'])

/** One hostname, with navigation that follows the current business section. */
export function useSiteSection() {
  const { pathname } = useLocation()
  const basePath = pathname.replace(/^\/tw(?=\/|$)/, '')
  const isWindowSite = SCREEN_ROUTES.has(basePath)
  return {
    isWindowSite,
    homePath: isWindowSite ? '/window-screen-solutions' : '/home',
    switchPath: isWindowSite ? '/home' : '/window-screen-solutions',
    switchLabel: isWindowSite ? 'nav.services' : 'nav.screens',
  }
}
