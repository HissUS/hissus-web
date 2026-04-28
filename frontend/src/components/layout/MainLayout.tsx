import { Outlet } from '@tanstack/react-router'
import { Footer } from './Footer'
import { Header } from './Header'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
