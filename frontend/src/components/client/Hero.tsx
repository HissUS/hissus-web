import heroImage from '@/assets/images/belc.jpg';

export default function Hero() {
  return (
    <div
      className="hero h-screen w-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay absolute inset-0 bg-black/20"></div>

      <div className="hero-content relative z-10 flex items-center justify-center h-full px-4">
        <div 
          className="max-w-4xl bg-white/10 border-2 border-white/40 rounded-2xl backdrop-blur-md text-center text-white" 
          style={{ padding: '6rem 2rem' }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold mb-8 leading-tight">
            Retractable Screens Designed for Modern Living
          </h1>
          
          <p className="text-lg sm:text-xl md:text-1xl mb-12 leading-relaxed opacity-90" >
            Customizable, high-quality retractable screens for windows and doors with a variety of colors.
          </p>

          <div className="flex gap-4 justify-center" style={{ marginTop: '2rem'}}>
            <button 
              className="btn btn-outline ring-2 ring-white text-white text-lg font-semibold rounded-full flex-1 max-w-xs 
              transition-transform duration-300 hover:scale-105 hover:bg-white hover:text-black 
              hover:shadow-[0_8px_30px_rgba(255,255,255,0.5)]"
              style={{ padding: '1rem 1rem' }}>
              Explore Products
            </button>

            <button 
              className="btn btn-outline ring-2 ring-white text-white text-lg font-semibold rounded-full flex-1 max-w-xs 
              transition-transform duration-300 hover:scale-105 hover:bg-white hover:text-black 
              hover:shadow-[0_8px_30px_rgba(255,255,255,0.5)]"
              style={{ padding: '1rem 1rem' }}>
              Get a Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}