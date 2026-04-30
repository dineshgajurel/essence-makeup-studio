import Image from "next/image";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-light to-[#e8e6df]"
      >
        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-primary/10 mountain-silhouette z-10 pointer-events-none"></div>
        <div className="text-center z-20 px-4">
          <h1 className="text-6xl md:text-8xl tracking-wider text-text-dark mb-2 fade-in-up font-medium">
            Essence
          </h1>
          <p className="text-xl md:text-2xl text-secondary font-light mb-4 tracking-[4px] uppercase fade-in-up delay-1">
            Unisex Studio
          </p>
          <p className="text-lg text-gray-600 mb-10 fade-in-up delay-2">
            Elevating Beauty, Naturally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up delay-3">
            <a
              href="#services"
              className="bg-primary text-text-light px-6 py-3 rounded-full font-medium border-2 border-primary transition-all duration-300 hover:bg-transparent hover:text-primary inline-block"
            >
              Explore Services
            </a>
            <a
              href="#contact"
              className="bg-transparent text-text-dark px-6 py-3 rounded-full font-medium border-2 border-text-dark transition-all duration-300 hover:bg-text-dark hover:text-text-light inline-block"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-medium text-center text-text-dark mb-2">
            Our Services
          </h2>
          <p className="text-center text-gray-500 mb-12 text-lg">
            Tailored for everyone, inspired by nature.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <div className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center">
              <div className="text-3xl mb-3">✂️</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Hair</h3>
              <p className="text-gray-600 text-xs">Keratin, cutting, color, nanoplex, smoothing</p>
            </div>
            <div className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center">
              <div className="text-3xl mb-3">💄</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Makeup</h3>
              <p className="text-gray-600 text-xs">Bridal & Party makeup services</p>
            </div>
            <div className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center">
              <div className="text-3xl mb-3">👁️</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Lashes extensions</h3>
              <p className="text-gray-600 text-xs">Enhance your natural eye beauty</p>
            </div>
            <div className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center">
              <div className="text-3xl mb-3">🦶</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Manicure pedicure</h3>
              <p className="text-gray-600 text-xs">Complete hand and foot care</p>
            </div>
            <div className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center">
              <div className="text-3xl mb-3">💅</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Nail extensions</h3>
              <p className="text-gray-600 text-xs">Beautiful, long-lasting nail art</p>
            </div>
            <div className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center">
              <div className="text-3xl mb-3">🍯</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Waxing</h3>
              <p className="text-gray-600 text-xs">Smooth, hair-free skin treatments</p>
            </div>
            <div className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center">
              <div className="text-3xl mb-3">🧖‍♀️</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Facial</h3>
              <p className="text-gray-600 text-xs">Rejuvenating skincare treatments</p>
            </div>
            <div className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center">
              <div className="text-3xl mb-3">💧</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Hydra facial</h3>
              <p className="text-gray-600 text-xs">Advanced hydration therapy</p>
            </div>
            <div className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Makeup photoshoot</h3>
              <p className="text-gray-600 text-xs">Professional studio photography</p>
            </div>
            <div className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center">
              <div className="text-3xl mb-3">💍</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Jewelry photoshoot</h3>
              <p className="text-gray-600 text-xs">Highlighting beauty and elegance</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-bg-light">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 flex justify-center w-full">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
              <Image
                src="/logo.png"
                alt="Essence Emblem"
                width={400}
                height={400}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-medium text-text-dark mb-6">
              Rooted in Nepal
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Located in the heart of Nepal, <strong className="text-text-dark">Essence</strong> redefines beauty by blending the serenity of our majestic mountains with modern makeup artistry.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We believe beauty has no gender. Our studio is a safe, welcoming space for everyone to discover their inner glow. Let nature and beauty intertwine.
            </p>
            <a
              href="#contact"
              className="text-primary font-medium hover:text-secondary transition-colors duration-300"
            >
              Contact us to learn more &rarr;
            </a>
          </div>
        </div>
      </section>
      <BookingForm />

      {/* Footer */}
      <footer className="bg-text-dark text-text-light pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <Image
                src="/logo.png"
                alt="Essence Logo"
                width={150}
                height={60}
                className="h-12 w-auto mb-4 invert brightness-0"
              />
              <p className="text-gray-400">Elevating Beauty, Naturally.</p>
            </div>
            <div>
              <h4 className="text-xl text-secondary mb-6 font-medium">
                Studio
              </h4>
              <p className="text-gray-300 mb-2">Ghataghar complex, 3rd floor</p>
              <p className="text-gray-300 mb-2">Ghataghar, Bhaktapur</p>
              <p className="text-gray-300">9762116374</p>
            </div>
            <div>
              <h4 className="text-xl text-secondary mb-6 font-medium">
                Follow Us
              </h4>
              <a href="https://www.tiktok.com/@essence.makeup.st" className="block text-gray-300 hover:text-primary mb-2 transition-colors">
                TikTok
              </a>
              <a href="https://www.instagram.com/essencemakeupstudio" className="block text-gray-300 hover:text-primary transition-colors">
                Instagram
              </a>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/10 text-gray-500 text-sm">
            &copy; 2026 Essence Unisex Studio. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
