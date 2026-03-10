import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // Required for HttpOnly cookie (JWT)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor: handle 401 by clearing UI state and redirecting to login
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Lazy import to avoid circular dependency
      const { useUiStore } = await import('@/store/uiStore')
      useUiStore.getState().clearAuthState()
      // Redirect preserving current language prefix
      const lang = window.location.pathname.split('/')[1] || 'zh-TW'
      window.location.href = `/${lang}/login`
    }
    return Promise.reject(error)
  },
)

export default apiClient
