import { usePageMetadata } from '@/hooks/usePageMetadata'
import { Outlet } from '@tanstack/react-router'
import { BackToTopButton } from '../ui/BackToTopButton'
import { Footer } from './Footer'
import { Header } from './Header'

export function MainLayout() {
  usePageMetadata()
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <BackToTopButton />
      <Footer />
    </div>
  )
}
