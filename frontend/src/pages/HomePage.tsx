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
      <CompanyAbout />
      <FactoryGallery />
      <FactorySteps />
      <CompanyContact compact />
    </>
  )
}
