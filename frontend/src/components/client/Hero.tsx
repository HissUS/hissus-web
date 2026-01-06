import heroImage from '@/assets/images/belc.jpg';

export default function Hero() {
  return (
    <div
      className="hero h-screen w-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay bg-black/40"></div>

      <div className="hero-content relative z-10 flex items-center justify-center h-full px-4">
        <div className="max-w-4xl bg-white/20 border-4 border-white rounded-2xl backdrop-blur-md text-center text-white" style={{ padding: '6rem 2rem' }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Retractable Screens Designed for Modern Living
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6">
            Seamlessly connect indoor and outdoor spaces.
          </p>
          <button className="btn btn-primary px-10 py-5 text-lg font-semibold transition-all duration-300 hover:shadow-xl">
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
}