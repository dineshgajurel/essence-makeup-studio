export default function Services() {
  const services = [
    { icon: "✂️", title: "Hair", desc: "Keratin, cutting, color, nanoplex, smoothing" },
    { icon: "💄", title: "Makeup", desc: "Bridal & Party makeup services" },
    { icon: "👁️", title: "Lashes extensions", desc: "Enhance your natural eye beauty" },
    { icon: "🦶", title: "Manicure pedicure", desc: "Complete hand and foot care" },
    { icon: "💅", title: "Nail extensions", desc: "Beautiful, long-lasting nail art" },
    { icon: "🍯", title: "Waxing", desc: "Smooth, hair-free skin treatments" },
    { icon: "🧖‍♀️", title: "Facial", desc: "Rejuvenating skincare treatments" },
    { icon: "💧", title: "Hydra facial", desc: "Advanced hydration therapy" },
    { icon: "📸", title: "Makeup photoshoot", desc: "Professional studio photography" },
    { icon: "💍", title: "Jewelry photoshoot", desc: "Highlighting beauty and elegance" },
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl md:text-5xl font-medium text-center text-text-dark mb-2">
          Our Services
        </h2>
        <p className="text-center text-gray-500 mb-12 text-lg">
          Tailored for everyone, inspired by nature.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-bg-light p-6 rounded-2xl text-center border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center"
            >
              <div className="text-3xl mb-3">{service.icon}</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">{service.title}</h3>
              <p className="text-gray-600 text-xs">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
