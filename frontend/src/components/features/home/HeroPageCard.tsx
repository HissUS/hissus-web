import type { PageCardInfo } from "@/types/PageCardType";
import { PageCardInfoMap } from "@/constants/Constants";
import { TransparentCard } from "@/components/commons/transparentCard/TransparentCard";
import { Button } from "@/components/ui";
import { DownArrowBouncingIcon } from "@/components/ui/icons";

export function HeroPageCard() {
  const { title, description, backgroundImg }: PageCardInfo =
    PageCardInfoMap["HeroPage"];

  // const data: PageCardInfo = PageCardInfoMap['HeroPage'];
  // const {
  //     title,
  //     description,
  //     backgroundImg,
  // } = data;

  return (
    <div
      className="hero h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="hero-overlay absolute inset-0 bg-black/20"></div>
      <div className="hero-content relative z-10 flex items-center justify-center h-full px-8 sm:px-4">
        <TransparentCard title={title} description={description}>
          <Button to="/services">Explore Products</Button>
          <Button to="/quote">Get a Quote</Button>
        </TransparentCard>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white">
        {DownArrowBouncingIcon}
      </div>
    </div>
  );
}
