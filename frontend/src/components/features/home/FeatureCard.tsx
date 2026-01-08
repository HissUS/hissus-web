import Card from '../../ui/Card';
import DoorImg from '@/assets/images/double_handle/DH_screendoor.jpg'
import WindowsImg from '@/assets/images/windows/windows.jpg'
import '../../../styles/feature-card.css';

export default function FeatureCard() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Wave top separator */}
      <div className="feature-section-wave-top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>
      
      {/* Main section with gradient and patterns */}
      <div className="feature-section-main">
        {/* Animated geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border-4 border-neutral-900 rounded-full animate-spin-slow"></div>
          <div className="absolute top-40 right-20 w-48 h-48 border-4 border-neutral-900 rotate-45 animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 border-4 border-neutral-900 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-neutral-900/20 rounded-2xl rotate-12 animate-float-delayed"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-32 left-1/4 w-3 h-3 bg-neutral-900 rounded-full animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-neutral-900 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-neutral-900 rounded-full animate-pulse-slow"></div>
        
        <div className="max-w-7xl w-full relative z-10">
          {/* Section Header with gradient text */}
          <div className="feature-section-header">
            <div className="inline-block mb-6">
              <span className="text-neutral-700 uppercase tracking-[0.3em] text-sm font-bold">Premium Solutions</span>
            </div>
            <h2 
              className="text-6xl md:text-7xl font-black mb-6 tracking-tight leading-tight text-neutral-900"
            >
              Elevate Your Space
            </h2>
            <p className="text-2xl text-neutral-700 leading-relaxed font-light text-center feature-section-subtitle">
              Transform your home with innovative retractable screen technology
            </p>
          </div>

          {/* Cards with staggered layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 feature-section-cards-grid">
            <div className="animate-slide-in-left lg:mt-8">
              <Card
                title="Custom Retractable Screens"
                description="Experience the perfect blend of functionality and elegance. Our retractable screens are custom-designed to fit your space, offering seamless protection against insects while maintaining your view and airflow."
                buttonText="Learn More"
                buttonLink="/services"
                imageSrc = {DoorImg}
              />
            </div>

            <div className="animate-slide-in-right lg:-mt-8">
              <Card
                title="Premium Quality Materials"
                description="Built to last with high-quality materials and precision engineering. Choose from a variety of colors and finishes to complement your home's aesthetic. Our screens are designed for durability and effortless operation."
                buttonText="View Options"
                buttonLink="/quote"
                imageSrc = {WindowsImg}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave bottom separator */}
      <div className="feature-section-wave-bottom">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,69.3C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

