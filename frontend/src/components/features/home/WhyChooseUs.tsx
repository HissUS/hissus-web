import { FeatureCard } from "../../commons/featureCard/FeatureCard";
import { features } from "@/constants/Constants";
import "@/styles/why-choose-us.css";

const WhyChooseUs = () => {
  return (
    <div className="why-choose-us-section">
      {/* Main section with white background */}
      <div className="why-choose-us-main">
        {/* Geometric shapes background */}
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
              <span className="why-choose-us-subtitle">Why Choose Us</span>
            </div>
            <h2 className="why-choose-us-title">Excellence in Every Detail</h2>
            <p className="why-choose-us-description">
              We combine innovation, craftsmanship, and customer care to deliver
              retractable screens that exceed expectations.
            </p>
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
};

export default WhyChooseUs;
