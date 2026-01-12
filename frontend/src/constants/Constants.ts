import type { PageCardInfo } from "@/types/PageCardType";
import heroImage from "@/assets/images/belc.jpg";

// Import the new icons
import {
  PremiumQualityIcon,
  CustomSolutionsIcon,
  ExpertInstallationIcon,
  ModernDesignIcon,
} from "@/components/ui/icons";

const HeroPageCardInfo: PageCardInfo = {
  title: "Retractable Screens Designed for Modern Living",
  description:
    "Customizable, high-quality retractable screens for windows and doors with a variety of colors.",
  backgroundImg: heroImage,
};

const ProductPageCardInfo: PageCardInfo = {
  title: "Premium Solutions",
  description:
    "Elevate Your Space\n Transform your home with innovative retractable screen technology",
};

export const PageCardInfoMap = {
  HeroPage: HeroPageCardInfo,
  ProdctPage: ProductPageCardInfo,
};

export const features = [
  {
    title: "Premium Quality",
    description:
      "Built with the highest quality materials and precision engineering for lasting durability.",
    icon: PremiumQualityIcon,
  },
  {
    title: "Custom Solutions",
    description:
      "Tailored to your exact specifications with a wide range of colors and configurations.",
    icon: CustomSolutionsIcon,
  },
  {
    title: "Expert Installation",
    description:
      "Professional installation by experienced technicians ensures flawless operation.",
    icon: ExpertInstallationIcon,
  },
  {
    title: "Modern Design",
    description:
      "Sleek, contemporary aesthetics that seamlessly integrate with any architectural style.",
    icon: ModernDesignIcon,
  },
];
