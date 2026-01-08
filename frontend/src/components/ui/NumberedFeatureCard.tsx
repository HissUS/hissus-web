import React, { type ReactNode } from 'react';
import '../../styles/numbered-feature-card.css';

interface NumberedFeatureCardProps {
  number: number;
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

const NumberedFeatureCard: React.FC<NumberedFeatureCardProps> = ({
  number,
  title,
  description,
  icon,
  className = '',
}) => {
  return (
    <div className={`numbered-feature-card-wrapper ${className}`}>
      {/* Large background number with transparency */}
      <div className="numbered-feature-card-bg-number">
        <span className="numbered-feature-card-bg-number-text">
          {number.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Card Content */}
      <div className="numbered-feature-card-content">
        <div className="numbered-feature-card-inner">
          {/* Icon Section */}
          {icon && (
            <div className="numbered-feature-card-icon">
              {icon}
            </div>
          )}
          
          {/* Content Section */}
          <div className="numbered-feature-card-text">
            <h3 className="numbered-feature-card-title">
              {title}
            </h3>
            <p className="numbered-feature-card-description">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberedFeatureCard;
