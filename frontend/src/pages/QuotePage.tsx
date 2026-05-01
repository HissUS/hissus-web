import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { CATALOG_DATA } from '../features/homepage/constants/catalog'

const TEXAS_CITY_GROUPS = [
  {
    labelKey: 'quote.cityGroups.northTexas',
    options: [
      { value: 'Dallas', labelKey: 'quote.cities.dallas' },
      { value: 'Fort Worth', labelKey: 'quote.cities.fortWorth' },
      { value: 'Arlington', labelKey: 'quote.cities.arlington' },
      { value: 'Plano', labelKey: 'quote.cities.plano' },
      { value: 'Frisco', labelKey: 'quote.cities.frisco' },
      { value: 'McKinney', labelKey: 'quote.cities.mckinney' },
      { value: 'Irving', labelKey: 'quote.cities.irving' },
      { value: 'Richardson', labelKey: 'quote.cities.richardson' },
      { value: 'Lewisville', labelKey: 'quote.cities.lewisville' },
      { value: 'Garland', labelKey: 'quote.cities.garland' },
      { value: 'Carrollton', labelKey: 'quote.cities.carrollton' },
      { value: 'Grand Prairie', labelKey: 'quote.cities.grandPrairie' },
      { value: 'Denton', labelKey: 'quote.cities.denton' },
      { value: 'Grapevine', labelKey: 'quote.cities.grapevine' },
      { value: 'Allen', labelKey: 'quote.cities.allen' },
      { value: 'Mesquite', labelKey: 'quote.cities.mesquite' },
    ],
  },
  {
    labelKey: 'quote.cityGroups.middleTexas',
    options: [
      { value: 'Austin', labelKey: 'quote.cities.austin' },
      { value: 'Round Rock', labelKey: 'quote.cities.roundRock' },
      { value: 'San Antonio', labelKey: 'quote.cities.sanAntonio' },
      { value: 'Waco', labelKey: 'quote.cities.waco' },
      { value: 'Temple', labelKey: 'quote.cities.temple' },
      { value: 'Killeen', labelKey: 'quote.cities.killeen' },
      { value: 'Bryan', labelKey: 'quote.cities.bryan' },
      { value: 'College Station', labelKey: 'quote.cities.collegeStation' },
      { value: 'New Braunfels', labelKey: 'quote.cities.newBraunfels' },
    ],
  },
  {
    labelKey: 'quote.cityGroups.southTexas',
    options: [
      { value: 'Houston', labelKey: 'quote.cities.houston' },
      { value: 'Sugar Land', labelKey: 'quote.cities.sugarLand' },
      { value: 'Katy', labelKey: 'quote.cities.katy' },
      { value: 'The Woodlands', labelKey: 'quote.cities.theWoodlands' },
      { value: 'Pearland', labelKey: 'quote.cities.pearland' },
      { value: 'Pasadena', labelKey: 'quote.cities.pasadena' },
      { value: 'League City', labelKey: 'quote.cities.leagueCity' },
      { value: 'Baytown', labelKey: 'quote.cities.baytown' },
      { value: 'Conroe', labelKey: 'quote.cities.conroe' },
      { value: 'Victoria', labelKey: 'quote.cities.victoria' },
      { value: 'Corpus Christi', labelKey: 'quote.cities.corpusChristi' },
      { value: 'Galveston', labelKey: 'quote.cities.galveston' },
    ],
  },
]

const TEXAS_CITIES = TEXAS_CITY_GROUPS.flatMap((group) => group.options)

const PRODUCT_OPTIONS = CATALOG_DATA.map((product) => ({
  value: product.id,
  label: product.nameKey,
}))

function RequiredMark({ children }: { children: string }) {
  return (
    <span>
      {children} <span className="text-destructive">*</span>
    </span>
  )
}

