import { Camera, ArrowRight, Mail, Award, Eye, AtSign } from "lucide-react";

const portfolio = [
  { title: "Golden Hour", category: "Portrait", aspect: "aspect-[3/4]" },
  { title: "Urban Lines", category: "Architecture", aspect: "aspect-square" },
  { title: "Silent Morning", category: "Landscape", aspect: "aspect-[4/3]" },
  { title: "The Gaze", category: "Portrait", aspect: "aspect-[3/4]" },
  { title: "Steel & Glass", category: "Architecture", aspect: "aspect-[4/3]" },
  { title: "Midnight Bloom", category: "Still Life", aspect: "aspect-square" },
  { title: "In Motion", category: "Editorial", aspect: "aspect-[3/4]" },
  { title: "Reflections", category: "Landscape", aspect: "aspect-square" },
];

const services = [
  { name: "Portrait Sessions", price: "From $500", desc: "Intimate, editorial-style portraits that capture your essence." },
  { name: "Commercial Work", price: "From $2,000", desc: "Brand photography, product shoots, and campaign imagery." },
  { name: "Wedding Coverage", price: "From $5,000", desc: "Full-day documentary coverage of your most important day." },
  { name: "Fine Art Prints", price: "From $300", desc: "Museum-quality prints from the archive collection." },
];

const awards = [
  "International Photography Awards 2025",
  "Hasselblad Masters Finalist",
  "Vogue Italia Featured Artist",
  "National Geographic Contributor",
];

export default function PhotographyDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <span className="text-lg font-light text-gray-900 tracking-[0.2em]">LENS & LIGHT</span>
          <div className="hidden md:flex items-center gap-10">
            <a href="#work" className="text-xs text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-[0.15em]">Work</a>
            <a href="#services" className="text-xs text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-[0.15em]">Services</a>
            <a href="#about" className="text-xs text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-[0.15em]">About</a>
            <a href="#contact" className="text-xs text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-[0.15em]">Contact</a>
          </div>
        </div>
        <div className="h-px bg-gray-100" />
      </nav>

      {/* Hero */}
      <section className="pt-24 min-h-screen flex items-center">
        <div className="mx-auto max-w-7xl px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mb-6">Photography Studio</p>
              <h1 className="text-5xl md:text-7xl font-extralight text-gray-900 leading-[1.15]">
                Capturing
                <br />
                <em className="italic font-normal">Light</em> &
                <br />
                <em className="italic font-normal">Emotion</em>
              </h1>
              <p className="mt-8 text-gray-500 leading-relaxed max-w-sm">
                Minimalist photography that speaks volumes through restraint.
                Every frame is a study in light, shadow, and human connection.
              </p>
              <div className="mt-10 flex items-center gap-8">
                <a href="#work" className="inline-flex items-center gap-2 text-sm text-gray-900 font-medium hover:gap-3 transition-all border-b border-gray-900 pb-1">
                  View Portfolio <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Book a Session
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-3">
                  <div className="aspect-[3/4] bg-gray-100 rounded-sm" />
                  <div className="aspect-square bg-gray-200 rounded-sm" />
                </div>
                <div className="space-y-3 mt-8">
                  <div className="aspect-square bg-gray-900 rounded-sm flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="aspect-[3/4] bg-gray-100 rounded-sm" />
                </div>
                <div className="space-y-3 mt-4">
                  <div className="aspect-[3/4] bg-gray-200 rounded-sm" />
                  <div className="aspect-square bg-gray-100 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="work" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mb-3">Selected Work</p>
            <h2 className="text-3xl font-extralight text-gray-900">Portfolio</h2>
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {portfolio.map((item, i) => (
              <div
                key={item.title}
                className={`${item.aspect} bg-gradient-to-br ${
                  i % 3 === 0 ? "from-gray-200 to-gray-300" :
                  i % 3 === 1 ? "from-gray-100 to-gray-200" :
                  "from-gray-800 to-gray-900"
                } rounded-sm relative overflow-hidden group cursor-pointer break-inside-avoid`}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-white/70 text-xs">{item.category}</p>
                  </div>
                </div>
                {i % 3 === 2 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-gray-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16">
            <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mb-3">Offerings</p>
            <h2 className="text-3xl font-extralight text-gray-900">Services</h2>
          </div>
          <div className="space-y-0">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between py-8 border-b border-gray-100 group hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div>
                  <h3 className="text-xl font-light text-gray-900 group-hover:tracking-wider transition-all">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{service.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">{service.price}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/5] bg-gray-800 rounded-sm flex items-center justify-center">
              <Camera className="h-20 w-20 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-[0.3em] mb-4">About</p>
              <h2 className="text-4xl font-extralight leading-relaxed">
                Arjun Mehta
              </h2>
              <p className="text-gray-500 text-sm uppercase tracking-wider">Photographer & Visual Artist</p>
              <p className="mt-8 text-gray-400 leading-relaxed">
                With a background in fine art and over a decade behind the lens, I approach
                every project as a collaboration. My work lives at the intersection of
                documentary honesty and artistic vision.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Based in New York, available worldwide. My work has been featured in
                Vogue, National Geographic, and exhibited in galleries across Europe and Asia.
              </p>
              <div className="mt-8 space-y-2">
                {awards.map((award) => (
                  <div key={award} className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-gray-600 shrink-0" />
                    <span className="text-sm text-gray-500">{award}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24">
        <div className="mx-auto max-w-xl px-6 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mb-3">Get in Touch</p>
          <h2 className="text-3xl font-extralight text-gray-900">
            Let&apos;s Create Something Beautiful
          </h2>
          <p className="mt-6 text-gray-500 leading-relaxed">
            Available for commercial projects, editorial work, and portrait sessions.
            Reach out to discuss your vision.
          </p>
          <div className="mt-10 flex items-center justify-center gap-8">
            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Mail className="h-4 w-4" />
              hello@lensandlight.co
            </a>
            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <AtSign className="h-4 w-4" />
              @lensandlight
            </a>
          </div>
          <button className="mt-8 px-10 py-4 bg-gray-900 text-white text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors">
            Book a Session
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-light tracking-[0.2em] text-gray-900">LENS & LIGHT</p>
          <p className="text-xs text-gray-400 mt-2">
            &copy; 2026 Lens & Light Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
