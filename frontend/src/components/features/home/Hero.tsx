import heroImage from '@/assets/images/belc.jpg';

export default function Hero() {
  return (
    <div
      className="hero h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay absolute inset-0 bg-black/20"></div>

      <div className="hero-content relative z-10 flex items-center justify-center h-full px-8 sm:px-4">
        <div className="hero-content-box">
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold leading-tight" style={{ marginBottom: '2rem', paddingTop: '1rem' }}>
            Retractable Screens Designed for Modern Living
          </h1>
          
          <p className="text-lg sm:text-xl md:text-xl leading-relaxed opacity-90" style={{ marginBottom: '2rem' }}>
            Customizable, high-quality retractable screens for windows and doors with a variety of colors.
          </p>

          <div className="flex gap-4 justify-center" style={{ paddingBottom: '1rem' }}>
            <button className="btn-hero">
              Explore Products
            </button>

            <button className="btn-hero">
              Get a Quote
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2}
            stroke="white"
            className="w-15 h-15 opacity-80"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}