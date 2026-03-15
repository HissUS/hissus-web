import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { AuthLayout } from '../layouts/AuthLayout'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { ProductsPage } from '../pages/ProductsPage'

// ─── Root ────────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: Outlet })

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
const consolePage = () => (
  <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">
    Console — coming soon
  </div>
)
const consoleRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/console',
  component: consolePage,
})
const consoleCountryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/$country/console',
  component: consolePage,
})

// /get-a-quote | /$country/get-a-quote
const quotePage = () => (
  <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">
    Quote — coming soon
  </div>
)
const quoteRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/get-a-quote',
  component: quotePage,
})
const quoteCountryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/$country/get-a-quote',
  component: quotePage,
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

// ─── Route tree ───────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  mainLayoutRoute.addChildren([
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
