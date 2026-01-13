import type { PageCardInfo } from "@/types/PageCardType";
import { PageCardInfoMap } from "@/constants/Constants";
import { features } from "@/constants/Constants";
import { FeatureCard } from "@/components/commons/featureCard/FeatureCard";
import "@/styles/why-choose-us.css";

export function ChooseUsPageCard() {
  const { header, title, description }: PageCardInfo =
    PageCardInfoMap["ChooseUsPage"];

  return (
    <div className="why-choose-us-section">
      <div className="why-choose-us-main">
        <div className="why-choose-us-shapes">
          <div className="shape-circle-1"></div>
          <div className="shape-square-1"></div>
          <div className="shape-triangle-1"></div>
          <div className="shape-circle-2"></div>
          <div className="shape-hexagon"></div>
        </div>
        {/* Subtle dot pattern */}
        <div className="why-choose-us-dots"></div>
        <div className="why-choose-us-content">
          {/* Section Header */}
          <div className="why-choose-us-header">
            <div>
              <span className="why-choose-us-subtitle">{header}</span>
            </div>
            <h2 className="why-choose-us-title">{title}</h2>
            <p className="why-choose-us-description">{description}</p>
          </div>
          {/* Features List */}
          <div className="why-choose-us-features">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                number={index + 1}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                className="why-choose-us-feature-card"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
