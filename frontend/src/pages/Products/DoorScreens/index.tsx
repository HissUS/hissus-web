import DoorImg from '@/assets/images/double_handle/DH_screendoor.jpg';

export default function DoorScreens() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Door Screens
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Custom retractable screens for single doors, double doors, and sliding patio doors
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src={DoorImg} 
                alt="Retractable Door Screen" 
                className="rounded-lg shadow-2xl w-full h-auto object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Premium Retractable Door Screens
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our retractable door screens are custom-designed for single doors, double doors, 
                and sliding patio doors, allowing fresh air and natural light to flow in while 
                maintaining a clean, refined appearance and strong curb appeal.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Each screen is engineered to retract smoothly when not in use, providing an 
                unobstructed view and seamless access to your outdoor spaces.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Key Features
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-600 text-4xl mb-4">🚪</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Custom Fit
                </h4>
                <p className="text-gray-600">
                  Precisely measured and custom-built to fit your door opening perfectly
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-600 text-4xl mb-4">🔧</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Easy Operation
                </h4>
                <p className="text-gray-600">
                  Smooth retractable mechanism that operates effortlessly with minimal maintenance
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-600 text-4xl mb-4">🎨</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Style Options
                </h4>
                <p className="text-gray-600">
                  Multiple colors and finishes available to match your home's aesthetic
                </p>
              </div>
            </div>
          </div>

          {/* Door Types */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Available for All Door Types
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Single Doors</h4>
                <p className="text-gray-600">Perfect for main entrances and back doors</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Double Doors</h4>
                <p className="text-gray-600">Ideal for French doors and wide openings</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Sliding Doors</h4>
                <p className="text-gray-600">Great for patio doors and large openings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get a free consultation and quote for your door screen project
          </p>
          <a 
            href="/quote" 
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            Request Free Quote
          </a>
        </div>
      </section>
    </div>
  );
}
