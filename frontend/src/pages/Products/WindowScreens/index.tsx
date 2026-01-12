import WindowsImg from '@/assets/images/windows/windows.jpg';

export default function WindowScreens() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Window Screens
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Custom window screens for superior airflow and insect protection
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Premium Window Screens
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Whatever your window type, our custom window screens are designed to deliver 
                smooth airflow and dependable insect protection—bringing fresh air in while 
                keeping pests out.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our window screens are crafted with precision to fit any window size or style, 
                ensuring maximum protection and ventilation without compromising your view or 
                your home's aesthetic.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src={WindowsImg} 
                alt="Window Screens" 
                className="rounded-lg shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Key Features
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-600 text-4xl mb-4">🪟</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Universal Fit
                </h4>
                <p className="text-gray-600">
                  Compatible with all window types and sizes for complete coverage
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-600 text-4xl mb-4">🦟</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Insect Protection
                </h4>
                <p className="text-gray-600">
                  Fine mesh that keeps even the smallest insects out while allowing airflow
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-600 text-4xl mb-4">💪</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Durable Materials
                </h4>
                <p className="text-gray-600">
                  Weather-resistant construction designed for years of reliable use
                </p>
              </div>
            </div>
          </div>

          {/* Window Types */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Available for All Window Types
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 transition-colors text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Double-Hung</h4>
                <p className="text-sm text-gray-600">Traditional windows</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 transition-colors text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Casement</h4>
                <p className="text-sm text-gray-600">Side-hinged windows</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 transition-colors text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Sliding</h4>
                <p className="text-sm text-gray-600">Horizontal gliding</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 transition-colors text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Bay & Bow</h4>
                <p className="text-sm text-gray-600">Multi-panel windows</p>
              </div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Our Window Screens?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <span className="text-blue-600 text-2xl mr-4">✓</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Energy Efficient</h4>
                  <p className="text-gray-600">Allows natural ventilation to reduce cooling costs</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 text-2xl mr-4">✓</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Easy Maintenance</h4>
                  <p className="text-gray-600">Simple to clean and maintain for long-lasting performance</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 text-2xl mr-4">✓</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Clear View</h4>
                  <p className="text-gray-600">Fine mesh provides protection without obstructing your view</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 text-2xl mr-4">✓</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Professional Installation</h4>
                  <p className="text-gray-600">Expert installation ensures perfect fit and function</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-linear-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get a free consultation and quote for your window screen project
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
