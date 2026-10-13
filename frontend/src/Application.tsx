import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode, useState } from 'react'
import type { createSiteRouter } from './router'

/** Shared provider tree keeps static rendering and client hydration identical. */
export function Application({ router }: { router: ReturnType<typeof createSiteRouter> }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  )
  return (
    <StrictMode>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </StrictMode>
  )
}
