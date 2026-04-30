import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Essence Luxury Background"
          fill
          className="object-cover brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10"></div>
      </div>

      <div className="text-center z-20 px-4 max-w-4xl">
        <h1 className="text-5xl sm:text-7xl md:text-9xl tracking-tighter text-white mb-6 fade-in-up delay-1 font-medium italic">
          Essence
        </h1>
        <div className="w-24 h-1 bg-primary mx-auto mb-8 fade-in-up delay-1"></div>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 fade-in-up delay-2 max-w-2xl mx-auto leading-relaxed font-light">
          Elevating Beauty, Naturally. <br />
          Where Artistry Meets Elegance. From bespoke hair designs to professional makeup, we bring your inner glow to the surface.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center fade-in-up delay-3">
          <a
            href="#services"
            className="bg-primary text-text-light px-8 py-4 rounded-full font-medium border-2 border-primary transition-all duration-300 hover:bg-transparent hover:text-primary inline-block text-lg"
          >
            Our Services
          </a>
          <a
            href="#contact"
            className="bg-transparent text-white px-8 py-4 rounded-full font-medium border-2 border-white transition-all duration-300 hover:bg-white hover:text-black inline-block text-lg"
          >
            Book / Contact
          </a>
        </div>
      </div>
    </section>
  );
}
