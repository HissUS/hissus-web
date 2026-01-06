export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <img
        src="/assets/images/belc.jpg"
        alt="Hero background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex h-full items-center justify-center bg-black/40 text-white">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-semibold">
            Retractable Screens Designed for Modern Living
          </h1>
          <p className="mt-4 text-lg opacity-90">
            Seamlessly connect indoor and outdoor spaces.
          </p>
          <button className="mt-6 rounded bg-white px-6 py-3 text-black">
            Explore Products
          </button>
        </div>
      </div>
    </section>
  )
}
