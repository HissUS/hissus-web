import { z } from 'zod'

const TEXAS_CITIES = new Set([
  'Dallas',
  'Fort Worth',
  'Arlington',
  'Plano',
  'Frisco',
  'McKinney',
  'Irving',
  'Richardson',
  'Lewisville',
  'Garland',
  'Carrollton',
  'Grand Prairie',
  'Denton',
  'Grapevine',
  'Allen',
  'Mesquite',
  'Austin',
  'Round Rock',
  'San Antonio',
  'Waco',
  'Temple',
  'Killeen',
  'Bryan',
  'College Station',
  'New Braunfels',
  'Houston',
  'Sugar Land',
  'Katy',
  'The Woodlands',
  'Pearland',
  'Pasadena',
  'League City',
  'Baytown',
  'Conroe',
  'Victoria',
  'Corpus Christi',
  'Galveston',
])
const SCREEN_PRODUCTS = new Set(['single-handle', 'double-handle', 'multi-handle', 'windows'])
const text = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine(
      (value) =>
        !Array.from(value).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127),
    )

export const inquirySchema = z
  .object({
    kind: z.enum(['screen', 'facility']).default('screen'),
    firstName: text(80),
    lastName: text(80),
    email: z.string().trim().email().max(254),
    phone: text(25),
    city: text(120),
    product: text(80),
    message: z.string().trim().max(4000).default(''),
    locale: z.enum(['en', 'zh-TW']).default('en'),
    website: z.string().max(0).default(''),
  })
  .superRefine((data, ctx) => {
    if (data.kind === 'screen') {
      if (
        !/^\d{10}$/.test(data.phone) ||
        !TEXAS_CITIES.has(data.city) ||
        !SCREEN_PRODUCTS.has(data.product)
      ) {
        ctx.addIssue({ code: 'custom', message: 'Invalid screen inquiry' })
      }
    } else if (!/^[+\d][\d ()-]{6,24}$/.test(data.phone) || data.product !== 'factory-facility') {
      ctx.addIssue({ code: 'custom', message: 'Invalid facility inquiry' })
    }
  })