export function QuotePage() {
  const { t } = useTranslation()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [product, setProduct] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validate() {
    if (!firstName.trim() || !lastName.trim()) return t('quote.errors.nameRequired')
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return t('quote.errors.emailInvalid')
    if (!phone.trim()) return t('quote.errors.phoneRequired')
    if (!city) return t('quote.errors.cityRequired')
    if (!product) return t('quote.errors.productRequired')
    return null
  }

  function handleSubmit(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault()
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    const selectedProduct = PRODUCT_OPTIONS.find((item) => item.value === product)
    const selectedCity = TEXAS_CITIES.find((item) => item.value === city)
    const productLabel = selectedProduct?.label ?? product

    const subject = `HISS US Quote Request - ${firstName} ${lastName}`
    const bodyLines = [
      t('quote.email.title'),
      '',
      t('quote.email.contactSection'),
      `  ${t('quote.firstName')}: ${firstName}`,
      `  ${t('quote.lastName')}: ${lastName}`,
      `  ${t('quote.emailAddress')}: ${email}`,
      `  ${t('quote.phoneNumber')}: ${phone}`,
      '',
      t('quote.email.locationSection'),
      `  ${t('quote.city')}: ${t(selectedCity?.labelKey ?? 'quote.cities.austin')}`,
      '',
      t('quote.email.productSection'),
      `  ${t('quote.productWanted')}: ${t(productLabel)}`,
      '',
      t('quote.email.messageSection'),
      `  ${message || t('quote.email.none')}`,
    ]
    const body = bodyLines.join('\n')
    const mailto = `mailto:ivanou0814@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    // open user's mail client with prefilled email
    window.location.href = mailto
    setSubmitted(true)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">{t('quote.title')}</h1>
      <p className="mb-8 text-gray-600">{t('quote.subtitle')}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex w-full flex-col">
            <span className="mb-2 text-sm font-medium">
              <RequiredMark>{t('quote.firstName')}</RequiredMark>
            </span>
            <input
              className="h-11 rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary/40"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              aria-required
            />
          </label>

          <label className="flex w-full flex-col">
            <span className="mb-2 text-sm font-medium">
              <RequiredMark>{t('quote.lastName')}</RequiredMark>
            </span>
            <input
              className="h-11 rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary/40"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              aria-required
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex w-full flex-col">
            <span className="mb-2 text-sm font-medium">
              <RequiredMark>{t('quote.emailAddress')}</RequiredMark>
            </span>
            <input
              type="email"
              className="h-11 rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required
            />
          </label>

          <label className="flex w-full flex-col">
            <span className="mb-2 text-sm font-medium">
              <RequiredMark>{t('quote.phoneNumber')}</RequiredMark>
            </span>
            <input
              type="tel"
              className="h-11 rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary/40"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              aria-required
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex w-full flex-col">
            <span className="mb-2 text-sm font-medium">
              <RequiredMark>{t('quote.city')}</RequiredMark>
            </span>
            <select
              className="h-11 rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary/40"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              aria-required
            >
              <option value="" disabled>
                {t('quote.cityPlaceholder')}
              </option>
              {TEXAS_CITY_GROUPS.map((group) => (
                <optgroup key={group.labelKey} label={t(group.labelKey)}>
                  {group.options.map((c) => (
                    <option key={c.value} value={c.value}>
                      {t(c.labelKey)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <label className="flex w-full flex-col">
            <span className="mb-2 text-sm font-medium">
              <RequiredMark>{t('quote.productWanted')}</RequiredMark>
            </span>
            <select
              className="h-11 rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary/40"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
              aria-required
            >
              <option value="" disabled>
                {t('quote.productPlaceholder')}
              </option>
              {PRODUCT_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {t(item.label)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex w-full flex-col">
          <span className="mb-2 text-sm font-medium">{t('quote.messageOptional')}</span>
          <textarea
            className="min-h-30 rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary/40"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        {error && <div className="text-sm text-destructive">{error}</div>}
        {submitted && <div className="text-sm text-green-600">{t('quote.sentNotice')}</div>}

        <div className="flex items-center gap-3">
          <Button type="submit">{t('quote.send')}</Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setFirstName('')
              setLastName('')
              setEmail('')
              setPhone('')
              setCity('')
              setProduct('')
              setMessage('')
              setError(null)
              setSubmitted(false)
            }}
          >
            {t('quote.reset')}
          </Button>
        </div>
      </form>
    </div>
  )
}
