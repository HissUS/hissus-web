interface TransparentCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function TransparentCard({
  title,
  description,
  children,
}: TransparentCardProps) {
  return (
    <div className="hero-content-box">
      <h1
        className="text-4xl sm:text-5xl md:text-5xl font-bold leading-tight"
        style={{ marginBottom: "2rem", paddingTop: "0.5rem" }}
      >
        {title}
      </h1>

      <p
        className="text-lg sm:text-xl md:text-xl leading-relaxed opacity-90"
        style={{ marginBottom: "2rem" }}
      >
        {description}
      </p>

      {children && (
        <div
          className="flex gap-4 justify-center"
          style={{ paddingBottom: "0.5rem" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
