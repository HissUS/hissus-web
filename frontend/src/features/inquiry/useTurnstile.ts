import { useEffect, useRef, useState } from 'react'

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      action: string
      theme: string
      size: string
      language: string
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => boolean
    },
  ) => string
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}
let library: Promise<TurnstileApi> | undefined

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!library)
    library = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      const fail = () => {
        library = undefined
        script.remove()
        reject(new Error('Verification unavailable'))
      }
      const timeout = window.setTimeout(fail, 12000)
      script.onload = () => {
        clearTimeout(timeout)
        if (window.turnstile) resolve(window.turnstile)
        else fail()
      }
      script.onerror = () => {
        clearTimeout(timeout)
        fail()
      }
      document.head.append(script)
    })
  return library
}

export function useTurnstile(locale: string, resetKey: number, onVerify: (token: string) => void) {
  const container = useRef<HTMLDivElement>(null)
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim()
  const [status, setStatus] = useState(sitekey ? 'loading' : 'unavailable')
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const element = container.current
    if (!element) return
    const updateSize = () => setCompact(element.clientWidth < 300)
    updateSize()
    if (!window.ResizeObserver) {
      window.addEventListener('resize', updateSize)
      return () => window.removeEventListener('resize', updateSize)
    }
    const observer = new ResizeObserver(updateSize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!sitekey) return
    let cancelled = false
    let widget: string | undefined
    let api: TurnstileApi | undefined
    loadTurnstile()
      .then((loaded) => {
        if (cancelled || !container.current) return
        api = loaded
        onVerify('')
        setStatus('loading')
        widget = api.render(container.current, {
          sitekey,
          action: 'hissus_inquiry',
          theme: 'light',
          size: compact ? 'compact' : 'normal',
          language: locale === 'zh-TW' ? 'zh-tw' : 'en',
          callback: (token) => {
            if (!cancelled) {
              onVerify(token)
              setStatus('ready')
            }
          },
          'expired-callback': () => {
            if (!cancelled) {
              onVerify('')
              setStatus('expired')
            }
          },
          'error-callback': () => {
            if (!cancelled) {
              onVerify('')
              setStatus('unavailable')
            }
            return true
          },
        })
      })
      .catch(() => {
        if (!cancelled) {
          onVerify('')
          setStatus('unavailable')
        }
      })
    return () => {
      cancelled = true
      if (widget !== undefined) api?.remove(widget)
    }
  }, [sitekey, locale, resetKey, onVerify, compact])
  return { container, status }
}
