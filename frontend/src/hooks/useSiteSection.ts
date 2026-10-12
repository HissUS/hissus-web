import { useLocation } from '@tanstack/react-router'
import { SITE_PATHS, getSiteSection } from '@/lib'

/** Navigation follows the current business namespace on one hostname. */
export function useSiteSection() {
  const { pathname } = useLocation()
  const section = getSiteSection(pathname)
  const isWindowSite = section === 'windows'
  return {
    section,
    isWindowSite,
    homePath: SITE_PATHS[section].home,
    switchPath: isWindowSite ? SITE_PATHS.factory.home : SITE_PATHS.windows.home,
    switchLabel: isWindowSite ? 'nav.services' : 'nav.screens',
  }
}
