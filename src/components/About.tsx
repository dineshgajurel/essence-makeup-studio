import Image from "next/image";

export default function About() {
  return (
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
  );
}
