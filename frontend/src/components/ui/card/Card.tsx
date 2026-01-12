import HomeButton from "../button/Button";

interface CardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc?: string;
}

export function Card({
  title,
  description,
  buttonText,
  buttonLink,
  imageSrc,
}: CardProps) {
  return (
    <div className="card lg:card-side feature-card">
      <figure className="feature-card-figure">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="feature-card-image" />
        ) : (
          <div className="feature-card-placeholder">
            <span className="feature-card-placeholder-text">Image Here</span>
          </div>
        )}
      </figure>

      <div className="feature-card-content">
        <h2 className="feature-card-title">{title}</h2>
        <p className="feature-card-description">{description}</p>
        <div className="feature-card-button-container">
          <HomeButton to={buttonLink}>{buttonText}</HomeButton>
        </div>
      </div>
    </div>
  );
}

Card.displayName = "Card";
