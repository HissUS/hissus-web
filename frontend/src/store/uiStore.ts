import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  // Auth UI state (NOT the JWT token — that stays in HttpOnly cookie)
  isAuthenticated: boolean
  setAuthenticated: (value: boolean) => void
  clearAuthState: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  clearAuthState: () => set({ isAuthenticated: false, sidebarOpen: false }),
}))
