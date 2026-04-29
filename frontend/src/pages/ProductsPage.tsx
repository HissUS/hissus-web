import { Link, useSearch } from '@tanstack/react-router'
import { ArrowRight, LayoutGrid, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui-wrapper'
import { useLocale } from '@/hooks'
import { cn, getAssetUrl } from '@/lib/utils'
import { useCatalogData } from '@/features/homepage/components/CatalogExplorer/useCatalogData'
import { GalleryCarousel } from '@/features/homepage/components/CatalogExplorer/GalleryCarousel'

export function ProductsPage() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''
  const search = useSearch({ strict: false }) as { tab?: string }
  const categories = useCatalogData()
  const active = categories.find((category) => category.id === search.tab) ?? categories[0]
  const descriptionText = t(active.descriptionKey ?? active.summaryKey ?? active.nameKey)
  const descriptionParts = descriptionText.split('\n- ')
  const descriptionLead = descriptionParts[0]
  const descriptionBullets = descriptionParts.slice(1).map((item) => item.trim())
  const headerStatusLabel =
    active.id === 'single-handle'
      ? t('products.page.status.popular')
      : t(active.statusKey ?? 'products.page.status.popular')

  return (
    <main className="overflow-x-hidden bg-white">
      <section className="relative overflow-hidden bg-linear-to-b from-[#F8F9FA] via-white to-white py-12 sm:py-16">
        <div className="absolute inset-0 z-0 opacity-60 bg-[radial-gradient(circle_at_top_left,rgba(0,86,179,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(0,86,179,0.07),transparent_24%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[--primary]/20 bg-white px-3 py-1 text-xs font-semibold text-[--primary] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {t('products.page.sectionTitle')}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {t('products.title')}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              {t('products.page.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex flex-wrap gap-3 sm:gap-4">
            <a
              href="#select-product"
              className="rounded-full border border-[--primary]/20 bg-[--primary]/5 px-4 py-2 text-sm font-semibold text-[--primary]"
            >
              {t('products.page.sectionTitle')}
            </a>
            <a
              href="#product-details"
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
            >
              {t('products.page.overview')}
            </a>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.05fr_1.35fr] xl:items-start">
            <section id="select-product" className="min-w-0 space-y-4 xl:sticky xl:top-24">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-[--primary]" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('products.page.sectionTitle')}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-gray-600">
                {t('products.page.selectionHint')}
              </p>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {categories.map((category) => {
                  const isActive = category.id === active.id
                  const statusLabel =
                    category.id === 'single-handle'
                      ? t('products.page.status.popular')
                      : t(category.statusKey ?? 'products.page.status.popular')
                  const thumbnail = category.images[0]

                  return (
                    <Link
                      key={category.id}
                      to={`${prefix}/products` as never}
                      search={{ tab: category.id } as never}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group rounded-3xl border p-3 text-left shadow-sm transition-all duration-200 ring-2 ring-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[--primary]/40 focus-visible:ring-offset-2',
                        isActive
                          ? 'border-primary bg-[--primary]/5 shadow-md ring-[--primary]/20'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md',
                      )}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-24 sm:w-32">
                          <img
                            src={thumbnail ? getAssetUrl(thumbnail.src) : ''}
                            alt={thumbnail ? t(thumbnail.altKey) : t(category.nameKey)}
                            className="h-full w-full object-cover"
                          />
                          {isActive ? (
                            <div
                              className="absolute inset-0 ring-2 ring-[--primary]"
                              aria-hidden="true"
                            />
                          ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-base font-semibold leading-snug text-gray-900 wrap-break-word">
                                {t(category.nameKey)}
                              </p>
                              <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-gray-600 sm:line-clamp-2">
                                {t(category.summaryKey ?? category.nameKey)}
                              </p>
                            </div>
                            {isActive ? null : null}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span
                              className={cn(
                                'rounded-full px-2.5 py-1 font-semibold',
                                'bg-gray-100 text-gray-700',
                              )}
                            >
                              {statusLabel}
                            </span>
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                              {t(
                                category.availabilityKey ?? 'products.page.availability.available',
                              )}
                            </span>
                            {/* Removed action badge (overview / view details) per request */}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>

            <section className="min-w-0 space-y-8">
              <Card className="overflow-hidden border-gray-200 shadow-lg" id="product-details">
                <div className="h-1 bg-[--primary]" aria-hidden="true" />
                <CardHeader className="space-y-4 bg-linear-to-b from-white to-gray-50">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[--primary]/20 bg-[--primary]/10 px-3 py-1 text-xs font-semibold text-[--primary]">
                      {headerStatusLabel}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {t(active.availabilityKey ?? 'products.page.availability.available')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="wrap-break-word text-2xl text-gray-900 sm:text-3xl">
                      {t(active.nameKey)}
                    </CardTitle>
                    <CardDescription className="max-w-3xl text-base leading-relaxed text-gray-600 wrap-break-word">
                      <span className="block">{descriptionLead}</span>
                      {descriptionBullets.length > 0 ? (
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                          {descriptionBullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-4 sm:p-6">
                  <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-inner">
                    <GalleryCarousel images={active.images} />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {active.specs.map((spec) => {
                      const Icon = spec.icon

                      return (
                        <div
                          key={spec.labelKey}
                          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-[--primary]/30"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[--primary]/10 text-[--primary] ring-1 ring-[--primary]/10">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {t(spec.labelKey)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-relaxed text-gray-600 wrap-break-word">
                      {t('products.page.selectionHint')}
                    </p>
                    <Link
                      to={`${prefix}/get-a-quote` as never}
                      className="inline-flex w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto">
                        {t('nav.getQuote')}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-[#F8F9FA] shadow-sm" id="product-help">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 sm:text-xl">
                    {t('products.page.helpTitle')}
                  </CardTitle>
                  <CardDescription>{t('products.page.helpDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl wrap-break-word text-sm leading-relaxed text-gray-600">
                    {t('products.page.selectionHint')}
                  </p>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <Link
                      to={`${prefix}/get-a-quote` as never}
                      className="inline-flex w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto">{t('nav.getQuote')}</Button>
                    </Link>
                    <a
                      href="mailto:hiss.usatx@gmail.com"
                      className="inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 sm:w-auto"
                    >
                      {t('products.page.contact')}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
