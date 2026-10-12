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

const sharedFields = {
  email: z.string().trim().email().max(254),
  message: z.string().trim().max(4000).default(''),
  locale: z.enum(['en', 'zh-TW']).default('en'),
  website: z.string().max(0).default(''),
}

const screenInquirySchema = z.object({
  ...sharedFields,
  kind: z.literal('screen'),
  firstName: text(80),
  lastName: text(80),
  phone: text(25).regex(/^\d{10}$/),
  city: text(120).refine((value) => TEXAS_CITIES.has(value)),
  product: z.enum(['single-handle', 'double-handle', 'multi-handle', 'windows']),
})

const facilityInquirySchema = z.object({
  ...sharedFields,
  kind: z.literal('facility'),
  name: text(160),
  phone: text(25).regex(/^[+\d][\d ()-]{6,24}$/),
  subject: text(200),
})

// Existing screen clients may omit kind; preserve that API behavior.
export const inquirySchema = z.preprocess(
  (input) => {
    if (input && typeof input === 'object' && !Array.isArray(input) && !('kind' in input)) {
      return { ...input, kind: 'screen' }
    }
    return input
  },
  z.discriminatedUnion('kind', [screenInquirySchema, facilityInquirySchema]),
)
