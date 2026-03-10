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
// /home/$country → localized  (e.g. /home/tw)
const homeRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/home',
  component: HomePage,
})
const homeCountryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/home/$country',
  component: HomePage,
})

// /products | /products/$country
const productsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/products',
  component: ProductsPage,
})
const productsCountryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/products/$country',
  component: ProductsPage,
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
  path: '/login/$country',
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
  ]),
  authLayoutRoute.addChildren([loginRoute, loginCountryRoute]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
