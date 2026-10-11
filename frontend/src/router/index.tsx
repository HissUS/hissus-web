import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  redirect,
  ScrollRestoration,
  useLocation,
} from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { AuthLayout } from '../layouts/AuthLayout'
import { MainLayout } from '../layouts/MainLayout'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { HomePage } from '../pages/HomePage'
const ServicesPage = lazyRouteComponent(() => import('../pages/ServicesPage'), 'ServicesPage')
const WindowScreenPage = lazyRouteComponent(
  () => import('../pages/WindowScreenPage'),
  'WindowScreenPage',
)
const AboutPage = lazyRouteComponent(() => import('../pages/AboutPage'), 'AboutPage')
const ContactPage = lazyRouteComponent(() => import('../pages/ContactPage'), 'ContactPage')
const LoginPage = lazyRouteComponent(() => import('../pages/LoginPage'), 'LoginPage')
const ProductsPage = lazyRouteComponent(() => import('../pages/ProductsPage'), 'ProductsPage')
const QuotePage = lazyRouteComponent(() => import('../pages/QuotePage'), 'QuotePage')

// ─── Root ────────────────────────────────────────────────────────────────────

function RootComponent() {
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
      <ScrollRestoration />
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
  beforeLoad: () => {
    throw redirect({ to: '/home' })
  },
})

// ─── Layout: Main (public pages) ─────────────────────────────────────────────

const mainLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'main-layout',
  component: MainLayout,
})

// /home         → English (US)
// /$country/home → localized  (e.g. /tw/home)
const homeRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/home',
  component: HomePage,
})
const homeCountryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/$country/home',
  component: HomePage,
})

// /products | /$country/products
const productsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/products',
  component: ProductsPage,
})
const productsCountryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/$country/products',
  component: ProductsPage,
})

// /console | /$country/console
function ConsolePage() {
  const { t } = useTranslation()
  return <h1 className="company-container py-16 text-2xl">{t('company.console')}</h1>
}
const consoleRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/console',
  component: ConsolePage,
})
const consoleCountryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/$country/console',
  component: ConsolePage,
})

// /get-a-quote | /$country/get-a-quote
const quoteRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/get-a-quote',
  component: QuotePage,
})
const quoteCountryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/$country/get-a-quote',
  component: QuotePage,
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
})

function NotFoundPage() {
  const { t } = useTranslation()
  const prefix = window.location.pathname.startsWith('/tw/') ? '/tw' : ''
  return (
    <div className="company-container py-16">
      <h1 className="company-heading">{t('company.notFoundTitle')}</h1>
      <p className="company-copy mt-8">{t('company.notFoundDesc')}</p>
      <Link to={`${prefix}/home` as never} className="company-text-link">
        {t('nav.home')}
      </Link>
    </div>
  )
}

const companyRoutes = [
  { path: '/services', component: ServicesPage },
  { path: '/window-screen-solutions', component: WindowScreenPage },
  { path: '/about', component: AboutPage },
  { path: '/contact', component: ContactPage },
].flatMap(({ path, component }) => [
  createRoute({ getParentRoute: () => mainLayoutRoute, path, component }),
  createRoute({ getParentRoute: () => mainLayoutRoute, path: `/$country${path}`, component }),
])

// ─── Route tree ───────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  mainLayoutRoute.addChildren([
    ...companyRoutes,
    homeRoute,
    homeCountryRoute,
    productsRoute,
    productsCountryRoute,
    consoleRoute,
    consoleCountryRoute,
    quoteRoute,
    quoteCountryRoute,
  ]),
  authLayoutRoute.addChildren([loginRoute, loginCountryRoute]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
