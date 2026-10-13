import {
  CompanyAbout,
  CompanyContact,
  FactorySteps,
  FactoryGallery,
  FactoryHero,
} from '@/features/homepage'

export function HomePage() {
  return (
    <>
      <FactoryHero />
      <FactoryGallery />
      <FactorySteps />
      <CompanyAbout />
      <CompanyContact compact />
    </>
  )
}
