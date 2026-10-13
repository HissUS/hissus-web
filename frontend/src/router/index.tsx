import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  redirect,
  ScrollRestoration,
  useLocation,
  notFound,
  type RouterHistory,
} from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { AuthLayout } from '../layouts/AuthLayout'
import { MainLayout } from '../layouts/MainLayout'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { SITE_PATHS, LEGACY_PATHS, getSiteSection } from '@/lib'
import { usePageMetadata } from '@/hooks/usePageMetadata'
const HomePage = lazyRouteComponent(() => import('../pages/HomePage'), 'HomePage')
const ServicesPage = lazyRouteComponent(() => import('../pages/ServicesPage'), 'ServicesPage')
const WindowScreenPage = lazyRouteComponent(
  () => import('../pages/WindowScreenPage'),
  'WindowScreenPage',
)
const ContactPage = lazyRouteComponent(() => import('../pages/ContactPage'), 'ContactPage')
const LoginPage = lazyRouteComponent(() => import('../pages/LoginPage'), 'LoginPage')
const ProductsPage = lazyRouteComponent(() => import('../pages/ProductsPage'), 'ProductsPage')
const QuotePage = lazyRouteComponent(() => import('../pages/QuotePage'), 'QuotePage')

// ─── Root ────────────────────────────────────────────────────────────────────

function RootComponent() {
  usePageMetadata()
  const location = useLocation()
  const { i18n } = useTranslation()
  const locale = location.pathname.startsWith('/tw/') ? 'zh-TW' : 'en'
  useEffect(() => {
    document.documentElement.lang = locale
    if (i18n.language !== locale) void i18n.changeLanguage(locale)
  }, [locale, i18n])
  const basePath = location.pathname.replace(/^\/(?:tw)(?=\/|$)/, '') || '/'
  const prevBasePath = useRef(basePath)

  useEffect(() => {
    if (prevBasePath.current !== basePath) {
      setTimeout(() => {
        if (location.hash) return
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
        })
      }, 10)
      prevBasePath.current = basePath
    }
  }, [basePath, location.hash])

  return (
    <>
      {!import.meta.env.SSR && <ScrollRestoration />}
      <Outlet />
    </>
  )
}

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: ({ location }) => {
    throw redirect({
      to: '/factory/home',
      search: location.search as never,
      hash: location.hash,
      replace: true,
    })
  },
})

// ─── Layout: Main (public pages) ─────────────────────────────────────────────

const mainLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'main-layout',
  component: MainLayout,
})

function ConsolePage() {
  const { t } = useTranslation()
  return <h1 className="company-container py-16 text-2xl">{t('company.console')}</h1>
}

const publicPages = (
  [
    { path: SITE_PATHS.factory.home, component: HomePage },
    { path: SITE_PATHS.factory.services, component: ServicesPage },
    { path: SITE_PATHS.factory.contact, component: ContactPage },
    { path: SITE_PATHS.windows.home, component: WindowScreenPage },
    { path: SITE_PATHS.windows.products, component: ProductsPage },
    { path: SITE_PATHS.windows.quote, component: QuotePage },
    { path: '/console', component: ConsolePage },
  ] as const
).flatMap(({ path, component }) => [
  createRoute({ getParentRoute: () => mainLayoutRoute, path, component }),
  createRoute({
    getParentRoute: () => mainLayoutRoute,
    path: `/$country${path}`,
    component,
    beforeLoad: ({ params }) => {
      if (params.country !== 'tw') throw notFound()
    },
  }),
])

// Preserve locale, query selection and hash for bookmarked links.
const aliases = {
  ...LEGACY_PATHS,
  '/about': SITE_PATHS.factory.home,
  '/factory/about': SITE_PATHS.factory.home,
  '/factory': SITE_PATHS.factory.home,
  '/windows': SITE_PATHS.windows.home,
}
const legacyRoutes = Object.entries(aliases).flatMap(([path, destination]) => [
  createRoute({
    getParentRoute: () => rootRoute,
    path,
    beforeLoad: ({ location }) => {
      throw redirect({
        to: destination as never,
        search: location.search as never,
        hash:
          path === '/about' || path === '/factory/about' ? location.hash || 'about' : location.hash,
        replace: true,
      })
    },
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: `/$country${path}`,
    beforeLoad: ({ params, location }) => {
      if (params.country !== 'tw') throw notFound()
      throw redirect({
        to: `/${params.country}${destination}` as never,
        search: location.search as never,
        hash:
          path === '/about' || path === '/factory/about' ? location.hash || 'about' : location.hash,
        replace: true,
      })
    },
  }),
])
const countryIndex = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$country',
  beforeLoad: ({ params, location }) => {
    if (params.country !== 'tw') throw notFound()
    throw redirect({
      to: `/${params.country}/factory/home` as never,
      search: location.search as never,
      hash: location.hash,
      replace: true,
    })
  },
})

// ─── Layout: Auth ─────────────────────────────────────────────────────────────

const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: AuthLayout,
})

// /login | /login/$country
const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: LoginPage,
})
const loginCountryRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/$country/login',
  component: LoginPage,
  beforeLoad: ({ params }) => {
    if (params.country !== 'tw') throw notFound()
  },
})

function NotFoundPage() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const prefix = pathname.startsWith('/tw/') ? '/tw' : ''
  const homePath = SITE_PATHS[getSiteSection(pathname)].home
  return (
    <div className="company-container py-16">
      <h1 className="company-heading">{t('company.notFoundTitle')}</h1>
      <p className="company-copy mt-8">{t('company.notFoundDesc')}</p>
      <Link to={`${prefix}${homePath}` as never} className="company-text-link">
        {t('nav.home')}
      </Link>
    </div>
  )
}

// ─── Route tree ───────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  countryIndex,
  ...legacyRoutes,
  mainLayoutRoute.addChildren(publicPages),
  authLayoutRoute.addChildren([loginRoute, loginCountryRoute]),
])

export function createSiteRouter(history?: RouterHistory) {
  const siteRouter = createRouter({ routeTree, ...(history ? { history, isServer: true } : {}) })
  // Route data is loaded before hydration. Keep TanStack's SSR boundary tree on both sides.
  siteRouter.ssr = { manifest: undefined }
  return siteRouter
}
export const router = createSiteRouter()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
