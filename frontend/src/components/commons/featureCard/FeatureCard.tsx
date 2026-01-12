import type { ReactNode } from "react";
import "@/styles/numbered-feature-card.css";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  number?: number;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  number,
  className = "",
}: FeatureCardProps) {
  return (
    <div className={`numbered-feature-card-wrapper ${className}`}>
      {number && (
        <div className="numbered-feature-card-bg-number">
          <span className="numbered-feature-card-bg-number-text">{number}</span>
        </div>
      )}
      <div className="numbered-feature-card-content">
        <div className="numbered-feature-card-inner">
          {icon && <div className="numbered-feature-card-icon">{icon}</div>}
          <div className="numbered-feature-card-text">
            <div className="numbered-feature-card-title">{title}</div>
            <div className="numbered-feature-card-description">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
