import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-text-dark text-text-light pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <Image
              src="/logo.png"
              alt="Essence Logo"
              width={150}
              height={60}
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-400">Elevating Beauty, Naturally.</p>
          </div>
          <div>
            <h4 className="text-xl text-primary mb-6 font-medium">
              Essence Unisex Studio
            </h4>
            <p className="text-gray-300 mb-2">Ghataghar complex, 3rd floor</p>
            <p className="text-gray-300 mb-2">Ghataghar, Bhaktapur</p>
            <p className="text-gray-300">9762116374</p>
          </div>
          <div>
            <h4 className="text-xl text-primary mb-6 font-medium">
              Stay Connected
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
  );
}
