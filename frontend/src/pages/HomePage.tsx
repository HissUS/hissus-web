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
      <FactorySteps />
      <FactoryGallery />
      <CompanyContact compact />
    </>
  )
}
