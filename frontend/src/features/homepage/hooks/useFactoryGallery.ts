import { useEffect, useRef, useState } from 'react'
import { FACTORY_PHOTOS } from '../constants'

export function useFactoryGallery() {
  const [selected, setSelected] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const isOpen = selected !== null
  useEffect(() => {
    if (!isOpen || !dialog.current) return
    const element = dialog.current
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = overflow
      trigger.current?.focus({ preventScroll: true })
    }
  }, [isOpen])
  const open = (index: number, button: HTMLButtonElement) => {
    trigger.current = button
    setSelected(index)
  }
  const move = (delta: number) =>
    setSelected((index) =>
      index === null ? null : (index + delta + FACTORY_PHOTOS.length) % FACTORY_PHOTOS.length,
    )
  return { selected, dialog, open, move, close: () => setSelected(null) }
}
