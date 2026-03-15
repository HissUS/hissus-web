import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const HISSUS_DEFAULTS = {
  button: 'transition-all active:scale-[0.98]',
  card: 'transition-all',
  badge: 'transition-all',
} as const

type HissusComponent = keyof typeof HISSUS_DEFAULTS

export function withHissusDefaults(component: HissusComponent, className?: string): string {
  return cn(HISSUS_DEFAULTS[component], className)
}

export function getAssetUrl(path: string): string {
  if (path.startsWith('http')) return path
  const base = import.meta.env.VITE_ASSET_BASE_URL ?? ''
  return `${base}${path}`
}
